import React, { useState, useEffect, useCallback } from 'react';
import { GitMerge, ArrowRight, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { useLearner } from '../context/LearnerContext';
import { EmptyState } from '../components/common/EmptyState';
import { SkeletonCard } from '../components/common/SkeletonLoader';
import { ErrorState } from '../components/common/ErrorState';

interface GapItem {
  skill_name: string;
  category: string;
  current_level: number;
  target_level: number;
  gap_amount: number;
  gap_severity: string;
  importance: string;
  prerequisites: string[];
  why_it_matters: string;
  recommended_action: string;
  priority_order: number;
}

export const SkillGapPage: React.FC<{ onNavigate?: (tab: string) => void }> = ({ onNavigate }) => {
  const { profile, dataRevision } = useLearner();
  const [gaps, setGaps] = useState<GapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGaps = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getSkillGaps();
      const rawGaps = (res as any).gaps || (Array.isArray(res) ? res : []);
      setGaps(rawGaps);
    } catch (e: any) {
      console.error('Failed to load skill gaps:', e);
      setError(e?.message || 'Failed to load skill gap analysis.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGaps();
  }, [loadGaps, dataRevision]);

  if (loading) {
    return (
      <div className="space-y-6 pb-12">
        <SkeletonCard rows={2} />
        <div className="space-y-4">
          <SkeletonCard rows={3} />
          <SkeletonCard rows={3} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <ErrorState
          title="Unable to Calculate Skill Gaps"
          message={error}
          onRetry={loadGaps}
        />
      </div>
    );
  }

  const criticalCount = gaps.filter(g => g.gap_severity === 'Critical').length;
  const targetRole = profile?.target_role || profile?.career_goal || 'AI Engineer';

  return (
    <div className="space-y-8 pb-12">
      {/* 1. HEADER BANNER */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-extrabold text-brand-700 uppercase tracking-wider mb-1">
            <GitMerge className="w-4 h-4 text-brand-600" />
            <span>Target Career Skill Requirement Matrix</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Skill Gap Analyzer</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed font-medium">
            Quantifies required target proficiencies for <strong className="text-slate-900">{targetRole}</strong> against your evidence-backed Skill DNA level.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <span className="text-xs font-black bg-rose-50 text-rose-700 px-3.5 py-2 rounded-xl border border-rose-200 shadow-2xs">
            {criticalCount} Critical Gaps
          </span>
        </div>
      </div>

      {/* 2. GAP CARDS LIST */}
      {gaps.length > 0 ? (
        <div className="space-y-4">
          {gaps.map((gap, index) => (
            <div
              key={gap.skill_name}
              className={`p-6 bg-white border rounded-2xl shadow-2xs space-y-4 transition-all card-hover ${
                gap.gap_severity === 'Critical' ? 'border-rose-300 ring-1 ring-rose-100' : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-3">
                  <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center">
                    #{gap.priority_order || index + 1}
                  </span>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">{gap.skill_name}</h3>
                    <span className="text-[10px] text-slate-400 font-medium">{gap.category || 'Core Skill'} • Importance: {gap.importance || 'High'}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${
                    gap.gap_severity === 'Critical' ? 'bg-rose-100 text-rose-800' :
                    gap.gap_severity === 'High' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {gap.gap_severity || 'Medium'} Gap: {Math.round(gap.gap_amount || 0)} points
                  </span>
                </div>
              </div>

              {/* Progress Level Bars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between font-semibold text-slate-600">
                    <span>Current Evidence Level:</span>
                    <span className="font-extrabold text-slate-900">{Math.round(gap.current_level || 0)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-brand-600 h-full rounded-full" style={{ width: `${gap.current_level || 0}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-semibold text-slate-600">
                    <span>Target Matrix Level:</span>
                    <span className="font-extrabold text-emerald-700">{Math.round(gap.target_level || 75)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${gap.target_level || 75}%` }} />
                  </div>
                </div>
              </div>

              {/* Why This Is A Gap Explanation */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
                <span className="font-extrabold text-slate-900 block">Why This Is A Gap:</span>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {gap.why_it_matters || `Requires ${Math.round(gap.target_level || 75)}% verified evidence for ${targetRole} target role.`}
                </p>
              </div>

              {/* Action Trigger */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs">
                <span className="font-bold text-brand-700 bg-brand-50 border border-brand-200/80 px-3 py-1.5 rounded-lg w-fit">
                  Action: {gap.recommended_action || 'Complete 30-MCQ Diagnostic Assessment'}
                </span>

                {onNavigate && (
                  <button
                    type="button"
                    onClick={() => onNavigate('assessments')}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <span>Take Assessment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={CheckCircle2}
          title="No Skill Gaps Detected"
          description="Congratulations! All your verified skills currently meet or exceed the target requirement levels for your target role."
          actionText="Explore Skill Graph"
          onAction={() => onNavigate && onNavigate('roadmap')}
        />
      )}
    </div>
  );
};
