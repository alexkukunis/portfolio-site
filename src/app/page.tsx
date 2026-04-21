import PageLayout from "@/components/layout/PageLayout";
import { getCaseStudies } from "@/lib/crud";

export const revalidate = 60;

export default async function Home() {
  const studies = await getCaseStudies({ publishedOnly: true });

  return (
    <PageLayout
      title=""
      subtitle=""
    >
      <div className="max-w-4xl mx-auto pt-24 pb-32">
        {/* Intro */}
        <div className="space-y-5 mb-20">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
            Hello, I'm Alex — a product designer.
          </h1>
          <p className="text-lg text-text-muted max-w-2xl leading-relaxed">
            I design intuitive digital experiences that balance user needs with business goals.
            Currently focused on simplifying complex workflows into clean, human-centered interfaces.
          </p>
        </div>

        {/* Case Studies */}
        {studies.length > 0 && (
          <section>
            <h2 className="text-sm font-medium uppercase tracking-wider text-text-muted mb-8">
              Case studies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {studies.map((study) => (
                <a
                  key={study.id}
                  href={`/case-studies/${study.slug}`}
                  className="group block rounded-2xl border border-border bg-surface overflow-hidden hover:border-accent/60 transition"
                >
                  {/* Feature image */}
                  {study.coverImageUrl ? (
                    <div className="aspect-[16/9] bg-background overflow-hidden">
                      <img
                        src={study.coverImageUrl}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/9] bg-gradient-to-br from-[#1a1a2e] to-[#0f3460] flex items-center justify-center border-b border-border/50">
                      <svg
                        width="40" height="40" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="1"
                        className="text-text-muted/30"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      {[study.company, study.year, study.duration]
                        .filter(Boolean)
                        .map((t, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-0.5 rounded-full border border-border bg-background text-xs text-text-muted"
                          >
                            {t}
                          </span>
                        ))}
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-accent transition">
                      {study.title}
                    </h3>
                    <p className="text-sm text-text-muted line-clamp-2">
                      {study.summary}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </PageLayout>
  );
}
