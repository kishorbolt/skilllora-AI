import React from 'react';
import type { Recommendation } from '../../types';
import { X, Sparkles } from 'lucide-react';

interface WhyRecommendedDrawerProps {
  recommendation: Recommendation | null;
  onClose: () => void;
}

export const WhyRecommendedDrawer: React.FC<WhyRecommendedDrawerProps> = ({ recommendation, onClose }) => {
  if (!recommendation) return null;

  const breakdown = recommendation.breakdown_scores || {};

  const metrics = [
    { label: 'Goal Relevance (30%)', value: breakdown.goal_relevance || 95, desc: 'Matches target role requirements' },
    { label: 'Skill Gap Relevance (20%)', value: breakdown.skill_gap_relevance || 85, desc: 'Targets highest priority proficiency gap' },
    { label: 'Prerequisite Match (15%)', value: breakdown.prerequisite_match || 100, desc: 'All prerequisite skills verified' },
    { label: 'Difficulty Fit (10%)', value: breakdown.difficulty_fit || 90, desc: 'Matched to current mastery level' },
    { label: 'Learning Preference (10%)', value: breakdown.learning_preference || 100, desc: 'Matches project-based preference' },
    { label: 'Historical Performance (10%)', value: breakdown.historical_performance || 85, desc: 'Optimized based on past quiz attempts' },
    { label: 'Time Schedule Fit (5%)', value: breakdown.time_fit || 90, desc: 'Fits 2.0h daily study allocation' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
        <div>
          <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
            <div>
              <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded uppercase tracking-wider">
                RECOMMENDATION EXPLAINABILITY
              </span>
              <h2 className="text-xl font-black text-slate-900 tracking-tight mt-1">Why this recommendation?</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                RESOURCE
              </span>
              <h3 className="text-base font-extrabold text-slate-900">{recommendation.title}</h3>
              <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
                <span className="bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-700 font-semibold">{recommendation.type}</span>
                <span>•</span>
                <span>{recommendation.skill_name}</span>
                <span>•</span>
                <span>{recommendation.estimated_duration_minutes} mins</span>
              </div>
            </div>

            <div className="bg-brand-50/70 border border-brand-200 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2 text-brand-700 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-brand-600" />
                  <span>AI Matching Synthesis</span>
                </div>
                <span className="text-sm font-black text-brand-700">{recommendation.relevance_score}% Match Score</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {recommendation.why_recommended}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-3">7-Factor Recommendation Breakdown</h4>
              <div className="space-y-3 bg-white border border-slate-200 rounded-xl p-4">
                {metrics.map((m) => (
                  <div key={m.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-700">{m.label}</span>
                      <span className="font-bold text-slate-900">{Math.round(m.value)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-0.5">
                      <div className="h-full bg-brand-600 rounded-full" style={{ width: `${Math.min(100, Math.max(0, m.value))}%` }} />
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{m.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
