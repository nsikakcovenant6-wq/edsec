 
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  Check,
  Code2,
  Cloud,
  GraduationCap,
  Headphones,
  Laptop,
  Lightbulb,
  LockKeyhole,
  MonitorPlay,
  Network,
  Palette,
  Rocket,
  ShieldCheck,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";

const featuredPrograms = [
  {
    title: "Full-Stack Web Development",
    description:
      "Learn to design, build, deploy, and maintain modern websites and full-stack web applications.",
    icon: Code2,
    href: "/courses/full-stack-web-development",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Cybersecurity",
    description:
      "Develop practical knowledge of cybersecurity, networking, threats, security tools, and defensive practices.",
    icon: ShieldCheck,
    href: "/courses/cybersecurity",
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "UI/UX Design",
    description:
      "Learn how to transform ideas into intuitive, accessible, and engaging digital experiences.",
    icon: Palette,
    href: "/courses/ui-ux-design",
    image:
      "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "IT Support & Networking",
    description:
      "Build practical skills in computer systems, networking, troubleshooting, maintenance, and technical support.",
    icon: Network,
    href: "/courses/it-support-networking",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=85",
  },
];

const stats = [
  { value: "10+", label: "ICT Programs" },
  { value: "100%", label: "Practical Learning" },
  { value: "20+", label: "Training Systems" },
  { value: "1", label: "Growing Community" },
];

const learningAreas = [
  {
    title: "Microsoft Office Professional",
    icon: Laptop,
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Graphic Design",
    icon: Palette,
    image:
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "UI/UX Design",
    icon: Palette,
    image:
      "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Full-Stack Web Development",
    icon: Code2,
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Cybersecurity",
    icon: LockKeyhole,
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Data Analysis",
    icon: BarChart3,
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Digital Marketing",
    icon: BriefcaseBusiness,
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "IT Support & Networking",
    icon: Network,
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Cloud Computing",
    icon: Cloud,
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Virtual Assistant",
    icon: Headphones,
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=85",
  },
];

const services = [
  {
    number: "01",
    title: "ICT & Professional Training",
    description:
      "Practical technology and digital-skills programs designed for students, professionals, entrepreneurs, and career changers.",
    href: "/services",
    icon: GraduationCap,
  },
  {
    number: "02",
    title: "Corporate ICT Training",
    description:
      "Customized ICT and digital-skills training designed to help organizations build stronger and more productive teams.",
    href: "/corporate-training",
    icon: BriefcaseBusiness,
  },
  {
    number: "03",
    title: "Technology Projects",
    description:
      "Learn by building practical projects that demonstrate real-world technology skills and strengthen your portfolio.",
    href: "/student-projects",
    icon: Rocket,
  },
];

const communityCards = [
  {
    number: "01",
    title: "Training",
    description:
      "Explore the EDSEC ICT INSTITUTE learning environment.",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=85",
    href: "/gallery",
    icon: GraduationCap,
  },
  {
    number: "02",
    title: "Projects",
    description: "Discover what our learners build.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=85",
    href: "/student-projects",
    icon: Code2,
  },
  {
    number: "03",
    title: "Community",
    description: "Learn and grow together.",
    image:
      "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1200&q=85",
    href: "/gallery",
    icon: Users,
  },
];

const teachingSteps = [
  {
    number: "01",
    title: "Learn",
    text: "Understand the concepts and technology.",
    icon: BookOpen,
  },
  {
    number: "02",
    title: "Practice",
    text: "Apply what you learn through exercises.",
    icon: Wrench,
  },
  {
    number: "03",
    title: "Build",
    text: "Create practical projects and solutions.",
    icon: Code2,
  },
  {
    number: "04",
    title: "Grow",
    text: "Test your knowledge and build your portfolio.",
    icon: Rocket,
  },
];

