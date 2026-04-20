import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { RenderBlocks } from '@/components/case-study/Blocks';
import { getCaseStudyByIdOrSlug } from '@/lib/crud';

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

  const cookieStore = await cookies();
  const isAdmin = cookieStore.get('admin_auth')?.value === 'true';
  if (!study.published && !isAdmin) return notFound();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <article className="max-w-4xl mx-auto px-6 pt-12 pb-24">
          {!study.published && isAdmin ? (
            <div className="mb-6 rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm text-orange-300">
              Draft — not visible to the public.
            </div>
          ) : null}
          <RenderBlocks blocks={study.blocks as any} />
        </article>
      </main>
      <Footer />
    </div>
  );
}
