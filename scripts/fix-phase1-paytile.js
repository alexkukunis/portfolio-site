const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function fixPhase1() {
  // Delete duplicate text (order 7) and list (order 8)
  await prisma.caseStudyBlock.delete({ where: { id: 'cmo929t3h0007iaq1qu3a0vcs' } });
  console.log('Deleted text order 7');
  await prisma.caseStudyBlock.delete({ where: { id: 'cmo929t3h0008iaq1lykb219h' } });
  console.log('Deleted list order 8');

  // Update twocolumn (order 9): text left (full paragraph + bullets), image right
  await prisma.caseStudyBlock.update({
    where: { id: 'cmo929t3h0009iaq1yea42cc2' },
    data: {
      content: {
        side: 'left',
        text: `We ran 12 user interviews focused on privacy, trust, and proximity preferences. Six contextual map tests revealed how people actually navigate and interact with location UI — a lot of assumptions didn't survive contact with real users. A privacy survey of 108 participants confirmed what we suspected: 71% wouldn't share their phone number with a stranger, and anonymity wasn't a nice-to-have, it was the baseline expectation. A competitive audit across Cash App, Venmo, Zelle, Life360, and Snap Map consistently revealed the same gap — nobody had combined proximity payments, real privacy controls, and gamification in a single coherent experience.

Proximity felt intuitive when framed as tapping on a map
Privacy needed to be visible and controllable at every touchpoint
Gamification meaningfully boosted adoption — task completion went up 27% in sessions where game mechanics were present`,
        label: 'Research Visualization',
        imageUrl: '/uploads/Screen-Shot-2022-10-24-at-2.18.41-PM-1.png',
        imageAlt: 'Ideation and findings visualization showing research synthesis and key insight mapping'
      }
    }
  });
  console.log('Updated twocolumn order 9: full text left (paragraph + bullets), image right only.');
}

fixPhase1().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); await pool.end(); });