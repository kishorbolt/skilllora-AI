import os
import uuid
import datetime
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from typing import List, Optional
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import LearnerProfile, LearnerSkill, Skill, CompletedCourse, InterestedResource, User
from app.schemas import (
    UserProfileResponse, ProfileUpdateRequest, OverallSkillDNAResponse, SkillDNASchema,
    SkillEvidenceSchema, SkillHistorySchema, SkillManageRequest, CompletedCourseSchema, InterestedResourceSchema,
    ResumeUploadResponse, ResumeAnalysisResponse, ResumeInsights, ResumeInsightSkill
)
from app.services.auth_service import get_current_profile
from app.services.skill_dna_service import SkillDNAService
from app.services.career_service import CareerService
from app.services.streak_service import StreakService

router = APIRouter(prefix="/profile", tags=["Profile & Personalization"])

@router.get("", response_model=UserProfileResponse)
def get_user_profile(profile: LearnerProfile = Depends(get_current_profile), db: Session = Depends(get_db)):
    readiness = CareerService.calculate_career_readiness(db, profile, profile.career_goal)
    verified = db.query(LearnerSkill).filter(LearnerSkill.profile_id == profile.id, LearnerSkill.is_verified == True).count()
    total = db.query(LearnerSkill).filter(LearnerSkill.profile_id == profile.id).count()
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
        target_role=profile.target_role or profile.career_goal or "AI Engineer",
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

@router.put("", response_model=UserProfileResponse)
def update_user_profile(req: ProfileUpdateRequest, profile: LearnerProfile = Depends(get_current_profile), db: Session = Depends(get_db)):
    if req.name and profile.user:
        profile.user.name = req.name
    if req.email and profile.user:
        profile.user.email = req.email
    if req.bio is not None:
        profile.bio = req.bio
    if req.location is not None:
        profile.location = req.location
    if req.phone is not None:
        profile.phone = req.phone
    if req.linkedin_url is not None:
        profile.linkedin_url = req.linkedin_url
    if req.github_url is not None:
        profile.github_url = req.github_url
    if req.portfolio_url is not None:
        profile.portfolio_url = req.portfolio_url
    if req.current_role is not None:
        profile.current_role = req.current_role
    if req.target_role is not None:
        profile.target_role = req.target_role
        profile.career_goal = req.target_role
    if req.career_goal is not None:
        profile.career_goal = req.career_goal
    if req.learning_objective is not None:
        profile.learning_objective = req.learning_objective
    if req.experience_level is not None:
        profile.experience_level = req.experience_level
    if req.target_deadline is not None:
        profile.target_deadline = req.target_deadline
    if req.daily_study_hours is not None:
        profile.daily_study_hours = req.daily_study_hours
    if req.preferred_format is not None:
        profile.preferred_format = req.preferred_format
    if req.preferred_difficulty is not None:
        profile.preferred_difficulty = req.preferred_difficulty
    if req.weekly_availability is not None:
        profile.weekly_availability = req.weekly_availability

    db.commit()
    db.refresh(profile)
    return get_user_profile(profile, db)

@router.post("/avatar")
async def upload_avatar(file: UploadFile = File(...), profile: LearnerProfile = Depends(get_current_profile), db: Session = Depends(get_db)):
    os.makedirs("./uploads/avatars", exist_ok=True)
    ext = file.filename.split(".")[-1].lower() if "." in file.filename else "png"
    filename = f"avatar_{profile.id}_{uuid.uuid4().hex[:8]}.{ext}"
    filepath = os.path.join("./uploads/avatars", filename)

    content = await file.read()
    with open(filepath, "wb") as f:
        f.write(content)

    relative_url = f"/uploads/avatars/{filename}"
    profile.avatar_url = relative_url
    db.commit()

    return {"status": "success", "avatar_url": relative_url}

@router.delete("/avatar")
def remove_avatar(profile: LearnerProfile = Depends(get_current_profile), db: Session = Depends(get_db)):
    if profile.avatar_url:
        old_path = "." + profile.avatar_url
        if os.path.exists(old_path):
            try:
                os.remove(old_path)
            except Exception:
                pass
    profile.avatar_url = None
    db.commit()
    return {"status": "success", "avatar_url": None}

