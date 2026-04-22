import type { JSX } from 'react';
import type { LinksContent } from '../types';
import type { RenderProps } from '../types';

function LinkIcon({ icon }: { icon?: string }) {
  if (!icon) return null;

  const icons: Record<string, JSX.Element> = {
    external_link: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
        <polyline points="15 3 21 3 21 9"/>
        <line x1="10" y1="14" x2="21" y2="3"/>
      </svg>
    ),
    globe: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
    app_store: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="M10 10l3 3 3-3"/>
      </svg>
    ),
    play_store: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polygon points="10,8 16,12 10,16"/>
      </svg>
    ),
  };

  return (
    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent/10 text-accent flex-shrink-0">
      {icons[icon] ?? icons.external_link}
    </div>
  );
}

export function RenderLinks({ content }: RenderProps<'links'>) {
  const v = content as LinksContent;

  return (
    <div className="my-16">
      {v.title && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">{v.title}</h2>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {v.links.map((link, i) => (
          <a
            key={i}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-5 rounded-xl border border-border/50 bg-surface/50 hover:border-accent/30 hover:bg-accent/5 transition-all duration-200 flex items-start gap-3"
          >
            <LinkIcon icon={link.icon} />
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:text-accent">{link.label}</h3>
              <p className="text-xs text-text-muted truncate">{link.url}</p>
            </div>
            <svg className="w-4 h-4 text-text-muted group-hover:text-accent ml-auto transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
}

export const linksDefault: LinksContent = {
  title: '',
  links: [],
};

export const linksMeta = {
  type: 'links' as const,
  label: 'Links',
  icon: '🔗',
  category: 'content' as const,
};