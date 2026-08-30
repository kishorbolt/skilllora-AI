import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=True)
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    profile = relationship("LearnerProfile", back_populates="user", uselist=False)


class LearnerProfile(Base):
    __tablename__ = "learner_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    career_goal = Column(String, nullable=False, default="AI Engineer")
    learning_objective = Column(String, nullable=False, default="Master required domain competencies with verified Skill DNA.")
    experience_level = Column(String, default="Intermediate")
    daily_study_hours = Column(Float, default=2.0)
    target_deadline = Column(String, default="March 2027")
    preferred_format = Column(String, default="Interactive & Project-based")
    confidence_level = Column(Integer, default=75)
    raw_onboarding_input = Column(Text, nullable=True)

    # Real Streak & Activity Tracking
    current_streak = Column(Integer, default=0)
    longest_streak = Column(Integer, default=0)
    total_learning_days = Column(Integer, default=0)
    last_active_date = Column(DateTime, nullable=True)

    # Extended Personal & Career Profile fields (Clean defaults for new learners)
    bio = Column(Text, nullable=True)
    avatar_url = Column(String, nullable=True)
    location = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    linkedin_url = Column(String, nullable=True)
    github_url = Column(String, nullable=True)
    portfolio_url = Column(String, nullable=True)
    current_role = Column(String, nullable=True, default="Learner")
    target_role = Column(String, nullable=True, default="AI Engineer")
    preferred_difficulty = Column(String, default="Intermediate")
    weekly_availability = Column(String, default="14 Hours / Week")
    
    # Resume & Career Document
    resume_url = Column(String, nullable=True)
    resume_filename = Column(String, nullable=True)
    resume_filetype = Column(String, nullable=True)
    resume_filesize = Column(String, nullable=True)
    resume_uploaded_at = Column(DateTime, nullable=True)
    resume_analysis_status = Column(String, nullable=True) # e.g. "pending", "analyzed", "failed"
    resume_insights_json = Column(JSON, default=dict)

    user = relationship("User", back_populates="profile")
    learner_skills = relationship("LearnerSkill", back_populates="profile", cascade="all, delete-orphan")
    roadmaps = relationship("Roadmap", back_populates="profile", cascade="all, delete-orphan")
    assessment_attempts = relationship("AssessmentAttempt", back_populates="profile", cascade="all, delete-orphan")
    project_submissions = relationship("ProjectSubmission", back_populates="profile", cascade="all, delete-orphan")
    feedbacks = relationship("Feedback", back_populates="profile", cascade="all, delete-orphan")
    insights = relationship("AIInsight", back_populates="profile", cascade="all, delete-orphan")
    adaptation_events = relationship("AdaptationEvent", back_populates="profile", cascade="all, delete-orphan")
    learning_sessions = relationship("LearningSession", back_populates="profile", cascade="all, delete-orphan")
    completed_courses = relationship("CompletedCourse", back_populates="profile", cascade="all, delete-orphan")
    interested_resources = relationship("InterestedResource", back_populates="profile", cascade="all, delete-orphan")
    activities = relationship("LearningActivity", back_populates="profile", cascade="all, delete-orphan")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    category = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    prerequisites_json = Column(JSON, default=list)

    learner_skills = relationship("LearnerSkill", back_populates="skill")
    resources = relationship("Resource", back_populates="skill")
    assessments = relationship("Assessment", back_populates="skill")
    projects = relationship("Project", back_populates="skill")


class LearnerSkill(Base):
    __tablename__ = "learner_skills"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("learner_profiles.id"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    
    # 6-Factor metrics (0-100)
    mastery = Column(Float, default=0.0)
    confidence = Column(Float, default=50.0)
    retention = Column(Float, default=100.0)
    practical_application = Column(Float, default=0.0)
    assessment_performance = Column(Float, default=0.0)
    learning_velocity = Column(Float, default=0.0)
    
    overall_score = Column(Float, default=0.0)
    has_enough_evidence = Column(Boolean, default=False)
    evidence_count = Column(Integer, default=0)
    is_verified = Column(Boolean, default=False)
    source = Column(String, default="evidence_based") # "self_reported" vs "evidence_based"
    level = Column(String, default="Intermediate") # "Beginner", "Intermediate", "Advanced"
    last_practiced = Column(DateTime, default=datetime.datetime.utcnow)
    trend = Column(String, default="stable")
    status = Column(String, default="Beginner")

    profile = relationship("LearnerProfile", back_populates="learner_skills")
    skill = relationship("Skill", back_populates="learner_skills")
    evidence_list = relationship("SkillEvidence", back_populates="learner_skill", cascade="all, delete-orphan")
    history_list = relationship("SkillHistory", back_populates="learner_skill", cascade="all, delete-orphan")


class CompletedCourse(Base):
    __tablename__ = "completed_courses"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("learner_profiles.id"), nullable=False)
    course_name = Column(String, nullable=False)
    provider = Column(String, nullable=False, default="Coursera")
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=True)
    skill_name = Column(String, nullable=False)
    completion_date = Column(String, default="July 2026")
    duration_hours = Column(Float, default=15.0)
    certificate_url = Column(String, nullable=True)
    certificate_image = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    profile = relationship("LearnerProfile", back_populates="completed_courses")


