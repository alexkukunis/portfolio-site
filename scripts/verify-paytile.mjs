import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const study = await prisma.caseStudy.findFirst({
    where: { slug: 'paytile-location-payments' },
    include: { blocks: { orderBy: { order: 'asc' }, take: 5 } }
  });
  console.log('PayTile updated:');
  console.log('- Title:', study?.title);
  console.log('- Role:', study?.role);
  console.log('- Summary:', study?.summary?.substring(0, 100) + '...');
  console.log('First blocks:', JSON.stringify(study?.blocks || [], null, 2));
  await prisma.$disconnect();
  await pool.end();
}

main().catch(console.error);