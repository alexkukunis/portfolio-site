const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const roleUpdates = {
  'foodwell': 'Product Designer · iOS, Android & Web',
  'hm-checkout-redesign': 'Product Designer · iOS, Android & Web',
  'stmble-dating-app': 'Product Designer · iOS, Web',
  'sydney-health-chat': 'Product Designer · iOS, Android & Web', // or adjust slug if different
  'paytile-location-payments': 'Product Designer · iOS, Android & Web',
  'dealer-tire-storefront-redesign': 'UI/UX Designer · Web',
  'cozies': 'Cozies UX/UI Designer · Web' // assuming slug 'cozies'
};

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  let updatedCount = 0;
  let skippedCount = 0;
  for (const [slug, newRole] of Object.entries(roleUpdates)) {
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
