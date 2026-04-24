import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const blockId = 'cmoc20044000c2bq17pe6silg'; // order 12 text block ID
  const block = await prisma.caseStudyBlock.findUnique({ where: { id: blockId } });
  if (!block || block.type !== 'text') {
    console.log('Block not found or not text type');
    return;
  }

  const screensText = `Screen 1 — Full: Timer at 60 seconds, circular progress ring complete, neutral colour. Calm.

Screen 2 — Mid: Timer at 30 seconds, ring half elapsed, colour shifts to warm amber. Gentle urgency.

Screen 3 — Low: Timer at 10 seconds, ring nearly gone, colour shifts to a soft red. Clear pressure without alarm.

Screen 4 — Expired: Timer gently fades, a gentle message appears: "This moment has passed." No harsh state, no failure language. The moment simply closes.`;
  
  const currentBody = block.content.body as string;
  const newBody = currentBody.replace(screensText, '').trim();
  
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
  console.log('Removed screen descriptions from order 12.');
  console.log('New body length:', newBody.length);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
