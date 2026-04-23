require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const captionUpdates = [
  // Research stats image caption
  {
    id: 'cmoc1r4us00078fq1186ttmv2',
    newCaption: 'Three bold stat cards on a dark background. "78%" — members wanted real-time support but had no in-app option. "12 min" — average hold time before this feature existed. "35%" — churn rate above industry average.'
  },
  // Contextual Chat
  {
    id: 'cmoc1r4uu000a8fq1lzvdyx14',
    newCaption: 'Left screen — Old flow:\nThe member is on the claims detail screen and confused about a charge. The only help option is a small “Contact Us” link at the bottom, which opens the dialer and takes them out of the app. The experience feels disconnected and frustrating.\n\nRight screen — New flow:\nOn the same claims detail screen, a persistent chat button is anchored at the bottom. When tapped, chat opens with full context already in place. A banner at the top reads: “Chatting about: Claim” The agent sees this context instantly, so the member doesn’t need to re-explain the issue.'
  },
  // Prepop data
  {
    id: 'cmoc1r4uu000d8fq1wbn7e4e2',
    newCaption: 'Screen showing the chat opening sequence.\n\nAs the chat initializes, a subtle animation reveals member data loading in — name, plan type, active claims count, and primary physician. A small line of copy reads: “We’ve pulled up your information so you don’t have to repeat yourself.”'
  },
  // Security
  {
    id: 'cmoc1r4uu000g8fq157g9flvu',
    newCaption: 'Screen showing the chat initiation flow.\n\nBefore chat opens, a clean, single-screen consent moment — not a wall of legal text. Three simple icons: a lock (“End-to-end encrypted”), a face ID (“Verified with biometrics”), and a shield (“HIPAA compliant”).\nBelow, one button: “Start Secure Chat.” Reassuring, not bureaucratic.'
  },
  // Accessibility
  {
    id: 'cmoc1r4ux000j8fq1wez9h6ll',
    newCaption: 'Two screens side by side labeled “Standard” and “Accessible.”\n\nLeft — Standard:\nDefault chat interface with standard type sizing, tap targets, and input bar.\n\nRight — Accessible:\nSame layout with larger type, bigger tap targets, and a prominent microphone icon for voice input. High contrast mode is active, with clearer distinction between member and agent messages. The structure stays the same — only scale and input options change.'
  },
  // Full Chat Flow
  {
    id: 'cmoc1r4uy000m8fq1bxo863n0',
    newCaption: 'Four screens showing the journey: a claims page with a subtle contextual chat button anchored at the bottom, a simple security consent screen with encrypted, biometric, and HIPAA indicators plus a single start button, a live chat view with full claim context, clear agent/member conversation, and document upload in the input bar, and a resolution screen with a short summary, next steps, and a quick “Was this helpful?” prompt.'
  },
  // Results
  {
    id: 'cmoc1r4uy000o8fq1p17dkbg3',
    newCaption: '50K+ interactions in 6 months, response time reduced from 12 minutes to under 2 minutes, 35% churn reduction, 40% increase in accessibility score after testing and launch, and 25% reduction in support complaints over six months.'
  }
];

async function main() {
  for (const update of captionUpdates) {
    const block = await prisma.caseStudyBlock.findUnique({
      where: { id: update.id },
    });

    if (!block || !block.content.caption) {
      console.log(`Skipping block without caption: ${update.id}`);
      continue;
    }

    const newContent = {
      ...block.content,
      caption: update.newCaption
    };

    const updated = await prisma.caseStudyBlock.update({
      where: { id: update.id },
      data: { content: newContent },
    });

    console.log(`Updated ${update.id} caption:\nOld: ${block.content.caption.substring(0, 50)}...\nNew: ${updated.content.caption.substring(0, 50)}...`);
  }
  console.log('All captions updated.');
}

main()
  .catch(e => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
