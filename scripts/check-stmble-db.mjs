import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const stmble = await prisma.caseStudy.findFirst({ 
    where: { slug: 'stmble-dating-app' }, 
    select: { 
      coverImageUrl: true, 
      imageUrl: true, 
      title: true, 
      published: true,
      slug: true
    } 
  });
  console.log('Stmble DB:', JSON.stringify(stmble, null, 2));

  const allPublished = await prisma.caseStudy.findMany({ 
    where: { published: true }, 
    select: { 
      slug: true, 
      coverImageUrl: true, 
      imageUrl: true 
    },
    orderBy: { updatedAt: 'desc' }
  });
  console.log('All published studies images:', allPublished.map(s => ({slug: s.slug.substring(0,10)+'..', cover: s.coverImageUrl, image: s.imageUrl})));

  await prisma.$disconnect();
  await pool.end();
}

main().catch(console.error);
