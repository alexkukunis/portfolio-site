import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const study = await prisma.caseStudy.findFirst({
    where: { slug: 'stmble-dating-app' },
  });

  if (!study) {
    console.log('No stmble case study found');
    return;
  }

  const block12 = await prisma.caseStudyBlock.findFirst({
    where: { caseStudyId: study.id, order: 12 }
  });

  if (block12 && block12.type === 'text') {
    const currentBody = block12.content.body as string;
    const screensText = `Screen 1 — Full: Timer at 60 seconds, circular progress ring complete, neutral colour. Calm.

Screen 2 — Mid: Timer at 30 seconds, ring half elapsed, colour shifts to warm amber. Gentle urgency.

Screen 3 — Low: Timer at 10 seconds, ring nearly gone, colour shifts to a soft red. Clear pressure without alarm.

Screen 4 — Expired: Timer gently fades, a gentle message appears: "This moment has passed." No harsh state, no failure language. The moment simply closes.`;
    const newBody = currentBody.replace(screensText, '').trim();
    await prisma.caseStudyBlock.update({
      where: { id: block12.id },
      data: {
        content: {
          ...block12.content,
          body: newBody
        }
      }
    });
    console.log('Removed screen descriptions from order 12 text block.');
    console.log('New body preview:', newBody.substring(0, 200) + '...');
  } else {
    console.log('Text block at order 12 not found.');
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
