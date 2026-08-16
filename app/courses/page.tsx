import Image from "next/image";
import Link from "next/link";

const courses = [
  {
    title: "Full-Stack Web Development",
    slug: "full-stack-web-development",
    description:
      "Learn to build modern websites and complete web applications from frontend to backend.",
    image: "/images/courses/web-development.jpg",
    duration: "6 Months",
    level: "Beginner to Advanced",
    category: "Development",
  },
  {
    title: "Cybersecurity",
    slug: "cybersecurity",
    description:
      "Build practical cybersecurity skills including security fundamentals, networking, threats, and protection.",
    image: "/images/courses/cybersecurity.jpg",
    duration: "6 Months",
    level: "Beginner to Intermediate",
    category: "Technology",
  },
  {
    title: "Graphic Design",
    slug: "graphic-design",
    description:
      "Learn professional graphic design, branding, digital graphics, and visual communication.",
    image: "/images/courses/graphic-design.jpg",
    duration: "3 Months",
    level: "Beginner to Advanced",
    category: "Creative",
  },
  {
    title: "Data Analysis",
    slug: "data-analysis",
    description:
      "Learn how to transform raw data into useful insights using modern data analysis tools.",
    image: "/images/courses/data-analysis.jpg",
    duration: "4 Months",
    level: "Beginner to Intermediate",
    category: "Data",
  },
  {
    title: "Digital Marketing",
    slug: "digital-marketing",
    description:
      "Learn modern digital marketing strategies, social media, advertising, content, and analytics.",
    image: "/images/courses/digital-marketing.jpg",
    duration: "3 Months",
    level: "Beginner",
    category: "Business",
  },
  {
    title: "IT Support & Networking",
    slug: "it-support-networking",
    description:
      "Develop practical skills in computer troubleshooting, networking, systems, and IT support.",
    image: "/images/courses/it-support.jpg",
    duration: "4 Months",
    level: "Beginner to Intermediate",
    category: "IT",
  },
  {
    title: "UI/UX Design",
    slug: "ui-ux-design",
    description:
      "Learn how to design beautiful, accessible, and user-friendly digital experiences.",
    image: "/images/courses/ui-ux.jpg",
    duration: "3 Months",
    level: "Beginner to Advanced",
    category: "Design",
  },
  {
    title: "Microsoft Office Professional",
    slug: "microsoft-office-professional",
    description:
      "Master Word, Excel, PowerPoint and essential productivity tools for school and work.",
    image: "/images/courses/microsoft-office.jpg",
    duration: "2 Months",
    level: "Beginner to Advanced",
    category: "Productivity",
  },
];

export default function CoursesPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Hero */}
      <section className="bg-slate-950 px-6 py-24 text-white">
        <div className="mx-auto max-w-7xl">
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

      {/* Courses */}
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
            {courses.map((course) => (
              <article
                key={course.slug}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <Link href={`/courses/${course.slug}`}>
                  <div className="relative aspect-video overflow-hidden bg-slate-100">
                    <Image
                      src={course.image}
                      alt={course.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-6">
                    <span className="text-xs font-semibold uppercase tracking-wider text-cyan-600">
                      {course.category}
                    </span>

                    <h3 className="mt-2 text-xl font-bold">
                      {course.title}
                    </h3>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                      {course.description}
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-5 text-sm text-slate-500">
                      <span>{course.duration}</span>
                      <span>{course.level}</span>
                    </div>

                    <div className="mt-5 font-semibold text-cyan-600">
                      View course →
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-slate-950 px-8 py-14 text-center text-white sm:px-12">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready to start learning?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            Join EDSEC and develop practical digital skills for school, work,
            business, and your future career.
          </p>

          <Link
            href="/apply"
            className="mt-8 inline-block rounded-full bg-cyan-500 px-7 py-3 font-semibold transition hover:bg-cyan-400"
          >
            Apply to EDSEC
          </Link>
        </div>
      </section>
    </main>
  );
}