import { readFileSync } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { validateBlockContent } from '../src/lib/blocks/schemas';
import type { BlockType } from '../src/lib/blocks/types';

const { values } = parseArgs({
  options: {
    title: { type: 'string' },
    slug: { type: 'string' },
    from: { type: 'string' },
    published: { type: 'boolean', default: false },
  },
});

if (!values.from) {
  console.error('Usage: tsx scripts/create-case-study.ts --from <path.json> [--title ...] [--slug ...] [--published]');
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80) || `cs-${Date.now()}`;
}

async function ensureUniqueSlug(base: string): Promise<string> {
  let slug = base;
  let i = 1;
  while (await prisma.caseStudy.findUnique({ where: { slug } })) {
    i += 1;
    slug = `${base}-${i}`;
  }
  return slug;
}

async function main() {
  const templatePath = path.resolve(values.from as string);
  const raw = readFileSync(templatePath, 'utf8');
  const template = JSON.parse(raw) as {
    meta?: { slug?: string; published?: boolean };
    blocks: { type: BlockType; content: any }[];
  };

  const hero = template.blocks.find((b) => b.type === 'hero')?.content ?? {};
  const title = (values.title as string | undefined) ?? hero.title ?? 'Untitled';
  const requestedSlug = (values.slug as string | undefined) ?? template.meta?.slug ?? slugify(title);
  const slug = await ensureUniqueSlug(slugify(requestedSlug));
  const published = (values.published as boolean | undefined) ?? template.meta?.published ?? false;

  const sanitized = template.blocks.map((b, i) => ({
    type: b.type,
    content: validateBlockContent(b.type, b.content) as any,
    order: i,
  }));

  const created = await prisma.caseStudy.create({
    data: {
      slug,
      title,
      summary: hero.summary ?? '',
      role: hero.role ?? '',
      company: hero.company ?? '',
      year: hero.year ?? '',
      duration: hero.duration ?? '',
      coverImageUrl: hero.coverImageUrl ?? null,
      imageUrl: hero.coverImageUrl ?? null,
      published,
      publishedAt: published ? new Date() : null,
      blocks: { create: sanitized },
    },
  });

  console.log(`Created case study "${created.title}" → /case-studies/${created.slug}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
