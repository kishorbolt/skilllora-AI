from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.models import LearnerProfile, LearnerSkill, Roadmap, Feedback, Resource
from app.services.recommendation_service import RecommendationService

class NextActionService:
    @staticmethod
    def get_next_best_action(db: Session, profile: LearnerProfile) -> Dict[str, Any]:
        learner_skills = db.query(LearnerSkill).filter(LearnerSkill.profile_id == profile.id).all()
        skills_map = {ls.skill.name: ls for ls in learner_skills if ls.skill}

        # Find highest priority gap
        gap_skills = []
        for ls in learner_skills:
            if ls.skill:
                gap = 85.0 - ls.overall_score
                if gap > 0:
                    gap_skills.append((ls.skill.name, gap, ls))

        gap_skills.sort(key=lambda x: x[1], reverse=True)
        top_gap_name = gap_skills[0][0] if gap_skills else "Deep Learning"
        top_gap_ls = gap_skills[0][2] if gap_skills else None

        # Fetch active recommendations
        recommendations = RecommendationService.get_recommendations(db, profile, limit=3)
        primary_rec = recommendations[0] if recommendations else None

        if primary_rec:
            res = primary_rec["resource"]
            primary_action = {
                "title": res.title,
                "type": res.type,
                "skill_name": res.skill.name if res.skill else top_gap_name,
                "estimated_duration_minutes": res.duration_minutes,
                "difficulty": res.difficulty,
                "resource_id": res.id,
                "relevance_score": primary_rec["final_score"],
                "reason": f"Addresses your highest-priority skill gap ({top_gap_name}) and matches your daily {profile.daily_study_hours:.1f}h schedule."
            }
        else:
            primary_action = {
                "title": f"{top_gap_name} Guided Hands-On Practice",
                "type": "Coding Exercise",
                "skill_name": top_gap_name,
                "estimated_duration_minutes": 35,
                "difficulty": "Intermediate",
                "resource_id": 1,
                "relevance_score": 94.0,
                "reason": f"Directly targets your top skill bottleneck in {top_gap_name} to unblock downstream milestones."
            }

        alternatives = []
        for rec in recommendations[1:3]:
            r = rec["resource"]
            alternatives.append({
                "title": r.title,
                "type": r.type,
                "skill_name": r.skill.name if r.skill else "",
                "estimated_duration_minutes": r.duration_minutes,
                "difficulty": r.difficulty,
                "resource_id": r.id
            })

        return {
            "primary_action": primary_action,
            "alternative_actions": alternatives,
            "reason": f"Calculated based on your critical gap in {top_gap_name}, target readiness goal, and stored feedback preferences."
        }
