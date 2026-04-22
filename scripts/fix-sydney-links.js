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

  // Hero block (order 0) - clear duplicate links
  const heroBlock = await prisma.caseStudyBlock.findFirst({
    where: { caseStudyId: study.id, type: 'hero' }
  });
  if (heroBlock) {
    const heroContent = { ...heroBlock.content, links: [] };
    await prisma.caseStudyBlock.update({
      where: { id: heroBlock.id },
      data: { content: heroContent, order: 0 }
    });
    console.log('Cleared hero links, set order 0');
  }

  // Links block - remove title, set order 1
  const linksBlock = await prisma.caseStudyBlock.findFirst({
    where: { caseStudyId: study.id, type: 'links' }
  });
  if (linksBlock) {
    const linksContent = { ...linksBlock.content, title: null };
    await prisma.caseStudyBlock.update({
      where: { id: linksBlock.id },
      data: { content: linksContent, order: 1 }
    });
    console.log('Links block: removed title, set order 1');
  }

  // Shift other blocks +1 if needed (simple: delete and recreate links at order 1)
  await prisma.$transaction(async (tx) => {
    await tx.caseStudyBlock.updateMany({
      where: { caseStudyId: study.id, order: { gte: 1 } },
      data: { order: { increment: 1 } }
    });
  });

  // Verify
  const blocks = await prisma.caseStudyBlock.findMany({
    where: { caseStudyId: study.id },
    orderBy: { order: 'asc' },
    select: { id: true, type: true, order: true, content: true }
  });
  console.log('Sydney blocks order:', JSON.stringify(blocks.slice(0,3), null, 2));
}

main().catch(console.error).finally(async () => {
  await prisma.$disconnect();
  await pool.end();
});