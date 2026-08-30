import json
import datetime
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.models import (
    LearnerProfile, LearnerSkill, Roadmap, RoadmapPhase, RoadmapItem,
    AssessmentAttempt, AdaptationEvent, Resource, Skill
)
from app.services.skill_dna_service import SkillDNAService

class AdaptiveService:
    @staticmethod
    def handle_assessment_result(
        db: Session,
        profile: LearnerProfile,
        learner_skill: LearnerSkill,
        score: float,
        weak_concepts: List[str],
        strong_concepts: List[str]
    ) -> Dict[str, Any]:
        skill_name = learner_skill.skill.name if learner_skill.skill else "Skill"
        old_score = learner_skill.overall_score
        roadmap_updated = False
        adaptation_summary = None

        # Capture Before State
        before_state = {
            "skill_name": skill_name,
            "overall_score": old_score,
            "mastery": learner_skill.mastery,
            "confidence": learner_skill.confidence,
            "assessment_perf": learner_skill.assessment_performance,
            "status": learner_skill.status
        }

        if score >= 90.0:
            # High score: fast-track
            reason = f"Scored {score:.0f}% on {skill_name} assessment (Excellence threshold >=90%)."
            SkillDNAService.update_skill_state(
                db=db,
                learner_skill=learner_skill,
                reason=reason,
                event_type="assessment_passed",
                mastery_delta=10.0,
                confidence_delta=15.0,
                assessment_delta=20.0,
                retention_delta=10.0,
                velocity_delta=5.0,
                evidence_title=f"{skill_name} Mastery Quiz ({score:.0f}%)",
                evidence_type="quiz",
                evidence_score=score
            )
            
            # Skip redundant introductory item in roadmap if pending
            active_roadmap = db.query(Roadmap).filter(Roadmap.profile_id == profile.id).first()
            if active_roadmap:
                for phase in active_roadmap.phases:
                    for item in phase.items:
                        if item.skill_name == skill_name and item.status == "pending" and "Intro" in item.title:
                            item.status = "skipped"
                            roadmap_updated = True

            adaptation_summary = f"Machine Learning / {skill_name} score ({score:.0f}%) is exceptionally strong. AI skipped introductory materials and advanced your roadmap directly to applied concepts."

        elif score < 60.0:
            # Low score: remediation insertion
            reason = f"Scored {score:.0f}% on {skill_name} assessment (Needs reinforcement <60%)."
            SkillDNAService.update_skill_state(
                db=db,
                learner_skill=learner_skill,
                reason=reason,
                event_type="assessment_remediation",
                mastery_delta=-5.0,
                confidence_delta=-10.0,
                assessment_delta=-15.0,
                evidence_title=f"{skill_name} Diagnostic Attempt ({score:.0f}%)",
                evidence_type="quiz",
                evidence_score=score
            )

            # Insert remediation item into active roadmap phase
            active_roadmap = db.query(Roadmap).filter(Roadmap.profile_id == profile.id).first()
            if active_roadmap:
                active_phase = next((p for p in active_roadmap.phases if p.status == "in_progress"), None)
                if not active_phase and active_roadmap.phases:
                    active_phase = active_roadmap.phases[0]

                if active_phase:
                    weak_str = ", ".join(weak_concepts) if weak_concepts else "Core Concepts"
                    remediation_item = RoadmapItem(
                        phase_id=active_phase.id,
                        title=f"Remediation: {skill_name} ({weak_str})",
                        skill_name=skill_name,
                        estimated_hours=2.0,
                        item_type="Resource",
                        status="pending",
                        is_remediation=True,
                        order_index=0
                    )
                    db.add(remediation_item)
                    roadmap_updated = True

            adaptation_summary = f"Assessment score ({score:.0f}%) highlighted weak concepts in {skill_name}. AI inserted a targeted remediation module into your active roadmap."

        else:
            # Moderate score
            reason = f"Completed {skill_name} assessment with {score:.0f}%."
            SkillDNAService.update_skill_state(
                db=db,
                learner_skill=learner_skill,
                reason=reason,
                event_type="assessment_complete",
                mastery_delta=5.0,
                assessment_delta=10.0,
                confidence_delta=5.0,
                evidence_title=f"{skill_name} Assessment ({score:.0f}%)",
                evidence_type="quiz",
                evidence_score=score
            )
            adaptation_summary = f"Assessment completed ({score:.0f}%). Skill DNA updated."

        # Capture After State & Store Adaptation Event
        after_state = {
            "skill_name": skill_name,
            "overall_score": learner_skill.overall_score,
            "mastery": learner_skill.mastery,
            "confidence": learner_skill.confidence,
            "assessment_perf": learner_skill.assessment_performance,
            "status": learner_skill.status
        }

        if adaptation_summary:
            event = AdaptationEvent(
                profile_id=profile.id,
                trigger_event=f"Assessment Attempt: {skill_name} ({score:.0f}%)",
                summary=adaptation_summary,
                before_state_json=before_state,
                after_state_json=after_state,
                reason=reason
            )
            db.add(event)

        db.commit()

        return {
            "old_score": old_score,
            "new_score": learner_skill.overall_score,
            "roadmap_updated": roadmap_updated,
            "adaptation_summary": adaptation_summary
        }
