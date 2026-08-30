import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  showTagline?: boolean;
  compact?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showWordmark = true,
  showTagline = false,
  compact = false,
  className = ''
}) => {
  const logoSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl'
  };

  const tagSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-xs'
  };

  const logoClass = logoSizes[size] || logoSizes.md;
  const textClass = textSizes[size] || textSizes.md;
  const tagClass = tagSizes[size] || tagSizes.md;

  if (compact) {
    return (
      <div className={`inline-flex items-center ${className}`} title="SKILLORA AI — Adaptive Intelligence for Personalized Learning">
        <img
          src="/skillora%20ai.png"
          alt="SKILLORA AI logo"
          className={`${logoClass} object-contain shrink-0`}
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center space-x-2.5 ${className}`}>
      <img
        src="/skillora%20ai.png"
        alt="SKILLORA AI logo"
        className={`${logoClass} object-contain shrink-0`}
      />

      {showWordmark && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center space-x-1.5 leading-none">
            <span className={`font-extrabold text-slate-900 tracking-tight ${textClass}`}>
              SKILLORA
            </span>
            <span className="text-[10px] font-extrabold bg-brand-100 text-brand-700 px-1.5 py-0.5 rounded">
              AI
            </span>
          </div>

          {showTagline && (
            <span className={`text-slate-400 font-medium tracking-tight block mt-0.5 ${tagClass}`}>
              Adaptive Intelligence for Personalized Learning
            </span>
          )}
        </div>
      )}
    </div>
  );
};
