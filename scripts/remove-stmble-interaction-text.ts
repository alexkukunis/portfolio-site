import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const blockId = 'cmoc20044000f2bq1ajvrh4m0'; // order 15 text block ID
  const block = await prisma.caseStudyBlock.findUnique({ where: { id: blockId } });
  if (!block || block.type !== 'text') {
    console.log('Block not found or not text type');
    return;
  }

  const statesText = `State 1 — Default: Profile card centred, timer running, both buttons visible and equal weight.

State 2 — Accepting: The accept button pulses briefly, card lifts slightly with a subtle shadow, a soft confirmation animation begins. Feels like a moment, not a tap.

State 3 — Passing: Card slides away to the left, no harsh dismiss animation, "Not right now" — the language is soft and non-rejecting deliberately. Nobody is rejected in Stmble. Timing just doesn't align.`;
  
  const currentBody = block.content.body as string;
  const newBody = currentBody.replace(statesText, '').trim();
  
  if (newBody === currentBody) {
    console.log('No change needed - text not found');
    return;
  }
  
  await prisma.caseStudyBlock.update({
    where: { id: blockId },
    data: { 
      content: { 
        body: newBody 
      } 
    }
  });
  console.log('Removed state descriptions from order 15.');
  console.log('New body length:', newBody.length);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
