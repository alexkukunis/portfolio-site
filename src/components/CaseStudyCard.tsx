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
      className={`group relative rounded-2xl border border-border/50 hover:border-foreground/20 hover:shadow-lg transition-all duration-200 block ${className}`}
    >
      <div className="aspect-[16/10] relative overflow-hidden rounded-xl">
        {study.coverImageUrl || study.imageUrl ? (
          <img
            src={study.coverImageUrl ?? study.imageUrl}
            alt={study.title}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted/60">
            <svg className="w-16 h-16 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
        {(study.category || isLocked) && (
          <div className="absolute top-4 left-4 z-20 bg-black/50 backdrop-blur-2xl text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-2xl drop-shadow-2xl flex items-center gap-0.5">
            {study.category && study.category.toUpperCase()}
            {isLocked && (
              <>
                {study.category && <span className="opacity-70 font-normal mx-1">·</span>}
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </>
            )}
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3 text-xs opacity-90 group-hover:opacity-100 transition-opacity duration-200">
          {study.company && (
            <span className="uppercase font-semibold tracking-wider text-muted-foreground">
              {study.company}
            </span>
          )}
          {study.role && (
            <span className="font-medium text-muted-foreground/90">· {study.role}</span>
          )}
        </div>
        <h3 className="text-lg md:text-xl font-black leading-tight mb-2 line-clamp-2 group-hover:text-foreground transition-colors duration-200">
          {study.title}
        </h3>
        <p className="text-sm text-muted-foreground/80 leading-relaxed line-clamp-2">
          {study.summary}
        </p>
      </div>
    </Link>
  );
}