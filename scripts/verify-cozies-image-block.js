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
  const imageBlock = await prisma.caseStudyBlock.findUnique({
    where: { id: 'cmo95t6z50000x7q1ht6fjhi4' },
    select: { id: true, type: true, content: true, order: true }
  });
  console.log('Cozies image block:', JSON.stringify(imageBlock, null, 2));
}

main().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); await pool.end(); });