import React, { useState } from 'react';
import type { Recommendation } from '../types';
import { api } from '../services/api';
import { EmptyState } from '../components/common/EmptyState';
import { Compass, ThumbsUp, ThumbsDown, HelpCircle, CheckCircle2 } from 'lucide-react';

interface RecommendationsPageProps {
  recommendations: Recommendation[];
  onOpenWhyDrawer: (rec: Recommendation) => void;
  onRefresh: () => void;
}

export const RecommendationsPage: React.FC<RecommendationsPageProps> = ({
  recommendations,
  onOpenWhyDrawer,
  onRefresh
}) => {
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const handleFeedback = async (type: string, rec: Recommendation) => {
    try {
      await api.submitFeedback(type, rec.resource_id, rec.skill_name);
      setFeedbackMsg(`Recorded feedback '${type}' for "${rec.title}". AI updated recommendation rankings.`);
      setTimeout(() => setFeedbackMsg(null), 4000);
      onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. HEADER BANNER */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xs">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center text-white shadow-sm shrink-0">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">AI-Driven Recommendations</h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Multi-factor ranking engine optimized for your active skill gaps, target deadline, and learning format preferences.
            </p>
          </div>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-900 flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* 2. RECOMMENDATION CARDS GRID */}
      {recommendations && recommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map((rec) => (
            <div key={rec.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs card-hover flex flex-col justify-between space-y-5">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-extrabold text-brand-700 uppercase tracking-wider bg-brand-50 border border-brand-200/80 px-2 py-0.5 rounded">
                      {rec.skill_name} • {rec.type}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 mt-1.5">{rec.title}</h3>
                  </div>
                  <span className="text-xs font-black text-brand-700 bg-brand-50 border border-brand-200 px-2.5 py-1 rounded-lg shrink-0">
                    {rec.relevance_score}% Match
                  </span>
                </div>

                <div className="flex items-center space-x-3 text-xs text-slate-500 mt-2.5 font-medium">
                  <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">{rec.difficulty}</span>
                  <span>•</span>
                  <span>{rec.estimated_duration_minutes} mins</span>
                </div>

                <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Why Recommended:</span>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {rec.why_recommended}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => onOpenWhyDrawer(rec)}
                  className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center space-x-1 cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Explain Match</span>
                </button>

                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => handleFeedback('useful', rec)}
                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
                    title="Useful"
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFeedback('dislike', rec)}
                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Not Relevant"
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFeedback('too_easy', rec)}
                    className="px-2 py-1 text-[10px] font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
                  >
                    Too Easy
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFeedback('too_difficult', rec)}
                    className="px-2 py-1 text-[10px] font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
                  >
                    Too Hard
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Compass}
          title="No Recommendations Available"
          description="Complete a diagnostic assessment or save interested topics to generate tailored learning recommendations."
          actionText="Refresh Recommendations"
          onAction={onRefresh}
        />
      )}
    </div>
  );
};
