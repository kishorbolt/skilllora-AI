import datetime
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models import LearnerProfile, LearningActivity

class StreakService:
    @staticmethod
    def get_streak_info(profile: LearnerProfile) -> Dict[str, Any]:
        """
        Calculate current streak status based on calendar dates.
        """
        if not profile.last_active_date:
            return {
                "current_streak": 0,
                "longest_streak": profile.longest_streak or 0,
                "total_learning_days": profile.total_learning_days or 0,
                "is_today_complete": False,
                "last_active_date": None
            }

        today = datetime.date.today()
        last_date = profile.last_active_date.date() if isinstance(profile.last_active_date, datetime.datetime) else profile.last_active_date
        diff = (today - last_date).days

        if diff == 0:
            # Active today
            return {
                "current_streak": profile.current_streak or 1,
                "longest_streak": profile.longest_streak or 1,
                "total_learning_days": profile.total_learning_days or 1,
                "is_today_complete": True,
                "last_active_date": profile.last_active_date.strftime("%Y-%m-%d")
            }
        elif diff == 1:
            # Active yesterday, streak still alive pending today's activity
            return {
                "current_streak": profile.current_streak or 1,
                "longest_streak": profile.longest_streak or 1,
                "total_learning_days": profile.total_learning_days or 1,
                "is_today_complete": False,
                "last_active_date": profile.last_active_date.strftime("%Y-%m-%d")
            }
        else:
            # Missed 2+ days, active streak broken to 0 until next activity
            return {
                "current_streak": 0,
                "longest_streak": profile.longest_streak or 0,
                "total_learning_days": profile.total_learning_days or 0,
                "is_today_complete": False,
                "last_active_date": profile.last_active_date.strftime("%Y-%m-%d")
            }

    @staticmethod
    def record_activity(
        db: Session,
        profile: LearnerProfile,
        activity_type: str,
        title: str,
        description: Optional[str] = None,
        date_override: Optional[datetime.date] = None
    ) -> Dict[str, Any]:
        """
        Record a meaningful learning activity and adjust streak consecutively.
        """
        activity_date_obj = date_override or datetime.date.today()
        now = datetime.datetime.utcnow()

        # Log discrete LearningActivity entry
        act = LearningActivity(
            profile_id=profile.id,
            activity_type=activity_type,
            title=title,
            description=description,
            activity_date=datetime.datetime.combine(activity_date_obj, datetime.time(12, 0)),
            created_at=now
        )
        db.add(act)

        # Streak calculation based on calendar days
        if not profile.last_active_date:
            profile.current_streak = 1
            profile.longest_streak = max(profile.longest_streak or 0, 1)
            profile.total_learning_days = 1
            profile.last_active_date = datetime.datetime.combine(activity_date_obj, datetime.time(12, 0))
        else:
            last_date = profile.last_active_date.date() if isinstance(profile.last_active_date, datetime.datetime) else profile.last_active_date
            diff = (activity_date_obj - last_date).days

            if diff == 0:
                # Same calendar day: do not increment streak counter
                pass
            elif diff == 1:
                # Consecutive day: increment streak
                profile.current_streak = (profile.current_streak or 0) + 1
                profile.longest_streak = max(profile.longest_streak or 0, profile.current_streak)
                profile.total_learning_days = (profile.total_learning_days or 0) + 1
                profile.last_active_date = datetime.datetime.combine(activity_date_obj, datetime.time(12, 0))
            elif diff > 1:
                # Missed at least one day: reset streak to 1
                profile.current_streak = 1
                profile.longest_streak = max(profile.longest_streak or 0, 1)
                profile.total_learning_days = (profile.total_learning_days or 0) + 1
                profile.last_active_date = datetime.datetime.combine(activity_date_obj, datetime.time(12, 0))

        db.commit()
        db.refresh(profile)

        return StreakService.get_streak_info(profile)
