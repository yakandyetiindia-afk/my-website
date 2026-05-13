from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserCreate(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    password: str = Field(min_length=8, max_length=72)

class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: Optional[str] = None
    role: str
    is_active: bool

    class Config:
        orm_mode = True

class UserUpdateRole(BaseModel):
    role: str

class AssessmentCreate(BaseModel):
    title: str
    description: Optional[str] = None
    technology: str
    is_active: bool = True
    time_limit_minutes: Optional[int] = None
    randomize_questions: bool = True

class AssessmentOut(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    technology: str
    is_active: bool
    time_limit_minutes: Optional[int] = None
    randomize_questions: bool

    class Config:
        orm_mode = True

class QuestionCreate(BaseModel):
    assessment_id: int
    prompt: str
    options: List[str]
    correct_index: int
    difficulty: str = "medium"
    technology: Optional[str] = None

class QuestionOut(BaseModel):
    id: int
    assessment_id: int
    prompt: str
    options: List[str]
    difficulty: str

class SubmitAnswer(BaseModel):
    question_id: int
    selected_index: int

class SubmitAttempt(BaseModel):
    attempt_id: int
    assessment_id: int
    answers: List[SubmitAnswer]

class AttemptOut(BaseModel):
    id: int
    user_id: int
    assessment_id: int
    score: float
    total: int
    started_at: datetime
    submitted_at: datetime

    class Config:
        orm_mode = True

class LeadershipOverview(BaseModel):
    total_users: int
    total_attempts: int
    avg_score: float
    assessments: List[dict]
    skill_heatmap: List[dict]


class AttemptStartOut(BaseModel):
    attempt_id: int
    assessment_id: int
    time_limit_minutes: Optional[int] = None
    started_at: datetime
    questions: List[QuestionOut]
