from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models import LearnerProfile, LearnerSkill
from app.services.career_matrix import get_career_matrix

class SkillGapAnalyzer:
    @staticmethod
    def analyze_gaps(db: Session, profile: LearnerProfile) -> Dict[str, Any]:
        career_matrix = get_career_matrix(profile.career_goal)
        learner_skills = db.query(LearnerSkill).filter(LearnerSkill.profile_id == profile.id).all()
        learner_skills_map = {ls.skill.name: ls for ls in learner_skills if ls.skill}

        gaps_list: List[Dict[str, Any]] = []
        critical_count = 0

        for req in career_matrix:
            sname = req["skill_name"]
            req_level = req["required_level"]
            importance = req["importance"]
            prereqs = req["prerequisites"]

            ls = learner_skills_map.get(sname)
            current_level = ls.overall_score if ls else 0.0

            gap_amount = max(0.0, req_level - current_level)

            # Priority calculation based on gap_amount, importance, and prereqs
            if gap_amount > 20.0 and importance in ["Critical", "High"]:
                severity = "Critical"
                critical_count += 1
            elif gap_amount > 10.0:
                severity = "High"
            elif gap_amount > 0.0:
                severity = "Medium"
            else:
                severity = "Strength"

            # Why it's a gap text
            why_text = f"Your target {profile.career_goal} role requires {req_level:.0f}% proficiency in {sname} (Importance: {importance}). Your current evidence-backed level is {current_level:.0f}%."
            if prereqs:
                why_text += f" Prerequisites: {', '.join(prereqs)}."

            action_text = f"Complete {sname} Diagnostic Assessment & Practical Project"
            if current_level < 40.0:
                action_text = f"Start {sname} Foundations Module"

            gaps_list.append({
                "skill_name": sname,
                "category": ls.skill.category if ls and ls.skill else "Core",
                "current_level": round(current_level, 1),
                "target_level": round(req_level, 1),
                "gap_amount": round(gap_amount, 1),
                "gap_severity": severity,
                "importance": importance,
                "prerequisites": prereqs,
                "why_it_matters": why_text,
                "recommended_action": action_text,
                "priority_order": 0
            })

        # Sort gaps by severity (Critical first) and gap amount
        severity_order = {"Critical": 1, "High": 2, "Medium": 3, "Strength": 4}
        gaps_list.sort(key=lambda x: (severity_order.get(x["gap_severity"], 5), -x["gap_amount"]))

        for idx, g in enumerate(gaps_list, 1):
            g["priority_order"] = idx

        top_priorities = [g["skill_name"] for g in gaps_list if g["gap_severity"] in ["Critical", "High"]][:3]

        return {
            "target_role": profile.career_goal,
            "critical_gaps_count": critical_count,
            "gaps": gaps_list,
            "top_priorities": top_priorities
        }
