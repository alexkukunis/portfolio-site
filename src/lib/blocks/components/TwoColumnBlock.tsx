"use client";

import { useState } from 'react';
import type { EditorProps, RenderProps } from '../types';
import { Field, TextArea, TextInput } from './shared';
import { ImageModal } from './ImageModal';

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
  imageUrl?: string;
  imageCaption?: string;
  imageAlt?: string;
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
  const isTall = label.includes('One-Handed') || label.includes('one-handed');
  const aspectClass = isTall ? 'aspect-[4/5] md:aspect-[3/4]' : 'aspect-[4/3]';
  return (
    <div
      className={`w-full ${aspectClass} rounded-2xl border border-border/50 overflow-hidden relative flex items-center justify-center`}
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
      {/* Centered icon */}
      <div className="relative z-10 flex flex-col items-center gap-3 text-text-muted/50 select-none">
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
      </div>
    </div>
  );
}

function RealImage({ imageUrl, imageAlt, label, onZoom }: { imageUrl: string; imageAlt?: string; label: string; onZoom: () => void }) {
  const isTall = label.includes('One-Handed') || imageUrl.includes('one-handed');
  const aspectClass = isTall ? 'aspect-[4/5] md:aspect-[3/4]' : 'aspect-video';
  return (
    <div className={`w-full ${aspectClass} rounded-2xl border border-border/50 overflow-hidden group relative cursor-pointer`} onClick={onZoom}>
      <img
        src={imageUrl}
        alt={imageAlt || label}
        className="w-full h-full object-cover object-top group-hover:scale-[1.01] transition-transform duration-500"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
        <svg className="w-12 h-12 text-white/80 group-hover:text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <polyline points="15 3 21 3 21 9"></polyline>
          <polyline points="9 21 3 21 3 15"></polyline>
          <line x1="21" y1="3" x2="14" y2="10"></line>
          <line x1="3" y1="21" x2="10" y2="14"></line>
        </svg>
      </div>
    </div>
  );
}

export function TwoColumnEditor({ value, onChange }: EditorProps<'twocolumn'>) {
  const v = value as TwoColumnContent;
  const set = (patch: Partial<TwoColumnContent>) => onChange({ ...v, ...patch });
  return (
    <div className="grid gap-3">
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
  const [modalOpen, setModalOpen] = useState(false);
  const isLeft = v.side === 'left';

  return (
    <div className="my-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
      <div className={isLeft ? 'order-1' : 'order-1 md:order-2'}>
        {v.imageUrl ? (
          <RealImage
            imageUrl={v.imageUrl}
            imageAlt={v.imageAlt}
            label={v.label}
            onZoom={() => setModalOpen(true)}
          />
        ) : (
          <ImagePlaceholder label={v.label} index={index ?? 0} />
        )}
        <ImageModal isOpen={modalOpen} onClose={() => setModalOpen(false)} imageUrl={v.imageUrl || ''} alt={v.imageAlt || v.label} />
      </div>
      <div className={`space-y-4 ${isLeft ? 'order-2' : 'order-2 md:order-1'}`}>
        {v.label && (
          <h3 className="text-2xl md:text-3xl font-semibold mt-0 mb-5 text-foreground leading-tight">
            {v.label}
          </h3>
        )}
        <div className="prose-sm text-text-muted leading-relaxed whitespace-pre-wrap">
          {v.text}
        </div>
      </div>
    </div>
  );
}
