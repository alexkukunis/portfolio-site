import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const study = await prisma.caseStudy.findFirst({ where: { slug: 'hm-checkout-redesign' } });
  if (!study) {
    console.log('H&M not found');
    return;
  }

  // Get hero block (order 0)
  const heroBlock = await prisma.caseStudyBlock.findFirst({
    where: { caseStudyId: study.id, type: 'hero' }
  });

  // Get links block if exists
  const linksBlock = await prisma.caseStudyBlock.findFirst({
    where: { caseStudyId: study.id, type: 'links' }
  });

  const newLinks = [
    { label: 'Website', url: 'https://www.hm.com/', icon: 'globe' },
    { label: 'iOS App', url: 'https://apps.apple.com/us/app/h-m/id834465911', icon: 'external-link' },
    { label: 'Android', url: 'https://play.google.com/store/apps/details?id=com.hm.goe&hl=en_US', icon: 'external-link' }
  ];

  let heroLinks = newLinks;

  if (linksBlock) {
    // Merge existing links if any
    const existingLinks = linksBlock.content.links || [];
    heroLinks = [...newLinks, ...existingLinks.filter(l => !newLinks.some(nl => nl.url === l.url))];
    await prisma.caseStudyBlock.delete({ where: { id: linksBlock.id } });
    console.log('Merged/deleted H&M links block');
  }

  if (heroBlock) {
    const heroContent = { ...heroBlock.content, links: heroLinks };
    await prisma.caseStudyBlock.update({
      where: { id: heroBlock.id },
      data: { content: heroContent }
    });
    console.log('Added links to H&M hero');
  }

  // Verify
  const blocks = await prisma.caseStudyBlock.findMany({
    where: { caseStudyId: study.id },
    orderBy: { order: 'asc' },
    select: { type: true, order: true, content: true }
  });
  console.log('H&M hero content:', JSON.stringify(blocks.find(b => b.type === 'hero')?.content.links || 'No hero links', null, 2));
}

main().catch(console.error).finally(async () => {
  await prisma.$disconnect();
  await pool.end();
});