import FilterableStudies from './FilterableStudies';
import { getCaseStudies } from '@/lib/crud';
import type { CaseStudy } from '@prisma/client';

export const dynamic = 'force-dynamic';

export default async function FeaturedStudies() {
  const studies = await getCaseStudies({ publishedOnly: true });

  if (studies.length === 0) {
    return null;
  }

  return (
    <FilterableStudies
      studies={studies as CaseStudy[]}
      lockedSlugs={['dealer-tire-storefront-redesign', 'paytile-location-payments', 'stmble-dating-app']}
    />
  );
}
