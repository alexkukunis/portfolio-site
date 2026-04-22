import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const study = await prisma.caseStudy.findFirst({ where: { slug: 'foodwell-healthy-meal-delivery' } });
  if (!study) {
    console.log('Foodwell not found');
    process.exit(1);
  }
  console.log(`Foodwell ID: ${study.id}`);
  const blocks = await prisma.caseStudyBlock.findMany({
    where: { 
      caseStudyId: study.id,
      type: 'quote',
      content: {
        path: ['text'],
        string_contains: 'Redesigning FoodWell'
      }
    },
    select: { id: true, content: true }
  });
  console.log('Foodwell quote block:', JSON.stringify(blocks, null, 2));
}

main().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); await pool.end(); });