class InterestedResource(Base):
    __tablename__ = "interested_resources"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("learner_profiles.id"), nullable=False)
    resource_id = Column(Integer, ForeignKey("resources.id"), nullable=True)
    resource_name = Column(String, nullable=False)
    skill_name = Column(String, nullable=False)
    difficulty = Column(String, default="Intermediate")
    duration_minutes = Column(Integer, default=90)
    provider = Column(String, default="Udacity")
    saved_at = Column(DateTime, default=datetime.datetime.utcnow)
    notes = Column(Text, nullable=True)
    interaction_count = Column(Integer, default=1)

    profile = relationship("LearnerProfile", back_populates="interested_resources")


class SkillEvidence(Base):
    __tablename__ = "skill_evidence"

    id = Column(Integer, primary_key=True, index=True)
    learner_skill_id = Column(Integer, ForeignKey("learner_skills.id"), nullable=False)
    evidence_type = Column(String, nullable=False) # "course", "quiz", "assessment", "project", "evaluation", "session", "self_reported"
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    score = Column(Float, nullable=True)
    metadata_json = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    learner_skill = relationship("LearnerSkill", back_populates="evidence_list")


class SkillHistory(Base):
    __tablename__ = "skill_history"

    id = Column(Integer, primary_key=True, index=True)
    learner_skill_id = Column(Integer, ForeignKey("learner_skills.id"), nullable=False)
    old_score = Column(Float, nullable=False)
    new_score = Column(Float, nullable=False)
    reason = Column(String, nullable=False)
    event_type = Column(String, default="assessment")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    learner_skill = relationship("LearnerSkill", back_populates="history_list")


class Resource(Base):
    __tablename__ = "resources"

    id = Column(Integer, primary_key=True, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    title = Column(String, nullable=False)
    type = Column(String, nullable=False)
    difficulty = Column(String, default="Intermediate")
    duration_minutes = Column(Integer, default=60)
    prerequisites_json = Column(JSON, default=list)
    format = Column(String, default="Interactive")
    is_project_based = Column(Boolean, default=False)
    description = Column(Text, nullable=True)
    url = Column(String, default="#")
    tags_json = Column(JSON, default=list)

    skill = relationship("Skill", back_populates="resources")


class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("learner_profiles.id"), nullable=False)
    resource_id = Column(Integer, ForeignKey("resources.id"), nullable=True)
    skill_name = Column(String, nullable=True)
    feedback_type = Column(String, nullable=False)
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    profile = relationship("LearnerProfile", back_populates="feedbacks")


class Roadmap(Base):
    __tablename__ = "roadmaps"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("learner_profiles.id"), nullable=False)
    goal_title = Column(String, nullable=False)
    target_date = Column(String, nullable=False)
    total_duration_weeks = Column(Integer, default=24)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    profile = relationship("LearnerProfile", back_populates="roadmaps")
    phases = relationship("RoadmapPhase", back_populates="roadmap", cascade="all, delete-orphan")


class RoadmapPhase(Base):
    __tablename__ = "roadmap_phases"

    id = Column(Integer, primary_key=True, index=True)
    roadmap_id = Column(Integer, ForeignKey("roadmaps.id"), nullable=False)
    phase_number = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    estimated_weeks = Column(Integer, default=4)
    status = Column(String, default="upcoming")

    roadmap = relationship("Roadmap", back_populates="phases")
    items = relationship("RoadmapItem", back_populates="phase", cascade="all, delete-orphan")


