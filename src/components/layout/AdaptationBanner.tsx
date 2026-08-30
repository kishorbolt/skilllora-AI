import React from 'react';
import { Sparkles } from 'lucide-react';

interface AdaptationBannerProps {
  adaptation: {
    trigger_event: string;
    summary: string;
    before_state: any;
    after_state: any;
    reason: string;
    created_at: string;
  } | null;
  onDismiss?: () => void;
}

export const AdaptationBanner: React.FC<AdaptationBannerProps> = ({ adaptation, onDismiss }) => {
  if (!adaptation) return null;

  return (
    <div className="mb-6 bg-white border border-brand-200 rounded-xl p-5 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-brand-600"></div>

      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3.5">
          <div className="w-9 h-9 rounded-lg bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600 shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold tracking-wider text-brand-700 bg-brand-100/80 px-2 py-0.5 rounded uppercase">
                AI ADAPTATION EVENT
              </span>
              <span className="text-xs text-slate-400 font-medium">{adaptation.created_at}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              {adaptation.summary}
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-3xl">
              <strong className="text-slate-900 font-semibold">Reason: </strong>
              {adaptation.reason}
            </p>
          </div>
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-xs text-slate-400 hover:text-slate-600 font-semibold px-2 py-1"
          >
            Dismiss
          </button>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">STATE BEFORE ADAPTATION</span>
          <div className="flex items-center justify-between font-medium text-slate-700">
            <span>Skill: {adaptation.before_state?.skill_name || adaptation.before_state?.skill || 'Deep Learning'}</span>
            <span className="font-bold text-slate-900">{adaptation.before_state?.overall_score || adaptation.before_state?.score || 52}%</span>
          </div>
        </div>

        <div className="bg-brand-50/50 border border-brand-200/80 rounded-lg p-3">
          <span className="text-[10px] font-bold text-brand-700 uppercase tracking-wider block mb-1">STATE AFTER AI ADAPTATION</span>
          <div className="flex items-center justify-between font-medium text-brand-900">
            <span>Skill: {adaptation.after_state?.skill_name || adaptation.after_state?.skill || 'Deep Learning'}</span>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-brand-700">{adaptation.after_state?.overall_score || adaptation.after_state?.score || 48}%</span>
              {adaptation.after_state?.inserted && (
                <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">Remediation Inserted</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
