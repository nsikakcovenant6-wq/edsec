/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  BriefcaseBusiness,
  Check,
  Cloud,
  Code2,
  Database,
  GraduationCap,
  Laptop,
  LockKeyhole,
  Palette,
  Rocket,
  ShieldCheck,
  Sparkles,
  Users,
  Wifi,
  Wrench,
} from "lucide-react";

const courses = [
  {
    title: "Full-Stack Web Development",
    slug: "full-stack-web-development",
    description:
      "Learn to design, develop, deploy, and maintain modern websites and complete full-stack web applications.",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1800&q=90",
    duration: "6 Months",
    level: "Beginner to Advanced",
    category: "Development",
    icon: Code2,
    accent: "from-blue-600 to-cyan-500",
    skills: [
      "HTML, CSS and JavaScript",
      "Responsive web design",
      "React and modern frontend development",
      "Next.js and TypeScript",
      "Backend development",
      "REST APIs and authentication",
      "SQL and databases",
      "Git and GitHub",
      "Deployment and hosting",
      "Real-world web applications",
    ],
  },
  {
    title: "Cybersecurity",
    slug: "cybersecurity",
    description:
      "Build practical cybersecurity knowledge covering networks, threats, vulnerabilities, security tools, and defensive practices.",
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1800&q=90",
    duration: "6 Months",
    level: "Beginner to Intermediate",
    category: "Security",
    icon: ShieldCheck,
    accent: "from-violet-600 to-blue-600",
    skills: [
      "Cybersecurity fundamentals",
      "Computer and network security",
      "Threats and vulnerabilities",
      "Security monitoring",
      "Identity and access management",
      "Authentication and authorization",
      "Security tools",
      "Cybersecurity awareness",
      "Incident response fundamentals",
      "Practical security exercises",
    ],
  },
  {
    title: "Graphic Design",
    slug: "graphic-design",
    description:
      "Learn professional graphic design, visual communication, branding, digital graphics, and creative production.",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1800&q=90",
    duration: "3 Months",
    level: "Beginner to Advanced",
    category: "Creative",
    icon: Palette,
    accent: "from-pink-600 to-orange-500",
    skills: [
      "Design fundamentals",
      "Typography",
      "Colour theory",
      "Composition and layout",
      "Brand identity",
      "Logo design",
      "Flyer and poster design",
      "Social media graphics",
      "Digital advertising designs",
      "Practical design projects",
    ],
  },
  {
    title: "Data Analysis",
    slug: "data-analysis",
    description:
      "Learn how to collect, clean, analyze, visualize, and communicate data to produce useful business insights.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1800&q=90",
    duration: "4 Months",
    level: "Beginner to Intermediate",
    category: "Data",
    icon: BarChart3,
    accent: "from-emerald-600 to-cyan-500",
    skills: [
      "Data analysis fundamentals",
      "Microsoft Excel",
      "Data cleaning",
      "Formulas and functions",
      "Data visualization",
      "Charts and dashboards",
      "Data interpretation",
      "Reports and presentations",
      "Business data analysis",
      "Practical data projects",
    ],
  },
  {
    title: "Digital Marketing",
    slug: "digital-marketing",
    description:
      "Learn modern digital marketing strategies, social media, content creation, advertising, SEO, and analytics.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1800&q=90",
    duration: "3 Months",
    level: "Beginner",
    category: "Business",
    icon: BriefcaseBusiness,
    accent: "from-orange-500 to-pink-600",
    skills: [
      "Digital marketing fundamentals",
      "Social media marketing",
      "Content strategy",
      "Content creation",
      "Search engine optimization",
      "Digital advertising",
      "Audience research",
      "Email marketing fundamentals",
      "Marketing analytics",
      "Practical marketing campaigns",
    ],
  },
  {
    title: "IT Support & Networking",
    slug: "it-support-networking",
    description:
      "Develop practical skills in computer hardware, troubleshooting, networking, systems administration, and technical support.",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1800&q=90",
    duration: "4 Months",
    level: "Beginner to Intermediate",
    category: "IT & Networking",
    icon: Wifi,
    accent: "from-cyan-600 to-blue-600",
    skills: [
      "Computer hardware",
      "Windows troubleshooting",
      "Operating systems",
      "Software installation",
      "Network fundamentals",
      "IP addressing",
      "Router and Wi-Fi configuration",
      "LAN setup",
      "Printers and peripherals",
      "Practical IT support",
    ],
  },
  {
    title: "UI/UX Design",
    slug: "ui-ux-design",
    description:
      "Learn how to research, plan, prototype, and design beautiful, accessible, and user-friendly digital experiences.",
    image:
      "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1800&q=90",
    duration: "3 Months",
    level: "Beginner to Advanced",
    category: "Design",
    icon: Palette,
    accent: "from-fuchsia-600 to-violet-600",
    skills: [
      "UI/UX fundamentals",
      "User research",
      "User personas",
      "Information architecture",
      "Wireframing",
      "Prototyping",
      "Design systems",
      "Responsive interface design",
      "Usability testing",
      "Real-world design projects",
    ],
  },
  {
    title: "Microsoft Office Professional",
    slug: "microsoft-office-professional",
    description:
      "Master Microsoft Word, Excel, PowerPoint, and essential productivity skills for school, business, and professional work.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=90",
    duration: "2 Months",
    level: "Beginner to Advanced",
    category: "Productivity",
    icon: Laptop,
    accent: "from-blue-600 to-indigo-600",
    skills: [
      "Microsoft Word",
      "Microsoft Excel",
      "Microsoft PowerPoint",
      "Professional document creation",
      "Spreadsheets",
      "Excel formulas",
      "Charts and presentations",
      "Business documents",
      "Digital productivity",
      "Practical office projects",
    ],
  },
  {
    title: "Cloud Computing",
    slug: "cloud-computing",
    description:
      "Understand modern cloud technology and learn how applications, storage, servers, databases, and services operate in the cloud.",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1800&q=90",
    duration: "4 Months",
    level: "Beginner to Intermediate",
    category: "Cloud Technology",
    icon: Cloud,
    accent: "from-sky-500 to-blue-700",
    skills: [
      "Cloud computing fundamentals",
      "Cloud service models",
      "Cloud deployment models",
      "Virtual machines",
      "Cloud storage",
      "Cloud databases",
      "Networking in the cloud",
      "Identity and access management",
      "Cloud security fundamentals",
      "Deploying applications to the cloud",
    ],
  },
  {
    title: "Virtual Assistant",
    slug: "virtual-assistant",
    description:
      "Build professional remote-work skills for supporting businesses, entrepreneurs, executives, and online teams.",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1800&q=90",
    duration: "3 Months",
    level: "Beginner to Intermediate",
    category: "Professional Skills",
    icon: Users,
    accent: "from-amber-500 to-orange-600",
    skills: [
      "Virtual assistance fundamentals",
      "Professional communication",
      "Email management",
      "Calendar management",
      "Online research",
      "Microsoft Office and Google Workspace",
      "Task and project management",
      "Customer support",
      "Social media assistance",
      "Remote-work professionalism",
    ],
  },
];

