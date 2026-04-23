import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function updateResearchText() {
  const sydney = await prisma.caseStudy.findFirst({ where: { slug: 'sydney-health-bcbs' } });
  if (!sydney) {
    console.log('Sydney Health not found');
    process.exit(1);
  }

  const blocks = await prisma.caseStudyBlock.findMany({
    where: { caseStudyId: sydney.id },
    orderBy: { order: 'asc' }
  });

  let researchHeadingIndex = -1;
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].type === 'heading' && blocks[i].content.text === 'Research') {
      researchHeadingIndex = i;
      break;
    }
  }

  if (researchHeadingIndex === -1) {
    console.log('Research heading not found');
    process.exit(1);
  }

  const textIndex = researchHeadingIndex + 2; // heading -> image -> text
  if (textIndex >= blocks.length || blocks[textIndex].type !== 'text') {
    console.log('Research text block not found after image');
    process.exit(1);
  }

  const researchTextBlock = blocks[textIndex];
  const newBody = `25 interviews across younger and elderly members, CS call log analysis, and user surveys revealed two dominant issues: long phone wait times and confusion around claims. Older users additionally highlighted usability barriers in the interface, including small font sizes, limited tap targets, and difficult navigation. The findings pointed to two distinct problems requiring a single, unified solution.`;

  const updatedContent = {
    ...researchTextBlock.content,
    body: newBody
  };

  await prisma.caseStudyBlock.update({
    where: { id: researchTextBlock.id },
    data: { content: updatedContent }
  });

  console.log(`Updated Research text block ${researchTextBlock.id} body`);
  console.log('New body preview:', newBody.substring(0, 100) + '...');
}

updateResearchText().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); await pool.end(); });
