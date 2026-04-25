const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const cozies = await prisma.caseStudy.findUnique({
    where: { slug: 'cozies-maternity-fashion-ux' }
  });

  if (cozies) {
    await prisma.caseStudy.update({
      where: { id: cozies.id },
      data: { role: 'UX/UI Designer · Web' }
    });
    console.log('✓ Cozies role updated to "UX/UI Designer · Web"');
  } else {
    console.log('✗ No cozies-maternity-fashion-ux found');
  }

  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
