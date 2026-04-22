const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function insertImage() {
  const cozies = await prisma.caseStudy.findFirst({ where: { slug: 'cozies-maternity-fashion-ux' } });
  if (!cozies) {
    console.log('Cozies not found');
    process.exit(1);
  }

  // Shift all blocks order >= 2 to +1
  const blocksToShift = await prisma.caseStudyBlock.findMany({
    where: { caseStudyId: cozies.id, order: { gte: 2 } },
    orderBy: { order: 'asc' }
  });
  for (const block of blocksToShift) {
    await prisma.caseStudyBlock.update({
      where: { id: block.id },
      data: { order: block.order + 1 }
    });
  }
  console.log(`Shifted ${blocksToShift.length} blocks order >=2`);

  // Insert new full-width image block at order 2
  const newImage = await prisma.caseStudyBlock.create({
    data: {
      caseStudyId: cozies.id,
      type: 'image',
      order: 2,
      content: {
        imageUrl: '/uploads/cozies-ios-app.png',
        imageAlt: 'Cozies iOS app maternity fashion shopping experience'
      }
    }
  });
  console.log(`Inserted image block ID ${newImage.id} at order 2 (zoom-enabled full-width).`);
}

insertImage().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); await pool.end(); });