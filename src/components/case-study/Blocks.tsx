import { blockRegistry } from '@/lib/blocks/registry';
import type { BlockType } from '@/lib/blocks/types';
import { validateBlockContent } from '@/lib/blocks/schemas';
import BlockFrame from './BlockFrame';

export interface BlockData {
  id?: string;
  type: string;
  content: any;
}

function RenderOne({ type, content, index }: { type: string; content: any; index?: number }) {
  const def = blockRegistry[type as BlockType];
  if (!def) return null;
  let safe: any;
  try {
    safe = validateBlockContent(type as BlockType, content);
  } catch {
    safe = def.defaultContent;
  }
  const Render = def.Render as any;
  return <Render content={safe} index={index} />;
}

export function RenderBlock({ type, content, index }: { type: string; content: any; index?: number }) {
  return <RenderOne type={type} content={content} index={index} />;
}

export function RenderBlocks({ blocks }: { blocks: BlockData[] }) {
  return (
    <>
      {blocks.map((b, i) => (
        <BlockFrame key={b.id ?? i} id={b.type === 'hero' ? undefined : `${b.type}-${i}`}>
          <RenderOne type={b.type} content={b.content} index={i} />
        </BlockFrame>
      ))}
    </>
  );
}
