import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function updateDesignImages() {
  const sydney = await prisma.caseStudy.findFirst({ where: { slug: 'sydney-health-bcbs' } });
  if (!sydney) {
    console.log('Sydney Health not found');
    process.exit(1);
  }

  const blocks = await prisma.caseStudyBlock.findMany({
    where: { caseStudyId: sydney.id },
    orderBy: { order: 'asc' }
  });

  // Update Contextual Chat Entry image
  let contextualHeadingIndex = -1;
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].type === 'heading' && blocks[i].content.text === 'Key Design Decision 1 — Contextual Chat Entry') {
      contextualHeadingIndex = i;
      break;
    }
  }

  if (contextualHeadingIndex !== -1) {
    const nextBlockIndex = contextualHeadingIndex + 1;
    if (nextBlockIndex < blocks.length && blocks[nextBlockIndex].type === 'image') {
      const contextualImage = blocks[nextBlockIndex];
      const updatedContent = {
        ...contextualImage.content,
        url: '/uploads/sydney-context-chat.png'
      };
      await prisma.caseStudyBlock.update({
        where: { id: contextualImage.id },
        data: { content: updatedContent }
      });
      console.log(`Updated Contextual Chat Entry image block ${contextualImage.id} to /uploads/sydney-context-chat.png`);
    }
  }

  // Update Pre-Populated Member Data image
  let prepopHeadingIndex = -1;
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].type === 'heading' && blocks[i].content.text === 'Key Design Decision 2 — Pre-Populated Member Data') {
      prepopHeadingIndex = i;
      break;
    }
  }

  if (prepopHeadingIndex !== -1) {
    const nextBlockIndex = prepopHeadingIndex + 1;
    if (nextBlockIndex < blocks.length && blocks[nextBlockIndex].type === 'image') {
      const prepopImage = blocks[nextBlockIndex];
      const updatedContent = {
        ...prepopImage.content,
        url: '/uploads/sydney-prepopulated.png'
      };
      await prisma.caseStudyBlock.update({
        where: { id: prepopImage.id },
        data: { content: updatedContent }
      });
      console.log(`Updated Pre-Populated Member Data image block ${prepopImage.id} to /uploads/sydney-prepopulated.png`);
    }
  }

  console.log('Design images updated successfully.');
}

updateDesignImages().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); await pool.end(); });
