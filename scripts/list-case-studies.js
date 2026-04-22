import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const studies = await prisma.caseStudy.findMany({
    where: { published: true },
    include: {
      blocks: {
        select: { id: true, type: true, order: true },
        orderBy: { order: 'asc' }
      }
    },
    orderBy: { publishedAt: 'desc' }
  });
  console.log('Live case studies:', JSON.stringify(studies.map(s => ({ slug: s.slug, title: s.title, blockTypes: s.blocks.map(b => b.type) })), null, 2));
}

main().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); await pool.end(); });