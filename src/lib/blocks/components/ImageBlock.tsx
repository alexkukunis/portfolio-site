"use client";

import type { ImageBlockContent, EditorProps, RenderProps } from '../types';
import { Field, TextInput, ImagePlaceholder } from './shared';
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
  return (
    <figure className="my-8 space-y-3">
      {content.url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={content.url} alt={content.alt} className="w-full rounded-2xl border border-border object-cover" />
      ) : (
        <ImagePlaceholder />
      )}
      {content.caption ? <figcaption className="text-sm text-text-muted">{content.caption}</figcaption> : null}
    </figure>
  );
}
