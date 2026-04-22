import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const hero = await prisma.caseStudyBlock.findUnique({
    where: { id: 'cmo9281jq00006kq187nu71gf' },
    select: { content: true }
  });
  const links = await prisma.caseStudyBlock.findUnique({
    where: { id: 'cmo9281jq00016kq1dzhs1t1v' },
    select: { content: true }
  });
  console.log('HM Hero links:', JSON.stringify(hero?.content.links, null, 2));
  console.log('HM Links block:', JSON.stringify(links?.content.links, null, 2));
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