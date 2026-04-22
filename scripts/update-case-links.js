const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function updateLinks() {
  // Paytile hero
  await prisma.caseStudyBlock.update({
    where: { id: 'cmo929t3g0000iaq1gz39dujm' },
    data: {
      content: {
        ... (await prisma.caseStudyBlock.findUnique({ where: { id: 'cmo929t3g0000iaq1gz39dujm' } })).content,
        links: [{ label: 'Website', url: 'paytile.com', icon: 'globe' }]
      }
    }
  });
  console.log('Updated Paytile hero');

  // Paytile links block
  await prisma.caseStudyBlock.update({
    where: { id: 'cmo929t3h0001iaq16ahcmfr0' },
    data: {
      content: {
        ... (await prisma.caseStudyBlock.findUnique({ where: { id: 'cmo929t3h0001iaq16ahcmfr0' } })).content,
        links: [{ label: 'Website', url: 'paytile.com', icon: 'globe' }]
      }
    }
  });
  console.log('Updated Paytile links block');

  // H&M hero
  await prisma.caseStudyBlock.update({
    where: { id: 'cmo9281jq00006kq187nu71gf' },
    data: {
      content: {
        ... (await prisma.caseStudyBlock.findUnique({ where: { id: 'cmo9281jq00006kq187nu71gf' } })).content,
        links: [
          { label: 'Website', url: 'https://hm.com', icon: 'globe' },
          { label: 'iOS App', url: 'https://apps.apple.com/us/app/h-m/id834465911' },
          { label: 'Android App', url: 'https://play.google.com/store/apps/details?id=com.hm.goe&hl=en_US' }
        ]
      }
    }
  });
  console.log('Updated H&M hero');

  // Sydney Health hero
  await prisma.caseStudyBlock.update({
    where: { id: 'cmo9283o900006zq1548qb34w' },
    data: {
      content: {
        ... (await prisma.caseStudyBlock.findUnique({ where: { id: 'cmo9283o900006zq1548qb34w' } })).content,
        links: [
          { label: 'Website', url: 'https://www.sydneyhealth.com/', icon: 'globe' },
          { label: 'iOS App', url: 'https://apps.apple.com/us/app/sydney-health/id1463423283' },
          { label: 'Android App', url: 'https://play.google.com/store/apps/details?id=com.anthem.sydney&hl=en_US&pli=1' }
        ]
      }
    }
  });
  console.log('Updated Sydney Health hero');

  // HM links block
  await prisma.caseStudyBlock.update({
    where: { id: 'cmo9281jq00016kq1dzhs1t1v' },
    data: {
      content: {
        ... (await prisma.caseStudyBlock.findUnique({ where: { id: 'cmo9281jq00016kq1dzhs1t1v' } })).content,
        links: [{ label: 'Website', url: 'https://hm.com', icon: 'globe' }]
      }
    }
  });
  console.log('Updated HM links block');

  await prisma.$disconnect();
}

updateLinks().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
  await pool.end();
});