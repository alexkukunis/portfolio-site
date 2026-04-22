const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function fixDesignImages() {
  const cozies = await prisma.caseStudy.findFirst({ where: { slug: 'cozies-maternity-fashion-ux' } });
  await prisma.caseStudyBlock.update({
    where: { id: 'cmo9282m900096rq16tzgpkjt' },
    data: {
      content: {
        images: [
          {
            alt: "Cozies user persona",
            url: "/uploads/user-persona.png",
            caption: ""
          },
          {
            alt: "Cozies UI design mockup on iPhone",
            url: "/uploads/iphone-cozies-screen.png",
            caption: ""
          }
        ]
      }
    }
  });
  console.log('Updated Cozies image-grid order 10: removed middle sketch-home-cozies.png → 2-column.');
}

fixDesignImages().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); await pool.end(); });