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
  const blockId = 'cmoc1r4us00088fq120fm2si2';
  
  const block = await prisma.caseStudyBlock.findUnique({
    where: { id: blockId },
  });

  if (!block) {
    console.log('Block not found');
    process.exit(1);
  }

  console.log('Current body:', block.content.body);

  const currentBody = block.content.body;
  const newBody = currentBody.replace(', and surveyed 200 users', '');

  const updatedBlock = await prisma.caseStudyBlock.update({
    where: { id: blockId },
    data: {
      content: {
        ...block.content,
        body: newBody,
      },
    },
  });

  console.log('Updated body:', updatedBlock.content.body);
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
