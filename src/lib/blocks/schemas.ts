import { z } from 'zod';
import type { BlockType } from './types';

const str = z.string().default('');

const linksItemSchema = z.object({
  label: str,
  url: z.string(),
  icon: str.optional(),
});

export const heroSchema = z.object({
  title: str,
  summary: str,
  role: str,
  company: str,
  year: str,
  duration: str,
  coverImageUrl: str,
  logoUrl: str,
  logoUrlDark: str,
  links: z.array(linksItemSchema).default([]).optional(),
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

export const twocolumnSchema = z.object({
  side: z.union([z.literal('left'), z.literal('right')]).default('left'),
  text: str,
  label: str,
  imageUrl: str.optional(),
  imageCaption: str.optional(),
  imageAlt: str.optional(),
});

export const carouselSchema = z.object({
  slides: z.array(
    z.object({
      url: str,
      alt: str,
    }),
  ).default([]),
});

export const appStoreScreenshotsSchema = z.object({
  title: str,
  subtitle: str,
  screenshots: z.array(
    z.object({
      url: str,
      alt: str,
    }),
  ).default([]),
  featureImage: z.object({
    url: str,
    caption: str,
    alt: str,
  }).default({ url: '', caption: '', alt: '' }),
});

export const imageGridSchema = z.object({
  title: str.optional(),
  images: z
    .array(
      z.object({
        url: str,
        alt: str,
        caption: str,
      }),
    )
    .min(1)
    .max(6)
    .default([]),
});

export const featureGridSchema = z.object({
  title: str,
  subtitle: str,
  features: z.array(
    z.object({
      icon: str,
      title: str,
      description: str,
    }),
  ).default([]),
});

export const linksSchema = z.object({
  title: str.optional(),
  links: z.array(linksItemSchema).min(1),
});

export const blockSchemas: Record<BlockType, z.ZodTypeAny> = {
  hero: heroSchema,
  heading: headingSchema,
  text: textSchema,
  image: imageBlockSchema,
  list: listSchema,
  quote: quoteSchema,
  twocolumn: twocolumnSchema,
  carousel: carouselSchema,
  'appstore-screenshots': appStoreScreenshotsSchema,
  'feature-grid': featureGridSchema,
  'image-grid': imageGridSchema,
  links: linksSchema,
};

export function validateBlockContent(type: BlockType, content: unknown) {
  const schema = blockSchemas[type];
  if (!schema) throw new Error(`Unknown block type: ${type}`);
  return schema.parse(content ?? {});
}
