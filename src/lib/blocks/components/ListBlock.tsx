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

  return (
    <div className="my-8 max-w-3xl space-y-3">
      {items.map((item, i) => (
        <div
          key={i}
          className="group flex items-start gap-4 p-4 rounded-xl border border-border/50 hover:border-accent/50 hover:bg-accent/5 transition-all duration-200"
        >
          <div className="flex-shrink-0 w-8 h-8 mt-1 flex items-center justify-center rounded-full bg-accent/10 text-accent font-bold text-sm border border-accent/20 group-hover:bg-accent/20 transition-all">
            {content.ordered ? (
              <span>{i + 1}.</span>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            )}
          </div>
          <div className="flex-1 text-text-muted leading-relaxed group-hover:text-foreground transition-colors">
            {item}
          </div>
        </div>
      ))}
    </div>
  );
}
