from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models import LearnerProfile, LearnerSkill, Skill, AssessmentAttempt, Roadmap, RoadmapPhase, RoadmapItem, AdaptationEvent
from app.services.mcq_validator import MCQValidator
from app.services.question_bank import get_technology_question_bank
from app.services.skill_dna_service import SkillDNAService

class AssessmentEngine:
    @staticmethod
    def generate_30_mcq_assessment(technology: str, previous_attempts: List[AssessmentAttempt] = None) -> Dict[str, Any]:
        raw_bank = get_technology_question_bank(technology)
        
        # Filter valid questions
        validated: List[Dict[str, Any]] = []
        for q in raw_bank:
            if MCQValidator.validate_question(q, technology, validated):
                validated.append(q)

        # Categorize by difficulty
        easy_qs = [q for q in validated if q.get("difficulty") == "Easy"]
        med_qs = [q for q in validated if q.get("difficulty") == "Medium"]
        hard_qs = [q for q in validated if q.get("difficulty") == "Hard"]

        # Ensure exact 10 Easy, 12 Medium, 8 Hard = 30 total
        selected = easy_qs[:10] + med_qs[:12] + hard_qs[:8]

        # Fill if needed
        if len(selected) < 30:
            for q in validated:
                if q not in selected:
                    selected.append(q)
                if len(selected) == 30:
                    break

        return {
            "technology": technology,
            "title": f"{technology} 30-MCQ Technology Skill Assessment",
            "total_questions": len(selected),
            "estimated_minutes": 25,
            "difficulty_distribution": {"Easy": 10, "Medium": 12, "Hard": 8},
            "questions": selected
        }

    @staticmethod
    def evaluate_submission(
        db: Session,
        profile: LearnerProfile,
        technology: str,
        assessment_questions: List[Dict[str, Any]],
        answers_map: Dict[int, int],
        duration_seconds: int = 1200
    ) -> Dict[str, Any]:
        correct_count = 0
        incorrect_count = 0
        unanswered_count = 0

        topic_stats: Dict[str, Dict[str, int]] = {}
        mistakes_list: List[Dict[str, Any]] = []
        full_review_list: List[Dict[str, Any]] = []

        for q in assessment_questions:
            q_id = q["id"]
            correct_idx = q["correct_answer_index"]
            options = q["options"]
            topic = q.get("concept", q.get("topic", "General"))

            if topic not in topic_stats:
                topic_stats[topic] = {"correct": 0, "total": 0}
            topic_stats[topic]["total"] += 1

            user_idx = answers_map.get(q_id)

            if user_idx is None:
                unanswered_count += 1
                status = "unanswered"
            elif user_idx == correct_idx:
                correct_count += 1
                topic_stats[topic]["correct"] += 1
                status = "correct"
            else:
                incorrect_count += 1
                status = "incorrect"
                mistakes_list.append({
                    "question_id": q_id,
                    "question_text": q["question_text"],
                    "user_answer": options[user_idx] if 0 <= user_idx < len(options) else "Skipped",
                    "user_answer_index": user_idx,
                    "correct_answer": options[correct_idx],
                    "correct_answer_index": correct_idx,
                    "explanation": q["explanation"],
                    "topic": topic,
                    "recommended_review": f"Review {technology} {topic}"
                })

            full_review_list.append({
                "question_id": q_id,
                "question_text": q["question_text"],
                "options": options,
                "user_answer_index": user_idx,
                "correct_answer_index": correct_idx,
                "explanation": q["explanation"],
                "topic": topic,
                "status": status
            })

        total_q = len(assessment_questions)
        pct = round((correct_count / max(1, total_q)) * 100.0, 1)

        # Topic Breakdown %
        topic_performance: Dict[str, float] = {}
        weak_topics: List[str] = []
        strong_topics: List[str] = []

        for top, data in topic_stats.items():
            top_pct = round((data["correct"] / max(1, data["total"])) * 100.0, 1)
            topic_performance[top] = top_pct
            if top_pct < 60.0:
                weak_topics.append(top)
            else:
                strong_topics.append(top)

        # Save Attempt Record
        attempt = AssessmentAttempt(
            profile_id=profile.id,
            assessment_id=1,
            score=pct,
            passed=pct >= 70.0,
            difficulty_level="30-MCQ Adaptive",
            weak_concepts_json=weak_topics,
            strong_concepts_json=strong_topics
        )
        db.add(attempt)
        db.flush()

        # Skill DNA Update
        skill = db.query(Skill).filter(Skill.name == technology).first()
        old_score = 50.0
        new_score = pct

        if skill:
            ls = db.query(LearnerSkill).filter(LearnerSkill.profile_id == profile.id, LearnerSkill.skill_id == skill.id).first()
            if ls:
                old_score = ls.overall_score
                ev_res = SkillDNAService.update_skill_state(
                    db=db,
                    learner_skill=ls,
                    reason=f"Completed {technology} 30-MCQ Tech Assessment ({pct:.0f}%).",
                    event_type="assessment",
                    assessment_delta=5.0 if pct >= 70 else -5.0,
                    mastery_delta=5.0 if pct >= 70 else -5.0,
                    evidence_title=f"{technology} 30-MCQ Assessment",
                    evidence_type="assessment",
                    evidence_score=pct
                )
                new_score = ev_res.overall_score if hasattr(ev_res, "overall_score") else ls.overall_score

        # Adaptive Roadmap Update if weak topics < 60%
        roadmap_updated = False
        adaptation_summary = None

        if weak_topics:
            rm = db.query(Roadmap).filter(Roadmap.profile_id == profile.id).first()
            if rm and rm.phases:
                active_phase = next((p for p in rm.phases if p.status == "in_progress"), rm.phases[0])
                weak_topic_str = ", ".join(weak_topics[:2])
                remediation_item = RoadmapItem(
                    phase_id=active_phase.id,
                    title=f"Remediation: {technology} ({weak_topic_str})",
                    skill_name=technology,
                    estimated_hours=3.0,
                    item_type="Resource",
                    status="pending",
                    is_remediation=True,
                    order_index=len(active_phase.items) + 1
                )
                db.add(remediation_item)
                
                adaptation_summary = f"{technology} assessment score ({pct:.0f}%) highlighted gaps in {weak_topic_str}. SKILLORA AI inserted remediation into Phase {active_phase.phase_number}."
                db.add(AdaptationEvent(
                    profile_id=profile.id,
                    trigger_event=f"30-MCQ Assessment ({pct:.0f}%)",
                    summary=f"Roadmap updated by AI for {technology}",
                    before_state_json={"skill": technology, "score": old_score},
                    after_state_json={"skill": technology, "score": new_score, "inserted": f"Remediation: {weak_topic_str}"},
                    reason=f"Score below threshold on sub-topics ({weak_topic_str}) triggered automatic remediation insertion."
                ))
                roadmap_updated = True

        db.commit()

        return {
            "score": pct,
            "correct_count": correct_count,
            "incorrect_count": incorrect_count,
            "unanswered_count": unanswered_count,
            "total_questions": total_q,
            "passed": pct >= 70.0,
            "performance_tag": "Strong" if pct >= 80 else ("Developing" if pct >= 60 else "Needs Focus"),
            "technology": technology,
            "old_skill_score": round(old_score, 1),
            "new_skill_score": round(new_score, 1),
            "topic_performance": topic_performance,
            "weak_topics": weak_topics,
            "strong_topics": strong_topics,
            "mistake_list": mistakes_list,
            "full_review_list": full_review_list,
            "roadmap_updated": roadmap_updated,
            "adaptation_summary": adaptation_summary
        }
