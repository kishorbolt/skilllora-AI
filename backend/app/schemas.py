from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field

# --- Auth & Session ---
class UserRegisterRequest(BaseModel):
    username: str
    email: str
    password: str
    confirm_password: Optional[str] = None
    name: Optional[str] = None

class UserLoginRequest(BaseModel):
    username_or_email: Optional[str] = None
    email: Optional[str] = None
    username: Optional[str] = None
    password: str

class AuthUserSchema(BaseModel):
    id: int
    username: Optional[str] = None
    name: str
    email: str
    is_demo: bool = False
    created_at: Optional[str] = None

class AuthTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: AuthUserSchema
    profile: Optional["UserProfileResponse"] = None

# --- User & Profile ---
class OnboardingParseRequest(BaseModel):
    natural_language_input: str

class OnboardingSubmitRequest(BaseModel):
    name: str
    email: str
    career_goal: str
    learning_objective: str
    experience_level: str = "Intermediate"
    existing_skills: List[str] = []
    completed_courses: List[str] = []
    interests: List[str] = []
    daily_study_hours: float = 2.0
    preferred_format: str = "Interactive & Project-based"
    target_deadline: str = "March 2027"
    confidence_level: int = 75
    raw_input: Optional[str] = None

class ProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    phone: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    current_role: Optional[str] = None
    target_role: Optional[str] = None
    career_goal: Optional[str] = None
    learning_objective: Optional[str] = None
    experience_level: Optional[str] = None
    target_deadline: Optional[str] = None
    daily_study_hours: Optional[float] = None
    preferred_format: Optional[str] = None
    preferred_difficulty: Optional[str] = None
    weekly_availability: Optional[str] = None

class UserProfileResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    username: Optional[str] = None
    name: str
    email: str
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    location: Optional[str] = None
    phone: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    current_role: Optional[str] = None
    target_role: Optional[str] = None
    career_goal: str
    learning_objective: str
    experience_level: str
    daily_study_hours: float
    target_deadline: str
    preferred_format: str
    preferred_difficulty: str
    weekly_availability: str
    confidence_level: int
    readiness_score: float
    total_skills_count: int
    verified_skills_count: int
    
    # Real Streak Information
    current_streak: int = 0
    longest_streak: int = 0
    total_learning_days: int = 0
    is_today_complete: bool = False
    last_active_date: Optional[str] = None
    
    # Resume Metadata
    resume_url: Optional[str] = None
    resume_filename: Optional[str] = None
    resume_filetype: Optional[str] = None
    resume_filesize: Optional[str] = None
    resume_uploaded_at: Optional[str] = None
    resume_analysis_status: Optional[str] = None
    resume_insights: Optional[Dict[str, Any]] = None

class StreakInfoResponse(BaseModel):
    current_streak: int
    longest_streak: int
    total_learning_days: int
    is_today_complete: bool
    last_active_date: Optional[str] = None

class LogActivityRequest(BaseModel):
    activity_type: str # "course", "assessment", "project", "roadmap_item", "mentor_chat", "session"
    title: str
    description: Optional[str] = None


# --- Resume Management ---
class ResumeUploadResponse(BaseModel):
    status: str
    resume_url: str
    resume_filename: str
    resume_filetype: str
    resume_filesize: str
    resume_uploaded_at: str

class ResumeInsightSkill(BaseModel):
    name: str
    level: Optional[str] = "Intermediate"

class ResumeInsights(BaseModel):
    detected_skills: List[ResumeInsightSkill] = []
    detected_roles: List[str] = []
    detected_projects: int = 0
    detected_certifications: int = 0

class ResumeAnalysisResponse(BaseModel):
    status: str
    insights: ResumeInsights

# --- Skills Management ---
class SkillManageRequest(BaseModel):
    skill_name: str
    category: Optional[str] = "General"
    proficiency: float = Field(..., ge=0.0, le=100.0)
    level: str = "Intermediate" # "Beginner", "Intermediate", "Advanced"
    is_self_reported: bool = True

class CompletedCourseSchema(BaseModel):
    id: Optional[int] = None
    course_name: str
    provider: str = "Coursera"
    skill_name: str
    completion_date: str = "July 2026"
    duration_hours: float = 15.0
    certificate_url: Optional[str] = None
    description: Optional[str] = None

class InterestedResourceSchema(BaseModel):
    id: Optional[int] = None
    resource_id: Optional[int] = None
    resource_name: str
    skill_name: str
    difficulty: str = "Intermediate"
    duration_minutes: int = 90
    provider: str = "Udacity"
    notes: Optional[str] = None

# --- Skill DNA ---
class SkillEvidenceSchema(BaseModel):
    id: int
    evidence_type: str
    title: str
    description: Optional[str] = None
    score: Optional[float] = None
    created_at: str

class SkillHistorySchema(BaseModel):
    id: int
    old_score: float
    new_score: float
    reason: str
    event_type: str
    created_at: str

class SkillDNASchema(BaseModel):
    id: int
    skill_name: str
    category: str
    mastery: float
    confidence: float
    retention: float
    practical_application: float
    assessment_performance: float
    learning_velocity: float
    overall_score: float
    has_enough_evidence: bool
    evidence_count: int
    is_verified: bool
    source: str # "self_reported" vs "evidence_based"
    level: str
    status: str
    trend: str
    last_practiced: str
    why_explanation: str
    recommended_action: str
    estimated_impact: str
    evidence_list: List[SkillEvidenceSchema] = []
    history_list: List[SkillHistorySchema] = []

