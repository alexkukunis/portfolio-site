import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const blockId = 'cmoc2004400092bq1nnmhz7ri'; // order 9 text block ID
  const block = await prisma.caseStudyBlock.findUnique({ where: { id: blockId } });
  if (!block || block.type !== 'text') {
    console.log('Block not found or not text type');
    return;
  }

  const coreText = `Left screen — Entering a location: A clean search/entry interface. A map view beneath showing a soft radius around the entered location. A single CTA at the bottom: "Stumble Here." The map doesn't show other users — just the place and the radius. Privacy-first visual.

Right screen — Active match moment: A profile card fills the screen — photo, first name, age. At the top a circular countdown timer, bold and visible, showing seconds remaining. Two buttons anchored to the bottom — a large filled "Accept" on the right, a lighter outlined "Not Right Now" on the left. The timer creates urgency. The asymmetric button weight creates a clear primary action without forcing it.`;
  
  const currentBody = block.content.body as string;
  const newBody = currentBody.replace(coreText, '').trim();
  
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
  console.log('Removed core experience descriptions from order 9.');
  console.log('New body length:', newBody.length);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
