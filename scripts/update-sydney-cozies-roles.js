const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const targetedUpdates = {
  'sydney-health': 'Product Designer · iOS, Android, Web',  // Sydney Health (no Senior)
  'cozies-maternity-fashion-ux': 'Cozies, UX/UI Designer · Web'
};

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  let updatedCount = 0;
  let skippedCount = 0;
  for (const [slug, newRole] of Object.entries(targetedUpdates)) {
    const study = await prisma.caseStudy.findUnique({
      where: { slug }
    });

    if (study) {
      await prisma.caseStudy.update({
        where: { id: study.id },
        data: { role: newRole }
      });
      console.log(`✓ Updated ${slug}: "${newRole}"`);
      updatedCount++;
    } else {
      console.log(`✗ No case study found for slug: ${slug}`);
      skippedCount++;
    }
  }

  console.log(`\nSummary: ${updatedCount} updated, ${skippedCount} skipped/missing.`);
  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
