import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    const all = await prisma.caseStudy.findMany({});
    console.log('ALL Case Studies:', JSON.stringify(all, null, 2));
    const published = await prisma.caseStudy.findMany({ where: { published: true } });
    console.log('\nPublished count:', published.length);
    console.log('\nPublished studies:', JSON.stringify(published, null, 2));
  } catch(e) {
    console.error('Error:', e.message);
    console.error(e.stack);
  } finally {
    await prisma.$disconnect();
  }
}

main();
