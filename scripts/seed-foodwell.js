const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

// Skip validation for seed - JSON matches types
async function main() {
  const templatePath = path.join(process.cwd(), 'scripts/templates/foodwell.json');
  const raw = fs.readFileSync(templatePath, 'utf8');
  const template = JSON.parse(raw);

  const hero = template.blocks.find((b) => b.type === 'hero')?.content ?? {};
  const sanitized = template.blocks.map((b, i) => ({
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

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
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
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});