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

const imageUpdates = [
  { id: 'cmoc1r4us00018fq1g1mxwqjs', url: '/uploads/sydney-overview.png' },  // Key screens
  { id: 'cmoc1r4us00078fq1186ttmv2', url: '/uploads/sydney-research.png' },  // Research
  { id: 'cmoc1r4uu000a8fq1lzvdyx14', url: '/uploads/sydney-context-chat.png' },  // Contextual Chat
  { id: 'cmoc1r4uu000d8fq1wbn7e4e2', url: '/uploads/sydney-prepopulated.png' },  // Prepop data
  { id: 'cmoc1r4uy000m8fq1bxo863n0', url: '/uploads/sydney-full-chat.png' }   // Full flow
];

async function main() {
  for (const update of imageUpdates) {
    const block = await prisma.caseStudyBlock.findUnique({
      where: { id: update.id },
    });

    if (!block || block.type !== 'image') {
      console.log(`Skipping non-image or missing block: ${update.id}`);
      continue;
    }

    const newContent = {
      ...block.content,
      url: update.url
    };

    const updated = await prisma.caseStudyBlock.update({
      where: { id: update.id },
      data: { content: newContent },
    });

    console.log(`Updated ${update.id}: ${block.content.url} → ${updated.content.url}`);
  }
  console.log('All images updated.');
}

main()
  .catch(e => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
