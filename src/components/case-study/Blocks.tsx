import { blockRegistry } from '@/lib/blocks/registry';
import type { BlockType } from '@/lib/blocks/types';
import { validateBlockContent } from '@/lib/blocks/schemas';
import BlockFrame from './BlockFrame';

export interface BlockData {
  id?: string;
  type: string;
  content: any;
}

function RenderOne({ type, content }: { type: string; content: any }) {
  const def = blockRegistry[type as BlockType];
  if (!def) return null;
  let safe: any;
  try {
    safe = validateBlockContent(type as BlockType, content);
  } catch {
    safe = def.defaultContent;
  }
  const Render = def.Render as any;
  return <Render content={safe} />;
}

export function RenderBlock({ type, content }: { type: string; content: any }) {
  return <RenderOne type={type} content={content} />;
}

export function RenderBlocks({ blocks }: { blocks: BlockData[] }) {
  return (
    <>
      {blocks.map((b, i) => (
        <BlockFrame key={b.id ?? i} id={b.type === 'hero' ? undefined : `${b.type}-${i}`}>
          <RenderOne type={b.type} content={b.content} />
        </BlockFrame>
      ))}
    </>
  );
}
