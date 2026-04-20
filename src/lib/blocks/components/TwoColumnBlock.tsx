"use client";

import type { EditorProps, RenderProps } from '../types';
import { Field, TextArea, TextInput } from './shared';

export const twocolumnMeta = {
  type: 'twocolumn' as const,
  label: 'Two Column',
  icon: '◱',
  category: 'media' as const,
};

export interface TwoColumnContent {
  side: 'left' | 'right';
  text: string;
  label: string;
}

export const twocolumnDefault: TwoColumnContent = { side: 'left', text: '', label: '' };

const gradients = [
  ['var(--tw-gradient-from, #1a1a2e)', 'var(--tw-gradient-to, #16213e)'],
  ['var(--tw-gradient-from, #16213e)', 'var(--tw-gradient-to, #0f3460)'],
  ['var(--tw-gradient-from, #0f3460)', 'var(--tw-gradient-to, #1a1a2e)'],
  ['var(--tw-gradient-from, #121212)', 'var(--tw-gradient-to, #1e1e2e)'],
  ['var(--tw-gradient-from, #232336)', 'var(--tw-gradient-to, #1a1a2e)'],
  ['var(--tw-gradient-from, #1b1b3a)', 'var(--tw-gradient-to, #111628)'],
  ['var(--tw-gradient-from, #15192d)', 'var(--tw-gradient-to, #1e293b)'],
  ['var(--tw-gradient-from, #1e293b)', 'var(--tw-gradient-to, #1a1a2e)'],
  ['var(--tw-gradient-from, #27272a)', 'var(--tw-gradient-to, #18181b)'],
  ['var(--tw-gradient-from, #18181b)', 'var(--tw-gradient-to, #0c0a09)'],
];

function getGradient(index: number) {
  const [from, to] = gradients[index % gradients.length];
  return `linear-gradient(135deg, ${from}, ${to})`;
}

function ImagePlaceholder({ label, index }: { label: string; index: number }) {
  return (
    <div
      className="w-full aspect-[4/3] rounded-2xl border border-border/50 overflow-hidden relative flex items-center justify-center"
      style={{ background: getGradient(index) }}
    >
      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      {/* Centered icon + label */}
      <div className="relative z-10 flex flex-col items-center gap-3 text-text-muted/50 select-none">
        {/* Minimal landscape/screenshot icon */}
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        {label && <span className="text-xs tracking-wide uppercase text-text-muted/40">{label}</span>}
      </div>
      {/* Top-left tag */}
      <div className="absolute top-3 left-3 px-2 py-1 rounded-md border border-white/5 bg-white/5 text-[10px] uppercase tracking-widest text-text-muted/40 font-medium">
        Image
      </div>
    </div>
  );
}

export function TwoColumnEditor({ value, onChange }: EditorProps<'twocolumn'>) {
  const v = value as TwoColumnContent;
  const set = (patch: Partial<TwoColumnContent>) => onChange({ ...v, ...patch });
  return (
    <div className="grid gap-3">
      {/* Side toggle */}
      <Field label="Image side">
        <div className="flex gap-2">
          {(['left', 'right'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => set({ side: s })}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition border ${
                v.side === s
                  ? 'bg-accent/20 border-accent text-accent'
                  : 'bg-surface border-border text-text-muted hover:border-text-muted'
              }`}
            >
              {s === 'left' ? 'Image Left' : 'Image Right'}
            </button>
          ))}
        </div>
      </Field>
      <Field label="Label">
        <TextInput value={v.label} onChange={(l) => set({ label: l })} placeholder="Research" />
      </Field>
      <Field label="Text content">
        <TextArea value={v.text} onChange={(t) => set({ text: t })} rows={4} placeholder="Content for this section..." />
      </Field>
    </div>
  );
}

export function RenderTwoColumn({ content, index }: RenderProps<'twocolumn'> & { index?: number }) {
  const v = content as TwoColumnContent;
  const isLeft = v.side === 'left';

  return (
    <div className="my-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
      {/* Image side */}
      <div className={isLeft ? 'order-1' : 'order-1 md:order-2'}>
        <ImagePlaceholder label={v.label} index={index ?? 0} />
      </div>
      {/* Text side */}
      <div className={`space-y-4 ${isLeft ? 'order-2' : 'order-2 md:order-1'}`}>
        <div className="prose-sm text-text-muted leading-relaxed whitespace-pre-wrap">
          {v.text}
        </div>
      </div>
    </div>
  );
}
