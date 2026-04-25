const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis;

const prisma = new PrismaClient({
  adapter,
  log: ['query']
});

async function main() {
  console.log('Finding foodwell case study...');
  const foodwell = await prisma.caseStudy.findUnique({
    where: { slug: 'foodwell' }
  });
  
  if (!foodwell) {
    console.log('Foodwell case study not found!');
    await prisma.$disconnect();
    await pool.end();
    return;
  }
  
  console.log('Found:', foodwell);
  
  console.log('Deleting blocks...');
  await prisma.caseStudyBlock.deleteMany({
    where: { caseStudyId: foodwell.id }
  });
  
  console.log('Deleting case study...');
  await prisma.caseStudy.delete({
    where: { id: foodwell.id }
  });
  
  console.log('Deleted successfully!');
  await prisma.$disconnect();
  await pool.end();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});