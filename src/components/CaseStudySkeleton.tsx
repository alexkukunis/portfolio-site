import React from 'react';

interface CaseStudySkeletonProps {
  className?: string;
}

export default function CaseStudySkeleton({ className = '' }: CaseStudySkeletonProps) {
  return (
    <div
      className={`
        group relative rounded-2xl border border-border hover:border-foreground/30 hover:shadow-md transition-all duration-300 block
        ${className}
      `}
    >
      <div className="flex flex-col md:flex-row md:divide-x md:divide-border/50">
        {/* Image top/left */}
        <div className="w-full md:w-3/5 relative overflow-hidden flex-shrink-0 aspect-[4/3] md:h-full md:aspect-auto rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none shimmer bg-surface/30" />

        {/* Content bottom/right */}
        <div className="w-full md:w-2/5 p-4 md:p-5 flex flex-col flex-1 rounded-b-2xl md:rounded-r-2xl md:rounded-bl-none min-h-[140px]">
          <div className="flex flex-wrap gap-2 mb-3 md:mb-4">
            <div className="w-16 h-5 shimmer bg-surface/50 rounded-full" />
            <div className="w-20 h-5 shimmer bg-surface/50 rounded-full" />
          </div>
          <div className="space-y-2 mb-3 md:mb-4">
            <div className="h-6 shimmer bg-surface/60 rounded w-4/5" />
            <div className="h-5 shimmer bg-surface/50 rounded w-3/5" />
          </div>
          <div className="space-y-1 flex-1">
            <div className="h-4 shimmer bg-surface/40 rounded w-full" />
            <div className="h-4 shimmer bg-surface/40 rounded w-4/5" />
            <div className="h-4 shimmer bg-surface/30 rounded w-3/5" />
          </div>
        </div>
      </div>
    </div>
  );
}
