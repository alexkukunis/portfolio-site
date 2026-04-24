import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const study = await prisma.caseStudy.findFirst({
    where: { slug: 'stmble-dating-app' },
    include: { blocks: { orderBy: { order: 'asc' } } }
  });
  if (study) {
    console.log(JSON.stringify(study, null, 2));
  } else {
    console.log('No stmble case study found');
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
