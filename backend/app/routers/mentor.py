from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import LearnerProfile, LearnerSkill, CompletedCourse, InterestedResource, AssessmentAttempt
from app.schemas import MentorChatRequest, MentorChatResponse
from app.services.auth_service import get_current_profile
from app.services.ai_provider import get_ai_provider
from app.services.career_service import CareerService
from app.services.skill_gap_analyzer import SkillGapAnalyzer
from app.services.streak_service import StreakService

router = APIRouter(prefix="/mentor", tags=["AI Mentor"])

@router.post("/chat", response_model=MentorChatResponse)
def chat_with_mentor(
    req: MentorChatRequest,
    profile: LearnerProfile = Depends(get_current_profile),
    db: Session = Depends(get_db)
):
    ai = get_ai_provider()

    readiness = CareerService.calculate_career_readiness(db, profile, profile.career_goal)
    gaps_analysis = SkillGapAnalyzer.analyze_gaps(db, profile)

    learner_skills = db.query(LearnerSkill).filter(LearnerSkill.profile_id == profile.id).all()
    verified_skills = [ls.skill.name for ls in learner_skills if ls.is_verified and ls.skill]
    self_reported = [ls.skill.name for ls in learner_skills if not ls.is_verified and ls.skill]

    completed_courses = db.query(CompletedCourse).filter(CompletedCourse.profile_id == profile.id).all()
    interested_courses = db.query(InterestedResource).filter(InterestedResource.profile_id == profile.id).all()
    recent_attempts = db.query(AssessmentAttempt).filter(AssessmentAttempt.profile_id == profile.id).order_by(AssessmentAttempt.created_at.desc()).limit(3).all()

    # Fetch project submissions
    project_submissions = profile.project_submissions or []
    evaluated_projects = [
        {
            "title": p.project.title if p.project else "Project",
            "overall_score": p.overall_score,
            "feedback": p.feedback_text
        } for p in project_submissions if p.project
    ]

    top_focus = gaps_analysis["top_priorities"][0] if gaps_analysis["top_priorities"] else (verified_skills[0] if verified_skills else "Python")

    context = {
        "learner_name": profile.user.name if profile.user else "Learner",
        "career_goal": profile.career_goal,
        "current_role": profile.current_role or "Learner",
        "target_role": profile.target_role or profile.career_goal,
        "readiness": f"{readiness['readiness_score']:.0f}%",
        "daily_hours": profile.daily_study_hours,
        "weekly_availability": profile.weekly_availability,
        "target_deadline": profile.target_deadline,
        "current_focus_skill": top_focus,
        "focus_score": f"{readiness['readiness_score']:.0f}%",
        "verified_skills": verified_skills,
        "self_reported_skills": self_reported,
        "completed_courses": [c.course_name for c in completed_courses],
        "interested_courses": [c.resource_name for c in interested_courses],
        "recent_assessments": [
            {
                "score": a.score,
                "weak_concepts": a.weak_concepts_json,
                "strong_concepts": a.strong_concepts_json
            } for a in recent_attempts
        ],
        "skill_gaps": gaps_analysis["gaps"],
        "projects": evaluated_projects,
        "resume_insights": profile.resume_insights_json
    }

    # Pass actual message + conversation history window
    history = [h.dict() if hasattr(h, "dict") else h for h in req.conversation_history]
    res = ai.generate_mentor_reply(req.message, context, history)

    # Log learning activity for streak
    StreakService.record_activity(
        db=db,
        profile=profile,
        activity_type="mentor_chat",
        title=f"AI Mentor Learning Session: {req.message[:35]}...",
        description="Engaged in interactive learning inquiry with AI Mentor."
    )

    return MentorChatResponse(
        response=res["response"],
        suggested_prompts=res["suggested_prompts"]
    )
