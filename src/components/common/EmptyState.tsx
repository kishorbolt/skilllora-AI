import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Sparkles } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
  badgeText?: string;
  variant?: 'card' | 'inline' | 'compact';
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Sparkles,
  title,
  description,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
  badgeText,
  variant = 'card',
  className = ''
}) => {
  if (variant === 'compact') {
    return (
      <div className={`p-4 bg-slate-50 border border-slate-200/80 rounded-xl text-center flex flex-col items-center justify-center space-y-2 ${className}`}>
        <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <span className="font-bold text-xs text-slate-800 block">{title}</span>
          <p className="text-[11px] text-slate-500 max-w-sm mt-0.5 leading-relaxed">{description}</p>
        </div>
        {actionText && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="mt-1 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-[11px] rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            {actionText}
          </button>
        )}
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${className}`}>
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-brand-600 shrink-0 shadow-2xs">
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-900">{title}</span>
              {badgeText && (
                <span className="text-[9px] font-extrabold uppercase bg-brand-100 text-brand-700 px-1.5 py-0.2 rounded">
                  {badgeText}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">{description}</p>
          </div>
        </div>

        {actionText && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg shrink-0 transition-colors cursor-pointer"
          >
            {actionText}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-slate-50/70 border border-dashed border-slate-300 rounded-2xl p-8 text-center flex flex-col items-center justify-center space-y-3.5 ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center text-brand-600">
        <Icon className="w-6 h-6" />
      </div>

      {badgeText && (
        <span className="text-[10px] font-extrabold tracking-wider uppercase bg-brand-50 text-brand-700 border border-brand-200 px-2.5 py-0.5 rounded-full">
          {badgeText}
        </span>
      )}

      <div className="max-w-md space-y-1">
        <h4 className="text-sm font-extrabold text-slate-900 tracking-tight">{title}</h4>
        <p className="text-xs text-slate-500 leading-relaxed font-medium">{description}</p>
      </div>

      {(actionText || secondaryActionText) && (
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
          {actionText && onAction && (
            <button
              type="button"
              onClick={onAction}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              {actionText}
            </button>
          )}

          {secondaryActionText && onSecondaryAction && (
            <button
              type="button"
              onClick={onSecondaryAction}
              className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer"
            >
              {secondaryActionText}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
