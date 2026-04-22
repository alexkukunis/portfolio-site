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

const templatePath = path.resolve(__dirname, 'templates/cozies-maternity-fashion-ux.json');
const raw = readFileSync(templatePath, 'utf8');
const template = JSON.parse(raw) as {
  meta?: { slug?: string; published?: boolean };
  blocks: { type: BlockType; content: any }[];
};

async function updateCozies() {
  const cozies = await prisma.caseStudy.findFirst({ where: { slug: 'cozies-maternity-fashion-ux' } });
  if (!cozies) {
    console.log('Cozies not found');
    process.exit(1);
  }

  await prisma.caseStudyBlock.deleteMany({ where: { caseStudyId: cozies.id } });

  const hero = template.blocks.find((b) => b.type === 'hero')?.content ?? {};
  const sanitized = template.blocks.map((b, i) => ({
    type: b.type,
    content: validateBlockContent(b.type, b.content),
    order: i,
  }));

  await prisma.caseStudy.update({
    where: { id: cozies.id },
    data: {
      title: hero.title ?? cozies.title,
      summary: hero.summary ?? cozies.summary,
      role: hero.role ?? cozies.role,
      company: hero.company ?? cozies.company,
      year: hero.year ?? cozies.year,
      duration: hero.duration ?? cozies.duration,
      coverImageUrl: hero.coverImageUrl ?? cozies.coverImageUrl,
      imageUrl: hero.coverImageUrl ?? cozies.imageUrl,
      blocks: { create: sanitized },
    }
  });

  console.log(`Updated Cozies case study "${cozies.title}" blocks and top-level fields.`);
}

updateCozies().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); await pool.end(); });
