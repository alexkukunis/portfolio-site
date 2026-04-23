import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function updateRemainingImages() {
  const sydney = await prisma.caseStudy.findFirst({ where: { slug: 'sydney-health-bcbs' } });
  if (!sydney) {
    console.log('Sydney Health not found');
    process.exit(1);
  }

  const blocks = await prisma.caseStudyBlock.findMany({
    where: { caseStudyId: sydney.id },
    orderBy: { order: 'asc' }
  });

  const updates = [
    { heading: 'Key Design Decision 3 — Security as a Visible Design Element', url: '/uploads/sydney-security.png' },
    { heading: 'Accessibility', url: '/uploads/sydney-accessibility.png' },
    { heading: 'Research', url: '/uploads/sydney-research.png' },
    { heading: 'Full Chat Flow', url: '/uploads/sydney-full-chat.png' }
  ];

  let updatedCount = 0;
  for (const update of updates) {
    let headingIndex = -1;
    for (let i = 0; i < blocks.length; i++) {
      if (blocks[i].type === 'heading' && blocks[i].content.text === update.heading) {
        headingIndex = i;
        break;
      }
    }

    if (headingIndex !== -1) {
      const nextBlockIndex = headingIndex + 1;
      if (nextBlockIndex < blocks.length && blocks[nextBlockIndex].type === 'image') {
        const imageBlock = blocks[nextBlockIndex];
        const updatedContent = {
          ...imageBlock.content,
          url: update.url
        };
        await prisma.caseStudyBlock.update({
          where: { id: imageBlock.id },
          data: { content: updatedContent }
        });
        console.log(`Updated ${update.heading} image block ${imageBlock.id} to ${update.url}`);
        updatedCount++;
      }
    }
  }

  // Update Key screens from Sydney Health app image (walkthrough screens block)
  let keyScreensIndex = -1;
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].type === 'image' && blocks[i].content.caption === 'Key screens from Sydney Health app') {
      keyScreensIndex = i;
      break;
    }
  }
  if (keyScreensIndex !== -1) {
    const keyScreensBlock = blocks[keyScreensIndex];
    const updatedContent = {
      ...keyScreensBlock.content,
      url: '/uploads/sydney-overview.png'
    };
    await prisma.caseStudyBlock.update({
      where: { id: keyScreensBlock.id },
      data: { content: updatedContent }
    });
    console.log(`Updated Key screens image block ${keyScreensBlock.id} to /uploads/sydney-overview.png`);
    updatedCount++;
  }

  console.log(`${updatedCount}/5 images updated successfully.`);
}

updateRemainingImages().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); await pool.end(); });
