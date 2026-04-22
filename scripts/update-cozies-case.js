const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function updateCase() {
  const cozies = await prisma.caseStudy.findFirst({ where: { slug: 'cozies-maternity-fashion-ux' } });
  if (!cozies) {
    console.log('Cozies not found');
    process.exit(1);
  }

  await prisma.caseStudy.update({
    where: { id: cozies.id },
    data: {
      title: 'Designing Cozies — Maternity Fashion That Actually Gets You',
      role: 'Lead UX/UI Designer · iOS & Web · 6 Weeks · 2025'
    }
  });
  console.log('Updated CaseStudy title/role.');
}

updateCase().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); await pool.end(); });