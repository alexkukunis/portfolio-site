const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const captionUpdates = [
  {
    imageUrl: '/uploads/foodwell-overview.png',
    newCaption: ''
  },
  {
    imageUrl: '/uploads/foodwell-hifi.png',
    newCaption: 'Before/after: Old cluttered FoodWell ordering (left) vs redesigned clean flow (right) with sticky cart and countdown timer.'
  },
  {
    imageUrl: '/uploads/foodwell-research.png',
    newCaption: 'FoodWell research synthesis: affinity map'
  },
  {
    imageUrl: '/uploads/foodwell-metrics.png',
    newCaption: 'Streamlined the checkout flow from 8 steps to 5'
  },
  {
    imageUrl: '/uploads/foodwell-workflow.png',
    newCaption: 'Ordering flow screens: Home with recommendations, meal detail, checkout.'
  },
  {
    imageUrl: '/uploads/foodwell-smart.png',
    newCaption: 'Personalized meal feed and filtered state'
  },
  {
    imageUrl: '/uploads/foodwell-timer.png',
    newCaption: 'Checkout timer screens: Active reservation (left) and expired state (right) on iPhone.'
  },
  {
    imageUrl: '/uploads/foodwell-key.png',
    newCaption: 'Display of key screens home, browse, checkout flow'
  },
  {
    imageUrl: '/uploads/foodwell-outcome.png',
    newCaption: 'Impact metrics: Before/after conversion chart, cart abandonment drop, AOV increase panels.'
  }
];

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const foodwell = await prisma.caseStudy.findUnique({
    where: { slug: 'foodwell' }
  });

  if (!foodwell) {
    console.log('Foodwell case study not found!');
    return;
  }

  console.log(`Found Foodwell (ID: ${foodwell.id})`);

  let updatedCount = 0;
  for (const update of captionUpdates) {
    const block = await prisma.caseStudyBlock.findFirst({
      where: {
        caseStudyId: foodwell.id,
        type: 'image',
        content: {
          path: ['url'],
          equals: update.imageUrl
        }
      }
    });

    if (block) {
      await prisma.caseStudyBlock.update({
        where: { id: block.id },
        data: {
          content: {
            ...block.content,
            caption: update.newCaption
          }
        }
      });
      console.log(`Updated caption for ${update.imageUrl}`);
      updatedCount++;
    } else {
      console.log(`No block found for ${update.imageUrl}`);
    }
  }

  console.log(`Updated ${updatedCount} captions.`);
  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
