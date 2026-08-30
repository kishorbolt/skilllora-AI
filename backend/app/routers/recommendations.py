from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import LearnerProfile, Feedback
from app.schemas import RecommendationSchema, FeedbackRequest, NextBestActionResponse
from app.services.auth_service import get_current_profile
from app.services.recommendation_service import RecommendationService
from app.services.next_action_service import NextActionService

router = APIRouter(prefix="/recommendations", tags=["Recommendations & Feedback"])

@router.get("", response_model=List[RecommendationSchema])
def get_personalized_recommendations(
    limit: int = 6,
    profile: LearnerProfile = Depends(get_current_profile),
    db: Session = Depends(get_db)
):
    recs = RecommendationService.get_recommendations(db, profile, limit=limit)

    output = []
    for item in recs:
        r = item["resource"]
        output.append(RecommendationSchema(
            id=r.id,
            resource_id=r.id,
            title=r.title,
            type=r.type,
            skill_name=r.skill.name if r.skill else "",
            difficulty=r.difficulty,
            estimated_duration_minutes=r.duration_minutes,
            relevance_score=item["final_score"],
            breakdown_scores=item["breakdown"],
            why_recommended=item["why_recommended"],
            is_project_based=r.is_project_based,
            is_interested=item.get("is_interested", False)
        ))
    return output

@router.post("/feedback")
def submit_recommendation_feedback(
    req: FeedbackRequest,
    profile: LearnerProfile = Depends(get_current_profile),
    db: Session = Depends(get_db)
):
    fb = Feedback(
        profile_id=profile.id,
        resource_id=req.resource_id,
        skill_name=req.skill_name,
        feedback_type=req.feedback_type,
        comment=req.comment
    )
    db.add(fb)
    db.commit()
    return {"status": "success", "message": f"Recorded feedback '{req.feedback_type}'. Future recommendation ranking updated."}

@router.get("/next-best-action", response_model=NextBestActionResponse)
def get_next_best_action(
    profile: LearnerProfile = Depends(get_current_profile),
    db: Session = Depends(get_db)
):
    res = NextActionService.get_next_best_action(db, profile)
    return NextBestActionResponse(
        primary_action=res["primary_action"],
        alternative_actions=res["alternative_actions"],
        reason=res["reason"]
    )
