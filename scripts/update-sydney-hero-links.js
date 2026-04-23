require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const blockId = 'cmoc1r4us00008fq1ndjtfrm6';
  
  const block = await prisma.caseStudyBlock.findUnique({
    where: { id: blockId },
  });

  if (!block) {
    console.log('Hero block not found');
    process.exit(1);
  }

  console.log('Current hero content:', JSON.stringify(block.content, null, 2));

  const newLinks = [
    { url: 'https://www.sydneyhealth.com', icon: 'globe', label: 'Website' },
    { url: 'https://apps.apple.com/us/app/sydney-health/id1463423283', icon: 'external-link', label: 'iOS App' },
    { url: 'https://play.google.com/store/apps/details?id=com.anthem.sydney&hl=en_US', icon: 'external-link', label: 'Android App' }
  ];

  const updatedContent = {
    ...block.content,
    links: newLinks
  };

  const updatedBlock = await prisma.caseStudyBlock.update({
    where: { id: blockId },
    data: {
      content: updatedContent,
    },
  });

  console.log('Updated hero links:', JSON.stringify(updatedBlock.content.links, null, 2));
  console.log('Done.');
}

main()
  .catch(e => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
