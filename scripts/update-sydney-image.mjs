import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const result = await prisma.caseStudy.updateMany({
    where: { slug: 'sydney-health-bcbs' },
    data: { 
      coverImageUrl: '/uploads/sydneyhealth.png',
      imageUrl: '/uploads/sydneyhealth.png'
    }
  });
  console.log(`Updated ${result.count} case studies.`);
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
