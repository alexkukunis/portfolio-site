const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function fixHeroRole() {
  const study = await prisma.caseStudy.findFirst({ where: { slug: 'foodwell-healthy-meal-delivery' } });
  if (!study) {
    console.log('Foodwell not found');
    process.exit(1);
  }
  const heroBlock = await prisma.caseStudyBlock.findFirst({
    where: {
      caseStudyId: study.id,
      type: 'hero'
    }
  });
  if (!heroBlock) {
    console.log('Hero block not found');
    process.exit(1);
  }
  await prisma.caseStudyBlock.update({
    where: { id: heroBlock.id },
    data: {
      content: {
        ...heroBlock.content,
        role: 'Product Designer'
      }
    }
  });
  // Also update CaseStudy role for consistency
  await prisma.caseStudy.update({
    where: { id: study.id },
    data: { role: 'Product Designer' }
  });
  console.log('Updated Foodwell hero role + CaseStudy role to "Product Designer".');
}

fixHeroRole().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); await pool.end(); });