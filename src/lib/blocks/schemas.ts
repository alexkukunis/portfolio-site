import { z } from 'zod';
import type { BlockType } from './types';

const str = z.string().default('');

export const heroSchema = z.object({
  title: str,
  summary: str,
  role: str,
  company: str,
  year: str,
  duration: str,
  coverImageUrl: str,
});

export const headingSchema = z.object({
  text: str,
  level: z.union([z.literal(2), z.literal(3)]).default(2),
});

export const textSchema = z.object({ body: str });

export const imageBlockSchema = z.object({
  url: str,
  caption: str,
  alt: str,
});

export const listSchema = z.object({
  items: z.array(str).default([]),
  ordered: z.boolean().default(false),
});

export const quoteSchema = z.object({
  text: str,
  attribution: str,
});

export const blockSchemas: Record<BlockType, z.ZodTypeAny> = {
  hero: heroSchema,
  heading: headingSchema,
  text: textSchema,
  image: imageBlockSchema,
  list: listSchema,
  quote: quoteSchema,
};

export function validateBlockContent(type: BlockType, content: unknown) {
  const schema = blockSchemas[type];
  if (!schema) throw new Error(`Unknown block type: ${type}`);
  return schema.parse(content ?? {});
}
