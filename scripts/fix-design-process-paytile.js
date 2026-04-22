const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function fixDesignProcess() {
  // Read text from order 26 block
  const textBlock = await prisma.caseStudyBlock.findFirst({
    where: { id: 'cmo929t3h000qiaq1vtam753k' }
  });
  const paragraph = textBlock?.content.body || '';

  // Delete text block order 26
  await prisma.caseStudyBlock.delete({
    where: { id: 'cmo929t3h000qiaq1vtam753k' }
  });
  console.log('Deleted text order 26');

  // Update twocolumn order 27: side 'right' (text left/image right), text = paragraph, label ''
  await prisma.caseStudyBlock.update({
    where: { id: 'cmo929t3h000riaq1iz0wkpuf' },
    data: {
      content: {
        side: 'right',
        text: paragraph,
        label: '',
        imageUrl: '/uploads/brain-storm-wire.jpeg',
        imageAlt: 'Early hand-drawn wireframes showing initial map layouts, payment flow exploration, and core interaction sketches'
      }
    }
  });
  console.log('Updated twocolumn order 27: paragraph LEFT, image RIGHT. Heading 25 kept above.');
}

fixDesignProcess().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); await pool.end(); });