import datetime
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.models import LearnerSkill, SkillEvidence, SkillHistory, Skill

class SkillDNAService:
    @staticmethod
    def calculate_skill_score(learner_skill: LearnerSkill) -> float:
        """
        Transparent Skill DNA Scoring Engine Formula:
        30% Knowledge (Mastery)
        20% Assessment Performance
        20% Practical Application
        15% Confidence
        10% Retention
        5% Learning Velocity (clamped 0-100)
        """
        # If no evidence at all, flag insufficient evidence
        if learner_skill.evidence_count == 0:
            learner_skill.has_enough_evidence = False
            learner_skill.overall_score = 0.0
            learner_skill.status = "Beginner"
            return 0.0

        learner_skill.has_enough_evidence = True

        vel_normalized = max(0.0, min(100.0, 50.0 + learner_skill.learning_velocity))
        
        score = (
            (0.30 * learner_skill.mastery) +
            (0.20 * learner_skill.assessment_performance) +
            (0.20 * learner_skill.practical_application) +
            (0.15 * learner_skill.confidence) +
            (0.10 * learner_skill.retention) +
            (0.05 * vel_normalized)
        )

        score = round(max(0.0, min(100.0, score)), 1)
        learner_skill.overall_score = score

        # Verification threshold: at least 3 evidence pieces (course + assessment + project)
        if learner_skill.evidence_count >= 3 and learner_skill.practical_application >= 60.0 and learner_skill.assessment_performance >= 70.0:
            learner_skill.is_verified = True
        else:
            learner_skill.is_verified = False

        # Status assignment
        if learner_skill.retention < 60.0 and learner_skill.evidence_count > 0:
            learner_skill.status = "At Risk"
        elif learner_skill.is_verified and score >= 80.0:
            learner_skill.status = "Verified"
        elif score >= 80.0:
            learner_skill.status = "Strong"
        elif score >= 60.0:
            learner_skill.status = "Developing"
        elif score >= 40.0:
            learner_skill.status = "Needs Focus"
        else:
            learner_skill.status = "Beginner"

        return score

    @staticmethod
    def update_skill_state(
        db: Session,
        learner_skill: LearnerSkill,
        reason: str,
        event_type: str = "assessment",
        mastery_delta: float = 0.0,
        assessment_delta: float = 0.0,
        practical_delta: float = 0.0,
        confidence_delta: float = 0.0,
        retention_delta: float = 0.0,
        velocity_delta: float = 0.0,
        evidence_title: Optional[str] = None,
        evidence_type: Optional[str] = None,
        evidence_score: Optional[float] = None
    ) -> LearnerSkill:
        old_score = learner_skill.overall_score

        # Apply metric updates
        if mastery_delta != 0.0:
            learner_skill.mastery = max(0.0, min(100.0, learner_skill.mastery + mastery_delta))
        if assessment_delta != 0.0:
            learner_skill.assessment_performance = max(0.0, min(100.0, learner_skill.assessment_performance + assessment_delta))
        if practical_delta != 0.0:
            learner_skill.practical_application = max(0.0, min(100.0, learner_skill.practical_application + practical_delta))
        if confidence_delta != 0.0:
            learner_skill.confidence = max(0.0, min(100.0, learner_skill.confidence + confidence_delta))
        if retention_delta != 0.0:
            learner_skill.retention = max(0.0, min(100.0, learner_skill.retention + retention_delta))
        if velocity_delta != 0.0:
            learner_skill.learning_velocity = round(learner_skill.learning_velocity + velocity_delta, 1)

        learner_skill.last_practiced = datetime.datetime.utcnow()

        # Add evidence if provided
        if evidence_title and evidence_type:
            evidence = SkillEvidence(
                learner_skill_id=learner_skill.id,
                evidence_type=evidence_type,
                title=evidence_title,
                score=evidence_score,
                description=f"Evidence recorded via {event_type}."
            )
            db.add(evidence)
            learner_skill.evidence_count += 1

        # Calculate new score
        new_score = SkillDNAService.calculate_skill_score(learner_skill)

        # Log score change history
        history = SkillHistory(
            learner_skill_id=learner_skill.id,
            old_score=old_score,
            new_score=new_score,
            reason=reason,
            event_type=event_type
        )
        db.add(history)
        db.commit()
        db.refresh(learner_skill)

        return learner_skill

    @staticmethod
    def apply_skill_decay(db: Session, learner_skill: LearnerSkill) -> LearnerSkill:
        """Heuristic skill decay based on days since last practiced"""
        now = datetime.datetime.utcnow()
        if not learner_skill.last_practiced:
            return learner_skill

        days_idle = (now - learner_skill.last_practiced).days
        if days_idle > 14:
            decay_amount = min(30.0, (days_idle - 14) * 0.5) # 0.5% retention drop per idle day past 14
            new_retention = max(30.0, learner_skill.retention - decay_amount)
            if new_retention != learner_skill.retention:
                learner_skill.retention = round(new_retention, 1)
                learner_skill.trend = "decaying"
                SkillDNAService.calculate_skill_score(learner_skill)
                db.commit()
        return learner_skill

    @staticmethod
    def get_skill_explanation(learner_skill: LearnerSkill) -> Dict[str, str]:
        """Provides human-readable AI explanation of why a skill has its current score."""
        score = learner_skill.overall_score
        name = learner_skill.skill.name if learner_skill.skill else "Skill"

        if learner_skill.evidence_count == 0:
            return {
                "why": f"No learning evidence has been logged yet for {name}. Complete a course or quiz to initialize score.",
                "action": f"Start '{name} Fundamentals' introductory resource.",
                "impact": "+15–25% initial skill gain"
            }

        if learner_skill.practical_application < 50.0:
            why = f"The learner has theoretical knowledge in {name} ({learner_skill.mastery:.0f}%), but practical application ({learner_skill.practical_application:.0f}%) is limiting the overall score."
            action = f"Submit a hands-on project or practical exercise for {name}."
            impact = "+10–15% practical score impact"
        elif learner_skill.assessment_performance < 60.0:
            why = f"Assessment score in {name} ({learner_skill.assessment_performance:.0f}%) is below target threshold."
            action = f"Complete adaptive practice assessment for {name}."
            impact = "+8–12% score impact"
        elif learner_skill.retention < 60.0:
            why = f"Retention for {name} has decayed to {learner_skill.retention:.0f}% due to lack of recent practice (last practiced {learner_skill.last_practiced.strftime('%b %d')})."
            action = f"Complete a 15-minute refresher quiz on {name}."
            impact = "Restore +15% retention"
        else:
            why = f"Strong performance verified across courses, assessments ({learner_skill.assessment_performance:.0f}%), and practical projects ({learner_skill.practical_application:.0f}%)."
            action = f"Advance to next downstream dependent skill."
            impact = "Unlocks advanced capstones"

        return {
            "why": why,
            "action": action,
            "impact": impact
        }
