import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

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
    skills: [
      "HTML, CSS and JavaScript",
      "React and modern frontend development",
      "Next.js and TypeScript",
      "Backend development",
      "Databases and APIs",
      "Git and deployment",
      "Real-world projects",
    ],
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
    skills: [
      "Cybersecurity fundamentals",
      "Computer and network security",
      "Threats and vulnerabilities",
      "Security tools",
      "Identity and access management",
      "Security awareness",
      "Practical security exercises",
    ],
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
    skills: [
      "Design fundamentals",
      "Typography and composition",
      "Brand identity",
      "Social media graphics",
      "Flyer and poster design",
      "Digital illustration",
      "Practical design projects",
    ],
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
    skills: [
      "Data fundamentals",
      "Microsoft Excel",
      "Data cleaning",
      "Data visualization",
      "Data interpretation",
      "Dashboards and reports",
      "Practical data projects",
    ],
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
    skills: [
      "Digital marketing fundamentals",
      "Social media marketing",
      "Content creation",
      "Search engine optimization",
      "Digital advertising",
      "Audience research",
      "Marketing analytics",
    ],
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
    skills: [
      "Computer hardware",
      "Windows troubleshooting",
      "Software installation",
      "Network fundamentals",
      "Router and Wi-Fi configuration",
      "Printer and peripheral support",
      "Practical IT support",
    ],
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
    skills: [
      "UI/UX fundamentals",
      "User research",
      "Wireframing",
      "Prototyping",
      "Design systems",
      "Responsive interface design",
      "Real-world design projects",
    ],
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
    skills: [
      "Microsoft Word",
      "Microsoft Excel",
      "Microsoft PowerPoint",
      "Professional documents",
      "Spreadsheets",
      "Presentations",
      "Digital productivity",
    ],
  },
];

export function generateStaticParams() {
  return courses.map((course) => ({
    slug: course.slug,
  }));
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const course = courses.find((item) => item.slug === slug);

  if (!course) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Hero */}
      <section className="bg-slate-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:py-24">
          <div>
            <Link
              href="/courses"
              className="text-sm font-medium text-cyan-400 hover:text-cyan-300"
            >
              ← Back to courses
            </Link>

            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
              {course.category}
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              {course.title}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              {course.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full bg-white/10 px-4 py-2">
                {course.duration}
              </span>

              <span className="rounded-full bg-white/10 px-4 py-2">
                {course.level}
              </span>

              <span className="rounded-full bg-white/10 px-4 py-2">
                Practical Training
              </span>
            </div>

            <Link
              href="/apply"
              className="mt-9 inline-block rounded-full bg-cyan-500 px-7 py-3 font-semibold transition hover:bg-cyan-400"
            >
              Apply for this course
            </Link>
          </div>

          <div className="relative aspect-4/3 overflow-hidden rounded-3xl">
            <Image
              src={course.image}
              alt={course.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Course information */}
      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_320px]">
          <div>
            <h2 className="text-3xl font-bold">What you will learn</h2>

            <p className="mt-4 leading-7 text-slate-600">
              EDSEC focuses on practical learning. You will develop useful
              skills through guided lessons, exercises, and projects.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {course.skills.map((skill) => (
                <div
                  key={skill}
                  className="rounded-xl border border-slate-200 p-5"
                >
                  <div className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-sm font-bold text-cyan-700">
                      ✓
                    </span>

                    <span className="font-medium">{skill}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Course card */}
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Course Information
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <p className="text-sm text-slate-500">Duration</p>
                <p className="mt-1 font-semibold">{course.duration}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Level</p>
                <p className="mt-1 font-semibold">{course.level}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Format</p>
                <p className="mt-1 font-semibold">
                  On-site / Online
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Learning Style</p>
                <p className="mt-1 font-semibold">
                  Practical & Project-Based
                </p>
              </div>
            </div>

            <Link
              href="/apply"
              className="mt-7 block rounded-xl bg-slate-950 px-5 py-3 text-center font-semibold text-white transition hover:bg-slate-800"
            >
              Apply Now
            </Link>
          </aside>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-7xl rounded-3xl bg-cyan-50 px-8 py-14 text-center">
          <h2 className="text-3xl font-bold">
            Start your journey with EDSEC.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Learn practical skills, build projects, and prepare yourself for
            opportunities in the digital world.
          </p>

          <Link
            href="/apply"
            className="mt-7 inline-block rounded-full bg-slate-950 px-7 py-3 font-semibold text-white transition hover:bg-slate-800"
          >
            Apply Now
          </Link>
        </div>
      </section>
    </main>
  );
}