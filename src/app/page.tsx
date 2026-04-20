import PageLayout from "@/components/layout/PageLayout";
import Card from "@/components/ui/Card";

export default function Home() {
  return (
    <PageLayout
      title="Product Designer"
      subtitle="UX/UI · Design Systems · User Research"
    >
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-tight">
              Crafting digital
              <br />
              <span className="text-slate-500">experiences that matter</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg">
              Senior Product Designer with 5+ years of experience transforming complex problems
              into elegant, user-centered solutions. Specializing in design systems,
              mobile apps, and SaaS platforms.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href="/case-studies"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all"
              >
                View Case Studies
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-700 dark:text-slate-300 hover:border-slate-900 dark:hover:border-white transition-all"
              >
                Get in Touch
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
              <svg className="w-48 h-48 text-slate-300 dark:text-slate-700" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </div>
        </section>

        {/* Featured Case Studies */}
        <section className="mb-24">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Selected Work
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                A curation of my design projects
              </p>
            </div>
            <a
              href="/case-studies"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              All projects
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "E-commerce Mobile App",
                excerpt: "Redesigning the shopping experience for a fashion retailer with 35% conversion increase",
                tags: ["Mobile", "E-commerce", "UX Research"],
                gradient: "from-indigo-500 to-purple-600",
              },
              {
                title: "SaaS Analytics Dashboard",
                excerpt: "Enterprise analytics platform simplifying data visualization for marketing teams",
                tags: ["Dashboard", "SaaS", "Data Viz"],
                gradient: "from-emerald-500 to-teal-600",
              },
              {
                title: "Healthcare Patient Portal",
                excerpt: "HIPAA-compliant patient management system improving clinic workflow",
                tags: ["Healthcare", "Web", "Accessibility"],
                gradient: "from-amber-500 to-orange-600",
              },
            ].map((project, index) => (
              <Card key={index} hoverable className="group overflow-hidden">
                <div
                  className={`aspect-video bg-gradient-to-br ${project.gradient} opacity-90 group-hover:opacity-100 transition-opacity`}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                      <path d={project.tags[0] === "Mobile" ? "M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" : project.tags[0] === "Dashboard" ? "M3 3h18v18H3V3zm2 2v14h14V5H5zm3 3h2v2H8V8zm4 0h2v2h-2V8zm-4 4h2v2H8v-2zm4 0h2v2h-2v-2z" : "M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"} />
                    </svg>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                    {project.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
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
            ))}
          </div>
        </section>

        {/* Expertise */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Expertise
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Areas of focus in my design practice
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "search",
                title: "User Research",
                description: "Interviews, surveys, usability testing, journey mapping",
              },
              {
                icon: "palette",
                title: "UI Design",
                description: "Visual design, high-fidelity mockups, pixel-perfect implementations",
              },
              {
                icon: "structure",
                title: "Design Systems",
                description: "Component libraries, design tokens, scalability patterns",
              },
              {
                icon: "touch_app",
                title: "Prototyping",
                description: "Interactive prototypes, design validation, micro-interactions",
              },
            ].map((skill, i) => (
              <Card key={i} className="p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <svg className="w-6 h-6 text-slate-700 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {skill.icon === "search" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />}
                    {skill.icon === "palette" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />}
                    {skill.icon === "structure" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />}
                    {skill.icon === "touch_app" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />}
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{skill.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{skill.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Tools & Skills
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Technologies and methods I work with
            </p>
          </div>
          <Card className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Design</h3>
                <div className="space-y-4">
                  {[
                    { name: "User Research", level: 90 },
                    { name: "Wireframing & Prototyping", level: 95 },
                    { name: "Visual Design", level: 88 },
                    { name: "Design Systems", level: 85 },
                    { name: "Interaction Design", level: 82 },
                  ].map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-slate-700 dark:text-slate-300">{skill.name}</span>
                        <span className="text-slate-500">{skill.level}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-slate-900 dark:bg-white rounded-full transition-all duration-500"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Software</h3>
                <div className="flex flex-wrap gap-2">
                  {["Figma", "Sketch", "Adobe Creative Suite", "Principle", "ProtoPie", "Notion", "Linear", "Jira", "Miro", "Whimsical", "VS Code", "HTML/CSS", "React", "Webflow"].map((tool) => (
                    <span
                      key={tool}
                      className="px-3 py-2 text-sm font-medium bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </PageLayout>
  );
}
