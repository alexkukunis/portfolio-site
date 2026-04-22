import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const study = await prisma.caseStudy.findFirst({ where: { slug: 'sydney-health-bcbs' } });
  if (!study) {
    console.log('Sydney not found');
    return;
  }

  // Get hero block (order 0)
  const heroBlock = await prisma.caseStudyBlock.findFirst({
    where: { caseStudyId: study.id, type: 'hero' }
  });

  // Get links block
  const linksBlock = await prisma.caseStudyBlock.findFirst({
    where: { caseStudyId: study.id, type: 'links' }
  });

  if (heroBlock && linksBlock) {
    const links = linksBlock.content.links || [];
    const heroContent = { ...heroBlock.content, links };
    await prisma.caseStudyBlock.update({
      where: { id: heroBlock.id },
      data: { content: heroContent }
    });
    await prisma.caseStudyBlock.delete({ where: { id: linksBlock.id } });
    // Shift orders down for blocks after links
    const remainingBlocks = await prisma.caseStudyBlock.findMany({
      where: { caseStudyId: study.id, order: { gt: linksBlock.order } }
    });
    for (const block of remainingBlocks) {
      await prisma.caseStudyBlock.update({
        where: { id: block.id },
        data: { order: block.order - 1 }
      });
    }
    console.log('Moved Sydney links to hero, deleted links block, shifted orders');
  } else {
    console.log('Hero or links block missing');
  }

  // Verify
  const blocks = await prisma.caseStudyBlock.findMany({
    where: { caseStudyId: study.id },
    orderBy: { order: 'asc' },
    select: { type: true, order: true, content: true }
  });
  console.log('Sydney blocks:', JSON.stringify(blocks.slice(0,2), null, 2));
}

main().catch(console.error).finally(async () => {
  await prisma.$disconnect();
  await pool.end();
});