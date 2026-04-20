"use client";

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { blockRegistry } from '@/lib/blocks/registry';
import type { BlockType } from '@/lib/blocks/types';
import type { DraftBlock } from './useCaseStudyDraft';

interface Props {
  block: DraftBlock;
  onChange: (content: any) => void;
  onRemove: () => void;
}

export default function SortableBlockRow({ block, onChange, onRemove }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.key });
  const [open, setOpen] = useState(block.type === 'hero');
  const def = blockRegistry[block.type as BlockType];

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  if (!def) return null;
  const Editor = def.Editor as any;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-xl border ${isDragging ? 'border-accent' : 'border-border'} bg-surface`}
    >
      <div className="flex items-center gap-2 px-3 py-2.5">
        <button
          type="button"
          aria-label="Drag to reorder"
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-text-muted hover:text-foreground px-1.5 py-1"
        >
          ⋮⋮
        </button>
        <span className="w-6 h-6 flex items-center justify-center rounded-md border border-border bg-background text-accent text-xs">
          {def.icon}
        </span>
        <span className="flex-1 text-sm font-medium text-foreground">{def.label}</span>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="text-xs text-text-muted hover:text-foreground px-2 py-1"
        >
          {open ? 'Collapse' : 'Edit'}
        </button>
        {block.type !== 'hero' ? (
          <button
            type="button"
            onClick={onRemove}
            className="text-xs text-text-muted hover:text-red-400 px-2 py-1"
          >
            Remove
          </button>
        ) : null}
      </div>
      {open ? (
        <div className="px-4 pb-4 pt-2 border-t border-border">
          <Editor value={block.content} onChange={onChange} />
        </div>
      ) : null}
    </div>
  );
}
