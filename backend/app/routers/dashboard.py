import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import LearnerProfile, CompletedCourse, AssessmentAttempt, LearnerSkill, LearningActivity
from app.services.auth_service import get_current_profile
from app.services.career_service import CareerService
from app.services.skill_gap_analyzer import SkillGapAnalyzer
from app.services.roadmap_service import RoadmapService
from app.services.recommendation_service import RecommendationService
from app.services.streak_service import StreakService

router = APIRouter(prefix="/dashboard", tags=["Dashboard Overview"])

@router.get("")
def get_dashboard_overview(profile: LearnerProfile = Depends(get_current_profile), db: Session = Depends(get_db)):
    readiness = CareerService.calculate_career_readiness(db, profile, profile.career_goal)
    gaps_data = SkillGapAnalyzer.analyze_gaps(db, profile)
    roadmap_data = RoadmapService.calculate_date_aware_roadmap(db, profile)
    recs = RecommendationService.get_recommendations(db, profile)
    streak_info = StreakService.get_streak_info(profile)

    # Days remaining calculation
    target_date = datetime.date(2027, 3, 31)
    today = datetime.date.today()
    days_remaining = max(1, (target_date - today).days)

    # Schedule status
    schedule_status = "On Track"
    if readiness["readiness_score"] < 40:
        schedule_status = "Needs Focus"
    elif readiness["readiness_score"] > 80:
        schedule_status = "Ahead of Schedule"

    # Recent activity timeline from database
    activities = db.query(LearningActivity).filter(
        LearningActivity.profile_id == profile.id
    ).order_by(LearningActivity.activity_date.desc(), LearningActivity.created_at.desc()).limit(6).all()

    recent_activity = []
    for act in activities:
        recent_activity.append({
            "id": f"act-{act.id}",
            "type": act.activity_type.capitalize(),
            "title": act.title,
            "skill": profile.career_goal,
            "date": act.activity_date.strftime("%b %d, %Y") if act.activity_date else act.created_at.strftime("%b %d, %Y"),
            "result": "Completed",
            "skill_impact": "+Evidence"
        })

    # If no activities yet, check CompletedCourse & AssessmentAttempt
    if not recent_activity:
        completed_courses = db.query(CompletedCourse).filter(CompletedCourse.profile_id == profile.id).order_by(CompletedCourse.created_at.desc()).limit(3).all()
        for crs in completed_courses:
            recent_activity.append({
                "id": f"course-{crs.id}",
                "type": "Course",
                "title": crs.course_name,
                "skill": crs.skill_name,
                "date": crs.completion_date or crs.created_at.strftime("%b %d, %Y"),
                "result": "Completed",
                "skill_impact": "+Evidence"
            })

        attempts = db.query(AssessmentAttempt).filter(AssessmentAttempt.profile_id == profile.id).order_by(AssessmentAttempt.created_at.desc()).limit(3).all()
        for att in attempts:
            recent_activity.append({
                "id": f"assessment-{att.id}",
                "type": "Assessment",
                "title": "Adaptive Diagnostic Assessment",
                "skill": "Assessment",
                "date": att.created_at.strftime("%b %d, %Y"),
                "result": f"Score: {att.score:.0f}%",
                "skill_impact": f"+{round(att.score/10, 1)}% Mastery"
            })

    # AI Insights
    top_priority = gaps_data["top_priorities"][0] if gaps_data["top_priorities"] else "Core Fundamentals"
    insights = [
        f"Your {profile.career_goal} readiness score is currently {readiness['readiness_score']:.0f}%.",
        f"Your highest priority skill gap is {top_priority}.",
        f"Current streak: {streak_info['current_streak']} active days ({'Completed today' if streak_info['is_today_complete'] else 'Active yesterday, complete today to maintain'})." if streak_info['current_streak'] > 0 else "Start your first learning activity today to begin building your streak.",
        f"Schedule status is currently {schedule_status} at {profile.daily_study_hours} hrs/day."
    ]

    # Strongest skill
    learner_skills = db.query(LearnerSkill).filter(LearnerSkill.profile_id == profile.id).all()
    strongest_skill = "None yet"
    if learner_skills:
        sorted_skills = sorted(learner_skills, key=lambda s: s.overall_score, reverse=True)
        if sorted_skills and sorted_skills[0].overall_score > 0 and sorted_skills[0].skill:
            strongest_skill = sorted_skills[0].skill.name

    # Next Best Action
    top_gap = gaps_data["gaps"][0] if gaps_data["gaps"] else None
    if top_gap and top_gap["gap_amount"] > 0:
        next_action = {
            "title": f"Master {top_gap['skill_name']} Fundamentals",
            "skill": top_gap["skill_name"],
            "duration_minutes": 35,
            "why": f"Targets your highest-priority gap ({top_gap['gap_amount']:.0f} point gap for {profile.career_goal}).",
            "action_type": "Start Learning"
        }
    else:
        next_action = {
            "title": "Take Diagnostic Assessment",
            "skill": "Core Skills",
            "duration_minutes": 20,
            "why": "Evaluate your current baseline skills to generate verified Skill DNA.",
            "action_type": "Start Assessment"
        }

    return {
        "profile": {
            "name": profile.user.name if profile.user else "Learner",
            "email": profile.user.email if profile.user else "",
            "avatar_url": profile.avatar_url,
            "target_role": profile.target_role or profile.career_goal or "AI Engineer",
            "current_role": profile.current_role or "Learner",
            "target_deadline": profile.target_deadline or "March 2027",
            "daily_hours": profile.daily_study_hours or 2.0,
            "readiness_score": readiness["readiness_score"],
            "days_remaining": days_remaining,
            "schedule_status": schedule_status,
            "current_streak": streak_info["current_streak"],
            "longest_streak": streak_info["longest_streak"],
            "total_learning_days": streak_info["total_learning_days"],
            "is_today_complete": streak_info["is_today_complete"]
        },
        "skill_dna_summary": {
            "overall_proficiency": readiness["readiness_score"],
            "strongest_skill": strongest_skill,
            "priority_gap": top_priority,
            "evidence_count": sum(ls.evidence_count for ls in learner_skills)
        },
        "streak_info": streak_info,
        "skill_gaps": gaps_data,
        "date_aware_roadmap": roadmap_data,
        "next_best_action": next_action,
        "recent_activity": recent_activity,
        "ai_insights": insights,
        "recommendations": recs
    }
