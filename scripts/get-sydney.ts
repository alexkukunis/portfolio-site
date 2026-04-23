import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const studies = await prisma.caseStudy.findMany({
    where: {
      OR: [
        { slug: { contains: 'sydney' } },
        { title: { contains: 'sydney' } },
        { company: { contains: 'sydney' } },
      ],
    },
    include: { blocks: { orderBy: { order: 'asc' } } },
  });

  console.log('Found studies:', JSON.stringify(studies.map(s => ({ id: s.id, slug: s.slug, title: s.title, published: s.published, blockCount: s.blocks.length })), null, 2));

  // Search blocks for text
  studies.forEach(s => {
    s.blocks.forEach((b, i) => {
      if (b.content && typeof b.content === 'object') {
        const text = JSON.stringify(b.content).toLowerCase();
        if (text.includes('survey') || text.includes('interview') || text.includes('elderly')) {
          console.log(`\\n=== Study ${s.slug} Block ${i} (type: ${b.type}): ===`);
          console.log(JSON.stringify(b.content, null, 2));
        }
      }
    });
  });
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
