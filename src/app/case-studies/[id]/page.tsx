import PageLayout from "@/components/layout/PageLayout";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Link from "next/link";
import Button from "@/components/ui/Button";

interface CaseStudyDetailPageProps {
  params: Promise<{ id: string }>;
}

const caseStudyData = {
  id: "1",
  title: "E-commerce Mobile App Redesign",
  subtitle: "A comprehensive redesign of a fashion retail app resulting in 35% increase in conversions",
  client: "FashionRetail Co.",
  duration: "3 months",
  role: "Lead UX/UI Designer",
  category: "Mobile",
  tags: ["UX Research", "Mobile Design", "E-commerce", "Prototyping", "User Testing"],
  startDate: "January 2024",
  endDate: "March 2024",
  challenges: [
    "Low conversion rate on checkout flow (12%)",
    "High cart abandonment rate (68%)",
    "Outdated design system inconsistent with brand",
    "Confusing product navigation structure",
  ],
  solutions: [
    "Conducted 30+ user interviews to identify pain points",
    "Redesigned checkout flow with progress indicators",
    "Implemented new design system with reusable components",
    "Simplified navigation with smart categorization",
  ],
  outcomes: [
    "35% increase in conversion rate",
    "Reduced cart abandonment to 45%",
    "4.8/5 app store rating",
    "2x improvement in task completion time",
  ],
  description:
    "This project involved a complete redesign of a fashion retail mobile application " +
    "used by over 500,000 monthly active users. The goal was to modernize the user " +
    "experience, improve conversion metrics, and establish a scalable design system.",
  process: [
    {
      title: "Discovery & Research",
      description: "Conducted user interviews, competitive analysis, and usability testing to understand current pain points and opportunities.",
      imageGradient: "from-blue-500 via-indigo-500 to-purple-500",
    },
    {
      title: "Wireframing & Ideation",
      description: "Created low-fidelity wireframes exploring different interaction patterns and information architectures.",
      imageGradient: "from-purple-500 via-pink-500 to-red-500",
    },
    {
      title: "Visual Design",
      description: "Developed high-fidelity mockups and a comprehensive design system ensuring consistency across the app.",
      imageGradient: "from-red-500 via-orange-500 to-amber-500",
    },
    {
      title: "Testing & Validation",
      description: "Ran multiple rounds of user testing with prototypes to validate design decisions before development.",
      imageGradient: "from-amber-500 via-yellow-500 to-green-500",
    },
  ],
};

export default async function CaseStudyDetailPage({ params }: CaseStudyDetailPageProps) {
  const { id } = await params;

  return (
    <PageLayout title="Case Study" subtitle={`${caseStudyData.title} - Design Process & Results`}>
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-12">
          <Link
            href="/case-studies"
            className="inline-flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:underline mb-6"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Case Studies
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                {caseStudyData.title}
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                {caseStudyData.subtitle}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit
              </Button>
              <Button variant="outline">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Live Preview
              </Button>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Card className="p-4">
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Client</p>
            <p className="font-semibold text-slate-900 dark:text-white mt-1">{caseStudyData.client}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Duration</p>
            <p className="font-semibold text-slate-900 dark:text-white mt-1">{caseStudyData.duration}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Role</p>
            <p className="font-semibold text-slate-900 dark:text-white mt-1">{caseStudyData.role}</p>
          </Card>
        </div>

        {/* Skills Tags */}
        <div className="mb-12">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-4">
            Skills Used
          </h3>
          <div className="flex flex-wrap gap-2">
            {caseStudyData.tags.map((tag) => (
              <Badge key={tag} variant="indigo">{tag}</Badge>
            ))}
          </div>
        </div>

        {/* Overview */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Overview</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{caseStudyData.description}</p>
        </section>

        {/* Challenges & Solutions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                <span className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center justify-center text-xs font-bold mr-3">
                  C
                </span>
                Challenges
              </h3>
              <ul className="space-y-2">
                {caseStudyData.challenges.map((challenge, i) => (
                  <li key={i} className="flex items-start text-slate-600 dark:text-slate-400 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 mr-2 flex-shrink-0" />
                    {challenge}
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                <span className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 flex items-center justify-center text-xs font-bold mr-3">
                  S
                </span>
                Solutions
              </h3>
              <ul className="space-y-2">
                {caseStudyData.solutions.map((solution, i) => (
                  <li key={i} className="flex items-start text-slate-600 dark:text-slate-400 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 mr-2 flex-shrink-0" />
                    {solution}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>

        {/* Outcomes */}
        <Card className="mb-12 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10">
          <div className="p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Key Outcomes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {caseStudyData.outcomes.map((outcome, i) => (
                <div key={i} className="flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-slate-700 dark:text-slate-300">{outcome}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Design Process */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Design Process</h2>
          <div className="space-y-8">
            {caseStudyData.process.map((step, i) => (
              <Card key={i} hoverable className="overflow-hidden">
                <div className={`h-48 bg-gradient-to-br ${step.imageGradient}`} />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      <span className="text-indigo-600 dark:text-indigo-400 mr-2">{String(i + 1).padStart(2, "0")}</span>
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">{step.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Footer CTA */}
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Interested in working together? Let&apos;s create something amazing.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:shadow-lg hover:scale-105 transition-all"
          >
            Get in Touch
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
