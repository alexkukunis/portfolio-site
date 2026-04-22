import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const study = await prisma.caseStudy.findFirst({ where: { slug: 'paytile-location-payments' } });
  if (!study) {
    console.log('Paytile not found');
    process.exit(1);
  }
  console.log(`Paytile ID: ${study.id}`);
  const blocks = await prisma.caseStudyBlock.findMany({
    where: { 
      caseStudyId: study.id,
      type: 'twocolumn',
      content: {
        path: ['imageUrl'],
        string_contains: 'Screen-Shot-2022-10-24-at-2.18.52-PM-1.png'
      }
    },
    select: { id: true, content: true, order: true }
  });
  console.log('Matching twocolumn block:', JSON.stringify(blocks, null, 2));
}

main().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); await pool.end(); });