from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from app.database import get_db
from app.models import User, LearnerProfile
from app.schemas import (
    UserRegisterRequest, UserLoginRequest, AuthTokenResponse,
    AuthUserSchema, UserProfileResponse
)
from app.services.auth_service import AuthService, get_current_user, get_current_profile
from app.services.career_service import CareerService
from app.services.streak_service import StreakService

router = APIRouter(prefix="/auth", tags=["Authentication & Session"])

def build_profile_response(profile: LearnerProfile, db: Session) -> UserProfileResponse:
    readiness = CareerService.calculate_career_readiness(db, profile, profile.career_goal)
    verified = sum(1 for ls in profile.learner_skills if ls.is_verified)
    total = len(profile.learner_skills)
    streak_info = StreakService.get_streak_info(profile)

    return UserProfileResponse(
        id=profile.id,
        user_id=profile.user_id,
        username=profile.user.username if profile.user else None,
        name=profile.user.name if profile.user else "Learner",
        email=profile.user.email if profile.user else "",
        bio=profile.bio,
        avatar_url=profile.avatar_url,
        location=profile.location,
        phone=profile.phone,
        linkedin_url=profile.linkedin_url,
        github_url=profile.github_url,
        portfolio_url=profile.portfolio_url,
        current_role=profile.current_role or "Learner",
        target_role=profile.target_role or "AI Engineer",
        career_goal=profile.career_goal or "AI Engineer",
        learning_objective=profile.learning_objective or "",
        experience_level=profile.experience_level or "Intermediate",
        daily_study_hours=profile.daily_study_hours or 2.0,
        target_deadline=profile.target_deadline or "March 2027",
        preferred_format=profile.preferred_format or "Interactive & Project-based",
        preferred_difficulty=profile.preferred_difficulty or "Intermediate",
        weekly_availability=profile.weekly_availability or "14 Hours / Week",
        confidence_level=profile.confidence_level or 75,
        readiness_score=readiness["readiness_score"],
        total_skills_count=total,
        verified_skills_count=verified,
        current_streak=streak_info["current_streak"],
        longest_streak=streak_info["longest_streak"],
        total_learning_days=streak_info["total_learning_days"],
        is_today_complete=streak_info["is_today_complete"],
        last_active_date=streak_info["last_active_date"],
        resume_url=profile.resume_url,
        resume_filename=profile.resume_filename,
        resume_filetype=profile.resume_filetype,
        resume_filesize=profile.resume_filesize,
        resume_uploaded_at=profile.resume_uploaded_at.strftime("%Y-%m-%d") if profile.resume_uploaded_at else None,
        resume_analysis_status=profile.resume_analysis_status,
        resume_insights=profile.resume_insights_json
    )

@router.post("/register", response_model=AuthTokenResponse)
def register_user(req: UserRegisterRequest, db: Session = Depends(get_db)):
    # 1. Validate Username
    username_clean = (req.username or "").strip()
    if not username_clean:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please enter a username."
        )

    # Check for duplicate username (case-insensitive)
    existing_username = db.query(User).filter(func.lower(User.username) == username_clean.lower()).first()
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists. Please choose another username."
        )

    # 2. Validate Email
    email_clean = (req.email or "").strip().lower()
    if not email_clean or "@" not in email_clean or "." not in email_clean.split("@")[-1]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please enter your email address."
        )

    # Check for duplicate email (case-insensitive)
    existing_email = db.query(User).filter(func.lower(User.email) == email_clean.lower()).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        )

    # 3. Validate Password
    if not req.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please enter a password."
        )

    if req.confirm_password is not None and req.confirm_password != req.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match."
        )

    # 4. Hash user's actual chosen password securely
    hashed_password = AuthService.hash_password(req.password)

    # Determine display name
    display_name = req.name.strip() if req.name and req.name.strip() else username_clean

    user = User(
        username=username_clean,
        name=display_name,
        email=email_clean,
        hashed_password=hashed_password,
        is_demo=False
    )
    db.add(user)
    db.flush()

    # 5. Create completely fresh LearnerProfile (clean slate: 0 streak, 0 skills, 0 courses)
    profile = LearnerProfile(
        user_id=user.id,
        career_goal="AI Engineer",
        learning_objective="Master required domain competencies with verified Skill DNA.",
        current_role="Learner",
        target_role="AI Engineer",
        daily_study_hours=2.0,
        target_deadline="March 2027",
        current_streak=0,
        longest_streak=0,
        total_learning_days=0,
        last_active_date=None,
        bio=None,
        avatar_url=None,
        resume_url=None,
        resume_filename=None,
        resume_filetype=None,
        resume_filesize=None,
        resume_uploaded_at=None,
        resume_analysis_status=None,
        resume_insights_json={}
    )
    db.add(profile)
    db.commit()
    db.refresh(user)
    db.refresh(profile)

    # 6. Generate authenticated session token
    token = AuthService.create_token(user.id, user.email)
    user_schema = AuthUserSchema(
        id=user.id,
        username=user.username,
        name=user.name,
        email=user.email,
        is_demo=user.is_demo,
        created_at=user.created_at.strftime("%Y-%m-%d") if user.created_at else None
    )

    return AuthTokenResponse(
        access_token=token,
        token_type="bearer",
        user=user_schema,
        profile=build_profile_response(profile, db)
    )

