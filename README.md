# Skill Assessment Platform (MVP)

Containerized FastAPI + Postgres + React app for candidate assessments, admin content management, and leadership dashboards.

## Features
- Candidate login/register, take MCQ assessments, receive score
- Admin create assessments and questions, manage user roles
- Leadership dashboard with aggregate stats
- JWT auth and role-based access control

## Local Run (Docker)
```
docker compose up --build
```
- Frontend: http://localhost:8080
- Backend: http://localhost:8000

Optional bootstrap admin user:
```
BOOTSTRAP_ADMIN_EMAIL=admin@example.com
BOOTSTRAP_ADMIN_PASSWORD=ChangeMe123!
```
Add those to the `backend` service environment in `docker-compose.yml` or set in your shell.

## EC2 Hosting Notes (Overview)
1. Launch an EC2 instance (Ubuntu 22.04), open ports 80/443 and 22.
2. Install Docker and Docker Compose.
3. Copy this repo to the instance.
4. Run `docker compose up --build -d`.
5. Put Nginx or ALB in front for TLS termination.

## Next Steps (Suggested)
- Add question banks per technology and difficulty
- Add per-user historical reporting
- Add SSO (SAML/Okta)
- Add proctoring rules (time limits, randomization)