class OverallSkillDNAResponse(BaseModel):
    overall_dna_score: float
    career_readiness_score: float
    skills: List[SkillDNASchema]
    strengths: List[str]
    weaknesses: List[str]
    bottlenecks: List[str]
    at_risk_skills: List[str]

# --- Skill Gap ---
class SkillGapSchema(BaseModel):
    skill_name: str
    category: str
    current_level: float
    target_level: float
    gap_amount: float
    gap_severity: str
    prerequisites: List[str]
    why_it_matters: str
    priority_order: int

class SkillGapAnalysisResponse(BaseModel):
    target_role: str
    readiness_score: float
    critical_gaps_count: int
    gaps: List[SkillGapSchema]
    top_priorities: List[str]

# --- Skill Graph ---
class SkillNodeSchema(BaseModel):
    id: str
    name: str
    category: str
    proficiency: float
    status: str
    prerequisites: List[str]
    is_unlocked: bool

class SkillGraphResponse(BaseModel):
    nodes: List[SkillNodeSchema]

# --- Recommendation ---
class RecommendationSchema(BaseModel):
    id: int
    resource_id: int
    title: str
    type: str
    skill_name: str
    difficulty: str
    estimated_duration_minutes: int
    relevance_score: float
    breakdown_scores: Dict[str, float]
    why_recommended: str
    is_project_based: bool
    is_interested: bool = False

class FeedbackRequest(BaseModel):
    resource_id: Optional[int] = None
    skill_name: Optional[str] = None
    feedback_type: str
    comment: Optional[str] = None

# --- Roadmap ---
class RoadmapItemSchema(BaseModel):
    id: int
    resource_id: Optional[int] = None
    title: str
    skill_name: str
    estimated_hours: float
    item_type: str
    status: str
    is_remediation: bool

class RoadmapPhaseSchema(BaseModel):
    id: int
    phase_number: int
    title: str
    description: str
    estimated_weeks: int
    status: str
    items: List[RoadmapItemSchema]

class RoadmapResponse(BaseModel):
    id: int
    goal_title: str
    target_date: str
    total_duration_weeks: int
    overall_completion_pct: float
    phases: List[RoadmapPhaseSchema]
    recent_adaptation: Optional[Dict[str, Any]] = None

# --- Next Best Action ---
class NextBestActionResponse(BaseModel):
    primary_action: Dict[str, Any]
    alternative_actions: List[Dict[str, Any]]
    reason: str

# --- Assessment ---
class QuestionSchema(BaseModel):
    id: int
    concept: str
    difficulty: str
    question_text: str
    options: List[str]

class StartAssessmentRequest(BaseModel):
    skill_name: Optional[str] = None
    technology: Optional[str] = None


class StartAssessmentResponse(BaseModel):
    assessment_id: int
    skill_name: str
    title: str
    questions: List[QuestionSchema]

class SubmitAnswerSchema(BaseModel):
    question_id: int
    selected_option_index: int

class SubmitAssessmentRequest(BaseModel):
    assessment_id: int
    answers: List[SubmitAnswerSchema]

class AssessmentResultResponse(BaseModel):
    score: float
    passed: bool
    difficulty_level: str
    skill_name: str
    old_skill_score: float
    new_skill_score: float
    weak_concepts: List[str]
    strong_concepts: List[str]
    next_recommendation: str
    roadmap_updated: bool
    adaptation_summary: Optional[str] = None

# --- Projects ---
class GenerateProjectRequest(BaseModel):
    skill_name: str

class ProjectSpecResponse(BaseModel):
    id: int
    skill_name: str
    title: str
    objective: str
    difficulty: str
    estimated_hours: float
    required_skills: List[str]
    requirements: List[str]
    evaluation_criteria: List[str]

class SubmitProjectRequest(BaseModel):
    project_id: int
    github_url: Optional[str] = None
    code_snippet: Optional[str] = None
    reflection: Optional[str] = None

class ProjectEvaluationResponse(BaseModel):
    project_title: str
    correctness_score: float
    application_score: float
    completeness_score: float
    complexity_score: float
    overall_score: float
    feedback_text: str
    practical_application_updated: float
    evidence_added: str
    new_skill_score: float

# --- AI Mentor ---
class MentorChatRequest(BaseModel):
    message: str
    conversation_history: List[Dict[str, Any]] = []

class MentorChatResponse(BaseModel):
    response: str
    suggested_prompts: List[str]

# --- Career Simulator ---
class SimulateCareerRequest(BaseModel):
    target_role: str
    daily_study_hours: float
    known_skills: List[str] = []
    target_deadline: str

class SimulationComparisonResponse(BaseModel):
    current_path: Dict[str, Any]
    simulated_path: Dict[str, Any]
    differences: Dict[str, Any]

# --- Analytics ---
class AnalyticsResponse(BaseModel):
    skill_growth_over_time: List[Dict[str, Any]]
    weekly_learning_hours: List[Dict[str, Any]]
    assessment_performance_history: List[Dict[str, Any]]
    skill_distribution: Dict[str, int]
    learning_history_timeline: List[Dict[str, Any]]
    decaying_skills: List[Dict[str, Any]]
