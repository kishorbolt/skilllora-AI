import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-200/80 rounded-lg ${className}`} />
);

export const SkeletonCard: React.FC<{ rows?: number; className?: string }> = ({ rows = 3, className = '' }) => (
  <div className={`p-6 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-4 ${className}`}>
    <div className="flex items-center justify-between">
      <Skeleton className="h-5 w-36" />
      <Skeleton className="h-4 w-16" />
    </div>
    <Skeleton className="h-3 w-full" />
    <div className="space-y-2 pt-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center justify-between space-x-3">
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-12" />
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonDashboardGrid: React.FC = () => (
  <div className="space-y-8 pb-12">
    {/* Top Banner Skeleton */}
    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-2xs space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-28 rounded-xl" />
          <Skeleton className="h-12 w-28 rounded-xl" />
          <Skeleton className="h-12 w-28 rounded-xl" />
        </div>
      </div>
    </div>

    {/* Metric Cards Skeleton */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
          <div className="flex justify-between items-center">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-4 rounded-full" />
          </div>
          <Skeleton className="h-7 w-28" />
          <Skeleton className="h-2 w-full rounded-full" />
        </div>
      ))}
    </div>

    {/* 2-Column Grid Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <SkeletonCard rows={4} />
        <SkeletonCard rows={3} />
      </div>
      <div className="space-y-6">
        <SkeletonCard rows={2} />
        <SkeletonCard rows={3} />
      </div>
    </div>
  </div>
);
