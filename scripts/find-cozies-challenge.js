import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const cozies = await prisma.caseStudy.findFirst({ where: { slug: { contains: 'cozies' } } });
  if (!cozies) {
    console.log('Cozies not found');
    process.exit(1);
  }
  console.log(`Cozies slug: ${cozies.slug}, ID: ${cozies.id}`);
  const challengeHeading = await prisma.caseStudyBlock.findFirst({
    where: {
      caseStudyId: cozies.id,
      type: 'heading',
      content: {
        path: ['text'],
        string_contains: 'The Challenge'
      }
    },
    select: { id: true, order: true }
  });
  console.log('Challenge heading:', JSON.stringify(challengeHeading, null, 2));
  const blocksBefore = await prisma.caseStudyBlock.count({
    where: {
      caseStudyId: cozies.id,
      order: { lt: challengeHeading?.order || 0 }
    }
  });
  console.log(`Blocks before Challenge: ${blocksBefore}`);
}

main().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); await pool.end(); });