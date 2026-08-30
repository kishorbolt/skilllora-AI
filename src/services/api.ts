import type {
  UserProfile, OverallSkillDNA, SkillGapAnalysis, SkillNode, Recommendation,
  Roadmap, NextBestAction, AssessmentResponse, AssessmentResult, ProjectSpec,
  ProjectEvaluation, SimulationResult, AnalyticsData, LearnerSkillItem, CompletedCourse, InterestedResource,
  AuthUser, AuthTokenResponse
} from '../types';

const rawBase = (
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'
).trim().replace(/\/+$/, '');

const API_BASE = rawBase.endsWith('/api')
  ? rawBase
  : `${rawBase}/api`;

export const BACKEND_URL = API_BASE.replace(/\/api\/?$/, '');

export function getMediaUrl(path: string | undefined | null): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:') || path.startsWith('data:')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${BACKEND_URL}${cleanPath}`;
}

const TOKEN_KEY = 'skillora_auth_token';
const USER_KEY = 'skillora_auth_user';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function getStoredUser(): AuthUser | null {
  const data = localStorage.getItem(USER_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function setStoredUser(user: AuthUser | null) {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

async function fetchJSON<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (err: any) {
    throw new Error('Unable to connect to SKILLORA AI. Please try again.');
  }

  if (!res.ok) {
    const errorText = await res.text();
    let message = errorText;
    try {
      const parsed = JSON.parse(errorText);
      if (parsed && parsed.detail) {
        if (typeof parsed.detail === 'string') {
          message = parsed.detail;
        } else if (Array.isArray(parsed.detail)) {
          message = parsed.detail.map((d: any) => d.msg || JSON.stringify(d)).join(', ');
        }
      }
    } catch {
      // Use raw errorText
    }
    throw new Error(message || `Request failed with status ${res.status}`);
  }

  return res.json();
}

export const api = {
  // --- Auth & Session ---
  register: async (data: { username: string; email: string; password: string; confirm_password?: string; name?: string }) => {
    const res = await fetchJSON<AuthTokenResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setStoredToken(res.access_token);
    setStoredUser(res.user);
    return res;
  },

  login: async (data: { username_or_email: string; password: string }) => {
    const res = await fetchJSON<AuthTokenResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setStoredToken(res.access_token);
    setStoredUser(res.user);
    return res;
  },

  loginDemo: async () => {
    const res = await fetchJSON<AuthTokenResponse>('/auth/demo-login', {
      method: 'POST',
    });
    setStoredToken(res.access_token);
    setStoredUser(res.user);
    return res;
  },

  getMe: () => fetchJSON<{ user: AuthUser; profile: UserProfile }>('/auth/me'),

  logout: async () => {
    try {
      await fetchJSON<{ status: string }>('/auth/logout', { method: 'POST' });
    } catch {
      // Ignore network errors on logout
    } finally {
      setStoredToken(null);
      setStoredUser(null);
    }
  },

  // --- Profile & Personalization ---
  getProfile: () => fetchJSON<UserProfile>('/profile'),
  getUserProfile: () => fetchJSON<UserProfile>('/profile'),

  updateProfile: (data: Partial<UserProfile>) =>
    fetchJSON<UserProfile>('/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  updateUserProfile: (data: Partial<UserProfile>) =>
    fetchJSON<UserProfile>('/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  uploadAvatar: async (file: File) => {
    const token = getStoredToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/profile/avatar`, {
      method: 'POST',
      headers,
      body: formData,
    });
    if (!res.ok) throw new Error('Avatar upload failed');
    return res.json() as Promise<{ status: string; avatar_url: string }>;
  },

  removeAvatar: () =>
    fetchJSON<{ status: string; avatar_url: null }>('/profile/avatar', {
      method: 'DELETE',
    }),

  uploadResume: async (file: File) => {
    const token = getStoredToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/profile/resume`, {
      method: 'POST',
      headers,
      body: formData,
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Resume upload failed: ${errorText}`);
    }
    return res.json() as Promise<{
      status: string;
      resume_url: string;
      resume_filename: string;
      resume_filetype: string;
      resume_filesize: string;
      resume_uploaded_at: string;
    }>;
  },

  removeResume: () =>
    fetchJSON<{ status: string; message: string }>('/profile/resume', {
      method: 'DELETE',
    }),

  analyzeResume: () =>
    fetchJSON<{
      status: string;
      insights: {
        detected_skills: Array<{ name: string; level: string }>;
        detected_roles: string[];
        detected_projects: number;
        detected_certifications: number;
      };
    }>('/profile/resume/analyze', {
      method: 'POST',
    }),

  // --- Dashboard Aggregated ---
  getDashboardOverview: () => fetchJSON<any>('/dashboard'),

  // --- Skills Management ---
  getUserSkills: () => fetchJSON<LearnerSkillItem[]>('/profile/skills'),

  addUserSkill: (data: { skill_name: string; category?: string; proficiency: number; level: string; is_self_reported: boolean }) =>
    fetchJSON<{ status: string; skill_id: number }>('/profile/skills', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  deleteUserSkill: (skillId: number) =>
    fetchJSON<{ status: string }>(`/profile/skills/${skillId}`, {
      method: 'DELETE',
    }),

  // --- Completed Courses ---
  getCompletedCourses: () => fetchJSON<CompletedCourse[]>('/profile/courses'),

  addCompletedCourse: (data: { course_name: string; provider: string; skill_name: string; completion_date: string; duration_hours: number; certificate_url?: string; description?: string }) =>
    fetchJSON<{ status: string }>('/profile/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  deleteCompletedCourse: (courseId: number) =>
    fetchJSON<{ status: string }>(`/profile/courses/${courseId}`, {
      method: 'DELETE',
    }),

  // --- Interested Courses ---
  getInterestedResources: () => fetchJSON<InterestedResource[]>('/profile/interests'),

  addInterestedResource: (data: { resource_id?: number; resource_name: string; skill_name: string; difficulty: string; duration_minutes: number; provider: string; notes?: string }) =>
    fetchJSON<{ status: string }>('/profile/interests', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  deleteInterestedResource: (interestId: number) =>
    fetchJSON<{ status: string }>(`/profile/interests/${interestId}`, {
      method: 'DELETE',
    }),

  // --- Onboarding ---
  parseGoal: (prompt: string) =>
    fetchJSON<{
      parsed_goal: string;
      learning_objective: string;
      experience_level: string;
      existing_skills: string[];
      identified_weaknesses: string[];
      daily_study_hours: number;
      target_deadline: string;
      confidence_level: number;
      summary_reason: string;
    }>('/onboarding/parse-goal', {
      method: 'POST',
      body: JSON.stringify({ natural_language_input: prompt }),
    }),

  submitOnboarding: (data: any) =>
    fetchJSON<UserProfile>('/onboarding/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // --- Skill DNA ---
  getSkillDNA: () => fetchJSON<OverallSkillDNA>('/profile/skill-dna'),

  getSkillGaps: () => fetchJSON<SkillGapAnalysis>('/skills/gaps'),

  getSkillGraph: () => fetchJSON<{ nodes: SkillNode[] }>('/skills/graph'),

  // --- Roadmap & Actions ---
  getRoadmap: () => fetchJSON<Roadmap>('/roadmap'),

  toggleRoadmapItem: (itemId: number) =>
    fetchJSON<{ status: string; item_id: number; new_state: string }>(`/roadmap/items/${itemId}/toggle`, {
      method: 'POST',
    }),

  getNextBestAction: () => fetchJSON<NextBestAction>('/roadmap/next-best-action'),

  // --- Recommendations & Feedback ---
  getRecommendations: () => fetchJSON<Recommendation[]>('/recommendations'),

  submitFeedback: (type: string, resourceId?: number, skillName?: string) =>
    fetchJSON<{ status: string }>('/recommendations/feedback', {
      method: 'POST',
      body: JSON.stringify({
        feedback_type: type,
        resource_id: resourceId,
        skill_name: skillName,
      }),
    }),

  // --- Assessments (30-MCQ & Tech) ---
  startTechAssessment: (skillName: string) =>
    fetchJSON<any>('/assessment/start-tech', {
      method: 'POST',
      body: JSON.stringify({ skill_name: skillName }),
    }),

  submitTechAssessment: (data: any) =>
    fetchJSON<any>('/assessment/submit-tech', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  startAssessment: (skillName: string) =>
    fetchJSON<AssessmentResponse>('/assessment/start', {
      method: 'POST',
      body: JSON.stringify({ skill_name: skillName }),
    }),

  submitAssessment: (assessmentId: number, answers: Array<{ question_id: number; selected_option_index: number }>) =>
    fetchJSON<AssessmentResult>('/assessment/submit', {
      method: 'POST',
      body: JSON.stringify({ assessment_id: assessmentId, answers }),
    }),

  // --- Projects ---
  generateProject: (skillName: string) =>
    fetchJSON<ProjectSpec>('/projects/generate', {
      method: 'POST',
      body: JSON.stringify({ skill_name: skillName }),
    }),

  evaluateProject: (projectId: number, code: string, reflection: string, githubUrl?: string) =>
    fetchJSON<ProjectEvaluation>('/projects/evaluate', {
      method: 'POST',
      body: JSON.stringify({
        project_id: projectId,
        code_snippet: code,
        reflection,
        github_url: githubUrl,
      }),
    }),

  // --- Career Simulator ---
  simulateCareer: (targetRole: string, dailyHours: number, knownSkills: string[], deadline: string) =>
    fetchJSON<SimulationResult>('/career/simulate', {
      method: 'POST',
      body: JSON.stringify({
        target_role: targetRole,
        daily_study_hours: dailyHours,
        known_skills: knownSkills,
        target_deadline: deadline,
      }),
    }),

  // --- AI Mentor ---
  chatWithMentor: (message: string, conversationHistory: any[] = []) =>
    fetchJSON<{ response: string; suggested_prompts: string[] }>('/mentor/chat', {
      method: 'POST',
      body: JSON.stringify({ message, conversation_history: conversationHistory }),
    }),

  // --- Analytics ---
  getAnalytics: () => fetchJSON<AnalyticsData>('/analytics'),
};
