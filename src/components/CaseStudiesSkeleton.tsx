import CaseStudySkeleton from './CaseStudySkeleton';
import React from 'react';

export default function CaseStudiesSkeleton() {
  return (
    <section>
      {/* Header */}
      <div className="h-5 shimmer bg-surface/60 rounded w-32 mb-8" />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-12 items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="px-4 py-2.5 text-sm font-semibold uppercase tracking-wide rounded-full shimmer bg-surface/50 h-10 w-16 md:w-20"
          />
        ))}
      </div>

      {/* Cards */}
      <div className="space-y-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <CaseStudySkeleton key={i} className="w-full" />
        ))}
      </div>
    </section>
  );
}
