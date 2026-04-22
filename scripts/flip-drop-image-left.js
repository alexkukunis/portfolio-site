const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function flipDropImage() {
  await prisma.caseStudyBlock.update({
    where: { id: 'cmo929t3h000iiaq1h2szq0lb' },
    data: {
      content: {
        side: 'left',  // Image LEFT, text RIGHT
        text: 'The money drop interaction was one of the most interaction-design-dense problems in the product. I designed a long-press placement gesture with a physics-based drop animation and a radius heat preview so senders could see exactly who was in range before confirming. The animation wasn\'t decorative — it communicated distance, privacy radius, and confirmation state simultaneously without a single word of instructional UI copy.\n\n4.8/5 User satisfaction\n94% Task completion\n2.3s Avg. drop time\n87% Engagement rate',
        label: 'Money Drop Animation',
        imageUrl: '/uploads/ezgif-1-48098f39a0.png',
        imageAlt: 'Money drop animation showing long-press placement, physics drop, and radius heat preview'
      }
    }
  });
  console.log('Flipped Dropping Money twocolumn: IMAGE LEFT, text RIGHT (side: left).');
}

flipDropImage().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); await pool.end(); });