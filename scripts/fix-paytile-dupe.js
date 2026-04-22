const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function fixDupe() {
  // Delete duplicate text block (order 11)
  await prisma.caseStudyBlock.delete({
    where: { id: 'cmo929t3h000biaq128dkl2p5' }
  });
  console.log('Deleted duplicate text block order 11');

  // Trim heading from twocolumn order 12, set clean text + label
  await prisma.caseStudyBlock.update({
    where: { id: 'cmo929t3h000ciaq1hgiwor8l' },
    data: {
      content: {
        side: 'left',
        text: 'With the research synthesized, we mapped where existing payment apps were losing users and identified three areas to design into. First, streamlining interaction flows to reduce friction at every decision point. Second, introducing gamification and reward mechanics to drive retention beyond the first transaction. Third, polishing the UI to encourage exploration — the map was a canvas, not just a utility, and the design needed to reflect that.',
        label: 'Strategy Visualization',
        imageUrl: '/uploads/Screen-Shot-2022-10-24-at-2.18.52-PM-1.png',
        imageAlt: 'User engagement analysis chart showing identified improvement areas and strategy'
      }
    }
  });
  console.log('Updated twocolumn order 12: full text left, image right, no heading duplicate');
}

fixDupe().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); await pool.end(); });