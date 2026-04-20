import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  const DATABASE_URL = "postgresql://postgres:kfSwaTigJiBFZTHrUUFaTpCzmKBBMLZy@hopper.proxy.rlwy.net:33870/railway";
  const pool = new Pool({ connectionString: DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const templatePath = join(__dirname, 'templates/sydney-health-case-study.json');
  const raw = readFileSync(templatePath, 'utf8');
  const template = JSON.parse(raw);

  const hero = template.blocks.find((b) => b.type === 'hero')?.content ?? {};

  const blocks = template.blocks.map((b, i) => ({
    type: b.type,
    content: b.content,
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
        blocks: {
          create: blocks,
        },
      },
    });
    console.log(`Re-seeded "${payload.title}" with ${blocks.length} blocks`);
  } else {
    await prisma.caseStudy.create({
      data: {
        ...payload,
        blocks: {
          create: blocks,
        },
      },
    });
    console.log(`Seeded "${payload.title}" with ${blocks.length} blocks`);
  }

  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
