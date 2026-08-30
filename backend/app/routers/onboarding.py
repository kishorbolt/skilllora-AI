from fastapi import APIRouter, Depends, HTTPException, Header
from typing import Optional
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import OnboardingParseRequest, OnboardingSubmitRequest, UserProfileResponse
from app.services.ai_provider import get_ai_provider
from app.models import User, LearnerProfile, Skill, LearnerSkill, Roadmap, RoadmapPhase, RoadmapItem
from app.services.career_service import CareerService
from app.services.auth_service import AuthService, get_current_user

router = APIRouter(prefix="/onboarding", tags=["Onboarding"])

@router.post("/parse-goal")
def parse_natural_language_goal(req: OnboardingParseRequest):
    ai = get_ai_provider()
    parsed = ai.parse_onboarding_goal(req.natural_language_input)
    return parsed

@router.post("/submit", response_model=UserProfileResponse)
def submit_onboarding(
    req: OnboardingSubmitRequest,
    db: Session = Depends(get_db),
    authorization: Optional[str] = Header(None)
):
    # Determine user from auth header if present, or by email
    user = None
    if authorization and authorization.lower().startswith("bearer "):
        token = authorization[7:].strip()
        payload = AuthService.decode_token(token)
        if payload and "user_id" in payload:
            user = db.query(User).filter(User.id == payload["user_id"]).first()

    if not user:
        clean_email = req.email.strip().lower()
        user = db.query(User).filter(User.email == clean_email).first()
        if not user:
            user = User(
                email=clean_email,
                name=req.name.strip(),
                hashed_password=AuthService.hash_password("password123"),
                is_demo=False
            )
            db.add(user)
            db.flush()

    # Create or update LearnerProfile
    profile = db.query(LearnerProfile).filter(LearnerProfile.user_id == user.id).first()
    if not profile:
        profile = LearnerProfile(
            user_id=user.id,
            career_goal=req.career_goal,
            learning_objective=req.learning_objective,
            experience_level=req.experience_level,
            daily_study_hours=req.daily_study_hours,
            target_deadline=req.target_deadline,
            preferred_format=req.preferred_format,
            confidence_level=req.confidence_level,
            raw_onboarding_input=req.raw_input,
            current_streak=0,
            longest_streak=0,
            total_learning_days=0
        )
        db.add(profile)
        db.flush()
    else:
        profile.career_goal = req.career_goal
        profile.target_role = req.career_goal
        profile.learning_objective = req.learning_objective
        profile.experience_level = req.experience_level
        profile.daily_study_hours = req.daily_study_hours
        profile.target_deadline = req.target_deadline
        profile.preferred_format = req.preferred_format
        profile.confidence_level = req.confidence_level
        profile.raw_onboarding_input = req.raw_input

    # Clear old skills and roadmap if fresh onboarding
    db.query(LearnerSkill).filter(LearnerSkill.profile_id == profile.id).delete()
    db.query(Roadmap).filter(Roadmap.profile_id == profile.id).delete()

    # Initialize learner skills for existing vs default skills
    all_skills = db.query(Skill).all()
    for s in all_skills:
        has_skill = s.name in req.existing_skills
        score = 80.0 if has_skill else 0.0
        ls = LearnerSkill(
            profile_id=profile.id,
            skill_id=s.id,
            mastery=score,
            confidence=float(req.confidence_level),
            retention=90.0 if has_skill else 100.0,
            practical_application=70.0 if has_skill else 0.0,
            assessment_performance=75.0 if has_skill else 0.0,
            learning_velocity=5.0 if has_skill else 0.0,
            overall_score=score if has_skill else 0.0,
            has_enough_evidence=has_skill,
            evidence_count=2 if has_skill else 0,
            is_verified=has_skill,
            status="Strong" if has_skill else "Beginner"
        )
        db.add(ls)

    # Initialize Roadmap
    roadmap = Roadmap(
        profile_id=profile.id,
        goal_title=req.career_goal,
        target_date=req.target_deadline,
        total_duration_weeks=24
    )
    db.add(roadmap)
    db.flush()

    p1 = RoadmapPhase(roadmap_id=roadmap.id, phase_number=1, title="Phase 1: Core Foundations & Prerequisites", description="Build required fundamentals", estimated_weeks=4, status="in_progress")
    p2 = RoadmapPhase(roadmap_id=roadmap.id, phase_number=2, title="Phase 2: Domain Competencies & Practice", description="Master primary role competencies", estimated_weeks=8, status="upcoming")
    p3 = RoadmapPhase(roadmap_id=roadmap.id, phase_number=3, title="Phase 3: Advanced Systems & Production", description="Production architecture and optimization", estimated_weeks=8, status="upcoming")
    p4 = RoadmapPhase(roadmap_id=roadmap.id, phase_number=4, title="Phase 4: Capstone Project & Portfolio Verification", description="Job-ready portfolio proof", estimated_weeks=4, status="upcoming")
    db.add_all([p1, p2, p3, p4])
    db.commit()
    db.refresh(profile)

    readiness = CareerService.calculate_career_readiness(db, profile, req.career_goal)

    return UserProfileResponse(
        id=profile.id,
        user_id=user.id,
        username=user.username,
        name=user.name,
        email=user.email,
        career_goal=profile.career_goal,
        learning_objective=profile.learning_objective,
        experience_level=profile.experience_level,
        daily_study_hours=profile.daily_study_hours,
        target_deadline=profile.target_deadline,
        preferred_format=profile.preferred_format,
        preferred_difficulty=profile.preferred_difficulty or "Intermediate",
        weekly_availability=profile.weekly_availability or "14 Hours / Week",
        confidence_level=profile.confidence_level,
        readiness_score=readiness["readiness_score"],
        total_skills_count=len(all_skills),
        verified_skills_count=len(req.existing_skills),
        current_streak=profile.current_streak or 0,
        longest_streak=profile.longest_streak or 0,
        total_learning_days=profile.total_learning_days or 0,
        is_today_complete=False,
        last_active_date=None
    )
