import PageLayout from "@/components/layout/PageLayout";
import FilterableStudies from "@/components/FilterableStudies";
import CaseStudyCard from "@/components/CaseStudyCard";
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
          <h1 className="h1-hero text-4xl lg:text-5xl font-bold text-foreground leading-tight">
            {["Hello, ", "I'm ", "Alex ", "— ", "a ", "product ", "designer."].map((word, index) => (
              <span
                key={index}
                className="hero-word"
                style={{ animationDelay: `${index * 0.12}s` } as React.CSSProperties}
              >
                {word}
              </span>
            ))}
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
            <FilterableStudies 
              studies={studies}
              lockedSlugs={['dealer-tire-storefront-redesign', 'paytile-location-payments', 'stmble-dating-app']}
            />
          </section>
        )}
      </div>
    </PageLayout>
  );
}
