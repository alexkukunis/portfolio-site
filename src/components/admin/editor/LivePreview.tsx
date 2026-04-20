"use client";

import { RenderBlocks } from '@/components/case-study/Blocks';
import type { DraftBlock } from './useCaseStudyDraft';

export default function LivePreview({ blocks }: { blocks: DraftBlock[] }) {
  return (
    <div className="sticky top-[64px] h-[calc(100vh-80px)] overflow-y-auto rounded-2xl border border-border bg-background">
      <div className="px-4 py-2 border-b border-border flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-red-500/70" />
        <div className="w-2 h-2 rounded-full bg-yellow-500/70" />
        <div className="w-2 h-2 rounded-full bg-green-500/70" />
        <span className="ml-3 text-xs text-text-muted">Live preview</span>
      </div>
      <article className="px-8 py-8 max-w-3xl mx-auto">
        <RenderBlocks blocks={blocks.map((b) => ({ id: b.key, type: b.type, content: b.content }))} />
      </article>
    </div>
  );
}
