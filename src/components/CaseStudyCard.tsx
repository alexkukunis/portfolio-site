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
      <div className="flex h-[320px] md:h-[380px]">
        {/* Image left */}
        <div className="w-1/2 relative overflow-hidden rounded-l-xl flex-shrink-0 bg-muted/20">
          {study.coverImageUrl || study.imageUrl ? (
            <img
              src={study.coverImageUrl ?? study.imageUrl}
              alt={study.title}
              className="w-full h-full aspect-[3/4] object-cover object-top transition-transform duration-300"
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
        {/* Content right */}
        <div className="w-1/2 p-4 flex flex-col rounded-r-xl">
          <div className="flex items-center gap-1.5 mb-2 text-xs uppercase tracking-wide font-medium text-muted-foreground/90 group-hover:text-foreground/100 transition-colors">
            {study.company && study.company}
            {study.role && <span className="text-muted-foreground/70">· {study.role}</span>}
          </div>
          <h3 className="text-lg md:text-xl font-bold leading-snug mb-2 line-clamp-2 text-foreground group-hover:text-foreground/90 transition-colors">
            {study.title}
          </h3>
          <p className="text-sm leading-relaxed line-clamp-3 text-muted-foreground/75">
            {study.summary}
          </p>
        </div>
      </div>
    </Link>
  );
}