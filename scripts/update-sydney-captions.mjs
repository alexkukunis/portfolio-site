import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function updateCaptions() {
  const sydney = await prisma.caseStudy.findFirst({ where: { slug: 'sydney-health-bcbs' } });
  if (!sydney) {
    console.log('Sydney Health not found');
    process.exit(1);
  }

  const blocks = await prisma.caseStudyBlock.findMany({
    where: { caseStudyId: sydney.id },
    orderBy: { order: 'asc' }
  });

  const captionUpdates = [
    { heading: 'Research', newCaption: 'key metrics: 78% of members wanted real-time support but had no in-app option, 12-minute average hold time prior to this feature, and a 35% churn rate above industry average' },
    { heading: 'Key Design Decision 1 — Contextual Chat Entry', newCaption: 'Side-by-side comparison of old vs new claims support flow: the old screen forces users to exit the app via a “Contact Us” link and repeat details over the phone, while the new screen introduces an in-app chat button that opens directly into a contextual chat with the claim details preloaded, enabling seamless, no-repetition support.' },
    { heading: 'Key Design Decision 2 — Pre-Populated Member Data', newCaption: 'Screen showing chat initialization with subtle loading animation that pulls in member data (name, plan type, active claims count, primary physician) Includes a small inset of the agent view already populated with the member’s profile, plan details, and current screen context before the conversation begins.' },
    { heading: 'Key Design Decision 3 — Security as a Visible Design Element', newCaption: 'Screen showing chat initiation with a single, clean consent and security step before entry, featuring three icons: “End-to-end encrypted,” “Verified with biometrics (Face ID),” and “HIPAA compliant,” followed by a primary button labeled “Start Secure Chat,” designed as a reassuring, streamlined pre-chat security screen.' },
    { heading: 'Accessibility', newCaption: 'Two screens labeled “Standard” and “Accessible,” showing the same layout; the accessible version increases text size, tap targets, contrast, and adds a more prominent voice input.' },
    { heading: 'Full Chat Flow', newCaption: 'Four-screen journey: claims detail with contextual chat entry, a security consent screen (encrypted, biometric, HIPAA), an in-chat view with claim context and document sharing, and a final resolution screen with a summary card, next steps, and a simple “Was this helpful?” feedback prompt.' }
  ];

  let updatedCount = 0;
  for (const update of captionUpdates) {
    let headingIndex = -1;
    for (let i = 0; i < blocks.length; i++) {
      if (blocks[i].type === 'heading' && blocks[i].content.text === update.heading) {
        headingIndex = i;
        break;
      }
    }

    if (headingIndex !== -1) {
      const nextBlockIndex = headingIndex + 1;
      if (nextBlockIndex < blocks.length && blocks[nextBlockIndex].type === 'image') {
        const imageBlock = blocks[nextBlockIndex];
        const updatedContent = {
          ...imageBlock.content,
          caption: update.newCaption
        };
        await prisma.caseStudyBlock.update({
          where: { id: imageBlock.id },
          data: { content: updatedContent }
        });
        console.log(`Updated ${update.heading} image caption on block ${imageBlock.id}`);
        updatedCount++;
      }
    }
  }

  console.log(`${updatedCount}/6 captions updated successfully.`);
}

updateCaptions().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); await pool.end(); });
