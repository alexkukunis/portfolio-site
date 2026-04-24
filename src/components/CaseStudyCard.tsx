import Link from 'next/link';
import { ImagePlaceholder } from '@/lib/blocks/components/shared';

interface CaseStudyCardProps {
  study: any;
  href: string;
  isLocked?: boolean;
  className?: string;
}

export default function CaseStudyCard({ study, href, isLocked = false, className = '' }: CaseStudyCardProps) {
  return (
    <Link
      href={href}
      className={`group relative rounded-2xl border border-border hover:border-foreground/30 hover:shadow-md transition-all duration-300 block ${className}`}
    >
      <div className="flex flex-col md:flex-row md:divide-x md:divide-border/50">
        {/* Image top/left */}
        <div className="w-full md:w-3/5 relative overflow-hidden flex-shrink-0 bg-muted/20 aspect-[4/3] md:h-full md:aspect-auto rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none">
          {study.coverImageUrl || study.imageUrl ? (
            <img
              src={study.coverImageUrl ?? study.imageUrl}
              alt={study.title}
              className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted/80">
              <svg className="w-12 h-12 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          )}
          {(study.category || isLocked) && (
            <div className="absolute top-3 left-3 z-10 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1">
              {study.category && study.category.toUpperCase()}
              {isLocked && (
                <>
                  {study.category && <span className="opacity-60 font-normal mx-0.5">·</span>}
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </>
              )}
            </div>
          )}
        </div>
        {/* Content bottom/right */}
        <div className="w-full md:w-2/5 p-4 md:p-5 flex flex-col flex-1 rounded-b-2xl md:rounded-r-2xl md:rounded-bl-none min-h-[140px]">
          <div className="flex flex-wrap gap-2 mb-3 md:mb-4">
            {study.company && (
              <span className="inline-flex px-2.5 py-1 bg-muted/50 border border-muted/50 text-xs font-semibold uppercase tracking-wider text-foreground/80 hover:bg-muted/70 hover:border-muted/70 hover:text-foreground hover:scale-[1.02] transition-all duration-200 rounded-full">
                {study.company}
              </span>
            )}
            {study.role && (
              <span className="inline-flex px-2.5 py-1 bg-muted/40 border border-muted/40 text-xs font-medium text-foreground/70 hover:bg-muted/60 hover:border-muted/60 hover:text-foreground/90 hover:scale-[1.02] transition-all duration-200 rounded-full">
                {study.role}
              </span>
            )}
          </div>
          <h3 className="text-base md:text-xl font-bold leading-snug mb-3 md:mb-4 line-clamp-2 text-foreground group-hover:text-foreground/90 transition-colors">
            {study.title}
          </h3>
          <p className="text-sm leading-relaxed line-clamp-3 text-muted-foreground/75 flex-1">
            {study.summary}
          </p>
        </div>
      </div>
    </Link>
  );
}