import os
import uvicorn
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from app.config import settings
from app.database import engine, Base, SessionLocal, get_db, init_db
from app.services.seed_service import seed_database
from app.services.auth_service import get_current_profile
from app.models import LearnerProfile
from app.routers import (
    auth, onboarding, profile, skills, roadmap, assessment,
    recommendations, mentor, projects, career, analytics, dashboard
)

# Initialize database and migrate schema
init_db()

# Seed database with Kishor G demo profile
db = SessionLocal()
try:
    seed_database(db)
finally:
    db.close()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Configure CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static uploads directory for avatars and resumes
os.makedirs("./uploads/avatars", exist_ok=True)
os.makedirs("./uploads/resumes", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="./uploads"), name="uploads")

# Include Modular Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(onboarding.router, prefix=settings.API_V1_STR)
app.include_router(profile.router, prefix=settings.API_V1_STR)
app.include_router(skills.router, prefix=settings.API_V1_STR)
app.include_router(roadmap.router, prefix=settings.API_V1_STR)
app.include_router(assessment.router, prefix=settings.API_V1_STR)
app.include_router(recommendations.router, prefix=settings.API_V1_STR)
app.include_router(mentor.router, prefix=settings.API_V1_STR)
app.include_router(projects.router, prefix=settings.API_V1_STR)
app.include_router(career.router, prefix=settings.API_V1_STR)
app.include_router(analytics.router, prefix=settings.API_V1_STR)
app.include_router(dashboard.router, prefix=settings.API_V1_STR)

# Top-level direct aliases for convenience & API flexibility
@app.get(f"{settings.API_V1_STR}/skill-dna")
def alias_skill_dna(current_profile: LearnerProfile = Depends(get_current_profile), db: Session = Depends(get_db)):
    return profile.get_skill_dna(current_profile, db)

@app.get(f"{settings.API_V1_STR}/skill-gaps")
def alias_skill_gaps(current_profile: LearnerProfile = Depends(get_current_profile), db: Session = Depends(get_db)):
    return skills.get_skill_gaps(current_profile, db)

@app.get("/")
def root():
    return {
        "message": "Welcome to SKILLORA AI Backend API",
        "version": "1.0.0",
        "status": "healthy",
        "docs_url": "/docs"
    }

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
