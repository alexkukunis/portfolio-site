import PageLayout from "@/components/layout/PageLayout";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

const experiences = [
  {
    company: "TechCorp Inc.",
    role: "Senior Product Designer",
    period: "2022 — Present",
    description: "Leading design for core product offerings, managing design system, and mentoring junior designers.",
  },
  {
    company: "StartupHub",
    role: "Product Designer",
    period: "2020 — 2022",
    description: "Designed user experiences for fintech product from scratch, conducted user research, and collaborated with engineering.",
  },
  {
    company: "Design Studio Agency",
    role: "UX/UI Designer",
    period: "2019 — 2020",
    description: "Worked on diverse client projects including mobile apps, web applications, and brand identity design.",
  },
];

const education = [
  {
    institution: "Rhode Island School of Design",
    degree: "BFA in Interaction Design",
    period: "2015 — 2019",
  },
  {
    institution: "General Assembly",
    degree: "UX Design Bootcamp",
    period: "2019",
  },
];

const skills = [
  { icon: "search", title: "User Research", items: ["User Interviews", "Usability Testing", "Journey Mapping", "Competitive Analysis"] },
  { icon: "palette", title: "UI Design", items: ["Visual Design", "High-fidelity Mockups", "Mobile & Web", "Accessibility"] },
  { icon: "structure", title: "Design Systems", items: ["Component Libraries", "Design Tokens", "Documentation", "Patterns"] },
  { icon: "touch_app", title: "Prototyping", items: ["Interactive Prototypes", "Design Validation", "Micro-interactions", "Animation"] },
];

export default function AboutPage() {
  return (
    <PageLayout title="About" subtitle="My journey, experience & approach">
      <div className="max-w-6xl mx-auto">
        {/* Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2">
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              I&apos;m a senior Product Designer with over 5 years of experience transforming complex problems
              into elegant, user-centered solutions. My work spans mobile apps, web platforms,
              and design systems for companies ranging from startups to enterprises.
            </p>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              I believe great design is invisible — it just works. My approach combines deep user research,
              strategic thinking, and beautiful execution to create products that users love and
              businesses grow from. When I&apos;m not designing, you&apos;ll find me exploring new tools,
              writing about design, or enjoying a well-crafted cup of coffee.
            </p>
          </div>
          <Card className="aspect-square flex items-center justify-center">
            <svg className="w-32 h-32 text-slate-300 dark:text-slate-700" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </Card>
        </div>

        {/* Expertise */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Areas of Expertise</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((skill, i) => (
              <Card key={i} className="p-6">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-slate-700 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {skill.icon === "search" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />}
                    {skill.icon === "palette" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />}
                    {skill.icon === "structure" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />}
                    {skill.icon === "touch_app" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />}
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-3">{skill.title}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {skill.items.map((item) => (
                    <span key={item} className="px-2 py-1 text-xs font-medium bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md">
                      {item}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Experience</h2>
          <div className="space-y-4">
            {experiences.map((exp, i) => (
              <Card key={i} className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">{exp.role}</h3>
                    <p className="text-slate-600 dark:text-slate-400">{exp.company}</p>
                  </div>
                  <Badge variant="indigo" size="md">{exp.period}</Badge>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-4">{exp.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Education</h2>
          <div className="space-y-4">
            {education.map((edu, i) => (
              <Card key={i} className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{edu.degree}</h3>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-slate-600 dark:text-slate-400">{edu.institution}</p>
                  <Badge variant="default" size="md">{edu.period}</Badge>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Tools */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Tools & Technologies</h2>
          <div className="flex flex-wrap gap-2">
            {[
              "Figma", "Sketch", "Adobe Creative Suite", "Principle", "ProtoPie",
              "Notion", "Linear", "Jira", "Miro", "Whimsical",
              "VS Code", "HTML/CSS", "React", "Webflow", "Tailwind CSS", "Git"
            ].map((tool) => (
              <Badge key={tool} size="md" variant="default">
                {tool}
              </Badge>
            ))}
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
