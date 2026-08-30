from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import LearnerProfile, Roadmap, RoadmapPhase, RoadmapItem, AdaptationEvent, LearnerSkill
from app.schemas import RoadmapResponse, RoadmapPhaseSchema, RoadmapItemSchema
from app.services.auth_service import get_current_profile
from app.services.skill_dna_service import SkillDNAService
from app.services.next_action_service import NextActionService
from app.services.streak_service import StreakService
from app.schemas import NextBestActionResponse

router = APIRouter(prefix="/roadmap", tags=["Roadmap & Timeline"])

@router.get("", response_model=RoadmapResponse)
def get_roadmap(
    profile: LearnerProfile = Depends(get_current_profile),
    db: Session = Depends(get_db)
):
    roadmap = db.query(Roadmap).filter(Roadmap.profile_id == profile.id).first()
    if not roadmap:
        return RoadmapResponse(
            id=0,
            goal_title=profile.career_goal or "AI Engineer",
            target_date=profile.target_deadline or "March 2027",
            total_duration_weeks=24,
            overall_completion_pct=0.0,
            phases=[],
            recent_adaptation=None
        )

    phases_schema = []
    total_items = 0
    completed_items = 0

    for phase in roadmap.phases:
        items_schema = []
        for item in phase.items:
            total_items += 1
            if item.status == "completed":
                completed_items += 1

            items_schema.append(RoadmapItemSchema(
                id=item.id,
                resource_id=item.resource_id,
                title=item.title,
                skill_name=item.skill_name,
                estimated_hours=item.estimated_hours,
                item_type=item.item_type,
                status=item.status,
                is_remediation=item.is_remediation
            ))

        phases_schema.append(RoadmapPhaseSchema(
            id=phase.id,
            phase_number=phase.phase_number,
            title=phase.title,
            description=phase.description or "",
            estimated_weeks=phase.estimated_weeks,
            status=phase.status,
            items=items_schema
        ))

    completion_pct = round((completed_items / max(1, total_items)) * 100.0, 1)

    latest_event = db.query(AdaptationEvent).filter(AdaptationEvent.profile_id == profile.id).order_by(AdaptationEvent.created_at.desc()).first()
    adaptation_data = None
    if latest_event:
        adaptation_data = {
            "trigger_event": latest_event.trigger_event,
            "summary": latest_event.summary,
            "before_state": latest_event.before_state_json,
            "after_state": latest_event.after_state_json,
            "reason": latest_event.reason,
            "created_at": latest_event.created_at.strftime("%Y-%m-%d %H:%M")
        }

    return RoadmapResponse(
        id=roadmap.id,
        goal_title=roadmap.goal_title,
        target_date=roadmap.target_date,
        total_duration_weeks=roadmap.total_duration_weeks,
        overall_completion_pct=completion_pct,
        phases=phases_schema,
        recent_adaptation=adaptation_data
    )

@router.post("/item/{item_id}/complete")
@router.post("/items/{item_id}/toggle")
@router.post("/items/{item_id}/complete")
def toggle_item_complete(
    item_id: int,
    profile: LearnerProfile = Depends(get_current_profile),
    db: Session = Depends(get_db)
):
    item = db.query(RoadmapItem).filter(RoadmapItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Roadmap item not found.")

    item.status = "completed" if item.status != "completed" else "pending"
    db.commit()

    if item.status == "completed":
        ls = db.query(LearnerSkill).join(LearnerSkill.skill).filter(
            LearnerSkill.profile_id == profile.id,
            LearnerSkill.skill.has(name=item.skill_name)
        ).first()
        
        if ls:
            SkillDNAService.update_skill_state(
                db=db,
                learner_skill=ls,
                reason=f"Completed roadmap item '{item.title}'.",
                event_type="resource_completed",
                mastery_delta=5.0,
                retention_delta=5.0,
                confidence_delta=5.0,
                evidence_title=item.title,
                evidence_type="course",
                evidence_score=100.0
            )

        StreakService.record_activity(
            db=db,
            profile=profile,
            activity_type="roadmap_item",
            title=f"Completed {item.title}",
            description=f"Roadmap milestone for {item.skill_name} completed."
        )

    return {"status": "success", "item_id": item.id, "new_state": item.status}

@router.get("/next-best-action", response_model=NextBestActionResponse)
def get_roadmap_next_best_action(
    profile: LearnerProfile = Depends(get_current_profile),
    db: Session = Depends(get_db)
):
    res = NextActionService.get_next_best_action(db, profile)
    return NextBestActionResponse(
        primary_action=res["primary_action"],
        alternative_actions=res["alternative_actions"],
        reason=res["reason"]
    )
