import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function updateResultsImage() {
  const sydney = await prisma.caseStudy.findFirst({ where: { slug: 'sydney-health-bcbs' } });
  if (!sydney) {
    console.log('Sydney Health not found');
    process.exit(1);
  }

  const blocks = await prisma.caseStudyBlock.findMany({
    where: { caseStudyId: sydney.id },
    orderBy: { order: 'asc' }
  });

  let resultsHeadingIndex = -1;
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].type === 'heading' && blocks[i].content.text === 'Results') {
      resultsHeadingIndex = i;
      break;
    }
  }

  if (resultsHeadingIndex === -1) {
    console.log('Results heading not found');
    process.exit(1);
  }

  const nextBlockIndex = resultsHeadingIndex + 1;
  if (nextBlockIndex >= blocks.length || blocks[nextBlockIndex].type !== 'image') {
    console.log('Results image block not found after heading');
    process.exit(1);
  }

  const resultsImage = blocks[nextBlockIndex];

  const updatedContent = {
    ...resultsImage.content,
    url: '/uploads/sydney-results.png'
  };

  await prisma.caseStudyBlock.update({
    where: { id: resultsImage.id },
    data: { content: updatedContent }
  });

  console.log(`Updated Results image block ${resultsImage.id} URL to /uploads/sydney-results.png`);
  console.log('New content:', JSON.stringify(updatedContent, null, 2));
}

updateResultsImage().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); await pool.end(); });
