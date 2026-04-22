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
  const blocks = await prisma.caseStudyBlock.findMany({
    where: { 
      caseStudyId: cozies.id,
      content: {
        string_contains: 'sketch-home-cozies'
      }
    },
    orderBy: { order: 'asc' },
    select: { id: true, type: true, content: true, order: true }
  });
  console.log('Cozies blocks containing "sketch-home-cozies":', JSON.stringify(blocks, null, 2));
}

main().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); await pool.end(); });