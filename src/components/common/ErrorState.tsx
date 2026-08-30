import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to Load Data',
  message = 'We encountered an error connecting to the SKILLORA AI service. Please ensure the backend is running and try again.',
  onRetry,
  className = ''
}) => {
  return (
    <div className={`p-8 bg-rose-50/60 border border-rose-200 rounded-2xl text-center flex flex-col items-center justify-center space-y-3.5 shadow-2xs ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-white border border-rose-200 text-rose-600 flex items-center justify-center shadow-2xs">
        <AlertTriangle className="w-6 h-6" />
      </div>

      <div className="max-w-md space-y-1">
        <h4 className="text-sm font-extrabold text-slate-900">{title}</h4>
        <p className="text-xs text-slate-600 leading-relaxed font-medium">{message}</p>
      </div>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};