const relatedCourses = [
  {
    title: "Full-Stack Web Development",
    slug: "full-stack-web-development",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=85",
    icon: Code2,
  },
  {
    title: "Cybersecurity",
    slug: "cybersecurity",
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=900&q=85",
    icon: ShieldCheck,
  },
  {
    title: "Data Analysis",
    slug: "data-analysis",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=85",
    icon: BarChart3,
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

  const CourseIcon = course.icon;

  const related = relatedCourses.filter(
    (item) => item.slug !== course.slug,
  );

  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-950">
      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative isolate overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0">
          <img
            src={course.image}
            alt={course.title}
            className="h-full w-full object-cover opacity-35"
          />

          <div className="absolute inset-0 bg-slate-950/75" />

          <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-950/85 to-blue-950/50" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.25),transparent_35%)]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 py-8 lg:px-8">
          <Link
            href="/courses"
            className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 backdrop-blur-md transition hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-1"
            />
            Back to all courses
          </Link>
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-10 lg:grid-cols-[1fr_.85fr] lg:items-center lg:px-8 lg:pb-28 lg:pt-14">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-cyan-300 backdrop-blur-md">
              <Sparkles size={15} />
              EDSEC ICT INSTITUTE
            </div>

            <div className="mt-7 flex items-center gap-4">
              <div
                className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-linear-to-br ${course.accent} shadow-2xl`}
              >
                <CourseIcon size={30} strokeWidth={1.7} />
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
                  {course.category}
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Practical & Project-Based Learning
                </p>
              </div>
            </div>

            <h1 className="mt-7 max-w-4xl text-4xl font-black tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              {course.title}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              {course.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
                {course.duration}
              </span>

              <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
                {course.level}
              </span>

              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300 backdrop-blur-md">
                Practical Training
              </span>
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/apply"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-7 py-4 font-bold text-slate-950 shadow-xl shadow-cyan-950/30 transition duration-300 hover:-translate-y-1 hover:bg-cyan-400"
              >
                Apply for this course
                <ArrowUpRight
                  size={18}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>

              <Link
                href="/courses"
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-7 py-4 font-semibold text-white backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white/10"
              >
                Explore other courses
              </Link>
            </div>
          </div>

          {/* HERO IMAGE CARD */}
          <div className="relative">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-cyan-500/10 blur-3xl" />

            <div className="relative overflow-hidden rounded-4xl border border-white/10 bg-white/5 p-2 shadow-2xl backdrop-blur-sm">
              <div className="relative aspect-4/3 overflow-hidden rounded-3xl">
                <img
                  src={course.image}
                  alt={course.title}
                  className="h-full w-full object-cover transition duration-700 hover:scale-105"
                />

                <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />

                <div className="absolute bottom-5 left-5 right-5">
                  <div className="rounded-2xl border border-white/15 bg-black/30 p-5 backdrop-blur-xl">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                          Your learning journey
                        </p>

                        <p className="mt-2 text-lg font-bold text-white">
                          Learn • Practice • Build • Grow
                        </p>
                      </div>

                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-cyan-500 text-slate-950">
                        <Rocket size={20} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          QUICK INFORMATION
      ========================================================= */}
      <section className="relative z-10 -mt-8 px-5 lg:px-8">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/60 sm:grid-cols-3">
          <div className="flex items-center gap-4 border-b border-slate-100 p-6 sm:border-b-0 sm:border-r">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-600">
              <GraduationCap size={21} />
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">
                Level
              </p>

              <p className="mt-1 font-bold text-slate-900">{course.level}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 border-b border-slate-100 p-6 sm:border-b-0 sm:border-r">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-cyan-50 text-cyan-600">
              <Wrench size={21} />
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">
                Learning Style
              </p>

              <p className="mt-1 font-bold text-slate-900">
                Practical & Project-Based
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-6">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-violet-50 text-violet-600">
              <Laptop size={21} />
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">
                Format
              </p>

              <p className="mt-1 font-bold text-slate-900">
                On-site / Online
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          WHAT YOU WILL LEARN
      ========================================================= */}
      <section className="bg-white px-5 py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                Course Curriculum
              </p>

              <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                What you will learn
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                Build useful skills through structured lessons, guided
                exercises, practical assignments, projects, and real-world
                problem solving.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {course.skills.map((skill, index) => (
                <div
                  key={skill}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-5 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-xl"
                >
                  <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-blue-50 opacity-0 blur-2xl transition duration-500 group-hover:opacity-100" />

                  <div className="relative flex gap-4">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                      <Check size={17} strokeWidth={3} />
                    </div>

                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Module {String(index + 1).padStart(2, "0")}
                      </span>

                      <p className="mt-1 font-semibold leading-6 text-slate-900">
                        {skill}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COURSE CARD */}
          <aside className="h-fit overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl lg:sticky lg:top-24">
            <div
              className={`h-2 bg-linear-to-r ${course.accent}`}
            />

            <div className="p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                    Course Details
                  </p>

                  <h3 className="mt-2 text-2xl font-black text-slate-950">
                    {course.title}
                  </h3>
                </div>

                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-slate-950 text-white">
                  <CourseIcon size={21} />
                </div>
              </div>

              <div className="mt-7 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-700">
                    <Rocket size={17} />
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-400">
                      Duration
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                      {course.duration}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-700">
                    <GraduationCap size={17} />
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-400">
                      Level
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                      {course.level}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-700">
                    <Laptop size={17} />
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-400">
                      Format
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                      On-site / Online
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-700">
                    <Rocket size={17} />
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-400">
                      Training
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                      Practical & Project-Based
                    </p>
                  </div>
                </div>
              </div>

              <Link
                href="/apply"
                className="group mt-8 flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-4 text-center font-bold text-white transition duration-300 hover:-translate-y-1 hover:bg-blue-600"
              >
                Apply Now
                <ArrowUpRight
                  size={17}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>

              <p className="mt-4 text-center text-xs leading-5 text-slate-400">
                Start building practical technology skills with EDSEC ICT
                INSTITUTE.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* =========================================================
          HOW EDSEC TEACHES
      ========================================================= */}
      <section className="relative overflow-hidden bg-slate-950 px-5 py-24 text-white lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(37,99,235,0.22),transparent_32%),radial-gradient(circle_at_10%_90%,rgba(6,182,212,0.12),transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">
              The EDSEC Method
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              You don't just learn it.
              <span className="block text-cyan-400">
                You build with it.
              </span>
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-400">
              Our training approach is designed to move students from
              understanding concepts to actually using their skills.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-4">
            {[
              {
                number: "01",
                title: "Learn",
                text: "Understand the concepts, tools, and technologies.",
                icon: GraduationCap,
              },
              {
                number: "02",
                title: "Practice",
                text: "Apply your knowledge through exercises and assignments.",
                icon: Wrench,
              },
              {
                number: "03",
                title: "Build",
                text: "Create practical projects that solve real problems.",
                icon: Code2,
              },
              {
                number: "04",
                title: "Grow",
                text: "Improve your skills and develop your portfolio.",
                icon: Rocket,
              },
            ].map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-7 transition duration-500 hover:-translate-y-2 hover:border-cyan-400/30 hover:bg-white/10"
                >
                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-cyan-500/10 blur-xl transition duration-500 group-hover:scale-150" />

                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-black text-white/20">
                        {step.number}
                      </span>

                      <div className="grid h-11 w-11 place-items-center rounded-xl bg-cyan-500/10 text-cyan-400">
                        <Icon size={20} />
                      </div>
                    </div>

                    <h3 className="mt-8 text-xl font-bold">{step.title}</h3>

                    <p className="mt-3 leading-7 text-slate-400">
                      {step.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          WHY EDSEC
      ========================================================= */}
      <section className="bg-slate-50 px-5 py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
              Why EDSEC?
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Designed for people who want useful skills.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Whether you are starting from zero, changing careers, improving
              your professional skills, or building your first technology
              portfolio, our programs are designed around practical learning.
            </p>

            <Link
              href="/about"
              className="group mt-7 inline-flex items-center gap-2 font-bold text-blue-600 transition hover:text-blue-700"
            >
              Learn more about EDSEC
              <ArrowUpRight
                size={17}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Practical Training",
                text: "Focus on useful skills, exercises, assignments, and projects.",
                icon: Wrench,
              },
              {
                title: "Career Focused",
                text: "Develop skills that can support your education and career journey.",
                icon: Rocket,
              },
              {
                title: "Modern Technology",
                text: "Learn tools and concepts relevant to today's digital environment.",
                icon: Sparkles,
              },
              {
                title: "Supportive Community",
                text: "Learn, collaborate, ask questions, and grow with other learners.",
                icon: Users,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="group rounded-3xl border border-slate-200 bg-white p-7 transition duration-500 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600 transition duration-300 group-hover:bg-blue-600 group-hover:text-white">
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-slate-950">
                    {item.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-600">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          RELATED COURSES
      ========================================================= */}
      <section className="bg-white px-5 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                Explore More
              </p>

              <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Continue your learning journey.
              </h2>
            </div>

            <Link
              href="/courses"
              className="group inline-flex items-center gap-2 font-bold text-blue-600 hover:text-blue-700"
            >
              View all courses
              <ArrowUpRight
                size={17}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {related.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.slug}
                  href={`/courses/${item.slug}`}
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-white transition duration-500 hover:-translate-y-2 hover:border-blue-200 hover:shadow-2xl"
                >
                  <div className="relative h-56 overflow-hidden bg-slate-950">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                      loading="lazy"
                    />

                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />

                    <div className="absolute left-5 top-5 grid h-11 w-11 place-items-center rounded-xl border border-white/20 bg-white/10 text-white backdrop-blur-md">
                      <Icon size={19} />
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-xl font-bold text-slate-950">
                        {item.title}
                      </h3>

                      <ArrowUpRight
                        size={18}
                        className="shrink-0 text-slate-300 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-blue-600"
                      />
                    </div>

                    <p className="mt-4 font-semibold text-blue-600">
                      View course →
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          FINAL CTA
      ========================================================= */}
      <section className="relative overflow-hidden bg-slate-950 px-5 py-24 text-white lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.32),transparent_42%),radial-gradient(circle_at_15%_100%,rgba(6,182,212,0.12),transparent_28%)]" />

        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white text-slate-950 shadow-2xl">
            <CourseIcon size={27} />
          </div>

          <p className="mt-7 text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">
            Start Learning
          </p>

          <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
            Ready to start learning {course.title}?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-400">
            Take the next step toward practical technology skills. Apply today
            and begin your learning journey with EDSEC ICT INSTITUTE.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/apply"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-7 py-4 font-bold text-slate-950 shadow-xl shadow-cyan-950/30 transition duration-300 hover:-translate-y-1 hover:bg-cyan-400"
            >
              Apply Now
              <ArrowUpRight
                size={18}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>

            <Link
              href="/courses"
              className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-7 py-4 font-bold text-white transition duration-300 hover:-translate-y-1 hover:bg-white/10"
            >
              Browse All Courses
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 px-7 py-4 font-bold text-blue-300 transition duration-300 hover:-translate-y-1 hover:bg-blue-500/20"
            >
              Student Login
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}