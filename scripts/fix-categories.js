import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const updates = [
    { slug: 'hm-checkout-redesign', category: 'retail' },
    { slug: 'foodwell-healthy-meal-delivery', category: 'retail' },
    { slug: 'cozies-maternity-fashion-ux', category: 'retail' },
    { slug: 'dealer-tire-storefront-redesign', category: 'retail' },
    { slug: 'sydney-health-bcbs', category: 'health' },
    { slug: 'paytile-location-payments', category: 'fintech' }
  ];

  for (const { slug, category } of updates) {
    await prisma.caseStudy.updateMany({
      where: { slug },
      data: { category }
    });
    console.log(`Updated ${slug} category to "${category}"`);
  }

  const studies = await prisma.caseStudy.findMany({
    where: { published: true },
    select: { slug: true, title: true, category: true }
  });
  console.log('Updated studies:', JSON.stringify(studies, null, 2));
}

main().catch(console.error).finally(async () => {
  await prisma.$disconnect();
  await pool.end();
});