export interface AuthUser {
  id: number;
  username?: string;
  name: string;
  email: string;
  is_demo?: boolean;
  created_at?: string;
}

export interface AuthTokenResponse {
  access_token: string;
  token_type: string;
  user: AuthUser;
  profile?: UserProfile;
}

export interface UserProfile {
  id: number;
  user_id?: number;
  username?: string;
  name: string;
  email: string;
  bio?: string;
  avatar_url?: string;
  location?: string;
  phone?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  current_role?: string;
  target_role?: string;
  career_goal: string;
  learning_objective: string;
  experience_level: string;
  daily_study_hours: number;
  target_deadline: string;
  preferred_format: string;
  preferred_difficulty: string;
  weekly_availability: string;
  confidence_level: number;
  readiness_score: number;
  total_skills_count: number;
  verified_skills_count: number;
  
  // Real Streak Information
  current_streak?: number;
  longest_streak?: number;
  total_learning_days?: number;
  is_today_complete?: boolean;
  last_active_date?: string;
  
  // Resume Metadata
  resume_url?: string;
  resume_filename?: string;
  resume_filetype?: string;
  resume_filesize?: string;
  resume_uploaded_at?: string;
  resume_analysis_status?: string;
  resume_insights?: any;
}

export interface LearnerSkillItem {
  id: number;
  skill_name: string;
  category: string;
  proficiency: number;
  level: string;
  source: string; // "self_reported" vs "evidence_based"
  is_verified: boolean;
  evidence_count: number;
}

export interface CompletedCourse {
  id: number;
  course_name: string;
  provider: string;
  skill_name: string;
  completion_date: string;
  duration_hours: number;
  certificate_url?: string;
  description?: string;
}

export interface InterestedResource {
  id: number;
  resource_id?: number;
  resource_name: string;
  skill_name: string;
  difficulty: string;
  duration_minutes: number;
  provider: string;
  saved_at: string;
  notes?: string;
}

export interface SkillEvidence {
  id: number;
  evidence_type: string;
  title: string;
  description?: string;
  score?: number;
  created_at: string;
}

export interface SkillHistory {
  id: number;
  old_score: number;
  new_score: number;
  reason: string;
  event_type: string;
  created_at: string;
}

export interface SkillDNA {
  id: number;
  skill_name: string;
  category: string;
  mastery: number;
  confidence: number;
  retention: number;
  practical_application: number;
  assessment_performance: number;
  learning_velocity: number;
  overall_score: number;
  has_enough_evidence: boolean;
  evidence_count: number;
  is_verified: boolean;
  source: string;
  level: string;
  status: string;
  trend: string;
  last_practiced: string;
  why_explanation: string;
  recommended_action: string;
  estimated_impact: string;
  evidence_list: SkillEvidence[];
  history_list: SkillHistory[];
}

export interface OverallSkillDNA {
  overall_dna_score: number;
  career_readiness_score: number;
  skills: SkillDNA[];
  strengths: string[];
  weaknesses: string[];
  bottlenecks: string[];
  at_risk_skills: string[];
}

export interface SkillGap {
  skill_name: string;
  category: string;
  current_level: number;
  target_level: number;
  gap_amount: number;
  gap_severity: string;
  prerequisites: string[];
  why_it_matters: string;
  priority_order: number;
}

export interface SkillGapAnalysis {
  target_role: string;
  readiness_score: number;
  critical_gaps_count: number;
  gaps: SkillGap[];
  top_priorities: string[];
}

export interface SkillNode {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  status: string;
  prerequisites: string[];
  is_unlocked: boolean;
}

export interface Recommendation {
  id: number;
  resource_id: number;
  title: string;
  type: string;
  skill_name: string;
  difficulty: string;
  estimated_duration_minutes: number;
  relevance_score: number;
  breakdown_scores: Record<string, number>;
  why_recommended: string;
  is_project_based: boolean;
  is_interested?: boolean;
}

export interface RoadmapItem {
  id: number;
  resource_id?: number;
  title: string;
  skill_name: string;
  estimated_hours: number;
  item_type: string;
  status: string;
  is_remediation: boolean;
}

export interface RoadmapPhase {
  id: number;
  phase_number: number;
  title: string;
  description: string;
  estimated_weeks: number;
  status: string;
  items: RoadmapItem[];
}

export interface Roadmap {
  id: number;
  goal_title: string;
  target_date: string;
  total_duration_weeks: number;
  overall_completion_pct: number;
  phases: RoadmapPhase[];
  recent_adaptation?: {
    trigger_event: string;
    summary: string;
    before_state: any;
    after_state: any;
    reason: string;
    created_at: string;
  };
}

export interface NextBestAction {
  primary_action: {
    title: string;
    skill_name: string;
    estimated_hours: number;
    estimated_impact: string;
    type: string;
    reason: string;
  };
  alternative_actions: Array<{
    title: string;
    skill_name: string;
    estimated_hours: number;
    type: string;
  }>;
  reason: string;
}

export interface Question {
  id: number;
  concept: string;
  difficulty: string;
  question_text: string;
  options: string[];
}

export interface AssessmentResponse {
  assessment_id: number;
  skill_name: string;
  title: string;
  questions: Question[];
}

export interface AssessmentResult {
  score: number;
  passed: boolean;
  difficulty_level: string;
  skill_name: string;
  old_skill_score: number;
  new_skill_score: number;
  weak_concepts: string[];
  strong_concepts: string[];
  next_recommendation: string;
  roadmap_updated: boolean;
  adaptation_summary?: string;
}

export interface ProjectSpec {
  id: number;
  skill_name: string;
  title: string;
  objective: string;
  difficulty: string;
  estimated_hours: number;
  required_skills: string[];
  requirements: string[];
  evaluation_criteria: string[];
}

export interface ProjectEvaluation {
  project_title: string;
  correctness_score: number;
  application_score: number;
  completeness_score: number;
  complexity_score: number;
  overall_score: number;
  feedback_text: string;
  practical_application_updated: number;
  evidence_added: string;
  new_skill_score: number;
}

export interface SimulationResult {
  current_path: {
    role: string;
    duration_weeks: number;
    daily_hours: number;
    readiness_score: number;
  };
  simulated_path: {
    role: string;
    duration_weeks: number;
    daily_hours: number;
    readiness_score: number;
  };
  differences: {
    duration_delta_weeks: number;
    summary: string;
  };
}

export interface AnalyticsData {
  skill_growth_over_time: Array<Record<string, any>>;
  weekly_learning_hours: Array<{ week: string; hours: number; target: number }>;
  assessment_performance_history: Array<{ date: string; score: number; skill: string }>;
  skill_distribution: Record<string, number>;
  learning_history_timeline: Array<{
    date: string;
    title: string;
    category: string;
    type: string;
    detail: string;
  }>;
  decaying_skills: Array<{
    skill_name: string;
    retention: number;
    last_practiced: string;
    recommendation: string;
  }>;
}
