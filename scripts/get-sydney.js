const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const studies = await prisma.caseStudy.findMany({
    where: {
      OR: [
        { slug: { contains: 'sydney', mode: 'insensitive' } },
        { title: { contains: 'sydney', mode: 'insensitive' } },
        { company: { contains: 'sydney', mode: 'insensitive' } },
      ],
    },
    include: { blocks: true },
  });

  console.log('Sydney-related case studies:');
  console.log(JSON.stringify(studies, null, 2));

  if (studies.length === 0) {
    console.log('No Sydney case study found.');
  } else {
    studies.forEach(s => {
      console.log(`\\nStudy ID: ${s.id}, Slug: ${s.slug}`);
      s.blocks.forEach((b, i) => {
        if (b.content && (JSON.stringify(b.content).includes('surveyed') || JSON.stringify(b.content).includes('interview') || JSON.stringify(b.content).includes('elderly'))) {
          console.log(`Block ${i} (type: ${b.type}):`);
          console.log(JSON.stringify(b.content, null, 2));
        }
      });
    });
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
