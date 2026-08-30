import React from 'react';
import type { Roadmap } from '../types';
import { AdaptationBanner } from '../components/layout/AdaptationBanner';
import { EmptyState } from '../components/common/EmptyState';
import { SkeletonCard } from '../components/common/SkeletonLoader';
import { CheckCircle2, Sparkles, Calendar } from 'lucide-react';

interface RoadmapPageProps {
  roadmap: Roadmap | null;
  onToggleItem: (itemId: number) => void;
  onNavigate: (tab: string) => void;
}

export const RoadmapPage: React.FC<RoadmapPageProps> = ({ roadmap, onToggleItem, onNavigate }) => {
  if (!roadmap) {
    return (
      <div className="space-y-6 pb-12">
        <SkeletonCard rows={3} />
        <SkeletonCard rows={4} />
        <SkeletonCard rows={4} />
      </div>
    );
  }

  const phases = roadmap.phases || [];

  return (
    <div className="space-y-8 pb-12">
      {/* AI Adaptation Banner if Present */}
      {roadmap.recent_adaptation && (
        <AdaptationBanner adaptation={roadmap.recent_adaptation} />
      )}

      {/* 1. HEADER BANNER */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-brand-600 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CONTINUOUSLY ADAPTING PATH</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Structured Learning Roadmap: {roadmap.goal_title || 'AI Engineer'}
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Target Completion: <strong className="text-slate-900">{roadmap.target_date || 'March 31, 2027'}</strong> • Total Duration: {roadmap.total_duration_weeks || 24} Weeks
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-slate-50 border border-slate-200 px-5 py-3.5 rounded-2xl shrink-0">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">OVERALL COMPLETION</span>
            <span className="text-2xl font-black text-slate-900">{Math.round(roadmap.overall_completion_pct || 40)}%</span>
          </div>
          <div className="w-28 bg-slate-200 h-2.5 rounded-full overflow-hidden">
            <div className="h-full bg-brand-600 rounded-full transition-all duration-500" style={{ width: `${roadmap.overall_completion_pct || 40}%` }} />
          </div>
        </div>
      </div>

      {/* 2. ROADMAP PHASES */}
      {phases.length > 0 ? (
        <div className="space-y-6">
          {phases.map((phase) => (
            <div key={phase.id || phase.phase_number} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded uppercase tracking-wider ${
                      phase.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                      phase.status === 'in_progress' ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {phase.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Est. {phase.estimated_weeks} Weeks</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">
                    Phase {phase.phase_number}: {phase.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{phase.description}</p>
                </div>
              </div>

              <div className="space-y-3">
                {phase.items?.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all card-hover ${
                      item.status === 'completed'
                        ? 'bg-slate-50/60 border-slate-200 text-slate-500'
                        : item.is_remediation
                        ? 'bg-amber-50/50 border-amber-200 text-slate-900'
                        : 'bg-white border-slate-200 hover:border-brand-300 text-slate-900'
                    }`}
                  >
                    <div className="flex items-center space-x-3.5">
                      <button
                        type="button"
                        onClick={() => onToggleItem(item.id)}
                        className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
                          item.status === 'completed'
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 hover:border-brand-500 bg-white'
                        }`}
                        title="Mark complete"
                      >
                        {item.status === 'completed' && <CheckCircle2 className="w-4 h-4" />}
                      </button>

                      <div>
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          <span className={`font-bold text-sm ${item.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                            {item.title}
                          </span>
                          {item.is_remediation && (
                            <span className="text-[9px] bg-amber-100 text-amber-800 font-extrabold px-1.5 py-0.2 rounded uppercase">
                              AI Remediation
                            </span>
                          )}
                          {item.status === 'skipped' && (
                            <span className="text-[9px] bg-slate-200 text-slate-700 font-extrabold px-1.5 py-0.2 rounded uppercase">
                              Fast-Tracked
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium block mt-0.5">
                          Target Skill: <strong className="text-slate-700">{item.skill_name}</strong> • {item.estimated_hours}h estimated effort
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 sm:ml-auto">
                      <button
                        type="button"
                        onClick={() => onNavigate('assessments')}
                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Practice & Assess
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Calendar}
          title="No Learning Roadmap Phases"
          description="Your customized learning roadmap is being synthesized based on your target career goal."
          actionText="Build My Learning Path"
          onAction={() => onNavigate('overview')}
        />
      )}
    </div>
  );
};
