const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function deleteImageGrid() {
  await prisma.caseStudyBlock.delete({
    where: { id: 'cmo9282m900096rq16tzgpkjt' }
  });
  console.log('Deleted Cozies image-grid order 10 under Design Process.');
}

deleteImageGrid().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); await pool.end(); });