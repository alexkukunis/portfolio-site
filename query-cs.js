const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const caseStudies = await prisma.caseStudy.findMany({
    select: { id: true, slug: true, title: true }
  });
  console.log('Case Studies in DB:');
  console.log(caseStudies);
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});