@router.post("/login", response_model=AuthTokenResponse)
def login_user(req: UserLoginRequest, db: Session = Depends(get_db)):
    identifier = (req.username_or_email or req.email or req.username or "").strip()
    if not identifier:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username/email or password."
        )

    if not req.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username/email or password."
        )

    # Look up user by case-insensitive matching on username OR email
    user = db.query(User).filter(
        or_(
            func.lower(User.email) == identifier.lower(),
            func.lower(User.username) == identifier.lower()
        )
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username/email or password."
        )

    if not user.hashed_password or not AuthService.verify_password(req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username/email or password."
        )

    token = AuthService.create_token(user.id, user.email)
    profile = db.query(LearnerProfile).filter(LearnerProfile.user_id == user.id).first()
    if not profile:
        profile = LearnerProfile(user_id=user.id, current_streak=0, longest_streak=0, total_learning_days=0)
        db.add(profile)
        db.commit()
        db.refresh(profile)

    user_schema = AuthUserSchema(
        id=user.id,
        username=user.username,
        name=user.name,
        email=user.email,
        is_demo=user.is_demo,
        created_at=user.created_at.strftime("%Y-%m-%d") if user.created_at else None
    )

    return AuthTokenResponse(
        access_token=token,
        token_type="bearer",
        user=user_schema,
        profile=build_profile_response(profile, db)
    )

@router.post("/demo-login", response_model=AuthTokenResponse)
def demo_login(db: Session = Depends(get_db)):
    demo_user = db.query(User).filter(User.email == "kishor.g@skillora.ai").first()
    if not demo_user:
        raise HTTPException(status_code=404, detail="Demo account not found. Please restart backend to seed.")

    token = AuthService.create_token(demo_user.id, demo_user.email)
    profile = db.query(LearnerProfile).filter(LearnerProfile.user_id == demo_user.id).first()

    user_schema = AuthUserSchema(
        id=demo_user.id,
        username=demo_user.username or "kishorg",
        name=demo_user.name,
        email=demo_user.email,
        is_demo=True,
        created_at=demo_user.created_at.strftime("%Y-%m-%d") if demo_user.created_at else None
    )

    return AuthTokenResponse(
        access_token=token,
        token_type="bearer",
        user=user_schema,
        profile=build_profile_response(profile, db) if profile else None
    )

@router.get("/me")
def get_me(
    current_user: User = Depends(get_current_user),
    current_profile: LearnerProfile = Depends(get_current_profile),
    db: Session = Depends(get_db)
):
    user_schema = AuthUserSchema(
        id=current_user.id,
        username=current_user.username,
        name=current_user.name,
        email=current_user.email,
        is_demo=current_user.is_demo,
        created_at=current_user.created_at.strftime("%Y-%m-%d") if current_user.created_at else None
    )

    return {
        "user": user_schema,
        "profile": build_profile_response(current_profile, db)
    }

@router.post("/logout")
def logout_user():
    return {"status": "success", "message": "Successfully logged out. Session cleared."}
