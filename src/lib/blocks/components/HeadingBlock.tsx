"use client";

import type { HeadingContent, EditorProps, RenderProps } from '../types';
import { Field, TextInput } from './shared';

export const headingMeta = {
  type: 'heading' as const,
  label: 'Heading',
  icon: 'H',
  category: 'content' as const,
};
export const headingDefault: HeadingContent = { text: 'Section heading', level: 2 };

export function HeadingEditor({ value, onChange }: EditorProps<'heading'>) {
  const set = (patch: Partial<HeadingContent>) => onChange({ ...value, ...patch });
  return (
    <div className="grid gap-3">
      <Field label="Text"><TextInput value={value.text} onChange={(v) => set({ text: v })} /></Field>
      <div className="flex gap-2">
        {[2, 3].map((lvl) => (
          <button
            key={lvl}
            type="button"
            onClick={() => set({ level: lvl as 2 | 3 })}
            className={`px-3 py-1.5 rounded-lg text-sm border ${value.level === lvl ? 'bg-accent text-white border-accent' : 'bg-surface border-border text-text-muted'}`}
          >H{lvl}</button>
        ))}
      </div>
    </div>
  );
}

export function HeadingRender({ content }: RenderProps<'heading'>) {
  const cls = content.level === 3 ? 'text-xl md:text-2xl font-semibold mt-8 mb-3' : 'text-2xl md:text-3xl font-semibold mt-12 mb-5';
  if (content.level === 3) return <h3 className={`${cls} text-foreground`}>{content.text}</h3>;
  return <h2 className={`${cls} text-foreground`}>{content.text}</h2>;
}
