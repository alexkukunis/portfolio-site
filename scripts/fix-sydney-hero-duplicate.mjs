import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function fixHeroDuplicate() {
  const sydney = await prisma.caseStudy.findFirst({ where: { slug: 'sydney-health-bcbs' } });
  if (!sydney) {
    console.log('Sydney Health not found');
    process.exit(1);
  }

  // Update hero summary to concise
  const heroBlock = await prisma.caseStudyBlock.findFirst({
    where: {
      caseStudyId: sydney.id,
      type: 'hero'
    }
  });

  if (heroBlock) {
    const conciseSummary = `Sydney Health app for Blue Cross Blue Shield members. Designed end-to-end in-app live chat (iOS/Android) replacing 12min phone holds. Results: 50K+ interactions in first 6 months, 35% churn reduction, significant cost savings without added headcount.`;
    const updatedHero = {
      ...heroBlock.content,
      summary: conciseSummary
    };
    await prisma.caseStudyBlock.update({
      where: { id: heroBlock.id },
      data: { content: updatedHero }
    });
    console.log(`Updated hero summary to concise version`);
  }

  // Find Overview heading -> text, empty the text body
  const blocks = await prisma.caseStudyBlock.findMany({
    where: { caseStudyId: sydney.id },
    orderBy: { order: 'asc' }
  });

  let overviewHeadingIndex = -1;
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].type === 'heading' && blocks[i].content.text === 'Overview') {
      overviewHeadingIndex = i;
      break;
    }
  }

  if (overviewHeadingIndex !== -1) {
    const overviewTextIndex = overviewHeadingIndex + 1;
    if (overviewTextIndex < blocks.length && blocks[overviewTextIndex].type === 'text') {
      const overviewText = blocks[overviewTextIndex];
      const updatedOverview = {
        ...overviewText.content,
        body: ''
      };
      await prisma.caseStudyBlock.update({
        where: { id: overviewText.id },
        data: { content: updatedOverview }
      });
      console.log(`Emptied Overview text block to fix duplicate`);
    }
  }

  console.log('Hero duplicate fixed.');
}

fixHeroDuplicate().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); await pool.end(); });
