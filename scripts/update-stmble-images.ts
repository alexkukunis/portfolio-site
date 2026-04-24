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

  // Update 60-Second Timer image (order 11)
  const block11 = await prisma.caseStudyBlock.findFirst({
    where: { caseStudyId: study.id, order: 11 }
  });
  if (block11) {
    await prisma.caseStudyBlock.update({
      where: { id: block11.id },
      data: {
        content: {
          ...block11.content,
          url: '/uploads/stmble-60second.png'
        }
      }
    });
    console.log('Updated order 11 (60-Second Timer)');
  }

  // Update Interaction States image (order 14)
  const block14 = await prisma.caseStudyBlock.findFirst({
    where: { caseStudyId: study.id, order: 14 }
  });
  if (block14) {
    await prisma.caseStudyBlock.update({
      where: { id: block14.id },
      data: {
        content: {
          ...block14.content,
          url: '/uploads/stmble-interaction.png'
        }
      }
    });
    console.log('Updated order 14 (Interaction States)');
  }

  // Design System image (order 17)
  const block17 = await prisma.caseStudyBlock.findFirst({
    where: { caseStudyId: study.id, order: 17 }
  });
  if (block17) {
    await prisma.caseStudyBlock.update({
      where: { id: block17.id },
      data: {
        content: {
          ...block17.content,
          url: '/uploads/stmble-design-system.png'
        }
      }
    });
    console.log('Updated order 17 (Design System)');
  }

  console.log('All stmble images updated.');
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
