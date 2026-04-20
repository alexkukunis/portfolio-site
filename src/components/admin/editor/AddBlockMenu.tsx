"use client";

import { useEffect, useRef, useState } from 'react';
import { blocksByCategory } from '@/lib/blocks/registry';
import type { BlockType } from '@/lib/blocks/types';

const CATEGORY_LABELS: Record<string, string> = {
  template: 'Template',
  content: 'Content',
  media: 'Media',
};

export default function AddBlockMenu({ onAdd }: { onAdd: (t: BlockType) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const grouped = blocksByCategory();

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full rounded-xl border border-dashed border-border bg-surface/50 px-4 py-3 text-sm text-text-muted hover:text-foreground hover:border-accent/50 transition"
      >
        + Add block
      </button>
      {open ? (
        <div className="absolute z-20 mt-2 w-full rounded-xl border border-border bg-surface shadow-xl overflow-hidden">
          {Object.entries(grouped).map(([cat, items]) =>
            items.length ? (
              <div key={cat} className="border-b border-border last:border-0">
                <div className="px-3 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                  {CATEGORY_LABELS[cat] ?? cat}
                </div>
                <ul>
                  {items.map((def) => (
                    <li key={def.type}>
                      <button
                        type="button"
                        onClick={() => {
                          onAdd(def.type);
                          setOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-background transition text-left"
                      >
                        <span className="w-6 h-6 flex items-center justify-center rounded-md border border-border bg-background text-accent text-xs">
                          {def.icon}
                        </span>
                        {def.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null,
          )}
        </div>
      ) : null}
    </div>
  );
}