# --- RESUME MANAGEMENT ---
@router.post("/resume", response_model=ResumeUploadResponse)
async def upload_resume(file: UploadFile = File(...), profile: LearnerProfile = Depends(get_current_profile), db: Session = Depends(get_db)):
    content = await file.read()
    
    # 10 MB limit check
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Resume file is too large. Maximum allowed size is 10 MB.")
        
    ext = file.filename.split(".")[-1].lower() if "." in file.filename else ""
    if ext not in ["pdf", "doc", "docx"]:
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a PDF, DOC or DOCX resume.")

    # Remove old resume file if one was previously stored
    if profile.resume_url:
        old_path = "." + profile.resume_url
        if os.path.exists(old_path):
            try:
                os.remove(old_path)
            except Exception:
                pass

    os.makedirs("./uploads/resumes", exist_ok=True)
    clean_base = "".join(c for c in os.path.splitext(file.filename)[0] if c.isalnum() or c in ('_', '-'))[:25]
    unique_filename = f"resume_{profile.id}_{clean_base}_{uuid.uuid4().hex[:6]}.{ext}"
    filepath = os.path.join("./uploads/resumes", unique_filename)

    with open(filepath, "wb") as f:
        f.write(content)

    relative_url = f"/uploads/resumes/{unique_filename}"
    file_size_mb = len(content) / (1024 * 1024)
    file_size_str = f"{file_size_mb:.1f} MB" if file_size_mb >= 0.1 else f"{len(content) / 1024:.0f} KB"
    
    now = datetime.datetime.utcnow()
    
    profile.resume_url = relative_url
    profile.resume_filename = file.filename
    profile.resume_filetype = ext.upper()
    profile.resume_filesize = file_size_str
    profile.resume_uploaded_at = now
    profile.resume_analysis_status = "pending"
    profile.resume_insights_json = {}
    
    db.commit()
    db.refresh(profile)

    return ResumeUploadResponse(
        status="success",
        resume_url=relative_url,
        resume_filename=file.filename,
        resume_filetype=ext.upper(),
        resume_filesize=file_size_str,
        resume_uploaded_at=now.strftime("%Y-%m-%d")
    )

@router.delete("/resume")
def remove_resume(profile: LearnerProfile = Depends(get_current_profile), db: Session = Depends(get_db)):
    if profile.resume_url:
        old_path = "." + profile.resume_url
        if os.path.exists(old_path):
            try:
                os.remove(old_path)
            except Exception:
                pass

    profile.resume_url = None
    profile.resume_filename = None
    profile.resume_filetype = None
    profile.resume_filesize = None
    profile.resume_uploaded_at = None
    profile.resume_analysis_status = None
    profile.resume_insights_json = {}
    db.commit()
    return {"status": "success", "message": "Resume removed successfully"}

@router.post("/resume/analyze", response_model=ResumeAnalysisResponse)
def analyze_resume(profile: LearnerProfile = Depends(get_current_profile), db: Session = Depends(get_db)):
    if not profile.resume_url:
        raise HTTPException(status_code=400, detail="No resume uploaded yet. Please upload a resume first.")
        
    try:
        from app.services.ai_provider import get_ai_provider
        ai_provider = get_ai_provider()
        
        filepath = "." + profile.resume_url
        file_content = b""
        if os.path.exists(filepath):
            with open(filepath, "rb") as f:
                file_content = f.read()
            
        insights = ai_provider.analyze_resume(file_content, profile.resume_filetype)
        
        profile.resume_analysis_status = "analyzed"
        profile.resume_insights_json = insights
        db.commit()
        
        detected_skills = [
            ResumeInsightSkill(name=s["name"], level=s.get("level", "Intermediate"))
            for s in insights.get("detected_skills", [])
        ]
        
        return ResumeAnalysisResponse(
            status="success",
            insights=ResumeInsights(
                detected_skills=detected_skills,
                detected_roles=insights.get("detected_roles", []),
                detected_projects=insights.get("detected_projects", 0),
                detected_certifications=insights.get("detected_certifications", 0)
            )
        )
    except Exception as e:
        profile.resume_analysis_status = "failed"
        db.commit()
        raise HTTPException(status_code=500, detail=f"Resume analysis failed: {str(e)}")

# --- SKILLS MANAGEMENT ---
@router.get("/skills")
def get_user_skills(profile: LearnerProfile = Depends(get_current_profile), db: Session = Depends(get_db)):
    skills = db.query(LearnerSkill).filter(LearnerSkill.profile_id == profile.id).all()
    return [
        {
            "id": ls.id,
            "skill_name": ls.skill.name if ls.skill else "",
            "category": ls.skill.category if ls.skill else "General",
            "proficiency": ls.overall_score,
            "level": ls.level,
            "source": ls.source,
            "is_verified": ls.is_verified,
            "evidence_count": ls.evidence_count
        } for ls in skills
    ]

