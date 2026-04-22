import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const cozies = await prisma.caseStudy.findFirst({ where: { slug: 'cozies-maternity-fashion-ux' } });
  if (!cozies) {
    console.log('Cozies not found');
    process.exit(1);
  }
  console.log(`Cozies ID: ${cozies.id}`);
  const imagegrids = await prisma.caseStudyBlock.findMany({
    where: { 
      caseStudyId: cozies.id,
      type: 'imagegrid',
      content: {
        path: ['items'],
        array_contains: '/uploads/sketch-home-cozies.png'
      }
    },
    select: { id: true, type: true, content: true, order: true }
  });
  console.log('Cozies ImageGrid with sketch-home-cozies.png:', JSON.stringify(imagegrids, null, 2));
}

main().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); await pool.end(); });