/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

const projects = [
  {
    title: "EDSEC Learning Platform",
    category: "Full-Stack Development",
    description:
      "A modern learning platform with course management, student accounts, applications, and an administrative system.",
    tech: ["Next.js", "TypeScript", "PostgreSQL"],
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Secure Network Monitor",
    category: "Cybersecurity",
    description:
      "A practical cybersecurity project focused on monitoring network activity and identifying suspicious behaviour.",
    tech: ["Networking", "Security", "Linux"],
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Student Finance Dashboard",
    category: "Data Analysis",
    description:
      "An interactive dashboard designed to turn financial information into useful visual insights.",
    tech: ["Python", "SQL", "Data"],
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Modern Brand Experience",
    category: "UI/UX Design",
    description:
      "A complete digital interface created around user experience, accessibility, visual hierarchy, and responsive design.",
    tech: ["Figma", "UI/UX", "Prototyping"],
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Small Business Network",
    category: "IT Support & Networking",
    description:
      "A practical network design showing how computers, routers, switches, and shared resources can work together.",
    tech: ["Networking", "Windows", "Hardware"],
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Digital Campaign System",
    category: "Digital Marketing",
    description:
      "A digital marketing project covering campaign planning, audience targeting, content strategy, and performance tracking.",
    tech: ["Marketing", "Analytics", "Content"],
    image:
      "https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&w=1400&q=80",
  },
];

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
              <span className="block text-blue-400">
                real when you build.
              </span>
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

          {/* PROJECT GRID */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <article
                key={project.title}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100/40"
              >
                {/* PROJECT IMAGE */}
                <div className="relative h-56 overflow-hidden bg-slate-200">
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110"
                  />

                  {/* IMAGE OVERLAY */}
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/10 to-transparent" />

                  {/* CATEGORY */}
                  <div className="absolute bottom-5 left-5">
                    <span className="rounded-full border border-white/20 bg-slate-950/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                      {project.category}
                    </span>
                  </div>

                  {/* EXPLORE */}
                  <div className="absolute right-5 top-5 translate-y-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white opacity-0 backdrop-blur-md transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    Explore
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

                  {/* TECHNOLOGIES */}
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

                  {/* FOOTER */}
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

      {/* PROJECT EXPERIENCE */}
      <section className="border-y border-slate-100 bg-white py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                Learn by doing
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                Build skills through real projects.
              </h2>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7">
              <div className="text-3xl font-bold text-blue-600">
                01
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-950">
                Learn
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                Understand the tools, concepts and technologies required to
                solve practical problems.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7">
              <div className="text-3xl font-bold text-blue-600">
                02
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-950">
                Build
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                Turn your knowledge into useful applications, designs,
                dashboards, networks and digital solutions.
              </p>
            </div>
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