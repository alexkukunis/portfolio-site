import { readFileSync } from 'node:fs';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { validateBlockContent } from '../src/lib/blocks/schemas';
import type { BlockType } from '../src/lib/blocks/types';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const templatePath = path.join(process.cwd(), 'scripts/templates/checkout-redesign.json');
  const raw = readFileSync(templatePath, 'utf8');
  const template = JSON.parse(raw) as {
    meta: { slug: string; published: boolean };
    blocks: { type: BlockType; content: any }[];
  };

  const hero = template.blocks.find((b) => b.type === 'hero')?.content ?? {};
  const sanitized = template.blocks.map((b, i) => ({
    type: b.type,
    content: validateBlockContent(b.type, b.content) as any,
    order: i,
  }));

  const payload = {
    slug: template.meta.slug,
    title: hero.title ?? 'Untitled',
    summary: hero.summary ?? '',
    role: hero.role ?? '',
    company: hero.company ?? '',
    year: hero.year ?? '',
    duration: hero.duration ?? '',
    coverImageUrl: hero.coverImageUrl ?? null,
    imageUrl: hero.coverImageUrl ?? null,
    published: template.meta.published,
    publishedAt: template.meta.published ? new Date() : null,
  };

  const existing = await prisma.caseStudy.findUnique({ where: { slug: template.meta.slug } });
  if (existing) {
    await prisma.caseStudyBlock.deleteMany({ where: { caseStudyId: existing.id } });
    await prisma.caseStudy.update({
      where: { id: existing.id },
      data: {
        ...payload,
        blocks: { create: sanitized },
      },
    });
    console.log(`Re-seeded "${payload.title}"`);
  } else {
    await prisma.caseStudy.create({
      data: {
        ...payload,
        blocks: { create: sanitized },
      },
    });
    console.log(`Seeded "${payload.title}"`);
  }
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