class RoadmapItem(Base):
    __tablename__ = "roadmap_items"

    id = Column(Integer, primary_key=True, index=True)
    phase_id = Column(Integer, ForeignKey("roadmap_phases.id"), nullable=False)
    resource_id = Column(Integer, ForeignKey("resources.id"), nullable=True)
    title = Column(String, nullable=False)
    skill_name = Column(String, nullable=False)
    estimated_hours = Column(Float, default=5.0)
    item_type = Column(String, default="Resource")
    status = Column(String, default="pending")
    is_remediation = Column(Boolean, default=False)
    order_index = Column(Integer, default=0)

    phase = relationship("RoadmapPhase", back_populates="items")


class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    title = Column(String, nullable=False)
    difficulty = Column(String, default="Medium")
    description = Column(Text, nullable=True)

    skill = relationship("Skill", back_populates="assessments")
    questions = relationship("Question", back_populates="assessment", cascade="all, delete-orphan")


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    concept = Column(String, nullable=False)
    difficulty = Column(String, default="Medium")
    question_text = Column(Text, nullable=False)
    options_json = Column(JSON, nullable=False)
    correct_answer_index = Column(Integer, nullable=False)
    explanation = Column(Text, nullable=False)

    assessment = relationship("Assessment", back_populates="questions")


class AssessmentAttempt(Base):
    __tablename__ = "assessment_attempts"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("learner_profiles.id"), nullable=False)
    assessment_id = Column(Integer, ForeignKey("assessments.id"), nullable=False)
    score = Column(Float, nullable=False)
    passed = Column(Boolean, default=True)
    difficulty_level = Column(String, default="Medium")
    weak_concepts_json = Column(JSON, default=list)
    strong_concepts_json = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    profile = relationship("LearnerProfile", back_populates="assessment_attempts")
    assessment = relationship("Assessment")


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    title = Column(String, nullable=False)
    objective = Column(Text, nullable=False)
    difficulty = Column(String, default="Intermediate")
    estimated_hours = Column(Float, default=10.0)
    required_skills_json = Column(JSON, default=list)
    requirements_json = Column(JSON, default=list)
    evaluation_criteria_json = Column(JSON, default=list)

    skill = relationship("Skill", back_populates="projects")
    submissions = relationship("ProjectSubmission", back_populates="project")


class ProjectSubmission(Base):
    __tablename__ = "project_submissions"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("learner_profiles.id"), nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    github_url = Column(String, nullable=True)
    code_snippet = Column(Text, nullable=True)
    reflection = Column(Text, nullable=True)
    
    correctness_score = Column(Float, default=0.0)
    application_score = Column(Float, default=0.0)
    completeness_score = Column(Float, default=0.0)
    complexity_score = Column(Float, default=0.0)
    overall_score = Column(Float, default=0.0)
    feedback_text = Column(Text, nullable=True)
    evaluated_at = Column(DateTime, default=datetime.datetime.utcnow)

    profile = relationship("LearnerProfile", back_populates="project_submissions")
    project = relationship("Project", back_populates="submissions")


class AIInsight(Base):
    __tablename__ = "ai_insights"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("learner_profiles.id"), nullable=False)
    title = Column(String, nullable=False)
    category = Column(String, default="performance")
    content = Column(Text, nullable=False)
    impact = Column(String, default="positive")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    profile = relationship("LearnerProfile", back_populates="insights")


class AdaptationEvent(Base):
    __tablename__ = "adaptation_events"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("learner_profiles.id"), nullable=False)
    trigger_event = Column(String, nullable=False)
    summary = Column(String, nullable=False)
    before_state_json = Column(JSON, default=dict)
    after_state_json = Column(JSON, default=dict)
    reason = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    profile = relationship("LearnerProfile", back_populates="adaptation_events")


class LearningSession(Base):
    __tablename__ = "learning_sessions"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("learner_profiles.id"), nullable=False)
    resource_id = Column(Integer, ForeignKey("resources.id"), nullable=True)
    skill_name = Column(String, nullable=False)
    duration_minutes = Column(Integer, default=30)
    completed_at = Column(DateTime, default=datetime.datetime.utcnow)

    profile = relationship("LearnerProfile", back_populates="learning_sessions")


class LearningActivity(Base):
    __tablename__ = "learning_activities"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("learner_profiles.id"), nullable=False)
    activity_type = Column(String, nullable=False) # "course", "assessment", "project", "roadmap_item", "mentor_chat", "session"
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    activity_date = Column(DateTime, default=datetime.datetime.utcnow)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    profile = relationship("LearnerProfile", back_populates="activities")

