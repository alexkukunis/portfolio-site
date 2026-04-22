import { cookies } from 'next/headers';
import Link from 'next/link';
import PageLayout from '@/components/layout/PageLayout';
import { getCaseStudies } from '@/lib/crud';
import { ImagePlaceholder } from '@/lib/blocks/components/shared';
import UnlockModal from '@/components/UnlockModal';
import FilterableStudies from '@/components/FilterableStudies';
import CaseStudyCard from '@/components/CaseStudyCard';

export const metadata = {
  title: 'Case Studies · Portfolio',
  description: 'Selected product design case studies.',
};

export default async function CaseStudiesPage() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get('admin_auth')?.value === 'true';
  const caseStudies = await getCaseStudies({ publishedOnly: !isAdmin });

  return (
    <>
      <UnlockModal />
      <PageLayout title="Case Studies" subtitle="Selected product design work.">
        <div className="max-w-6xl mx-auto -mt-12 md:-mt-20 pt-0">
          {caseStudies.length === 0 ? (
            <div className="py-24 text-center rounded-2xl border border-dashed border-border">
              <p className="text-text-muted">No case studies yet.</p>
            </div>
          ) : (
            <FilterableStudies
              studies={caseStudies}
              lockedSlugs={['dealer-tire-storefront-redesign', 'paytile-location-payments', 'stmble-dating-app']}
            />
          )}
        </div>
      </PageLayout>
    </>
  );
}
