import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { RenderBlocks } from '@/components/case-study/Blocks';
import { getCaseStudies, getCaseStudyByIdOrSlug } from '@/lib/crud';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const study = await getCaseStudyByIdOrSlug(id);
  if (!study) return { title: 'Case study not found' };
  return {
    title: `${study.title} · Case Study`,
    description: study.summary,
    robots: { index: false, follow: true },
    openGraph: {
      title: study.title,
      description: study.summary,
      images: study.coverImageUrl ? [study.coverImageUrl] : undefined,
    },
  };
}

export default async function CaseStudyDetailPage({ params }: PageProps) {
  const { id } = await params;
  const study = await getCaseStudyByIdOrSlug(id);
  if (!study) return notFound();

  // Canonicalize: if looked up by id but we have a slug, redirect.
  if (study.slug && id !== study.slug) {
    redirect(`/case-studies/${study.slug}`);
  }

  const allStudies = await getCaseStudies({ publishedOnly: true });
  const currentIndex = allStudies.findIndex(s => s.slug === study.slug);
  const prevStudy = currentIndex > 0 ? allStudies[currentIndex - 1] : null;
  const nextStudy = currentIndex < allStudies.length - 1 ? allStudies[currentIndex + 1] : null;

  const cookieStore = await cookies();
  const isAdmin = cookieStore.get('admin_auth')?.value === 'true';
  if (!study.published && !isAdmin) return notFound();

  const isDraft = !study.published && isAdmin;

  const lockedSlugs = ['dealer-tire-storefront-redesign', 'paytile-location-payments', 'stmble-dating-app'];
  const pwCookie = cookieStore.get(`pw_${study.slug}`)?.value;
  if (lockedSlugs.includes(study.slug) && pwCookie !== 'alex2026') {
    redirect(`/case-studies?unlock=${study.slug}`);
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <article className="max-w-6xl mx-auto px-6 lg:px-8 pt-12 pb-12">
          {isDraft ? (
            <div className="mb-6 rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm text-orange-300">
              Draft — not visible to the public.
            </div>
          ) : null}
          <RenderBlocks blocks={study.blocks as any} />
          {/* Next/Prev Navigation */}
          {(prevStudy || nextStudy) && (
            <nav className="mt-20 pt-12 border-t border-border/30 bg-surface/80 backdrop-blur-md rounded-2xl p-6 flex flex-col lg:flex-row gap-4 justify-center lg:justify-between items-center max-w-4xl mx-auto">
              {prevStudy && (
                <Link
                  href={`/case-studies/${prevStudy.slug}`}
                  className="group flex items-center gap-2 px-6 py-3 rounded-full border border-border/50 bg-surface/90 hover:border-accent hover:bg-accent/10 transition-colors duration-200 text-sm font-medium text-foreground/90 hover:text-accent min-w-[120px] text-center"
                  aria-label={`Previous: ${prevStudy.title}`}
                >
                  <svg className="w-4 h-4 text-text-muted/70 group-hover:text-accent flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </Link>
              )}
              {nextStudy && (
                <Link
                  href={`/case-studies/${nextStudy.slug}`}
                  className="group flex items-center gap-2 px-6 py-3 rounded-full border border-border/50 bg-surface/90 hover:border-accent hover:bg-accent/10 transition-colors duration-200 text-sm font-medium text-foreground/90 hover:text-accent min-w-[120px] justify-center"
                  aria-label={`Next: ${nextStudy.title}`}
                >
                  Next
                  <svg className="w-4 h-4 text-text-muted/70 group-hover:text-accent flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </nav>
          )}
        </article>
      </main>
      <Footer />
    </div>
  );
}
