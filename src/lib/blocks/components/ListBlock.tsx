"use client";

import type { ListContent, EditorProps, RenderProps } from '../types';
import { StringArrayEditor } from './shared';

export const listMeta = {
  type: 'list' as const,
  label: 'List',
  icon: '≡',
  category: 'content' as const,
};
export const listDefault: ListContent = { items: [''], ordered: false };

export function ListEditor({ value, onChange }: EditorProps<'list'>) {
  const set = (patch: Partial<ListContent>) => onChange({ ...value, ...patch });
  return (
    <div className="grid gap-3">
      <div className="flex gap-2">
        <button type="button" onClick={() => set({ ordered: false })}
          className={`px-3 py-1.5 rounded-lg text-sm border ${!value.ordered ? 'bg-accent text-white border-accent' : 'bg-surface border-border text-text-muted'}`}>
          Bulleted
        </button>
        <button type="button" onClick={() => set({ ordered: true })}
          className={`px-3 py-1.5 rounded-lg text-sm border ${value.ordered ? 'bg-accent text-white border-accent' : 'bg-surface border-border text-text-muted'}`}>
          Numbered
        </button>
      </div>
      <StringArrayEditor label="Items" items={value.items} onChange={(items) => set({ items })} />
    </div>
  );
}

export function ListRender({ content }: RenderProps<'list'>) {
  const items = Array.isArray(content.items) ? content.items : [];
  if (!items.length) return null;
  const cls = 'space-y-2 my-5 max-w-3xl text-text-muted leading-relaxed';
  return content.ordered ? (
    <ol className={`${cls} list-decimal pl-6`}>
      {items.map((it, i) => <li key={i}>{it}</li>)}
    </ol>
  ) : (
    <ul className={`${cls} list-disc pl-6`}>
      {items.map((it, i) => <li key={i}>{it}</li>)}
    </ul>
  );
}
