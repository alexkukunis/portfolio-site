import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:kfSwaTigJiBFZTHrUUFaTpCzmKBBMLZy@hopper.proxy.rlwy.net:33870/railway";
  const pool = new Pool({ connectionString: DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

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

  const updatedHeroContent = {
    ...heroBlock.content,
    links: newLinks
  };

  await prisma.caseStudyBlock.update({
    where: { id: heroBlock.id },
    data: { content: updatedHeroContent }
  });

  console.log('Updated Sydney Health hero.links with 3 product links');
  console.log('Links:', JSON.stringify(newLinks, null, 2));

  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
