import datetime
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.models import Roadmap, RoadmapPhase, RoadmapItem, LearnerProfile

class RoadmapService:
    @staticmethod
    def calculate_date_aware_roadmap(db: Session, profile: LearnerProfile) -> Dict[str, Any]:
        roadmap = db.query(Roadmap).filter(Roadmap.profile_id == profile.id).first()
        if not roadmap:
            return {}

        start_date = datetime.date.today()
        current_date = start_date

        total_completed = 0
        total_items = 0

        phases_out = []
        for phase in (roadmap.phases or []):
            phase_duration_days = (phase.estimated_weeks or 4) * 7
            phase_start = current_date
            phase_end = phase_start + datetime.timedelta(days=phase_duration_days - 1)
            current_date = phase_end + datetime.timedelta(days=1)

            items_out = []
            for item in phase.items:
                total_items += 1
                if item.status == "completed":
                    total_completed += 1

                items_out.append({
                    "id": item.id,
                    "title": item.title,
                    "skill_name": item.skill_name,
                    "estimated_hours": item.estimated_hours,
                    "item_type": item.item_type,
                    "status": item.status,
                    "is_remediation": item.is_remediation
                })

            phases_out.append({
                "id": phase.id,
                "phase_number": phase.phase_number,
                "title": phase.title,
                "description": phase.description,
                "estimated_weeks": phase.estimated_weeks,
                "date_range": f"{phase_start.strftime('%b %d').upper()} – {phase_end.strftime('%b %d, %Y').upper()}",
                "status": phase.status,
                "items": items_out
            })

        completion_pct = round((total_completed / max(1, total_items)) * 100.0, 1)

        recent_adaptation = None
        if profile.adaptation_events:
            last_event = profile.adaptation_events[-1]
            recent_adaptation = {
                "trigger_event": last_event.trigger_event,
                "summary": last_event.summary,
                "before_state": last_event.before_state_json,
                "after_state": last_event.after_state_json,
                "reason": last_event.reason,
                "created_at": last_event.created_at.strftime("%Y-%m-%d %H:%M")
            }

        return {
            "id": roadmap.id,
            "goal_title": roadmap.goal_title,
            "target_date": roadmap.target_date,
            "total_duration_weeks": roadmap.total_duration_weeks,
            "overall_completion_pct": completion_pct,
            "phases": phases_out,
            "recent_adaptation": recent_adaptation
        }
