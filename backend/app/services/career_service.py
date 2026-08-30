from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.models import LearnerProfile, LearnerSkill, Skill

CAREER_REQUIREMENTS = {
    "AI Engineer": {
        "Python": 90.0,
        "Machine Learning": 85.0,
        "Deep Learning": 80.0,
        "Statistics": 75.0,
        "MLOps": 70.0,
        "System Design": 70.0,
        "SQL": 65.0
    },
    "Data Scientist": {
        "Python": 85.0,
        "Statistics": 90.0,
        "SQL": 85.0,
        "Machine Learning": 80.0,
        "Data Visualization": 80.0,
        "Deep Learning": 50.0
    },
    "MLOps Engineer": {
        "Python": 85.0,
        "MLOps": 90.0,
        "Cloud": 85.0,
        "System Design": 80.0,
        "Machine Learning": 75.0,
        "SQL": 70.0
    },
    "Full Stack AI Developer": {
        "Python": 85.0,
        "System Design": 80.0,
        "Machine Learning": 75.0,
        "SQL": 75.0,
        "Cloud": 70.0,
        "Data Structures": 80.0
    }
}

class CareerService:
    @staticmethod
    def calculate_career_readiness(db: Session, profile: LearnerProfile, target_role: str = None) -> Dict[str, Any]:
        role = target_role or profile.career_goal or "AI Engineer"
        reqs = CAREER_REQUIREMENTS.get(role, CAREER_REQUIREMENTS["AI Engineer"])

        learner_skills = db.query(LearnerSkill).filter(LearnerSkill.profile_id == profile.id).all()
        skills_map = {ls.skill.name: ls for ls in learner_skills if ls.skill}

        total_req_points = sum(reqs.values())
        achieved_points = 0.0

        gaps = []
        strongest = []
        critical_missing = []

        for skill_name, req_score in reqs.items():
            ls = skills_map.get(skill_name)
            current_score = ls.overall_score if ls else 0.0
            
            # Cap contribution at required score
            contribution = min(current_score, req_score)
            achieved_points += contribution

            gap = req_score - current_score
            if gap > 25.0:
                critical_missing.append(skill_name)
                gaps.append({
                    "skill_name": skill_name,
                    "current": current_score,
                    "required": req_score,
                    "gap": round(gap, 1),
                    "severity": "Critical"
                })
            elif gap > 0:
                gaps.append({
                    "skill_name": skill_name,
                    "current": current_score,
                    "required": req_score,
                    "gap": round(gap, 1),
                    "severity": "Medium" if gap > 10 else "Minor"
                })
            else:
                strongest.append(skill_name)

        readiness_pct = round((achieved_points / total_req_points) * 100.0, 1)

        projected_path = [
            {"phase": "Month 1-2", "milestone": "Close Statistics & Deep Learning core gaps", "target_readiness": min(85.0, readiness_pct + 12.0)},
            {"phase": "Month 3-4", "milestone": "Complete Capstone MLOps System Project", "target_readiness": min(95.0, readiness_pct + 20.0)},
            {"phase": "Month 5-6", "milestone": "Portfolio Verification & Job Ready State", "target_readiness": 98.0}
        ]

        return {
            "target_role": role,
            "readiness_score": readiness_pct,
            "critical_missing_skills": critical_missing,
            "strongest_skills": strongest,
            "gaps": gaps,
            "projected_improvement_path": projected_path,
            "disclaimer": "Career Readiness is an internal product heuristic derived from verified skill evidence and target profile requirements, not an official guarantee of employment."
        }

    @staticmethod
    def simulate_what_if(
        db: Session,
        profile: LearnerProfile,
        target_role: str,
        daily_hours: float,
        known_skills: List[str],
        target_deadline: str
    ) -> Dict[str, Any]:
        baseline_readiness = CareerService.calculate_career_readiness(db, profile, profile.career_goal)
        simulated_readiness = CareerService.calculate_career_readiness(db, profile, target_role)

        # Baseline timeline calculation
        current_hours = profile.daily_study_hours
        base_weeks = 24 if current_hours <= 2.0 else 16

        # Simulated timeline calculation
        sim_weeks = max(8, int(base_weeks * (current_hours / max(0.5, daily_hours))))

        # Known skills adjustment
        if known_skills:
            sim_weeks = max(6, sim_weeks - len(known_skills) * 2)

        current_path = {
            "role": profile.career_goal,
            "daily_hours": profile.daily_study_hours,
            "duration_weeks": base_weeks,
            "readiness_score": baseline_readiness["readiness_score"],
            "critical_gaps": baseline_readiness["critical_missing_skills"],
            "milestone_count": 5
        }

        simulated_path = {
            "role": target_role,
            "daily_hours": daily_hours,
            "duration_weeks": sim_weeks,
            "readiness_score": simulated_readiness["readiness_score"],
            "critical_gaps": simulated_readiness["critical_missing_skills"],
            "milestone_count": 4 if known_skills else 5
        }

        diff_weeks = base_weeks - sim_weeks
        summary = (
            f"Switching schedule from {current_hours:.1f}h to {daily_hours:.1f}h/day for '{target_role}' "
            f"will {'shorten' if diff_weeks >= 0 else 'extend'} your path by {abs(diff_weeks)} weeks (Total: {sim_weeks} weeks)."
        )

        return {
            "current_path": current_path,
            "simulated_path": simulated_path,
            "differences": {
                "duration_delta_weeks": -diff_weeks,
                "summary": summary,
                "unlocked_fast_track": len(known_skills) > 0
            }
        }
