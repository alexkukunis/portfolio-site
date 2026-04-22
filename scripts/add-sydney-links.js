import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const study = await prisma.caseStudy.findFirst({ where: { slug: 'sydney-health-bcbs' } });
  if (!study) {
    console.log('Sydney Health not found');
    return;
  }

  const linksBlock = await prisma.caseStudyBlock.findFirst({
    where: { caseStudyId: study.id, type: 'links' }
  });

  const newLinks = [
    { label: 'Website', url: 'https://www.sydneyhealth.com/', icon: 'globe' },
    { label: 'iOS App', url: 'https://apps.apple.com/us/app/sydney-health/id1463423283', icon: 'external-link' },
    { label: 'Android', url: 'https://play.google.com/store/apps/details?id=com.anthem.sydney&hl=en_US', icon: 'external-link' }
  ];

  if (linksBlock) {
    const updatedContent = {
      ...linksBlock.content,
      title: 'Live Product',
      links: newLinks
    };
    await prisma.caseStudyBlock.update({
      where: { id: linksBlock.id },
      data: { content: updatedContent }
    });
    console.log('Updated Sydney Health links block');
  } else {
    console.log('No links block found - create one?');
  }

  // Verify
  const blocks = await prisma.caseStudyBlock.findMany({
    where: { caseStudyId: study.id },
    select: { type: true, content: true }
  });
  console.log('Sydney Health links block:', JSON.stringify(blocks.find(b => b.type === 'links')?.content || 'Not found', null, 2));
}

main().catch(console.error).finally(async () => {
  await prisma.$disconnect();
  await pool.end();
});