const portalFeatures = [
  {
    title: "Courses",
    text: "Access your ICT programs",
    icon: BookOpen,
  },
  {
    title: "Progress",
    text: "Track your development",
    icon: BarChart3,
  },
  {
    title: "Classes",
    text: "Join online learning",
    icon: MonitorPlay,
  },
  {
    title: "Tests",
    text: "Check your knowledge",
    icon: Check,
  },
];

/*
|--------------------------------------------------------------------------
| HERO SLIDESHOW
|--------------------------------------------------------------------------
| CSS-only slideshow.
| No Hero3D.tsx
| No Reveal.tsx
*/

const heroSlides = [
  {
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1800&q=90",
    label: "Students • Technology • Community",
  },
  {
    image:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1800&q=90",
    label: "Learning • Collaboration • Innovation",
  },
  {
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1800&q=90",
    label: "Coding • Digital Skills • Creativity",
  },
  {
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1800&q=90",
    label: "Software • Engineering • Future",
  },
  {
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1800&q=90",
    label: "Teamwork • Career • Growth",
  },
  {
    image:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1800&q=90",
    label: "Education • Skills • Opportunity",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-950">
      <style>{`
        @keyframes edsecHeroSlide {
          0% {
            opacity: 0;
            transform: scale(1.04);
          }

          5% {
            opacity: 1;
          }

          16% {
            opacity: 1;
            transform: scale(1);
          }

          21% {
            opacity: 0;
          }

          100% {
            opacity: 0;
            transform: scale(1.04);
          }
        }

        @keyframes edsecHeroProgress {
          from {
            width: 0%;
          }

          to {
            width: 100%;
          }
        }

        @keyframes edsecFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-8px);
          }
        }

        .edsec-hero-slide {
          position: absolute;
          inset: 0;
          opacity: 0;
          animation: edsecHeroSlide 36s infinite;
        }

        .edsec-hero-slide:nth-child(1) {
          animation-delay: 0s;
        }

        .edsec-hero-slide:nth-child(2) {
          animation-delay: 6s;
        }

        .edsec-hero-slide:nth-child(3) {
          animation-delay: 12s;
        }

        .edsec-hero-slide:nth-child(4) {
          animation-delay: 18s;
        }

        .edsec-hero-slide:nth-child(5) {
          animation-delay: 24s;
        }

        .edsec-hero-slide:nth-child(6) {
          animation-delay: 30s;
        }

        .edsec-hero-progress {
          animation: edsecHeroProgress 6s linear infinite;
        }

        .edsec-float {
          animation: edsecFloat 5s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .edsec-hero-slide,
          .edsec-hero-progress,
          .edsec-float {
            animation: none;
          }

          .edsec-hero-slide:first-child {
            opacity: 1;
          }
        }
      `}</style>

      {/* ============================================================
          HERO
      ============================================================ */}
      <section className="relative isolate overflow-hidden bg-slate-950">
        <div className="absolute inset-0">
          {heroSlides.map((slide) => (
            <div className="edsec-hero-slide" key={slide.image}>
              <img
                src={slide.image}
                alt={slide.label}
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-slate-950/60" />

              <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-950/70 to-slate-950/20" />

              <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-slate-950/30" />
            </div>
          ))}
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(37,99,235,0.28),transparent_35%)]" />

        <div className="relative mx-auto grid min-h-190 max-w-7xl items-center gap-12 px-6 py-24 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:px-12">
          <div className="max-w-3xl text-white">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-blue-300" />
              Practical ICT education
            </div>

            <img
              src="/edsec-logo.png"
              alt="EDSEC ICT Institute"
              className="mb-8 h-16 w-auto object-contain"
            />

            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Learn technology.
              <span className="block text-blue-400">
                Build the future.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">
              EDSEC ICT INSTITUTE provides practical technology education,
              digital-skills training, professional development, and
              project-based learning for students and professionals.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/courses"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-blue-50"
              >
                Explore Courses
                <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              <Link
                href="/apply"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 font-semibold text-white backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/15"
              >
                Apply Now
              </Link>

              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-xl px-6 py-3.5 font-semibold text-white transition hover:bg-white/10"
              >
                Student Portal
              </Link>
            </div>

            <div className="mt-9 grid gap-3 sm:grid-cols-3">
              {[
                "Practical ICT training",
                "Project-based learning",
                "Career-focused skills",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-sm font-medium text-slate-200"
                >
                  <Check className="h-4 w-4 shrink-0 text-blue-400" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* HERO INFORMATION PANEL */}
          <div className="relative hidden lg:block">
            <div className="edsec-float relative mx-auto max-w-md">
              <div className="overflow-hidden rounded-4xl border border-white/15 bg-white/10 p-3 shadow-2xl backdrop-blur-xl">
                <div className="relative overflow-hidden rounded-3xl bg-slate-900">
                  <img
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=90"
                    alt="Students learning technology"
                    className="h-107.5 w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent" />

                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                      <span className="h-2 w-2 rounded-full bg-green-400" />
                      Learning in progress
                    </div>

                    <h3 className="text-2xl font-bold text-white">
                      Technology starts with learning.
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-200">
                      Learn practical skills. Build real projects. Create
                      opportunities.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 p-3">
                  <div className="rounded-xl bg-white/10 p-4">
                    <Code2 className="h-5 w-5 text-blue-300" />
                    <p className="mt-3 text-xs text-slate-300">Build</p>
                  </div>

                  <div className="rounded-xl bg-white/10 p-4">
                    <BookOpen className="h-5 w-5 text-blue-300" />
                    <p className="mt-3 text-xs text-slate-300">Learn</p>
                  </div>

                  <div className="rounded-xl bg-white/10 p-4">
                    <Rocket className="h-5 w-5 text-blue-300" />
                    <p className="mt-3 text-xs text-slate-300">Grow</p>
                  </div>
                </div>
              </div>

              <div className="absolute -left-10 top-20 rounded-2xl border border-white/15 bg-slate-950/80 p-4 shadow-xl backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-300">
                    <Laptop className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Current focus</p>
                    <p className="text-sm font-semibold text-white">
                      Digital Skills
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-8 rounded-2xl border border-white/15 bg-white p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <GraduationCap className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">EDSEC</p>
                    <p className="text-sm font-bold text-slate-950">
                      Learn. Build. Grow.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SLIDESHOW INDICATOR */}
        <div className="absolute bottom-7 left-1/2 z-20 flex w-[min(90%,420px)] -translate-x-1/2 gap-1.5">
          {heroSlides.map((slide) => (
            <div
              key={slide.image}
              className="h-1 flex-1 overflow-hidden rounded-full bg-white/20"
            >
              <div className="edsec-hero-progress h-full rounded-full bg-white/80" />
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================
          STATS
      ============================================================ */}
      <section className="border-y border-slate-100 bg-slate-50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-slate-200 px-6 sm:grid-cols-4 sm:px-8 lg:px-12">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-slate-50 px-5 py-8 text-center sm:py-10"
            >
              <div className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                {stat.value}
              </div>

              <div className="mt-2 text-sm text-slate-500">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================
          ABOUT
      ============================================================ */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                About EDSEC ICT INSTITUTE
              </p>

              <h2 className="mt-4 max-w-2xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                An ICT institute built around practical learning.
              </h2>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                We combine structured learning, practical exercises,
                technology projects, assessments, and supportive mentorship
                to help learners develop skills they can actually use.
              </p>

              <Link
                href="/about"
                className="mt-8 inline-flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-700"
              >
                Learn more about EDSEC
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {[
                {
                  title: "Practical Learning",
                  text: "Learn by doing, not just by watching.",
                  icon: Lightbulb,
                },
                {
                  title: "Career Focus",
                  text: "Build skills that support real opportunities.",
                  icon: Rocket,
                },
                {
                  title: "Supportive Community",
                  text: "Learn alongside people growing in technology.",
                  icon: Users,
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3 className="font-semibold text-slate-950">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          FEATURED PROGRAMS
      ============================================================ */}
      <section className="bg-slate-50 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                Featured Programs
              </p>

              <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                Build skills that matter.
              </h2>
            </div>

            <Link
              href="/courses"
              className="inline-flex items-center gap-2 font-semibold text-slate-700 hover:text-blue-600"
            >
              View all courses
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {featuredPrograms.map((program) => {
              const Icon = program.icon;

              return (
                <Link
                  key={program.title}
                  href={program.href}
                  className="group block overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={program.image}
                      alt={program.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-slate-950/10 to-transparent" />

                    <div className="absolute bottom-5 left-5 flex h-11 w-11 items-center justify-center rounded-xl bg-white/95 text-blue-600 shadow-lg">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="p-7">
                    <div className="flex items-start justify-between gap-5">
                      <div>
                        <h3 className="text-xl font-bold text-slate-950">
                          {program.title}
                        </h3>

                        <p className="mt-3 leading-7 text-slate-600">
                          {program.description}
                        </p>
                      </div>

                      <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-slate-400 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-blue-600" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          ALL PROGRAMS — 10 COURSES WITH PICTURES
      ============================================================ */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Learning Areas
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Choose your technology path.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Explore practical programs designed to help you develop useful
              digital and technology skills.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {learningAreas.map((area) => {
              const Icon = area.icon;

              return (
                <Link
                  key={area.title}
                  href="/courses"
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={area.image}
                      alt={area.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/75 via-slate-950/10 to-transparent" />

                    <div className="absolute bottom-4 left-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/95 text-blue-600 shadow-lg">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-semibold leading-6 text-slate-950">
                        {area.title}
                      </h3>

                      <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue-600" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          HOW WE TEACH
      ============================================================ */}
      <section className="bg-slate-950 py-20 text-white sm:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
              How We Teach
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Learn. Build. Test. Grow.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-400">
              Our learning approach focuses on understanding, practice,
              projects, assessment, and continuous improvement.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {teachingSteps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="rounded-2xl border border-white/10 bg-white/4 p-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-blue-400">
                      {step.number}
                    </span>

                    <Icon className="h-5 w-5 text-slate-400" />
                  </div>

                  <h3 className="mt-10 text-xl font-bold">
                    {step.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-400">
                    {step.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          SERVICES
      ============================================================ */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Services
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              More than training.
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <Link
                  key={service.number}
                  href={service.href}
                  className="group block rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-blue-600">
                      {service.number}
                    </span>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-blue-50 group-hover:text-blue-600">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <h3 className="mt-12 text-xl font-bold text-slate-950">
                    {service.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-600">
                    {service.description}
                  </p>

                  <div className="mt-7 inline-flex items-center gap-2 font-semibold text-slate-700 group-hover:text-blue-600">
                    Learn more
                    <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          STUDENT PORTAL
      ============================================================ */}
      <section className="bg-slate-50 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="overflow-hidden rounded-4xl bg-slate-950 p-7 text-white sm:p-10 lg:p-12">
            <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
              <div>
                <img
                  src="/edsec-logo.png"
                  alt="EDSEC ICT Institute"
                  className="h-12 w-auto object-contain"
                />

                <p className="mt-7 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
                  Student Portal
                </p>

                <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                  Your learning, in one place.
                </h2>

                <p className="mt-5 max-w-xl text-lg leading-8 text-slate-400">
                  Access your courses, monitor progress, join classes, take
                  tests, and manage your learning journey.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3.5 font-semibold text-slate-950 transition hover:bg-blue-50"
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center rounded-xl border border-white/15 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10"
                  >
                    Create Account
                  </Link>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {portalFeatures.map((feature) => {
                  const Icon = feature.icon;

                  return (
                    <div
                      key={feature.title}
                      className="rounded-2xl border border-white/10 bg-white/5 p-6"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-blue-400">
                        <Icon className="h-5 w-5" />
                      </div>

                      <h3 className="mt-6 font-semibold">
                        {feature.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {feature.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          VIRTUAL CLASS
      ============================================================ */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="grid overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-sm lg:grid-cols-2">
            <div className="relative min-h-85">
              <img
                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1400&q=85"
                alt="Virtual classroom"
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 to-transparent" />

              <div className="absolute bottom-7 left-7">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-900">
                  <MonitorPlay className="h-4 w-4 text-blue-600" />
                  Virtual Class
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center p-8 sm:p-12">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                Online Learning
              </p>

              <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
                Learn wherever you are.
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                Join live learning sessions, access your courses, and stay
                connected with your instructors and classmates.
              </p>

              <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Upcoming Class
                </p>

                <div className="mt-2 font-semibold text-slate-950">
                  Full-Stack Web Development
                </div>

                <div className="mt-1 text-sm text-slate-500">
                  Check your student portal for class details.
                </div>
              </div>

              <Link
                href="/login"
                className="mt-7 inline-flex w-fit items-center gap-2 font-semibold text-blue-600 hover:text-blue-700"
              >
                Access student portal
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          COMMUNITY
      ============================================================ */}
      <section className="bg-slate-50 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="mb-12 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              EDSEC Community
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Learn. Create. Connect.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {communityCards.map((card) => {
              const Icon = card.icon;

              return (
                <Link
                  key={card.number}
                  href={card.href}
                  className="group relative block min-h-95 overflow-hidden rounded-3xl"
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/30 to-transparent" />

                  <div className="absolute left-6 right-6 top-6 flex items-center justify-between text-white">
                    <span className="text-sm font-semibold">
                      {card.number}
                    </span>

                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="absolute bottom-7 left-6 right-6 text-white">
                    <h3 className="text-2xl font-bold">{card.title}</h3>

                    <p className="mt-2 text-sm leading-6 text-white/80">
                      {card.description}
                    </p>

                    <div className="mt-5 inline-flex items-center gap-2 font-semibold">
                      Explore
                      <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          CORPORATE TRAINING
      ============================================================ */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="grid overflow-hidden rounded-4xl bg-slate-950 text-white lg:grid-cols-2">
            <div className="relative min-h-100">
              <img
                src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=85"
                alt="Corporate training"
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-slate-950/40" />
            </div>

            <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-14">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
                Corporate Training
              </p>

              <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                Train. Improve. Grow.
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-400">
                Help your team develop stronger technology and digital skills
                through customized corporate ICT training.
              </p>

              <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-center gap-3">
                  <BriefcaseBusiness className="h-5 w-5 text-blue-400" />

                  <span className="font-semibold">
                    Customized learning programs
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Training designed around your organization&apos;s needs,
                  people, and goals.
                </p>
              </div>

              <Link
                href="/corporate-training"
                className="mt-8 inline-flex w-fit items-center gap-2 font-semibold text-white hover:text-blue-400"
              >
                Explore corporate training
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          FINAL CTA
      ============================================================ */}
      <section className="relative overflow-hidden bg-slate-950 py-24 text-white sm:py-32">
        <div className="absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-125 w-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl px-6 text-center sm:px-8">
          <img
            src="/edsec-logo.png"
            alt="EDSEC ICT Institute"
            className="mx-auto h-14 w-auto object-contain"
          />

          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
            Start Your ICT Journey
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">
            Your next skill can change your future.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            Start learning practical technology skills and take the next
            step toward your goals.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/apply"
              className="inline-flex items-center justify-center rounded-xl bg-white px-7 py-3.5 font-semibold text-slate-950 transition hover:bg-blue-50"
            >
              Apply Now
            </Link>

            <Link
              href="/courses"
              className="inline-flex items-center justify-center rounded-xl border border-white/15 px-7 py-3.5 font-semibold text-white transition hover:bg-white/10"
            >
              Explore Courses
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl px-7 py-3.5 font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              Student Login
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}