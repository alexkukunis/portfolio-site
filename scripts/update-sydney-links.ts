import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function updateSydneyLinks() {
  const sydney = await prisma.caseStudy.findFirst({ where: { slug: 'sydney-health-bcbs' } });
  if (!sydney) {
    console.log('Sydney Health not found');
    process.exit(1);
  }

  const heroBlock = await prisma.caseStudyBlock.findFirst({
    where: {
      caseStudyId: sydney.id,
      type: 'hero'
    }
  });

  if (!heroBlock) {
    console.log('Hero block not found');
    process.exit(1);
  }

  const newLinks = [
    { label: 'Website', url: 'https://www.sydneyhealth.com/', icon: 'globe' },
    { label: 'iOS App', url: 'https://apps.apple.com/us/app/sydney-health/id1463423283', icon: 'apple' },
    { label: 'Android App', url: 'https://play.google.com/store/apps/details?id=com.anthem.sydney&hl=en_US', icon: 'android' }
  ];

  const currentContent = heroBlock.content as Record&lt;string, any&gt;;
  const updatedHeroContent = {
    ...currentContent,
    links: newLinks
  };

  await prisma.caseStudyBlock.update({
    where: { id: heroBlock.id },
    data: { content: updatedHeroContent }
  });

  console.log('Updated Sydney Health hero.links with 3 product links');
  console.log('Links:', JSON.stringify(newLinks, null, 2));
}

updateSydneyLinks().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); await pool.end(); });
