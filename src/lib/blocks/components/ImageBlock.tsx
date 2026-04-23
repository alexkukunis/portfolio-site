"use client";

import { useState } from 'react';
import type { ImageBlockContent, EditorProps, RenderProps } from '../types';
import { Field, TextInput, ImagePlaceholder } from './shared';
import { ImageModal } from './ImageModal';
import ImageField from '@/components/admin/ImageField';

export const imageMeta = {
  type: 'image' as const,
  label: 'Image',
  icon: '▣',
  category: 'media' as const,
};
export const imageDefault: ImageBlockContent = { url: '', caption: '', alt: '' };

export function ImageEditor({ value, onChange }: EditorProps<'image'>) {
  const set = (patch: Partial<ImageBlockContent>) => onChange({ ...value, ...patch });
  return (
    <div className="grid gap-3">
      <ImageField value={value.url} onChange={(url) => set({ url })} />
      <Field label="Alt text"><TextInput value={value.alt} onChange={(v) => set({ alt: v })} /></Field>
      <Field label="Caption"><TextInput value={value.caption} onChange={(v) => set({ caption: v })} /></Field>
    </div>
  );
}

export function ImageRender({ content }: RenderProps<'image'>) {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <figure className="my-8 space-y-3">
      {content.url ? (
        <div className="w-full rounded-2xl border border-border/50 overflow-hidden group relative cursor-pointer bg-surface" onClick={() => setModalOpen(true)}>
          <img
            src={content.url}
            alt={content.alt}
            className="w-full h-auto max-h-[80vh] object-cover group-hover:scale-[1.02] transition-transform duration-500"
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
          <ImageModal isOpen={modalOpen} onClose={() => setModalOpen(false)} imageUrl={content.url} alt={content.alt || ''} />
        </div>
      ) : (
        <ImagePlaceholder />
      )}
      {content.caption ? <figcaption className="text-sm text-text-muted italic">{content.caption}</figcaption> : null}
    </figure>
  );
}
