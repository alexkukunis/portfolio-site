const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function fixP2P() {
  // Delete duplicate text block (order 20)
  await prisma.caseStudyBlock.delete({
    where: { id: 'cmo929t3h000kiaq1ld22pvup' }
  });
  console.log('Deleted P2P text block order 20');

  // Update twocolumn (order 21): full text left, image right only (side 'right')
  await prisma.caseStudyBlock.update({
    where: { id: 'cmo929t3h000liaq1s901so5a' },
    data: {
      content: {
        side: 'right',
        text: 'The proximity P2P flow was the hardest problem to solve. How do you let two strangers exchange money nearby without either person revealing personal information? The solution was a three-tier privacy system — blurred avatars, directional proximity arrows, and layered consent controls that let users choose exactly how much they revealed. No phone numbers, no contact sync, no QR codes. Just proximity and mutual confirmation.',
        label: 'P2P Transaction Flow',
        imageUrl: '/uploads/ezgif-1-c8061774f1.png',
        imageAlt: 'P2P transaction animation showing blurred avatars, directional arrows, and proximity verification flow'
      }
    }
  });
  console.log('Updated P2P twocolumn order 21: full text left, image right only.');
}

fixP2P().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); await pool.end(); });