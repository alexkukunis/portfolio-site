const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const study = await prisma.caseStudy.findUnique({
      where: { slug: 'hm-checkout-redesign' },
      include: { 
        blocks: { 
          orderBy: { order: 'asc' },
          select: { type: true, content: true, order: true }
        } 
      },
    });

    if (study) {
      console.log('✅ H&M Case Study verified:');
      console.log(`Title: ${study.title}`);
      console.log(`Slug: ${study.slug}`);
      console.log(`Published: ${study.published}`);
      console.log(`Blocks count: ${study.blocks.length}`);
      console.log('First few blocks:');
      study.blocks.slice(0, 5).forEach((b, i) => {
        console.log(`  ${i+1}. ${b.type} (order ${b.order}): ${JSON.stringify(b.content).slice(0, 100)}...`);
      });
      if (study.blocks.length > 5) console.log(`  ... and ${study.blocks.length - 5} more`);
    } else {
      console.log('❌ No H&M case study found.');
    }
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch(console.error);
