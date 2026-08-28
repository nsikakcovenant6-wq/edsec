/* eslint-disable @next/next/no-img-element */

import Link from "next/link";

const courses = [
  {
    title: "Full-Stack Web Development",
    slug: "full-stack-web-development",
    description:
      "Learn to build modern websites and complete web applications from frontend to backend.",
    image:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1400&q=85",
    duration: "6 Months",
    level: "Beginner to Advanced",
    category: "Development",
  },
  {
    title: "Cybersecurity",
    slug: "cybersecurity",
    description:
      "Build practical cybersecurity skills including security fundamentals, networking, threats, and protection.",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=85",
    duration: "6 Months",
    level: "Beginner to Intermediate",
    category: "Technology",
  },
  {
    title: "Graphic Design",
    slug: "graphic-design",
    description:
      "Learn professional graphic design, branding, digital graphics, and visual communication.",
    image:
      "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1400&q=85",
    duration: "3 Months",
    level: "Beginner to Advanced",
    category: "Creative",
  },
  {
    title: "Data Analysis",
    slug: "data-analysis",
    description:
      "Learn how to transform raw data into useful insights using modern data analysis tools.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=85",
    duration: "4 Months",
    level: "Beginner to Intermediate",
    category: "Data",
  },
  {
    title: "Digital Marketing",
    slug: "digital-marketing",
    description:
      "Learn modern digital marketing strategies, social media, advertising, content, and analytics.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=85",
    duration: "3 Months",
    level: "Beginner",
    category: "Business",
  },
  {
    title: "IT Support & Networking",
    slug: "it-support-networking",
    description:
      "Develop practical skills in computer troubleshooting, networking, systems, and IT support.",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=85",
    duration: "4 Months",
    level: "Beginner to Intermediate",
    category: "IT",
  },
  {
    title: "UI/UX Design",
    slug: "ui-ux-design",
    description:
      "Learn how to design beautiful, accessible, and user-friendly digital experiences.",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1400&q=85",
    duration: "3 Months",
    level: "Beginner to Advanced",
    category: "Design",
  },
  {
    title: "Microsoft Office Professional",
    slug: "microsoft-office-professional",
    description:
      "Master Word, Excel, PowerPoint and essential productivity tools for school and work.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=85",
    duration: "2 Months",
    level: "Beginner to Advanced",
    category: "Productivity",
  },
];

export default function CoursesPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950 px-6 py-24 text-white">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
              EDSEC Computer Training
            </p>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Learn skills that move your future forward.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Practical technology training designed to help students,
              professionals, and aspiring technology experts build skills they
              can actually use.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/apply"
                className="rounded-full bg-cyan-500 px-6 py-3 font-semibold text-white transition hover:bg-cyan-400"
              >
                Apply Now
              </Link>

              <a
                href="#courses"
                className="rounded-full border border-white/20 px-6 py-3 font-semibold transition hover:bg-white/10"
              >
                Explore Courses
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* COURSES */}
      <section id="courses" className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600">
              Our Programs
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Choose a course and start building.
            </h2>

            <p className="mt-4 max-w-2xl text-slate-600">
              Explore practical courses designed around real-world skills,
              projects, and career development.
            </p>
          </div>

          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, index) => (
              <article
                key={course.slug}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:border-cyan-200 hover:shadow-2xl hover:shadow-cyan-100/40"
              >
                <Link href={`/courses/${course.slug}`}>
                  {/* COURSE IMAGE */}
                  <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                    <img
                      src={course.image}
                      alt={`${course.title} course`}
                      loading={index === 0 ? "eager" : "lazy"}
                      fetchPriority={index === 0 ? "high" : "auto"}
                      decoding="async"
                      className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110"
                    />

                    {/* IMAGE OVERLAY */}
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-transparent to-transparent opacity-70" />

                    {/* CATEGORY */}
                    <div className="absolute left-4 top-4">
                      <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-900 shadow-sm">
                        {course.category}
                      </span>
                    </div>

                    {/* VIEW */}
                    <div className="absolute bottom-4 right-4 translate-y-2 rounded-full bg-cyan-500 px-4 py-2 text-xs font-bold text-white opacity-0 shadow-lg transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      View Course →
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-950 transition group-hover:text-cyan-600">
                      {course.title}
                    </h3>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                      {course.description}
                    </p>

                    {/* COURSE DETAILS */}
                    <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          Duration
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          {course.duration}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          Level
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          {course.level}
                        </p>
                      </div>
                    </div>

                    {/* COURSE LINK */}
                    <div className="mt-5 flex items-center justify-between">
                      <span className="text-sm font-semibold text-cyan-600">
                        Explore program
                      </span>

                      <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-700 transition group-hover:bg-cyan-500 group-hover:text-white">
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* WHY EDSEC */}
      <section className="bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-3">
            <Feature
              number="01"
              title="Practical Training"
              description="Learn through practical exercises and real-world projects instead of theory alone."
            />

            <Feature
              number="02"
              title="Career-Focused"
              description="Develop skills that can be applied to employment, freelancing, business, and further education."
            />

            <Feature
              number="03"
              title="Project-Based"
              description="Build projects that demonstrate your abilities and give you practical experience."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20 pt-20">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-slate-950 px-8 py-14 text-center text-white sm:px-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Start Today
          </p>

          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            Ready to start learning?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            Join EDSEC and develop practical digital skills for school, work,
            business, and your future career.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/apply"
              className="rounded-full bg-cyan-500 px-7 py-3 font-semibold transition hover:bg-cyan-400"
            >
              Apply to EDSEC
            </Link>

            <Link
              href="/"
              className="rounded-full border border-white/15 px-7 py-3 font-semibold transition hover:bg-white/10"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function Feature({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-7">
      <p className="text-sm font-black text-cyan-600">{number}</p>

      <h3 className="mt-4 text-xl font-bold text-slate-950">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-slate-600">
        {description}
      </p>
    </div>
  );
}