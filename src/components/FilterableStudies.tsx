"use client";

import { useState } from 'react';
import CaseStudyCard from './CaseStudyCard';
import type { CaseStudy, CaseStudyBlock } from '@prisma/client';

interface FilterableStudiesProps {
  studies: CaseStudy[];
  lockedSlugs: string[];
}


const categories = ['all', 'fintech', 'health', 'retail', 'social'] as const;
type Category = typeof categories[number];

export default function FilterableStudies({ studies, lockedSlugs }: FilterableStudiesProps) {
  const [filter, setFilter] = useState<'all' | 'fintech' | 'health' | 'retail' | 'social'>('all');

  const filteredStudies = studies.filter(study => {
    if (filter === 'all') return true;
    return study.category?.toLowerCase().trim() === filter;
  });

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-12 items-center">
        {categories.map((cat) => {
          const active = filter === cat;
          const label = cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1);
          return (
            <div
              key={cat}
              role="button"
              tabIndex={0}
              className={`
                px-4 py-2.5 text-sm font-semibold uppercase tracking-wide cursor-pointer transition-all duration-300 ease-out rounded-full select-none shadow-md
                ${active
                  ? 'bg-white text-black shadow-xl ring-2 ring-white/50 hover:shadow-2xl hover:scale-[1.02]'
                  : 'bg-surface/50 text-text-muted/80 border border-border/50 hover:bg-surface hover:text-foreground hover:shadow-lg hover:border-border'
                }
                focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50
              `.trim()}
              onClick={() => setFilter(cat)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setFilter(cat);
                }
              }}
            >
              {label}
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredStudies.map((study) => {
          const isLocked = lockedSlugs.includes(study.slug);
          return (
            <CaseStudyCard
              key={study.id}
              study={study}
              href={`/case-studies/${study.slug}`}
              isLocked={isLocked}
            />
          );
        })}
      </div>
    </div>
  );
}