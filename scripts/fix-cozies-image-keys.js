const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function fixImageKeys() {
  await prisma.caseStudyBlock.update({
    where: { id: 'cmo95t6z50000x7q1ht6fjhi4' },
    data: {
      content: {
        url: '/uploads/cozies-ios-app.png',
        alt: 'Cozies iOS app maternity fashion shopping experience'
      }
    }
  });
  console.log('Fixed Cozies image keys: imageUrl/imageAlt → url/alt.');
}

fixImageKeys().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); await pool.end(); });