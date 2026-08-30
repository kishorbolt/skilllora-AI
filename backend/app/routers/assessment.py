from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import LearnerProfile, AssessmentAttempt
from app.schemas import StartAssessmentRequest, SubmitAssessmentRequest, AssessmentResultResponse
from app.services.auth_service import get_current_profile
from app.services.assessment_engine import AssessmentEngine
from app.services.streak_service import StreakService

router = APIRouter(prefix="/assessment", tags=["Adaptive Assessment"])

@router.post("/start-tech")
def start_technology_assessment(
    req: StartAssessmentRequest,
    profile: LearnerProfile = Depends(get_current_profile),
    db: Session = Depends(get_db)
):
    attempts = db.query(AssessmentAttempt).filter(AssessmentAttempt.profile_id == profile.id).all()
    tech = req.technology or req.skill_name or "Python"
    assessment_pkg = AssessmentEngine.generate_30_mcq_assessment(tech, attempts)
    return assessment_pkg

@router.post("/submit-tech")
def submit_technology_assessment(
    req: Dict[str, Any],
    profile: LearnerProfile = Depends(get_current_profile),
    db: Session = Depends(get_db)
):
    technology = req.get("technology", "Python")
    questions = req.get("questions", [])
    raw_answers = req.get("answers", [])
    duration = req.get("duration_seconds", 1200)

    answers_map = {item["question_id"]: item["selected_option_index"] for item in raw_answers if "question_id" in item}

    result = AssessmentEngine.evaluate_submission(
        db=db,
        profile=profile,
        technology=technology,
        assessment_questions=questions,
        answers_map=answers_map,
        duration_seconds=duration
    )

    # Log meaningful activity for streak
    StreakService.record_activity(
        db=db,
        profile=profile,
        activity_type="assessment",
        title=f"30-MCQ {technology} Assessment",
        description=f"Completed 30-MCQ assessment with {result.get('score', 0):.0f}% score."
    )

    return result

@router.get("/history")
def get_assessment_history(
    profile: LearnerProfile = Depends(get_current_profile),
    db: Session = Depends(get_db)
):
    attempts = db.query(AssessmentAttempt).filter(AssessmentAttempt.profile_id == profile.id).order_by(AssessmentAttempt.created_at.desc()).all()
    history = []
    for a in attempts:
        tech_name = "Technology Assessment"
        try:
            if a.assessment and a.assessment.skill:
                tech_name = a.assessment.skill.name
            elif a.assessment:
                tech_name = a.assessment.title
            elif a.assessment_id == 1:
                tech_name = "Python"
        except Exception:
            tech_name = "Technology Assessment"

        history.append({
            "id": a.id,
            "technology": tech_name,
            "date": a.created_at.strftime("%b %d, %Y") if a.created_at else "Recently",
            "score": a.score,
            "passed": a.passed,
            "weak_concepts": a.weak_concepts_json or [],
            "strong_concepts": a.strong_concepts_json or []
        })
    return history

# Backwards compatibility endpoints
@router.post("/start")
def start_assessment_legacy(req: StartAssessmentRequest, db: Session = Depends(get_db)):
    pkg = AssessmentEngine.generate_30_mcq_assessment(req.skill_name or "Python")
    return {
        "assessment_id": 1,
        "skill_name": req.skill_name or "Python",
        "title": pkg["title"],
        "questions": pkg["questions"]
    }

@router.post("/submit")
def submit_assessment_legacy(
    req: SubmitAssessmentRequest,
    profile: LearnerProfile = Depends(get_current_profile),
    db: Session = Depends(get_db)
):
    pkg = AssessmentEngine.generate_30_mcq_assessment("Deep Learning")
    answers_map = {a.question_id: a.selected_option_index for a in req.answers}
    res = AssessmentEngine.evaluate_submission(db, profile, "Deep Learning", pkg["questions"], answers_map)
    
    StreakService.record_activity(
        db=db,
        profile=profile,
        activity_type="assessment",
        title="Deep Learning Diagnostic Assessment",
        description=f"Completed legacy assessment with {res['score']:.0f}% score."
    )

    return {
        "score": res["score"],
        "passed": res["passed"],
        "difficulty_level": "30-MCQ Adaptive",
        "skill_name": "Deep Learning",
        "old_skill_score": res["old_skill_score"],
        "new_skill_score": res["new_skill_score"],
        "weak_concepts": res["weak_topics"],
        "strong_concepts": res["strong_topics"],
        "next_recommendation": "Review weak sub-topics",
        "roadmap_updated": res["roadmap_updated"],
        "adaptation_summary": res["adaptation_summary"]
    }
