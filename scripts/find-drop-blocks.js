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
  const blocks = await prisma.caseStudyBlock.findMany({
    where: { 
      caseStudyId: study.id,
      OR: [
        {
          content: {
            path: ['text'],
            string_contains: 'money drop interaction'
          }
        },
        {
          content: {
            path: ['imageUrl'],
            string_contains: 'ezgif-1-48098f39a0.png'
          }
        },
        {
          type: 'heading',
          content: {
            path: ['text'],
            string_contains: 'Dropping Money'
          }
        }
      ]
    },
    orderBy: { order: 'asc' },
    select: { id: true, type: true, content: true, order: true }
  });
  console.log('Dropping Money blocks:', JSON.stringify(blocks, null, 2));
}

main().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); await pool.end(); });