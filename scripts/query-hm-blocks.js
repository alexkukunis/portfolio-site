import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const study = await prisma.caseStudy.findFirst({ where: { slug: 'hm-checkout-redesign' } });
  if (!study) {
    console.log('HM case study not found');
    process.exit(1);
  }
  console.log(`HM ID: ${study.id}`);
  const blocks = await prisma.caseStudyBlock.findMany({
    where: { caseStudyId: study.id },
    orderBy: { order: 'asc' },
    select: { id: true, type: true, content: true }
  });
  console.log('Blocks:', JSON.stringify(blocks, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });