const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const blockId = 'cmoc1r4us00088fq120fm2si2';
  
  const block = await prisma.caseStudyBlock.findUnique({
    where: { id: blockId },
  });

  if (!block) {
    console.log('Block not found');
    process.exit(1);
  }

  const currentBody = block.content.body;
  const newBody = currentBody.replace(', and surveyed 200 users', '');

  await prisma.caseStudyBlock.update({
    where: { id: blockId },
    data: {
      content: {
        ...block.content,
        body: newBody,
      },
    },
  });

  console.log('Updated block body to:', newBody);
  console.log('Done.');
}

main()
  .catch(e => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
