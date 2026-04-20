import { cookies } from 'next/headers';
import Link from 'next/link';
import PageLayout from '@/components/layout/PageLayout';
import { getCaseStudies } from '@/lib/crud';
import { ImagePlaceholder } from '@/lib/blocks/components/shared';

export const metadata = {
  title: 'Case Studies · Portfolio',
  description: 'Selected product design case studies.',
};

export default async function CaseStudiesPage() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get('admin_auth')?.value === 'true';
  const caseStudies = await getCaseStudies({ publishedOnly: !isAdmin });

  return (
    <PageLayout title="Case Studies" subtitle="Selected product design work.">
      <div className="max-w-6xl mx-auto">
        {caseStudies.length === 0 ? (
          <div className="py-24 text-center rounded-2xl border border-dashed border-border">
            <p className="text-text-muted">No case studies yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {caseStudies.map((study) => (
              <Link
                href={`/case-studies/${study.slug ?? study.id}`}
                key={study.id}
                className="group rounded-2xl border border-border bg-surface overflow-hidden hover:border-accent/60 transition"
              >
                <div className="aspect-[16/9] bg-background">
                  {study.coverImageUrl || study.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={study.coverImageUrl ?? study.imageUrl ?? ''}
                      alt={study.title}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImagePlaceholder label="Cover image" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {!study.published ? (
                      <span className="px-2 py-0.5 rounded-full border border-orange-500/40 bg-orange-500/10 text-xs text-orange-300">Draft</span>
                    ) : null}
                    {[study.role, study.company, study.year].filter(Boolean).map((pill, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-full border border-border text-xs text-text-muted">{pill}</span>
                    ))}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{study.title}</h3>
                  <p className="text-text-muted text-sm line-clamp-2">{study.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
