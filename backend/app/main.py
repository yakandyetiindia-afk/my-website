from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from typing import List
import json
import os
import csv
import io
import random
from datetime import datetime

from .db import Base, engine, SessionLocal
from . import models, schemas
from .auth import hash_password, verify_password, create_access_token, SECRET_KEY, ALGORITHM

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Skill Assessment API")

origins = os.getenv("CORS_ORIGINS", "http://localhost:8080,http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in origins if o.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise credentials_exception
    return user


def require_role(*roles):
    def _guard(user: models.User = Depends(get_current_user)):
        if user.role not in roles:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return user

    return _guard


@app.get("/health")
def health():
    return {"status": "ok"}


@app.on_event("startup")
def bootstrap_admin():
    admin_email = os.getenv("BOOTSTRAP_ADMIN_EMAIL")
    admin_password = os.getenv("BOOTSTRAP_ADMIN_PASSWORD")
    if not admin_email or not admin_password:
        return
    db = SessionLocal()
    try:
        existing = db.query(models.User).filter(models.User.email == admin_email).first()
        if existing:
            return
        user = models.User(
            email=admin_email,
            full_name="Admin",
            hashed_password=hash_password(admin_password),
            role="admin",
        )
        db.add(user)
        db.commit()
    finally:
        db.close()


@app.post("/auth/register", response_model=schemas.UserOut)
def register(payload: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = models.User(
        email=payload.email,
        full_name=payload.full_name,
        hashed_password=hash_password(payload.password),
        role="candidate",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@app.post("/auth/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(subject=user.email, role=user.role)
    return schemas.Token(access_token=token)


@app.get("/me", response_model=schemas.UserOut)
def me(user: models.User = Depends(get_current_user)):
    return user


@app.get("/assessments", response_model=List[schemas.AssessmentOut])
def list_assessments(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    return db.query(models.Assessment).filter(models.Assessment.is_active == True).all()


@app.get("/assessments/{assessment_id}/questions", response_model=List[schemas.QuestionOut])
def list_questions(assessment_id: int, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    assessment = db.query(models.Assessment).filter(models.Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    questions = db.query(models.Question).filter(models.Question.assessment_id == assessment_id).all()
    if assessment.randomize_questions:
        random.shuffle(questions)
    out = []
    for q in questions:
        out.append(
            schemas.QuestionOut(
                id=q.id,
                assessment_id=q.assessment_id,
                prompt=q.prompt,
                options=json.loads(q.options_json),
                difficulty=q.difficulty,
            )
        )
    return out


@app.post("/assessments/{assessment_id}/start", response_model=schemas.AttemptStartOut)
def start_attempt(assessment_id: int, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    assessment = db.query(models.Assessment).filter(models.Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    questions = db.query(models.Question).filter(models.Question.assessment_id == assessment_id).all()
    if not questions:
        raise HTTPException(status_code=404, detail="Assessment has no questions")
    if assessment.randomize_questions:
        random.shuffle(questions)

    attempt = models.Attempt(user_id=user.id, assessment_id=assessment_id, total=len(questions))
    db.add(attempt)
    db.commit()
    db.refresh(attempt)

    out_questions = [
        schemas.QuestionOut(
            id=q.id,
            assessment_id=q.assessment_id,
            prompt=q.prompt,
            options=json.loads(q.options_json),
            difficulty=q.difficulty,
        )
        for q in questions
    ]

    return schemas.AttemptStartOut(
        attempt_id=attempt.id,
        assessment_id=assessment_id,
        time_limit_minutes=assessment.time_limit_minutes,
        started_at=attempt.started_at,
        questions=out_questions,
    )


@app.post("/assessments/submit", response_model=schemas.AttemptOut)
def submit_attempt(payload: schemas.SubmitAttempt, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    attempt = db.query(models.Attempt).filter(models.Attempt.id == payload.attempt_id).first()
    if not attempt or attempt.user_id != user.id or attempt.assessment_id != payload.assessment_id:
        raise HTTPException(status_code=404, detail="Attempt not found")
    if attempt.submitted_at is not None:
        raise HTTPException(status_code=400, detail="Attempt already submitted")

    questions = db.query(models.Question).filter(models.Question.assessment_id == payload.assessment_id).all()
    if not questions:
        raise HTTPException(status_code=404, detail="Assessment not found or has no questions")

    assessment = db.query(models.Assessment).filter(models.Assessment.id == payload.assessment_id).first()
    if assessment and assessment.time_limit_minutes:
        elapsed = (datetime.utcnow() - attempt.started_at).total_seconds()
        if elapsed > assessment.time_limit_minutes * 60:
            raise HTTPException(status_code=400, detail="Time limit exceeded")

    question_map = {q.id: q for q in questions}
    total = len(questions)
    correct = 0

    for ans in payload.answers:
        q = question_map.get(ans.question_id)
        if not q:
            continue
        if ans.selected_index == q.correct_index:
            correct += 1
        db.add(models.AttemptAnswer(attempt_id=attempt.id, question_id=q.id, selected_index=ans.selected_index))

    attempt.score = round((correct / total) * 100, 2)
    attempt.total = total
    attempt.submitted_at = datetime.utcnow()
    db.commit()
    db.refresh(attempt)
    return attempt


@app.get("/admin/assessments", response_model=List[schemas.AssessmentOut])
def admin_assessments(db: Session = Depends(get_db), user: models.User = Depends(require_role("admin"))):
    return db.query(models.Assessment).all()


@app.post("/admin/assessments", response_model=schemas.AssessmentOut)
def create_assessment(payload: schemas.AssessmentCreate, db: Session = Depends(get_db), user: models.User = Depends(require_role("admin"))):
    assessment = models.Assessment(**payload.dict())
    db.add(assessment)
    db.commit()
    db.refresh(assessment)
    return assessment


@app.post("/admin/questions", response_model=schemas.QuestionOut)
def create_question(payload: schemas.QuestionCreate, db: Session = Depends(get_db), user: models.User = Depends(require_role("admin"))):
    assessment = db.query(models.Assessment).filter(models.Assessment.id == payload.assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    q = models.Question(
        assessment_id=payload.assessment_id,
        prompt=payload.prompt,
        options_json=json.dumps(payload.options),
        correct_index=payload.correct_index,
        difficulty=payload.difficulty,
    )
    db.add(q)
    db.commit()
    db.refresh(q)
    return schemas.QuestionOut(
        id=q.id,
        assessment_id=q.assessment_id,
        prompt=q.prompt,
        options=payload.options,
        difficulty=q.difficulty,
    )


@app.post("/admin/question-bank/import")
def import_question_bank(
    assessment_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: models.User = Depends(require_role("admin")),
):
    assessment = db.query(models.Assessment).filter(models.Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    content = file.file.read()
    filename = (file.filename or "").lower()
    created = 0

    def create_question(prompt, options, correct_index, difficulty):
        nonlocal created
        q = models.Question(
            assessment_id=assessment_id,
            prompt=prompt,
            options_json=json.dumps(options),
            correct_index=correct_index,
            difficulty=difficulty or "medium",
        )
        db.add(q)
        created += 1

    if filename.endswith(".json"):
        data = json.loads(content.decode("utf-8"))
        for item in data:
            create_question(
                item["prompt"],
                item["options"],
                int(item["correct_index"]),
                item.get("difficulty", "medium"),
            )
    elif filename.endswith(".csv"):
        text = content.decode("utf-8")
        reader = csv.DictReader(io.StringIO(text))
        for row in reader:
            options = [row.get(f"option_{i}", "") for i in range(1, 7)]
            options = [o for o in options if o]
            create_question(
                row["prompt"],
                options,
                int(row["correct_index"]),
                row.get("difficulty", "medium"),
            )
    else:
        raise HTTPException(status_code=400, detail="Unsupported file type. Use .csv or .json")

    db.commit()
    return {"created": created}


@app.get("/admin/users", response_model=List[schemas.UserOut])
def list_users(db: Session = Depends(get_db), user: models.User = Depends(require_role("admin"))):
    return db.query(models.User).all()


@app.patch("/admin/users/{user_id}", response_model=schemas.UserOut)
def update_user_role(user_id: int, payload: schemas.UserUpdateRole, db: Session = Depends(get_db), user: models.User = Depends(require_role("admin"))):
    target = db.query(models.User).filter(models.User.id == user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="User not found")
    target.role = payload.role
    db.commit()
    db.refresh(target)
    return target


@app.get("/leadership/overview", response_model=schemas.LeadershipOverview)
def leadership_overview(db: Session = Depends(get_db), user: models.User = Depends(require_role("leadership", "admin"))):
    total_users = db.query(models.User).count()
    total_attempts = db.query(models.Attempt).count()
    scores = [a.score for a in db.query(models.Attempt).all()]
    avg_score = round(sum(scores) / len(scores), 2) if scores else 0.0

    assessments = []
    for a in db.query(models.Assessment).all():
        attempts = db.query(models.Attempt).filter(models.Attempt.assessment_id == a.id).all()
        a_scores = [x.score for x in attempts]
        assessments.append(
            {
                "assessment_id": a.id,
                "title": a.title,
                "technology": a.technology,
                "attempts": len(attempts),
                "avg_score": round(sum(a_scores) / len(a_scores), 2) if a_scores else 0.0,
            }
        )

    return {
        "total_users": total_users,
        "total_attempts": total_attempts,
        "avg_score": avg_score,
        "assessments": assessments,
        "skill_heatmap": _skill_heatmap(db),
    }


def _skill_heatmap(db: Session):
    rows = db.query(models.Assessment).all()
    result = []
    for a in rows:
        attempts = db.query(models.Attempt).filter(models.Attempt.assessment_id == a.id).all()
        scores = [x.score for x in attempts]
        result.append(
            {
                "technology": a.technology,
                "title": a.title,
                "attempts": len(attempts),
                "avg_score": round(sum(scores) / len(scores), 2) if scores else 0.0,
            }
        )
    return result
