import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const study = await prisma.caseStudy.findFirst({ where: { slug: 'paytile-location-payments' } });
  if (!study) {
    console.log('PayTile not found');
    return;
  }

  const linksBlock = await prisma.caseStudyBlock.findFirst({
    where: { caseStudyId: study.id, type: 'links' }
  });

  if (linksBlock) {
    const content = linksBlock.content;
    // Remove duplicate Website link, keep only one
    const updatedContent = {
      ...content,
      links: content.links?.filter(link => link.label !== 'Website' || link.url !== 'https://www.paytile.com') || []
    };
    await prisma.caseStudyBlock.update({
      where: { id: linksBlock.id },
      data: { content: updatedContent }
    });
    console.log('Fixed PayTile links block - removed duplicate Website');
  } else {
    console.log('No links block found');
  }

  // Verify
  const blocks = await prisma.caseStudyBlock.findMany({
    where: { caseStudyId: study.id },
    select: { type: true, content: true }
  });
  console.log('PayTile blocks:', JSON.stringify(blocks.filter(b => b.type === 'links'), null, 2));
}

main().catch(console.error).finally(async () => {
  await prisma.$disconnect();
  await pool.end();
});