from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models import Resource, LearnerProfile, LearnerSkill, Feedback, CompletedCourse, InterestedResource

class RecommendationService:
    @staticmethod
    def calculate_recommendation_score(
        resource: Resource,
        profile: LearnerProfile,
        learner_skills_map: Dict[str, LearnerSkill],
        feedback_list: List[Feedback],
        completed_courses: List[CompletedCourse],
        interested_resources: List[InterestedResource]
    ) -> Dict[str, Any]:
        skill_name = resource.skill.name if resource.skill else ""
        learner_skill = learner_skills_map.get(skill_name)
        current_skill_score = learner_skill.overall_score if learner_skill else 0.0
        user_name = profile.user.name if profile.user else "Learner"

        # Check if already completed
        is_completed = any(c.course_name.lower() == resource.title.lower() for c in completed_courses)

        # Check if interested / bookmarked
        is_interested = any(i.resource_name.lower() == resource.title.lower() or i.skill_name == skill_name for i in interested_resources)

        # 1. Goal Relevance (30%)
        goal_relevant_skills = ["Deep Learning", "Machine Learning", "MLOps", "Python", "Statistics", "NLP", "System Design"]
        goal_rel = 95.0 if skill_name in goal_relevant_skills else 60.0

        # 2. Skill Gap Relevance (20%)
        gap_amount = max(0.0, 85.0 - current_skill_score)
        gap_rel = min(100.0, gap_amount * 1.2)

        # 3. Prerequisite Match (15%)
        prereqs = resource.prerequisites_json or []
        prereq_match = 100.0
        for prereq in prereqs:
            p_skill = learner_skills_map.get(prereq)
            if not p_skill or p_skill.overall_score < 50.0:
                prereq_match -= 40.0
        prereq_match = max(10.0, prereq_match)

        # 4. Difficulty Fit (10%)
        diff_fit = 80.0
        if resource.difficulty == "Beginner" and current_skill_score < 40.0:
            diff_fit = 95.0
        elif resource.difficulty == "Intermediate" and 40.0 <= current_skill_score <= 75.0:
            diff_fit = 95.0
        elif resource.difficulty == "Advanced" and current_skill_score > 75.0:
            diff_fit = 95.0
        elif resource.difficulty == "Beginner" and current_skill_score > 70.0:
            diff_fit = 40.0

        # 5. Preference Match & Interested Signal (10%)
        pref_fit = 80.0
        if profile.preferred_format in resource.format or (resource.is_project_based and "Project" in profile.preferred_format):
            pref_fit = 95.0

        # Interested courses boost preference relevance by +15%
        if is_interested:
            pref_fit += 15.0

        # 6. Historical Performance (10%)
        hist_perf = 85.0
        if learner_skill and learner_skill.assessment_performance < 60.0 and resource.type in ["Article", "Quiz", "Video"]:
            hist_perf = 95.0

        # 7. Time Fit (5%)
        daily_mins = profile.daily_study_hours * 60.0
        time_fit = 90.0 if resource.duration_minutes <= daily_mins else 60.0

        # Base Formula Score
        base_score = (
            (0.30 * goal_rel) +
            (0.20 * gap_rel) +
            (0.15 * prereq_match) +
            (0.10 * diff_fit) +
            (0.10 * pref_fit) +
            (0.10 * hist_perf) +
            (0.05 * time_fit)
        )

        # Adjust score based on stored feedback
        feedback_adj = 0.0
        for fb in feedback_list:
            if fb.resource_id == resource.id:
                if fb.feedback_type in ["like", "useful"]:
                    feedback_adj += 15.0
                elif fb.feedback_type in ["dislike"]:
                    feedback_adj -= 30.0
                elif fb.feedback_type == "too_easy" and resource.difficulty == "Beginner":
                    feedback_adj -= 25.0
                elif fb.feedback_type == "too_difficult" and resource.difficulty == "Advanced":
                    feedback_adj -= 25.0
                elif fb.feedback_type == "skipped":
                    feedback_adj -= 15.0

        # Completed resources get penalized to avoid duplicate recommendation
        if is_completed:
            feedback_adj -= 50.0

        final_score = round(max(0.0, min(100.0, base_score + feedback_adj)), 1)

        why_text = (
            f"Matches {user_name}'s goal for {profile.career_goal}. Target skill '{skill_name}' currently has a {gap_amount:.0f}% gap. "
            f"Resource difficulty ({resource.difficulty}) fits current proficiency level ({current_skill_score:.0f}%)."
        )
        if is_interested:
            why_text += " Boosted because you saved this topic in your Interested Courses."

        return {
            "resource": resource,
            "final_score": final_score,
            "why_recommended": why_text,
            "is_interested": is_interested,
            "breakdown": {
                "goal_relevance": round(goal_rel, 1),
                "skill_gap_relevance": round(gap_rel, 1),
                "prerequisite_match": round(prereq_match, 1),
                "difficulty_fit": round(diff_fit, 1),
                "learning_preference": round(pref_fit, 1),
                "historical_performance": round(hist_perf, 1),
                "time_fit": round(time_fit, 1),
                "feedback_adjustment": round(feedback_adj, 1)
            }
        }

    @staticmethod
    def get_recommendations(db: Session, profile: LearnerProfile, limit: int = 6) -> List[Dict[str, Any]]:
        resources = db.query(Resource).all()
        learner_skills = db.query(LearnerSkill).filter(LearnerSkill.profile_id == profile.id).all()
        learner_skills_map = {ls.skill.name: ls for ls in learner_skills if ls.skill}
        feedbacks = db.query(Feedback).filter(Feedback.profile_id == profile.id).all()
        completed_courses = db.query(CompletedCourse).filter(CompletedCourse.profile_id == profile.id).all()
        interested_resources = db.query(InterestedResource).filter(InterestedResource.profile_id == profile.id).all()

        scored = []
        for r in resources:
            item = RecommendationService.calculate_recommendation_score(
                r, profile, learner_skills_map, feedbacks, completed_courses, interested_resources
            )
            scored.append(item)

        scored.sort(key=lambda x: x["final_score"], reverse=True)
        return scored[:limit]
