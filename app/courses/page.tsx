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
  {
    title: "Cloud Computing",
    slug: "cloud-computing",
    description:
      "Build practical cloud skills and learn how modern applications, servers, storage, and infrastructure operate in the cloud.",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=85",
    duration: "4 Months",
    level: "Beginner to Advanced",
    category: "Cloud & Infrastructure",
  },
  {
    title: "Virtual Assistant",
    slug: "virtual-assistant",
    description:
      "Develop professional remote-work skills including administration, communication, scheduling, productivity tools, and client support.",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=85",
    duration: "3 Months",
    level: "Beginner to Intermediate",
    category: "Remote Work",
  },
];

export default function CoursesPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950 px-6 py-24 text-white sm:py-28">
        <div className="absolute -right-40 -top-40 h-112 w-md rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="absolute -bottom-40 -left-40 h-112 w-md rounded-full bg-blue-600/10 blur-3xl" />

        <div className="absolute right-[20%] top-[30%] h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
                EDSEC Computer Training
              </span>
            </div>

            <h1 className="max-w-4xl text-4xl font-black tracking-tight sm:text-5xl lg:text-7xl">
              Skills for the{" "}
              <span className="text-cyan-400">digital future.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Explore practical technology and professional courses designed
              to help you build confidence, create real projects, and prepare
              for opportunities in the modern digital economy.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/apply"
                className="rounded-full bg-cyan-500 px-7 py-3.5 font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:bg-cyan-400"
              >
                Apply Now
              </Link>

              <a
                href="#courses"
                className="rounded-full border border-white/15 bg-white/5 px-7 py-3.5 font-bold text-white backdrop-blur-sm transition hover:bg-white/10"
              >
                Explore Courses
              </a>

              <Link
                href="/login"
                className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-7 py-3.5 font-bold text-cyan-300 transition hover:bg-cyan-400/20"
              >
                Student Login
              </Link>
            </div>

            {/* HERO STATS */}
            <div className="mt-14 grid max-w-2xl grid-cols-2 gap-6 border-t border-white/10 pt-8 sm:grid-cols-4">
              <HeroStat value="10+" label="Programs" />
              <HeroStat value="100%" label="Practical" />
              <HeroStat value="Real" label="Projects" />
              <HeroStat value="Career" label="Focused" />
            </div>
          </div>
        </div>
      </section>

      {/* COURSE INTRO */}
      <section id="courses" className="px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-10 bg-cyan-500" />

                <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-600">
                  Our Programs
                </p>
              </div>

              <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Choose your path.
              </h2>

              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                From software development and cybersecurity to cloud
                infrastructure and remote professional skills, find a program
                that matches where you want to go.
              </p>
            </div>

            <div className="hidden rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 sm:block">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Available Programs
              </p>

              <p className="mt-1 text-2xl font-black text-slate-950">
                {courses.length}
              </p>
            </div>
          </div>

          {/* COURSE GRID */}
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, index) => (
              <article
                key={course.slug}
                className="group relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition duration-500 hover:-translate-y-2 hover:border-cyan-200 hover:shadow-2xl hover:shadow-cyan-100/50"
              >
                <Link href={`/courses/${course.slug}`}>
                  {/* IMAGE */}
                  <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                    <img
                      src={course.image}
                      alt={`${course.title} course`}
                      loading={index === 0 ? "eager" : "lazy"}
                      fetchPriority={index === 0 ? "high" : "auto"}
                      decoding="async"
                      className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110"
                    />

                    {/* IMAGE GRADIENT */}
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/10 to-transparent" />

                    {/* COURSE NUMBER */}
                    <div className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-slate-950/60 text-xs font-black text-white backdrop-blur-md">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    {/* CATEGORY */}
                    <div className="absolute right-4 top-4">
                      <span className="rounded-full border border-white/20 bg-white/90 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-900 shadow-sm backdrop-blur">
                        {course.category}
                      </span>
                    </div>

                    {/* IMAGE BOTTOM */}
                    <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-cyan-300">
                          EDSEC Program
                        </p>

                        <p className="mt-1 text-sm font-semibold text-white">
                          Start building your skills
                        </p>
                      </div>

                      <div className="grid h-10 w-10 translate-y-3 place-items-center rounded-full bg-cyan-500 text-lg font-bold text-white opacity-0 shadow-lg transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        →
                      </div>
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-6">
                    <h3 className="text-xl font-black tracking-tight text-slate-950 transition-colors duration-300 group-hover:text-cyan-600">
                      {course.title}
                    </h3>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                      {course.description}
                    </p>

                    {/* COURSE DETAILS */}
                    <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-5">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                          Duration
                        </p>

                        <p className="mt-1.5 text-sm font-bold text-slate-800">
                          {course.duration}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                          Level
                        </p>

                        <p className="mt-1.5 text-sm font-bold text-slate-800">
                          {course.level}
                        </p>
                      </div>
                    </div>

                    {/* LINK */}
                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-sm font-bold text-cyan-600">
                        Explore program
                      </span>

                      <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-700 transition-all duration-300 group-hover:bg-cyan-500 group-hover:text-white">
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

      {/* FEATURED LEARNING PATHS */}
      <section className="overflow-hidden bg-slate-950 px-6 py-20 text-white sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">
                More than a classroom
              </p>

              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
                Learn. Build.{" "}
                <span className="text-cyan-400">Become.</span>
              </h2>

              <p className="mt-5 max-w-xl leading-7 text-slate-300">
                EDSEC combines structured learning with practical projects so
                students can move from understanding concepts to actually
                applying them.
              </p>

              <Link
                href="/apply"
                className="mt-8 inline-flex rounded-full bg-white px-6 py-3 font-bold text-slate-950 transition hover:bg-cyan-50"
              >
                Start Your Journey →
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <LearningCard
                icon="01"
                title="Learn Practical Skills"
                description="Understand concepts through guided lessons, exercises, and practical activities."
              />

              <LearningCard
                icon="02"
                title="Build Real Projects"
                description="Turn your knowledge into projects that demonstrate what you can actually do."
              />

              <LearningCard
                icon="03"
                title="Develop Confidence"
                description="Practice consistently and become comfortable using professional digital tools."
              />

              <LearningCard
                icon="04"
                title="Prepare for Opportunities"
                description="Develop useful skills for employment, freelancing, business, and further education."
              />
            </div>
          </div>
        </div>
      </section>

      {/* WHY EDSEC */}
      <section className="bg-slate-50 px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-600">
              Why EDSEC
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Training built around your growth.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Feature
              number="01"
              title="Practical Training"
              description="Learn through practical exercises, guided activities, and real-world projects instead of theory alone."
            />

            <Feature
              number="02"
              title="Career-Focused"
              description="Develop skills that can be applied to employment, freelancing, entrepreneurship, and further education."
            />

            <Feature
              number="03"
              title="Project-Based"
              description="Build projects that demonstrate your abilities and give you valuable hands-on experience."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20 pt-20">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-4xl bg-slate-950 px-8 py-16 text-center text-white sm:px-12">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl" />

          <div className="relative">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">
              Start Today
            </p>

            <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-black tracking-tight sm:text-5xl">
              Your next skill could change your future.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-300">
              Join EDSEC and develop practical digital skills for school,
              work, business, freelancing, and your future career.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Link
                href="/apply"
                className="rounded-full bg-cyan-500 px-7 py-3.5 font-bold transition hover:bg-cyan-400"
              >
                Apply to EDSEC
              </Link>

              <Link
                href="/login"
                className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-7 py-3.5 font-bold text-cyan-300 transition hover:bg-cyan-400/20"
              >
                Student Login
              </Link>

              <Link
                href="/"
                className="rounded-full border border-white/15 px-7 py-3.5 font-bold transition hover:bg-white/10"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function HeroStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div>
      <p className="text-xl font-black text-white">{value}</p>

      <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
        {label}
      </p>
    </div>
  );
}

function LearningCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-3xl border border-white/10 bg-white/4 p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.07]">
      <div className="flex items-start justify-between gap-4">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-400/10 text-xs font-black text-cyan-400">
          {icon}
        </div>

        <span className="text-lg text-slate-600 transition group-hover:text-cyan-400">
          ↗
        </span>
      </div>

      <h3 className="mt-6 text-lg font-black text-white">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
    </div>
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
    <div className="group rounded-3xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-xl hover:shadow-slate-200/50">
      <div className="flex items-center justify-between">
        <p className="text-sm font-black text-cyan-600">{number}</p>

        <span className="text-xl text-slate-300 transition group-hover:text-cyan-500">
          +
        </span>
      </div>

      <h3 className="mt-6 text-xl font-black text-slate-950">{title}</h3>

      <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
    </div>
  );
}