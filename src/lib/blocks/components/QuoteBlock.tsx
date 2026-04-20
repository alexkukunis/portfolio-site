"use client";

import type { QuoteContent, EditorProps, RenderProps } from '../types';
import { Field, TextInput, TextArea } from './shared';

export const quoteMeta = {
  type: 'quote' as const,
  label: 'Quote',
  icon: '❝',
  category: 'social-proof' as const,
};
export const quoteDefault: QuoteContent = { text: '', attribution: '' };

export function QuoteEditor({ value, onChange }: EditorProps<'quote'>) {
  const set = (patch: Partial<QuoteContent>) => onChange({ ...value, ...patch });
  return (
    <div className="grid gap-3">
      <Field label="Quote"><TextArea value={value.text} onChange={(v) => set({ text: v })} rows={3} /></Field>
      <Field label="Attribution"><TextInput value={value.attribution} onChange={(v) => set({ attribution: v })} placeholder="Head of Growth" /></Field>
    </div>
  );
}

export function QuoteRender({ content }: RenderProps<'quote'>) {
  if (!content.text) return null;
  return (
    <blockquote className="my-10 border-l-2 border-accent pl-6 py-2 italic text-xl text-foreground max-w-3xl">
      “{content.text}”
      {content.attribution ? <footer className="mt-2 text-sm not-italic text-text-muted">— {content.attribution}</footer> : null}
    </blockquote>
  );
}
