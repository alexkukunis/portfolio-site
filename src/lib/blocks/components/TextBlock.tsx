"use client";

import type { TextContent, EditorProps, RenderProps } from '../types';
import { Field, TextArea } from './shared';

export const textMeta = {
  type: 'text' as const,
  label: 'Text',
  icon: '¶',
  category: 'content' as const,
};
export const textDefault: TextContent = { body: '' };

export function TextEditor({ value, onChange }: EditorProps<'text'>) {
  return (
    <Field label="Body">
      <TextArea value={value.body} onChange={(v) => onChange({ body: v })} rows={4} placeholder="Write your paragraph…" />
    </Field>
  );
}

export function TextRender({ content }: RenderProps<'text'>) {
  if (!content.body) return null;
  return (
    <p className="text-lg leading-relaxed text-text-muted max-w-3xl my-5 whitespace-pre-wrap">{content.body}</p>
  );
}
