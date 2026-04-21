import PageLayout from "@/components/layout/PageLayout";

export default function AboutPage() {
  return (
    <PageLayout title="About" subtitle="My journey, experience & approach">
      <div className="max-w-3xl -mt-24 md:-mt-32">
        <p className="text-lg text-muted leading-relaxed">
          I&apos;m a senior Product Designer with over 8 years of experience transforming complex problems
          into elegant, user-centered solutions across fintech, retail, and health. My work spans mobile apps,
          web platforms, and design systems for companies ranging from startups to enterprises.
        </p>
        <p className="text-lg text-muted leading-relaxed mt-4">
          I believe great design is invisible — it just works. My approach combines deep user research,
          strategic thinking, and beautiful execution to create products that users love and
          businesses grow from. When I&apos;m not designing, you&apos;ll find me exploring new tools,
          writing about design, or enjoying a well-crafted cup of coffee.
        </p>
      </div>
    </PageLayout>
  );
}
