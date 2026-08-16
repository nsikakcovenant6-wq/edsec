import Link from "next/link";

const projects = [
  {
    title: "EDSEC Learning Platform",
    category: "Full-Stack Development",
    description:
      "A modern learning platform with course management, student accounts, applications, and an administrative system.",
    tech: ["Next.js", "TypeScript", "PostgreSQL"],
    accent: "blue",
    icon: "⌘",
  },
  {
    title: "Secure Network Monitor",
    category: "Cybersecurity",
    description:
      "A practical cybersecurity project focused on monitoring network activity and identifying suspicious behaviour.",
    tech: ["Networking", "Security", "Linux"],
    accent: "violet",
    icon: "◈",
  },
  {
    title: "Student Finance Dashboard",
    category: "Data Analysis",
    description:
      "An interactive dashboard designed to turn financial information into useful visual insights.",
    tech: ["Python", "SQL", "Data"],
    accent: "cyan",
    icon: "▥",
  },
  {
    title: "Modern Brand Experience",
    category: "UI/UX Design",
    description:
      "A complete digital interface created around user experience, accessibility, visual hierarchy, and responsive design.",
    tech: ["Figma", "UI/UX", "Prototyping"],
    accent: "pink",
    icon: "✦",
  },
  {
    title: "Small Business Network",
    category: "IT Support & Networking",
    description:
      "A practical network design showing how computers, routers, switches, and shared resources can work together.",
    tech: ["Networking", "Windows", "Hardware"],
    accent: "emerald",
    icon: "⌁",
  },
  {
    title: "Digital Campaign System",
    category: "Digital Marketing",
    description:
      "A digital marketing project covering campaign planning, audience targeting, content strategy, and performance tracking.",
    tech: ["Marketing", "Analytics", "Content"],
    accent: "amber",
    icon: "↗",
  },
];

const accentStyles: Record<string, string> = {
  blue: "from-blue-600/30 via-blue-500/10 to-slate-950",
  violet: "from-violet-600/30 via-violet-500/10 to-slate-950",
  cyan: "from-cyan-600/30 via-cyan-500/10 to-slate-950",
  pink: "from-pink-600/30 via-pink-500/10 to-slate-950",
  emerald: "from-emerald-600/30 via-emerald-500/10 to-slate-950",
  amber: "from-amber-500/30 via-amber-500/10 to-slate-950",
};

export default function StudentProjectsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_30%,rgba(37,99,235,0.22),transparent_30%),radial-gradient(circle_at_85%_70%,rgba(14,165,233,0.15),transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-sm font-medium text-blue-300">
              <span className="h-2 w-2 rounded-full bg-blue-400" />
              Student Projects
            </div>

            <h1 className="mt-7 text-5xl font-bold tracking-[-0.04em] text-white sm:text-6xl">
              Learning becomes
              <span className="block text-blue-400">real when you build.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              Explore practical projects created through EDSEC training.
              Students learn by solving problems, building useful products,
              and turning their knowledge into real-world experience.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/courses"
                className="rounded-xl bg-blue-600 px-6 py-3.5 text-center font-semibold text-white transition hover:bg-blue-500"
              >
                Explore Courses
              </Link>

              <Link
                href="/apply"
                className="rounded-xl border border-slate-700 px-6 py-3.5 text-center font-semibold text-white transition hover:bg-white/5"
              >
                Start Learning
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                Build your portfolio
              </p>

              <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                From classroom knowledge to practical work.
              </h2>
            </div>

            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Every project is an opportunity to practise what you have
              learned, solve a real problem, collaborate with others, and
              create something you can confidently show to the world.
            </p>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                Project showcase
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                What students can build
              </h2>
            </div>

            <p className="max-w-md text-sm leading-6 text-slate-500">
              Projects span development, cybersecurity, design, data,
              networking, and digital business.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <article
                key={project.title}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100/40"
              >
                {/* CSS GENERATED VISUAL */}
                <div
                  className={`relative h-56 overflow-hidden bg-linear-to-br ${accentStyles[project.accent]}`}
                >
                  <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full border border-white/10" />
                  <div className="absolute -bottom-20 -left-10 h-48 w-48 rounded-full border border-white/10" />

                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute left-8 top-10 h-px w-32 bg-white" />
                    <div className="absolute left-8 top-20 h-px w-20 bg-white" />
                    <div className="absolute left-8 top-30 h-px w-28 bg-white" />
                  </div>

                  <div className="absolute inset-0 grid place-items-center">
                    <div className="relative grid h-24 w-24 place-items-center rounded-3xl border border-white/20 bg-white/10 text-4xl text-white shadow-2xl backdrop-blur-md">
                      {project.icon}

                      <div className="absolute -right-3 -top-3 h-5 w-5 rounded-full border border-white/30 bg-white/20" />
                      <div className="absolute -bottom-2 -left-3 h-3 w-3 rounded-full bg-white/40" />
                    </div>
                  </div>

                  <div className="absolute bottom-5 left-5 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
                    {project.category}
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-7">
                  <h3 className="text-xl font-semibold text-slate-950">
                    {project.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {project.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.tech.map((technology) => (
                      <span
                        key={technology}
                        className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600"
                      >
                        {technology}
                      </span>
                    ))}
                  </div>

                  <div className="mt-7 flex items-center justify-between border-t border-slate-100 pt-5">
                    <span className="text-sm font-medium text-slate-400">
                      Student showcase
                    </span>

                    <span className="font-semibold text-blue-600 transition group-hover:translate-x-1">
                      View project →
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-4xl px-5 text-center lg:px-8">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-2xl font-bold text-blue-600">
            ✦
          </div>

          <h2 className="mt-7 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Build something worth showing.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Join EDSEC and turn the skills you learn into practical projects,
            experience, and a portfolio you can be proud of.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/courses"
              className="rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white transition hover:bg-blue-700"
            >
              Explore Courses
            </Link>

            <Link
              href="/contact"
              className="rounded-xl border border-slate-300 px-7 py-3.5 font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              Contact EDSEC
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}