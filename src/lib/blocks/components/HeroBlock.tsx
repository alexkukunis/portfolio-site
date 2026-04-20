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
    </section>
  );
}
