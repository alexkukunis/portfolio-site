const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function fixQuote() {
  await prisma.caseStudyBlock.update({
    where: { id: 'cmo9284g1000p73q1ry0mf7mh' },
    data: {
      content: {
        text: 'Redesigning FoodWell\'s ordering flow taught me that simplification isn\'t about removing features — it\'s about surfacing the right thing at the right moment so users feel confident, not overwhelmed.',
        attribution: 'Product Designer, FoodWell'
      }
    }
  });
  console.log('Updated Foodwell quote: Interaction Designer → Product Designer.');
}

fixQuote().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); await pool.end(); });