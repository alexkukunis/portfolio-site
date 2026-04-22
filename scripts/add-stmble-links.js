import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const study = await prisma.caseStudy.findFirst({ where: { slug: 'stmble-dating-app' } });
  if (!study) {
    console.log('Stmble not found');
    return;
  }

  const heroBlock = await prisma.caseStudyBlock.findFirst({
    where: { caseStudyId: study.id, type: 'hero' }
  });

  const newLinks = [
    { label: 'Website', url: 'https://stmble.co', icon: 'globe' },
    { label: 'iOS App', url: 'https://apps.apple.com/us/app/stmble/id6757424289', icon: 'external-link' }
  ];

  if (heroBlock) {
    const heroContent = { ...heroBlock.content, links: newLinks };
    await prisma.caseStudyBlock.update({
      where: { id: heroBlock.id },
      data: { content: heroContent }
    });
    console.log('Added links to Stmble hero');
  }

  // Verify
  const blocks = await prisma.caseStudyBlock.findMany({
    where: { caseStudyId: study.id },
    orderBy: { order: 'asc' },
    select: { type: true, content: true }
  });
  console.log('Stmble hero links:', JSON.stringify(blocks.find(b => b.type === 'hero')?.content.links || 'No links', null, 2));
}

main().catch(console.error).finally(async () => {
  await prisma.$disconnect();
  await pool.end();
});