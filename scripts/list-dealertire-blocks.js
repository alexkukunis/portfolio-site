import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const dealertire = await prisma.caseStudy.findFirst({ where: { slug: 'dealer-tire-storefront-redesign' } });
  if (!dealertire) {
    console.log('DealerTire not found');
    process.exit(1);
  }
  console.log(`DealerTire slug: ${dealertire.slug}, ID: ${dealertire.id}, title: ${dealertire.title}, role: ${dealertire.role}`);
  const blocks = await prisma.caseStudyBlock.findMany({
    where: { caseStudyId: dealertire.id },
    orderBy: { order: 'asc' },
    select: { id: true, type: true, content: true, order: true }
  });
  console.log('All DealerTire blocks:', JSON.stringify(blocks, null, 2));
}

main().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); await pool.end(); });
