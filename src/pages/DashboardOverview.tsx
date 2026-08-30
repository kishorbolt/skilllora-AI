import React, { useState, useEffect, useCallback } from 'react';
import {
  Sparkles, ArrowRight, Compass, Info, GitMerge, FileCheck2,
  TrendingUp, Award, Calendar, Target, ShieldCheck, CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';
import { useLearner } from '../context/LearnerContext';
import { SkeletonDashboardGrid } from '../components/common/SkeletonLoader';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';

interface DashboardData {
  profile: {
    name: string;
    target_role: string;
    current_role: string;
    target_deadline: string;
    daily_hours: number;
    readiness_score: number;
    days_remaining: number;
    schedule_status: string;
  };
  skill_dna_summary: {
    overall_proficiency: number;
    strongest_skill: string;
    priority_gap: string;
    recent_improvement?: number;
    evidence_count?: number;
  };
  skill_gaps: {
    critical_gaps_count: number;
    gaps: Array<{
      skill_name: string;
      current_level: number;
      target_level: number;
      gap_amount: number;
      gap_severity: string;
      importance: string;
      why_it_matters: string;
      recommended_action: string;
    }>;
  };
  date_aware_roadmap: {
    overall_completion_pct: number;
    phases: Array<{
      phase_number: number;
      title: string;
      date_range: string;
      status: string;
      items: Array<{ title: string; skill_name: string; status: string; estimated_hours: number }>;
    }>;
  };
  next_best_action: {
    title: string;
    skill: string;
    duration_minutes: number;
    why: string;
  };
  recent_activity: Array<{
    id: string;
    type: string;
    title: string;
    skill: string;
    date: string;
    result: string;
    skill_impact: string;
  }>;
  ai_insights: string[];
  recommendations: Array<{
    id: number;
    title: string;
    skill_name: string;
    difficulty: string;
    duration_minutes: number;
    provider: string;
    match_score: number;
    why_recommended: string;
  }>;
}

export const DashboardOverview: React.FC<{ onNavigate?: (tab: string) => void }> = ({ onNavigate }) => {
  const { profile: contextProfile, dataRevision } = useLearner();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRec, setSelectedRec] = useState<any | null>(null);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getDashboardOverview();
      setData(res);
    } catch (e: any) {
      console.error('Failed to load dashboard:', e);
      setError(e?.message || 'Failed to load executive dashboard overview.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard, dataRevision]);

  if (loading) {
    return <SkeletonDashboardGrid />;
  }

  if (error || !data) {
    return (
      <div className="py-8">
        <ErrorState
          title="Dashboard Unavailable"
          message="Could not load your AI Adaptive Dashboard metrics. Ensure the backend server is running."
          onRetry={loadDashboard}
        />
      </div>
    );
  }

  const p = data.profile;
  const targetRole = contextProfile?.target_role || contextProfile?.career_goal || p?.target_role || 'AI Engineer';
  const targetDeadline = contextProfile?.target_deadline || p?.target_deadline || 'March 31, 2027';
  const readinessScore = contextProfile?.readiness_score || p?.readiness_score || 72;
  const daysRemaining = p?.days_remaining || 156;
  const scheduleStatus = p?.schedule_status || 'ON TRACK';

  return (
    <div className="space-y-8 pb-12">
      {/* 1. CAREER TARGET HEADER BANNER */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-brand-700 bg-brand-50 border border-brand-200/60 px-2.5 py-0.5 rounded uppercase tracking-wider flex items-center space-x-1">
                <Target className="w-3.5 h-3.5 text-brand-600" />
                <span>CAREER TARGET</span>
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Verified Digital Twin</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening'}, {contextProfile?.name || contextProfile?.username || p.name || 'Learner'} 👋
            </h2>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 pt-0.5">
              <span>Current: <strong className="text-slate-900">{contextProfile?.current_role || p.current_role || 'Learner'}</strong></span>
              <span className="text-slate-300">•</span>
              <span>Target Role: <strong className="text-brand-600 font-bold">{targetRole}</strong></span>
              <span className="text-slate-300">•</span>
              <span>Target Date: <strong className="text-slate-900">{targetDeadline}</strong></span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* Real Streak Badge */}
            <div className={`px-4 py-3 border rounded-xl text-xs flex-1 lg:flex-none min-w-[120px] ${
              contextProfile?.is_today_complete ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200/70'
            }`}>
              <span className={`font-bold block text-[10px] uppercase ${
                contextProfile?.is_today_complete ? 'text-emerald-800' : 'text-amber-800'
              }`}>
                Learning Streak
              </span>
              <div className="flex items-center space-x-1 mt-0.5">
                <span className={`font-black text-base ${
                  contextProfile?.is_today_complete ? 'text-emerald-700' : 'text-amber-700'
                }`}>
                  🔥 {contextProfile?.current_streak || 0} Days
                </span>
              </div>
              <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">
                {contextProfile?.is_today_complete ? '✓ Completed Today' : 'Pending Today'}
              </span>
            </div>

            <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex-1 lg:flex-none min-w-[110px]">
              <span className="text-slate-400 font-bold block text-[10px] uppercase">Days Remaining</span>
              <span className="font-black text-slate-900 text-base">{daysRemaining} Days</span>
            </div>

            <div className="px-4 py-3 bg-brand-50 border border-brand-200 rounded-xl text-xs flex-1 lg:flex-none min-w-[110px]">
              <span className="text-brand-700 font-bold block text-[10px] uppercase">Career Readiness</span>
              <span className="font-black text-brand-700 text-base">{readinessScore}%</span>
            </div>

            <div className="px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs flex-1 lg:flex-none min-w-[110px]">
              <span className="text-emerald-800 font-bold block text-[10px] uppercase">Schedule Status</span>
              <span className="font-black text-emerald-700 text-base">{scheduleStatus}</span>
            </div>

            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('roadmap')}
                className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer w-full sm:w-auto"
              >
                <span>View Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* TOP SUMMARY 4-METRIC GRID: Skill DNA, Skill Gaps, Assessment Summary, Career Readiness */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* 2. AI SKILL DNA CARD */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs card-hover flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-brand-700 uppercase tracking-wider bg-brand-50 border border-brand-200/80 px-2 py-0.5 rounded flex items-center space-x-1.5">
                <img src="/ai-dna-icon.jpg" alt="AI Skill DNA" className="w-3.5 h-3.5 rounded-sm object-cover" />
                <span>AI SKILL DNA</span>
              </span>
              <span className="text-xs font-bold text-slate-400">Readiness</span>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <span className="text-3xl font-black text-slate-900">
                {data.skill_dna_summary?.overall_proficiency || 61}%
              </span>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center space-x-0.5">
                <TrendingUp className="w-3 h-3" />
                <span>+{data.skill_dna_summary?.recent_improvement || 6}%</span>
              </span>
            </div>

            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-brand-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${data.skill_dna_summary?.overall_proficiency || 61}%` }}
              />
            </div>

            <div className="pt-2 text-xs space-y-1 border-t border-slate-100 text-slate-600 font-medium">
              <div className="flex justify-between">
                <span className="text-slate-400">Strongest:</span>
                <span className="font-bold text-slate-900">{data.skill_dna_summary?.strongest_skill || 'Python'} (90%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Priority Gap:</span>
                <span className="font-bold text-rose-600">{data.skill_dna_summary?.priority_gap || 'MLOps'} (20%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Evidence:</span>
                <span className="font-bold text-slate-800">{data.skill_dna_summary?.evidence_count || 12} activities</span>
              </div>
            </div>
          </div>

          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('skill-dna')}
              className="w-full py-2 bg-slate-50 hover:bg-brand-50 hover:text-brand-700 border border-slate-200 hover:border-brand-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-1 cursor-pointer"
            >
              <span>Explore Skill DNA</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 3. SKILL GAP SUMMARY CARD */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs card-hover flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded flex items-center space-x-1">
                <GitMerge className="w-3 h-3 text-amber-600" />
                <span>TOP SKILL GAPS</span>
              </span>
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                {data.skill_gaps?.critical_gaps_count || 3} Critical
              </span>
            </div>

            <div className="space-y-2 pt-1 text-xs">
              {data.skill_gaps?.gaps?.slice(0, 3).map((g) => (
                <div key={g.skill_name} className="p-2 bg-slate-50 border border-slate-200/70 rounded-lg space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-slate-900">{g.skill_name}</span>
                    <span className="text-[10px] font-bold text-rose-600 bg-rose-100/80 px-1.5 py-0.2 rounded">
                      -{Math.round(g.gap_amount || 45)} pts
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                    <span>Current: {Math.round(g.current_level || 20)}%</span>
                    <span>Target: {Math.round(g.target_level || 65)}%</span>
                  </div>
                  <div className="w-full bg-slate-200/70 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${g.current_level || 20}%` }} />
                  </div>
                </div>
              )) || (
                <div className="text-xs text-slate-400 italic">No critical skill gaps detected.</div>
              )}
            </div>
          </div>

          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('skill-gaps')}
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-1 cursor-pointer"
            >
              <span>View All Gaps</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 9. ASSESSMENT PERFORMANCE SUMMARY */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs card-hover flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-indigo-800 uppercase tracking-wider bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 rounded flex items-center space-x-1">
                <FileCheck2 className="w-3 h-3 text-indigo-600" />
                <span>ASSESSMENT SUMMARY</span>
              </span>
              <span className="text-xs font-bold text-slate-400">30-MCQ Tech</span>
            </div>

            <div className="pt-1">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-slate-900">80%</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  Proficient (24/30)
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block mt-0.5">Latest: Python Diagnostic Assessment</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Verified Technologies:</span>
                <strong className="text-slate-900">3 Active</strong>
              </div>
              <div className="flex justify-between">
                <span>Next Recommended:</span>
                <strong className="text-brand-600">Deep Learning (30 Qs)</strong>
              </div>
              <div className="flex justify-between">
                <span>Estimated Time:</span>
                <strong className="text-slate-700">25 minutes</strong>
              </div>
            </div>
          </div>

          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('assessments')}
              className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-1 cursor-pointer"
            >
              <span>Take Tech Assessment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 10. CAREER READINESS GAUGE */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs card-hover flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded flex items-center space-x-1">
                <Award className="w-3 h-3 text-emerald-600" />
                <span>ROLE READINESS</span>
              </span>
              <span className="text-xs font-bold text-emerald-700">Level 3 of 5</span>
            </div>

            <div className="pt-1">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-slate-900">{readinessScore}%</span>
                <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                  Target: 85%
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block mt-0.5">Role: {targetRole}</span>
            </div>

            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${readinessScore}%` }}
              />
            </div>

            <div className="pt-2 text-[11px] space-y-1 text-slate-600 border-t border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Skills Mapped:</span>
                <strong className="text-slate-900">{contextProfile?.total_skills_count || 12} Skills</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Practical Proof Verified:</span>
                <strong className="text-emerald-700">{contextProfile?.verified_skills_count || 4} Verified</strong>
              </div>
            </div>
          </div>

          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('career-simulator')}
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-1 cursor-pointer"
            >
              <span>Career What-If Simulator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2-COLUMN MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Personalized Learning Path & Recent Learning Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* 4. PERSONALIZED LEARNING PATH (DATE-AWARE ROADMAP TIMELINE) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Your Personalized Learning Path</h3>
                  <p className="text-[11px] text-slate-500">Date-aware milestone roadmap tuned to your {contextProfile?.daily_study_hours || p.daily_hours || 2}h/day study schedule.</p>
                </div>
              </div>
              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate('roadmap')}
                  className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center space-x-1 cursor-pointer"
                >
                  <span>Full Roadmap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {data.date_aware_roadmap?.phases && data.date_aware_roadmap.phases.length > 0 ? (
              <div className="space-y-3">
                {data.date_aware_roadmap.phases.map((phase) => (
                  <div key={phase.phase_number} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`w-5 h-5 rounded-full text-[10px] font-extrabold flex items-center justify-center ${
                          phase.status === 'completed' ? 'bg-emerald-600 text-white' : 'bg-brand-600 text-white'
                        }`}>
                          {phase.status === 'completed' ? '✓' : phase.phase_number}
                        </span>
                        <span className="font-extrabold text-slate-900 text-sm">
                          Phase {phase.phase_number}: {phase.title}
                        </span>
                      </div>
                      <span className="text-[10px] bg-slate-200 text-slate-800 font-bold px-2 py-0.5 rounded">
                        {phase.date_range}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {phase.items.slice(0, 4).map((item, i) => (
                        <span
                          key={i}
                          className="text-[11px] bg-white border border-slate-200 text-slate-700 font-semibold px-2.5 py-1 rounded-lg flex items-center space-x-1.5 shadow-2xs"
                        >
                          <CheckCircle2 className={`w-3.5 h-3.5 ${item.status === 'completed' ? 'text-emerald-600' : 'text-slate-300'}`} />
                          <span>{item.title}</span>
                          <span className="text-slate-400 font-normal">({item.estimated_hours}h)</span>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Calendar}
                title="No Learning Roadmap Available"
                description="Set your target career and daily study hours to generate your personalized learning path."
                actionText="Generate Roadmap"
                onAction={() => onNavigate && onNavigate('roadmap')}
              />
            )}
          </div>

          {/* 6. RECENT LEARNING ACTIVITY HISTORY */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Recent Learning Activity</h3>
                  <p className="text-[11px] text-slate-500">Live evidence logs recorded across assessments, projects, and courses.</p>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Digital Twin Audit</span>
            </div>

            {data.recent_activity && data.recent_activity.length > 0 ? (
              <div className="space-y-3">
                {data.recent_activity.map((act) => (
                  <div key={act.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs hover:border-brand-200 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center shadow-2xs shrink-0 ${
                        act.type === 'Assessment' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {act.type === 'Assessment' ? '30' : '✓'}
                      </div>
                      <div>
                        <span className="font-extrabold text-slate-900 text-sm block">{act.title}</span>
                        <span className="text-[11px] text-slate-500 block">{act.skill} • {act.date}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-extrabold text-slate-900 block">{act.result}</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded inline-block mt-0.5">
                        {act.skill_impact}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Award}
                title="No Learning Activity Yet"
                description="Your learning activity will appear here once you take an assessment or complete a project."
                actionText="Start Learning"
                onAction={() => onNavigate && onNavigate('assessments')}
              />
            )}
          </div>
        </div>

        {/* Right Column (1 col): Next Best Action, Dynamic AI Insights, Hybrid Recommendations */}
        <div className="space-y-6">
          {/* 5. NEXT BEST ACTION CARD */}
          <div className="bg-gradient-to-br from-brand-600 via-indigo-600 to-indigo-700 text-white rounded-2xl p-6 shadow-md space-y-4">
            <div className="flex items-center space-x-2 text-xs font-extrabold bg-white/15 w-fit px-2.5 py-1 rounded-md border border-white/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>YOUR NEXT BEST ACTION</span>
            </div>

            <div>
              <span className="text-xs text-white/80 font-bold uppercase tracking-wider block">
                Target: {data.next_best_action?.skill || 'Deep Learning'} • ~{data.next_best_action?.duration_minutes || 45} mins
              </span>
              <h3 className="text-lg font-black tracking-tight mt-1">
                {data.next_best_action?.title || 'Neural Network Fundamentals Diagnostic'}
              </h3>
              <p className="text-xs text-white/85 mt-2 leading-relaxed bg-white/10 p-3 rounded-xl border border-white/15">
                “{data.next_best_action?.why || 'This targets your highest-priority prerequisite gap before starting PyTorch development.'}”
              </p>
            </div>

            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('assessments')}
                className="w-full py-3 bg-white text-brand-700 hover:bg-slate-50 font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <span>Start Learning & Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* 7. DYNAMIC AI INSIGHTS CARD */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>Dynamic AI Insights</span>
            </h3>

            {data.ai_insights && data.ai_insights.length > 0 ? (
              <div className="space-y-2.5 text-xs">
                {data.ai_insights.map((ins, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 leading-relaxed font-medium">
                    {ins}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 italic">
                AI insights will appear as SKILLORA AI learns from your assessments, courses, and learning activity.
              </div>
            )}

            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('mentor')}
                className="w-full py-2 bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center space-x-1 cursor-pointer"
              >
                <span>Chat with AI Mentor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* 8. RECOMMENDATIONS CARD */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
                <Compass className="w-4 h-4 text-emerald-600" />
                <span>Recommended Learning</span>
              </h3>
              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate('recommendations')}
                  className="text-xs font-bold text-brand-600 hover:underline cursor-pointer"
                >
                  See All
                </button>
              )}
            </div>

            {data.recommendations && data.recommendations.length > 0 ? (
              <div className="space-y-3">
                {data.recommendations.slice(0, 3).map((rec) => (
                  <div key={rec.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs hover:border-brand-300 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900">{rec.title}</span>
                      <span className="text-[10px] font-bold text-brand-700 bg-brand-50 border border-brand-200 px-1.5 py-0.5 rounded">
                        {rec.match_score || 95}% Match
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-[11px] text-slate-500 font-medium">
                      <span>{rec.skill_name}</span>
                      <span>•</span>
                      <span>{rec.difficulty}</span>
                      <span>•</span>
                      <span>{rec.duration_minutes} mins</span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => setSelectedRec(rec)}
                        className="text-[11px] font-bold text-brand-600 hover:text-brand-700 flex items-center space-x-1 cursor-pointer"
                      >
                        <Info className="w-3.5 h-3.5" />
                        <span>Why Recommended?</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onNavigate && onNavigate('assessments')}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] rounded-lg cursor-pointer"
                      >
                        Start
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Compass}
                title="No Recommendations Available"
                description="Complete a skill assessment to receive tailored course and project recommendations."
                actionText="Take Assessment"
                onAction={() => onNavigate && onNavigate('assessments')}
                variant="compact"
              />
            )}
          </div>
        </div>
      </div>

      {/* WHY RECOMMENDED EXPLAINABILITY DRAWER MODAL */}
      {selectedRec && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center space-x-2 text-brand-700">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-lg font-extrabold text-slate-900">Why Was This Recommended?</h3>
            </div>
            <div className="p-4 bg-brand-50 border border-brand-200 rounded-xl space-y-2 text-xs text-brand-950">
              <span className="font-extrabold text-sm block">{selectedRec.title}</span>
              <p className="leading-relaxed font-medium">{selectedRec.why_recommended}</p>
            </div>
            <div className="text-right pt-2">
              <button
                type="button"
                onClick={() => setSelectedRec(null)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Close Explanation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
