import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const updates = [
    { slug: 'foodwell-healthy-meal-delivery', role: 'UI/UX Designer' },
    { slug: 'hm-checkout-redesign', role: 'Product Designer' }
  ];

  for (const { slug, role } of updates) {
    await prisma.caseStudy.updateMany({
      where: { slug },
      data: { role }
    });
    console.log(`Updated ${slug} role to "${role}"`);
  }

  const studies = await prisma.caseStudy.findMany({
    where: { published: true },
    select: { slug: true, title: true, role: true, category: true }
  });
  console.log('Updated studies:', JSON.stringify(studies, null, 2));
}

main().catch(console.error).finally(async () => {
  await prisma.$disconnect();
  await pool.end();
});