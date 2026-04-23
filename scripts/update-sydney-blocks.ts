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

const templatePath = path.resolve(__dirname, 'templates/sydney-health-updated.json');
const raw = readFileSync(templatePath, 'utf8');
const template = JSON.parse(raw) as {
  meta?: { slug?: string; published?: boolean };
  blocks: { type: BlockType; content: any }[];
};

async function updateSydney() {
  const sydney = await prisma.caseStudy.findFirst({ where: { slug: 'sydney-health-bcbs' } });
  if (!sydney) {
    console.log('Sydney Health not found');
    process.exit(1);
  }

  await prisma.caseStudyBlock.deleteMany({ where: { caseStudyId: sydney.id } });

  const hero = template.blocks.find((b) => b.type === 'hero')?.content ?? {};
  const sanitized = template.blocks.map((b, i) => ({
    type: b.type,
    content: validateBlockContent(b.type, b.content),
    order: i,
  }));

  await prisma.caseStudy.update({
    where: { id: sydney.id },
    data: {
      title: hero.title ?? sydney.title,
      summary: hero.summary ?? sydney.summary,
      role: hero.role ?? sydney.role,
      company: hero.company ?? sydney.company,
      year: hero.year ?? sydney.year,
      duration: hero.duration ?? sydney.duration,
      coverImageUrl: hero.coverImageUrl ?? sydney.coverImageUrl,
      imageUrl: hero.coverImageUrl ?? sydney.imageUrl,
      blocks: { create: sanitized },
    }
  });

  console.log(`Updated Sydney Health case study "${sydney.title}" blocks and top-level fields.`);
}

updateSydney().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); await pool.end(); });
