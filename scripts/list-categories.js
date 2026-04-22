import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const studies = await prisma.caseStudy.findMany({
    where: { published: true },
    select: {
      slug: true,
      title: true,
      category: true
    },
    orderBy: { updatedAt: 'desc' }
  });
  console.log('Published case studies with categories:', JSON.stringify(studies, null, 2));
}

main().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); await pool.end(); });