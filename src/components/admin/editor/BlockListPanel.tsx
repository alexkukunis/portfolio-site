"use client";

import { DndContext, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableBlockRow from './SortableBlockRow';
import AddBlockMenu from './AddBlockMenu';
import type { DraftBlock } from './useCaseStudyDraft';
import type { BlockType } from '@/lib/blocks/types';

interface Props {
  blocks: DraftBlock[];
  onReorder: (keys: string[]) => void;
  onContentChange: (key: string, content: any) => void;
  onRemove: (key: string) => void;
  onAdd: (type: BlockType) => void;
}

export default function BlockListPanel({ blocks, onReorder, onContentChange, onRemove, onAdd }: Props) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = blocks.findIndex((b) => b.key === active.id);
    const newIdx = blocks.findIndex((b) => b.key === over.id);
    if (oldIdx < 0 || newIdx < 0) return;
    const reordered = arrayMove(blocks, oldIdx, newIdx);
    onReorder(reordered.map((b) => b.key));
  }

  return (
    <div className="space-y-3">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={blocks.map((b) => b.key)} strategy={verticalListSortingStrategy}>
          {blocks.map((b) => (
            <SortableBlockRow
              key={b.key}
              block={b}
              onChange={(content) => onContentChange(b.key, content)}
              onRemove={() => onRemove(b.key)}
            />
          ))}
        </SortableContext>
      </DndContext>
      <AddBlockMenu onAdd={onAdd} />
    </div>
  );
}