@router.post("/skills")
def add_user_skill(req: SkillManageRequest, profile: LearnerProfile = Depends(get_current_profile), db: Session = Depends(get_db)):
    skill = db.query(Skill).filter(Skill.name == req.skill_name).first()
    if not skill:
        skill = Skill(name=req.skill_name, category=req.category or "General", description="Custom learner skill")
        db.add(skill)
        db.flush()

    ls = db.query(LearnerSkill).filter(LearnerSkill.profile_id == profile.id, LearnerSkill.skill_id == skill.id).first()
    source_val = "self_reported" if req.is_self_reported else "evidence_based"

    if not ls:
        ls = LearnerSkill(
            profile_id=profile.id,
            skill_id=skill.id,
            mastery=req.proficiency,
            confidence=req.proficiency,
            retention=90.0,
            practical_application=0.0 if req.is_self_reported else req.proficiency,
            assessment_performance=0.0 if req.is_self_reported else req.proficiency,
            learning_velocity=0.0,
            overall_score=req.proficiency,
            has_enough_evidence=not req.is_self_reported,
            evidence_count=0 if req.is_self_reported else 1,
            is_verified=False,
            source=source_val,
            level=req.level
        )
        db.add(ls)
    else:
        ls.mastery = req.proficiency
        ls.overall_score = req.proficiency
        ls.level = req.level
        ls.source = source_val

    db.commit()
    return {"status": "success", "skill_id": ls.id}

@router.delete("/skills/{skill_id}")
def delete_user_skill(skill_id: int, profile: LearnerProfile = Depends(get_current_profile), db: Session = Depends(get_db)):
    ls = db.query(LearnerSkill).filter(LearnerSkill.id == skill_id, LearnerSkill.profile_id == profile.id).first()
    if ls:
        db.delete(ls)
        db.commit()
    return {"status": "success"}

# --- COMPLETED COURSES ---
@router.get("/courses")
def get_completed_courses(profile: LearnerProfile = Depends(get_current_profile), db: Session = Depends(get_db)):
    courses = db.query(CompletedCourse).filter(CompletedCourse.profile_id == profile.id).all()
    return [
        {
            "id": c.id,
            "course_name": c.course_name,
            "provider": c.provider,
            "skill_name": c.skill_name,
            "completion_date": c.completion_date,
            "duration_hours": c.duration_hours,
            "certificate_url": c.certificate_url,
            "description": c.description
        } for c in courses
    ]

@router.post("/courses")
def add_completed_course(req: CompletedCourseSchema, profile: LearnerProfile = Depends(get_current_profile), db: Session = Depends(get_db)):
    skill = db.query(Skill).filter(Skill.name == req.skill_name).first()

    course = CompletedCourse(
        profile_id=profile.id,
        course_name=req.course_name,
        provider=req.provider,
        skill_id=skill.id if skill else None,
        skill_name=req.skill_name,
        completion_date=req.completion_date,
        duration_hours=req.duration_hours,
        certificate_url=req.certificate_url,
        description=req.description
    )
    db.add(course)

    if skill:
        ls = db.query(LearnerSkill).filter(LearnerSkill.profile_id == profile.id, LearnerSkill.skill_id == skill.id).first()
        if ls:
            SkillDNAService.update_skill_state(
                db=db,
                learner_skill=ls,
                reason=f"Added completed course '{req.course_name}' ({req.provider}).",
                event_type="course",
                mastery_delta=10.0,
                retention_delta=10.0,
                evidence_title=req.course_name,
                evidence_type="course",
                evidence_score=100.0
            )

    # Log streak activity
    StreakService.record_activity(
        db=db,
        profile=profile,
        activity_type="course",
        title=f"Completed {req.course_name}",
        description=f"Course completed via {req.provider}."
    )

    db.commit()
    return {"status": "success"}

@router.delete("/courses/{course_id}")
def delete_completed_course(course_id: int, profile: LearnerProfile = Depends(get_current_profile), db: Session = Depends(get_db)):
    c = db.query(CompletedCourse).filter(CompletedCourse.id == course_id, CompletedCourse.profile_id == profile.id).first()
    if c:
        db.delete(c)
        db.commit()
    return {"status": "success"}

# --- INTERESTED COURSES ---
@router.get("/interests")
def get_interested_resources(profile: LearnerProfile = Depends(get_current_profile), db: Session = Depends(get_db)):
    interests = db.query(InterestedResource).filter(InterestedResource.profile_id == profile.id).all()
    return [
        {
            "id": i.id,
            "resource_id": i.resource_id,
            "resource_name": i.resource_name,
            "skill_name": i.skill_name,
            "difficulty": i.difficulty,
            "duration_minutes": i.duration_minutes,
            "provider": i.provider,
            "saved_at": i.saved_at.strftime("%Y-%m-%d") if i.saved_at else "",
            "notes": i.notes
        } for i in interests
    ]

