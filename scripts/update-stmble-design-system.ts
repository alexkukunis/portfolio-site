import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Update Design System image caption (order 17, block ID cmoc20044000h2bq1i44yegzm)
  const imageBlockId = 'cmoc20044000h2bq1i44yegzm';
  const imageBlock = await prisma.caseStudyBlock.findUnique({ where: { id: imageBlockId } });
  if (imageBlock && imageBlock.type === 'image') {
    await prisma.caseStudyBlock.update({
      where: { id: imageBlockId },
      data: {
        content: {
          ...imageBlock.content,
          caption: 'Design system library'
        }
      }
    });
    console.log('Updated Design System image caption to "Design system library".');
  }

  // Clear Design System text body (order 18, block ID cmoc20044000i2bq1yle4d9x2)
  const textBlockId = 'cmoc20044000i2bq1yle4d9x2';
  const textBlock = await prisma.caseStudyBlock.findUnique({ where: { id: textBlockId } });
  if (textBlock && textBlock.type === 'text') {
    await prisma.caseStudyBlock.update({
      where: { id: textBlockId },
      data: {
        content: {
          ...textBlock.content,
          body: ''
        }
      }
    });
    console.log('Cleared Design System text body (order 18).');
  }

  console.log('Design System updates complete.');
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
