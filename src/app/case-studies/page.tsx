import PageLayout from "@/components/layout/PageLayout";
import Card from "@/components/ui/Card";
import Link from "next/link";

export const metadata = {
  title: "Case Studies - Portfolio",
  description: "Portfolio showcasing UX/UI design work and case studies",
};

const caseStudies = [
  {
    id: "1",
    title: "E-commerce Mobile App",
    excerpt: "Redesigning the shopping experience for a fashion retailer with 35% conversion increase",
    category: "Mobile App",
    tags: ["UX Research", "Mobile Design", "E-commerce"],
    gradient: "from-indigo-500 to-purple-600",
    date: "Mar 2024",
  },
  {
    id: "2",
    title: "SaaS Analytics Dashboard",
    excerpt: "Enterprise analytics platform simplifying data visualization for marketing teams",
    category: "Web Application",
    tags: ["Dashboard", "SaaS", "Data Visualization"],
    gradient: "from-emerald-500 to-teal-600",
    date: "Feb 2024",
  },
  {
    id: "3",
    title: "Healthcare Patient Portal",
    excerpt: "HIPAA-compliant patient management system improving clinic workflow efficiency",
    category: "Web Application",
    tags: ["Healthcare", "Accessibility", "System Design"],
    gradient: "from-amber-500 to-orange-600",
    date: "Jan 2024",
  },
  {
    id: "4",
    title: "FinTech Banking App",
    excerpt: "Modern banking experience with intuitive money management features",
    category: "Mobile App",
    tags: ["Mobile Design", "FinTech", "UI Design"],
    gradient: "from-pink-500 to-rose-600",
    date: "Dec 2023",
  },
];

const categories = ["All", "Mobile App", "Web Application", "Design System"];

export default function CaseStudiesPage() {
  return (
    <PageLayout title="Case Studies" subtitle="A curation of design projects">
      <div className="max-w-6xl mx-auto">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              className="px-4 py-2 text-sm font-medium rounded-xl transition-colors bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
            >
              {category}
            </button>
          ))}
        </div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {caseStudies.map((study) => (
            <Link href={`/case-studies/${study.id}`} key={study.id}>
              <Card hoverable className="group overflow-hidden">
                <div
                  className={`aspect-video bg-gradient-to-br ${study.gradient} transition-opacity`}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-2 1m0 4l2 1m-2-5l2 1m0-4l2 1m-2-5l2 1m-2-5l2 1m-2-5l-2 1m0 11l2 1m-2-4l2 1m-2-5l2 1m0-4l2 1m-2-5l2 1m-2-5l-2 1m0 11v4l-2 1m2-1l2 1m-2-4l2 1m-2-5l-2 1m0-4l-2 1m2-1l-2-1m2 4l2 1m-2-5l-2 1m0-4l-2 1m2-1l-2-1m2 4l-2 1m-2-5l2 1m0-4l2 1m-2-5l2 1m-2-5l-2 1m0 11l2 1m-2-4l-2 1m2-1l-2-1" />
                    </svg>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      {study.category}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">{study.date}</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                    {study.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                    {study.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {study.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs font-medium bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/case-studies/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Case Study
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
