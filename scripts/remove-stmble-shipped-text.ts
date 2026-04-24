import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const blockId = 'cmoc20044000l2bq1c2tis07h'; // order 21 text block ID
  const block = await prisma.caseStudyBlock.findUnique({ where: { id: blockId } });
  if (!block || block.type !== 'text') {
    console.log('Block not found or not text type');
    return;
  }

  const shippedText = `Stmble icon — clean, distinctive. Preview screenshots in the App Store carousel showing the core experience screens. Star rating visible. "Available on the App Store" badge. This image exists purely to show it's real and live — not a concept.`;
  
  const currentBody = block.content.body as string;
  const newBody = currentBody.replace(shippedText, '').trim();
  
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
  console.log('Removed shipped descriptions from order 21.');
  console.log('New body length:', newBody.length);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