@router.post("/interests")
def add_interested_resource(req: InterestedResourceSchema, profile: LearnerProfile = Depends(get_current_profile), db: Session = Depends(get_db)):
    interest = InterestedResource(
        profile_id=profile.id,
        resource_id=req.resource_id,
        resource_name=req.resource_name,
        skill_name=req.skill_name,
        difficulty=req.difficulty,
        duration_minutes=req.duration_minutes,
        provider=req.provider,
        notes=req.notes
    )
    db.add(interest)
    db.commit()
    return {"status": "success"}

@router.delete("/interests/{interest_id}")
def delete_interested_resource(interest_id: int, profile: LearnerProfile = Depends(get_current_profile), db: Session = Depends(get_db)):
    i = db.query(InterestedResource).filter(InterestedResource.id == interest_id, InterestedResource.profile_id == profile.id).first()
    if i:
        db.delete(i)
        db.commit()
    return {"status": "success"}

# --- SKILL DNA ---
@router.get("/skill-dna", response_model=OverallSkillDNAResponse)
def get_skill_dna(profile: LearnerProfile = Depends(get_current_profile), db: Session = Depends(get_db)):
    learner_skills = db.query(LearnerSkill).filter(LearnerSkill.profile_id == profile.id).all()

    skill_schemas = []
    total_score = 0.0
    valid_count = 0
    strengths = []
    weaknesses = []
    bottlenecks = []
    at_risk = []

    for ls in learner_skills:
        explanation = {
            "why": f"Proficiency evaluated based on {ls.evidence_count} evidence items.",
            "action": f"Practice {ls.skill.name if ls.skill else 'skill'} to boost evidence.",
            "impact": "+5% expected upon verification"
        }
        
        if ls.has_enough_evidence:
            total_score += ls.overall_score
            valid_count += 1

        if ls.status in ["Verified", "Strong"]:
            if ls.skill: strengths.append(ls.skill.name)
        elif ls.status in ["Needs Focus", "Beginner"] and ls.evidence_count > 0:
            if ls.skill: weaknesses.append(ls.skill.name)
        
        if ls.overall_score < 50.0 and ls.skill and ls.skill.name in ["Deep Learning", "Statistics", "MLOps"]:
            bottlenecks.append(ls.skill.name)

        if ls.status == "At Risk" or ls.trend == "decaying":
            if ls.skill: at_risk.append(ls.skill.name)

        ev_list = [
            SkillEvidenceSchema(
                id=e.id,
                evidence_type=e.evidence_type,
                title=e.title,
                description=e.description,
                score=e.score,
                created_at=e.created_at.strftime("%Y-%m-%d %H:%M")
            ) for e in ls.evidence_list
        ]

        hist_list = [
            SkillHistorySchema(
                id=h.id,
                old_score=h.old_score,
                new_score=h.new_score,
                reason=h.reason,
                event_type=h.event_type,
                created_at=h.created_at.strftime("%Y-%m-%d %H:%M")
            ) for h in ls.history_list
        ]

        skill_schemas.append(SkillDNASchema(
            id=ls.id,
            skill_name=ls.skill.name if ls.skill else "",
            category=ls.skill.category if ls.skill else "General",
            mastery=ls.mastery,
            confidence=ls.confidence,
            retention=ls.retention,
            practical_application=ls.practical_application,
            assessment_performance=ls.assessment_performance,
            learning_velocity=ls.learning_velocity,
            overall_score=ls.overall_score,
            has_enough_evidence=ls.has_enough_evidence,
            evidence_count=ls.evidence_count,
            is_verified=ls.is_verified,
            source=ls.source or "evidence_based",
            level=ls.level or "Intermediate",
            status=ls.status,
            trend=ls.trend,
            last_practiced=ls.last_practiced.strftime("%Y-%m-%d") if ls.last_practiced else "Never",
            why_explanation=explanation["why"],
            recommended_action=explanation["action"],
            estimated_impact=explanation["impact"],
            evidence_list=ev_list,
            history_list=hist_list
        ))

    overall_dna = round(total_score / max(1, valid_count), 1) if valid_count > 0 else 0.0
    readiness = CareerService.calculate_career_readiness(db, profile, profile.career_goal)

    return OverallSkillDNAResponse(
        overall_dna_score=overall_dna,
        career_readiness_score=readiness["readiness_score"],
        skills=skill_schemas,
        strengths=strengths,
        weaknesses=weaknesses,
        bottlenecks=bottlenecks,
        at_risk_skills=at_risk
    )
