const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  // Find Sydney Health by company name (flexible match)
  const sydney = await prisma.caseStudy.findFirst({
    where: {
      company: {
        contains: 'Sydney Health',
        mode: 'insensitive'
      }
    }
  });

  if (sydney) {
    await prisma.caseStudy.update({
      where: { id: sydney.id },
      data: { role: 'Product Designer · iOS, Android & Web' }
    });
    console.log(`✓ Sydney Health (${sydney.slug}) role updated to "Product Designer · iOS, Android & Web"`);
  } else {
    console.log('✗ No Sydney Health case study found');
    // List all with 'sydney' or 'health'
    const matches = await prisma.caseStudy.findMany({
      where: {
        OR: [
          { company: { contains: 'sydney', mode: 'insensitive' } },
          { company: { contains: 'health', mode: 'insensitive' } },
          { title: { contains: 'sydney', mode: 'insensitive' } }
        ]
      },
      select: { slug: true, company: true, title: true, role: true }
    });
    console.log('Possible matches:', JSON.stringify(matches, null, 2));
  }

  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
