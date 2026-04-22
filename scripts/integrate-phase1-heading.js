const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function integrateHeading() {
  // Delete separate heading block (order 6)
  await prisma.caseStudyBlock.delete({
    where: { id: 'cmo929t3h0006iaq1wqo68oz3' }
  });
  console.log('Deleted Phase 1 heading block order 6');

  // Update twocolumn label to heading text
  await prisma.caseStudyBlock.update({
    where: { id: 'cmo929t3h0009iaq1yea42cc2' },
    data: {
      content: {
        side: 'left',
        text: `We ran 12 user interviews focused on privacy, trust, and proximity preferences. Six contextual map tests revealed how people actually navigate and interact with location UI — a lot of assumptions didn't survive contact with real users. A privacy survey of 108 participants confirmed what we suspected: 71% wouldn't share their phone number with a stranger, and anonymity wasn't a nice-to-have, it was the baseline expectation. A competitive audit across Cash App, Venmo, Zelle, Life360, and Snap Map consistently revealed the same gap — nobody had combined proximity payments, real privacy controls, and gamification in a single coherent experience.

Proximity felt intuitive when framed as tapping on a map
Privacy needed to be visible and controllable at every touchpoint
Gamification meaningfully boosted adoption — task completion went up 27% in sessions where game mechanics were present`,
        label: 'Phase 1 — Research & Discovery',
        imageUrl: '/uploads/Screen-Shot-2022-10-24-at-2.18.41-PM-1.png',
        imageAlt: 'Ideation and findings visualization showing research synthesis and key insight mapping'
      }
    }
  });
  console.log('Updated twocolumn label to "Phase 1 — Research & Discovery": heading integrated, text left/image right.');
}

integrateHeading().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); await pool.end(); });