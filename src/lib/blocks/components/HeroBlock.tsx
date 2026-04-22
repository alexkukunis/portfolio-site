"use client";

import type { HeroContent, EditorProps, RenderProps } from '../types';
import { Field, TextInput, TextArea, ImagePlaceholder } from './shared';
import ImageField from '@/components/admin/ImageField';

export const heroMeta = {
  type: 'hero' as const,
  label: 'Hero',
  icon: '✦',
  category: 'template' as const,
};

export const heroDefault: HeroContent = {
  title: 'Redesigning checkout to reduce drop-off',
  summary: 'Led end-to-end redesign that cut checkout abandonment by 34% in 8 weeks.',
  role: 'Lead Product Designer',
  company: 'Company',
  year: new Date().getFullYear().toString(),
  duration: '3 months',
  coverImageUrl: '',
  logoUrl: '',
  logoUrlDark: '',
  links: [],
};

export function HeroEditor({ value, onChange }: EditorProps<'hero'>) {
  const set = (patch: Partial<HeroContent>) => onChange({ ...value, ...patch });
  return (
    <div className="grid gap-4">
      {/* Logo uploads - dark/light aware */}
      <div className="grid grid-cols-2 gap-3">
        <ImageField value={value.logoUrl} onChange={(url) => set({ logoUrl: url })} label="Logo (light mode)" />
        <ImageField value={value.logoUrlDark} onChange={(url) => set({ logoUrlDark: url })} label="Logo (dark mode)" />
      </div>
      <ImageField value={value.coverImageUrl} onChange={(url) => set({ coverImageUrl: url })} label="Cover image (1600×900)" />
      <Field label="Title (H1)">
        <TextInput value={value.title} onChange={(v) => set({ title: v })} placeholder="Verb + what changed + why it mattered" />
      </Field>
      <Field label="One-line summary">
        <TextArea value={value.summary} onChange={(v) => set({ summary: v })} rows={2} placeholder="Max 15 words. Include what you did and the result." />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Role">
          <TextInput value={value.role} onChange={(v) => set({ role: v })} placeholder="e.g. Lead Product Designer" />
        </Field>
        <Field label="Company">
          <TextInput value={value.company} onChange={(v) => set({ company: v })} />
        </Field>
        <Field label="Year">
          <TextInput value={value.year} onChange={(v) => set({ year: v })} />
        </Field>
        <Field label="Duration">
          <TextInput value={value.duration} onChange={(v) => set({ duration: v })} placeholder="e.g. 3 months" />
        </Field>
      </div>
    </div>
  );
}

export function HeroRender({ content }: RenderProps<'hero'>) {
  const pills = [content.role, content.company, content.year, content.duration].filter(Boolean);
  const logo = content.logoUrl;
  const logoDark = content.logoUrlDark;

  return (
    <section className="pt-8 pb-16">
      {/* Logo bar - dark/light mode aware */}
      {logo || logoDark ? (
        <div className="mb-10 flex items-center justify-center min-h-[48px] lg:justify-start">
          {logo ? (
            <img
              src={logo}
              alt=""
              className="h-8 w-auto object-contain dark:hidden mx-auto lg:mx-0"
            />
          ) : null}
          {logoDark ? (
            <img
              src={logoDark}
              alt=""
              className="h-8 w-auto object-contain hidden dark:block mx-auto lg:mx-0"
            />
          ) : null}
          {!logoDark && logo ? (
            <img
              src={logo}
              alt=""
              className="h-8 w-auto object-contain hidden sm:block"
            />
          ) : null}
        </div>
      ) : (
        <div className="mb-4" />
      )}

      <div className="rounded-3xl overflow-hidden border border-border bg-surface mb-10">
        {content.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={content.coverImageUrl} alt={content.title} className="w-full h-[50vh] object-cover" />
        ) : (
          <div className="w-full h-[50vh] flex items-center justify-center">
            <ImagePlaceholder label="Cover image · 1600×900" />
          </div>
        )}
      </div>
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-5">
        {content.title || 'Untitled case study'}
      </h1>
      {content.summary ? (
        <p className="text-lg md:text-xl text-text-muted max-w-3xl leading-relaxed mb-6">{content.summary}</p>
      ) : null}
      {pills.length ? (
        <div className="flex flex-wrap gap-2">
          {pills.map((p, i) => (
            <span key={i} className="px-3 py-1 rounded-full border border-border bg-surface text-xs font-medium text-text-muted">
              {p}
            </span>
          ))}
        </div>
      ) : null}
      {content.links && content.links.length > 0 ? (
        <div className="flex flex-wrap gap-4 mt-6">
          {content.links.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border/50 bg-surface/50 hover:border-accent/50 hover:bg-accent/5 text-sm font-medium text-foreground hover:text-accent transition-all duration-200"
            >
              <LinkIcon icon={link.icon} className="w-4 h-4" />
              {link.label}
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function LinkIcon({ icon, className }: { icon?: string; className?: string }) {
  if (!icon) return null;

  const icons: Record<string, React.ReactNode> = {
    external_link: (
      <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
        <polyline points="15 3 21 3 21 9"/>
        <line x1="10" y1="14" x2="21" y2="3"/>
      </svg>
    ),
    globe: (
      <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
    app_store: (
      <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="M10 10l3 3 3-3"/>
      </svg>
    ),
    play_store: (
      <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polygon points="10,8 16,12 10,16"/>
      </svg>
    ),
  };

  return icons[icon] ?? icons.external_link;
}
