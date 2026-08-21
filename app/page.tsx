/* eslint-disable @next/next/no-img-element */

import Link from "next/link";

const featuredPrograms = [
  {
    title: "Full-Stack Web Development",
    description:
      "Learn to design, build, deploy, and maintain modern websites and full-stack web applications.",
    icon: "⌘",
    href: "/courses/full-stack-web-development",
  },
  {
    title: "Cybersecurity",
    description:
      "Develop practical knowledge of cybersecurity, networking, threats, security tools, and defensive practices.",
    icon: "◈",
    href: "/courses/cybersecurity",
  },
  {
    title: "UI/UX Design",
    description:
      "Learn how to transform ideas into intuitive, accessible, and engaging digital experiences.",
    icon: "✦",
    href: "/courses/ui-ux-design",
  },
  {
    title: "IT Support & Networking",
    description:
      "Build practical skills in computer systems, networking, troubleshooting, maintenance, and technical support.",
    icon: "⌁",
    href: "/courses/it-support-networking",
  },
];

const stats = [
  {
    value: "8+",
    label: "ICT Programs",
  },
  {
    value: "100%",
    label: "Practical Learning",
  },
  {
    value: "20+",
    label: "Training Systems",
  },
  {
    value: "1",
    label: "Growing Community",
  },
];

const learningAreas = [
  "Microsoft Office Professional",
  "Graphic Design",
  "UI/UX Design",
  "Full-Stack Web Development",
  "Cybersecurity",
  "Data Analysis",
  "Digital Marketing",
  "IT Support & Networking",
];

const services = [
  {
    number: "01",
    title: "ICT & Professional Training",
    description:
      "Practical technology and digital-skills programs designed for students, professionals, entrepreneurs, and career changers.",
    href: "/services",
  },
  {
    number: "02",
    title: "Corporate ICT Training",
    description:
      "Customized ICT and digital-skills training designed to help organizations build stronger and more productive teams.",
    href: "/corporate-training",
  },
  {
    number: "03",
    title: "Technology Projects",
    description:
      "Learn by building practical projects that demonstrate real-world technology skills and strengthen your portfolio.",
    href: "/projects",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-950">
      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="relative border-b border-slate-200 bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(37,99,235,0.12),transparent_32%),radial-gradient(circle_at_10%_85%,rgba(14,165,233,0.08),transparent_30%)]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 sm:py-24 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:py-28">
          {/* HERO CONTENT */}
          <div>
            {/* BRAND */}
            <div className="mb-8 flex items-center gap-4">
              <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-200/60">
                <img
                  src="/edsec-logo.png"
                  alt="EDSEC ICT INSTITUTE Logo"
                  className="h-16 w-auto object-contain"
                />
              </div>

              <div>
                <p className="text-xl font-extrabold tracking-tight text-slate-950 sm:text-2xl">
                  EDSEC ICT INSTITUTE
                </p>

                <p className="mt-1 text-sm font-semibold text-blue-600">
                  INNOVATE. EDUCATE. ELEVATE.
                </p>
              </div>
            </div>

            {/* BADGE */}
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              Practical ICT education
            </div>

            <h1 className="max-w-4xl text-5xl font-bold tracking-[-0.045em] text-slate-950 sm:text-6xl lg:text-7xl">
              Learn technology.
              <span className="block text-blue-600">
                Build the future.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              EDSEC ICT INSTITUTE provides practical technology education,
              digital-skills training, professional development, and
              project-based learning for students and professionals.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/courses"
                className="rounded-xl bg-blue-600 px-6 py-3.5 text-center font-semibold text-white transition hover:bg-blue-700"
              >
                Explore Programs
              </Link>

              <Link
                href="/apply"
                className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-center font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
              >
                Apply Now
              </Link>

              <Link
                href="/login"
                className="rounded-xl border border-blue-200 bg-blue-50 px-6 py-3.5 text-center font-semibold text-blue-700 transition hover:bg-blue-100"
              >
                Student Portal
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-sm text-slate-500">
              <span>✓ Practical ICT training</span>
              <span>✓ Project-based learning</span>
              <span>✓ Career-focused skills</span>
            </div>
          </div>

          {/* HERO VISUAL */}
          <div className="relative">
            <div className="absolute -inset-8 rounded-[3rem] bg-blue-100/70 blur-3xl" />

            <div className="relative overflow-hidden rounded-4xlrder border-slate-200 bg-slate-950 p-3 shadow-2xl">
              <div className="rounded-[1.6rem] bg-slate-900 p-6 sm:p-7">
                {/* TOP */}
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-white p-1.5">
                      <img
                        src="/edsec-logo.png"
                        alt="EDSEC ICT INSTITUTE"
                        className="h-10 w-auto object-contain"
                      />
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">
                        EDSEC
                      </p>

                      <p className="mt-1 text-lg font-bold text-white">
                        ICT INSTITUTE
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                  </div>
                </div>

                {/* LAB TITLE */}
                <div className="mb-5">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-blue-400">
                    EDSEC ICT INSTITUTE
                  </p>

                  <p className="mt-1 text-xl font-semibold text-white">
                    Learn. Build. Test. Grow.
                  </p>
                </div>

                {/* STEPS */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    ["01", "Learn the skill"],
                    ["02", "Build a project"],
                    ["03", "Test your knowledge"],
                    ["04", "Build your portfolio"],
                  ].map(([number, title], index) => (
                    <div
                      key={number}
                      className={`rounded-2xl p-5 ${
                        index === 0 ? "bg-blue-600" : "bg-white/10"
                      }`}
                    >
                      <p className="text-3xl font-bold text-white">
                        {number}
                      </p>

                      <p
                        className={`mt-2 text-sm leading-6 ${
                          index === 0
                            ? "text-blue-100"
                            : "text-slate-300"
                        }`}
                      >
                        {title}
                      </p>
                    </div>
                  ))}
                </div>

                {/* BRAND CARD */}
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center gap-4">
                    <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-white p-1.5">
                      <img
                        src="/edsec-logo.png"
                        alt="EDSEC ICT INSTITUTE Logo"
                        className="h-11 w-auto object-contain"
                      />
                    </div>

                    <div>
                      <p className="font-semibold text-white">
                        EDSEC ICT INSTITUTE
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        Innovate. Educate. Elevate.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          STATS
      ===================================================== */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-5 sm:grid-cols-4 lg:px-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="px-4 py-8 sm:px-6 sm:py-10"
            >
              <p className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                {stat.value}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================
          ABOUT EDSEC ICT INSTITUTE
      ===================================================== */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                About EDSEC ICT INSTITUTE
              </p>

              <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                An ICT institute built around practical learning.
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                EDSEC ICT INSTITUTE is focused on helping learners develop
                useful technology skills through practical training,
                guided projects, assessments, and real-world problem solving.
              </p>

              <Link
                href="/about"
                className="mt-7 inline-flex rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-700"
              >
                Learn About EDSEC
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {[
                [
                  "Practical Learning",
                  "Learn by doing through guided exercises, projects, and real technology tasks.",
                ],
                [
                  "Career Focus",
                  "Develop skills and practical experience that can support your next career opportunity.",
                ],
                [
                  "Supportive Community",
                  "Learn alongside other people who are building their technology skills and careers.",
                ],
              ].map(([title, text], index) => (
                <div
                  key={title}
                  className="rounded-2xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50"
                >
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 font-bold text-blue-600">
                    0{index + 1}
                  </div>

                  <h3 className="mt-6 text-xl font-semibold text-slate-950">
                    {title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-600">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURED PROGRAMS
      ===================================================== */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                Featured ICT Programs
              </p>

              <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                Skills that move you forward.
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                Explore practical programs designed to help you build useful
                digital and technology skills.
              </p>
            </div>

            <Link
              href="/courses"
              className="font-semibold text-blue-600 transition hover:text-blue-700"
            >
              View all programs →
            </Link>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {featuredPrograms.map((program) => (
              <Link
                href={program.href}
                key={program.title}
                className="group rounded-2xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/50"
              >
                <div className="flex items-start justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-xl font-bold text-blue-600">
                    {program.icon}
                  </div>

                  <span className="text-slate-300 transition group-hover:text-blue-600">
                    ↗
                  </span>
                </div>

                <h3 className="mt-7 text-xl font-semibold text-slate-950">
                  {program.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {program.description}
                </p>

                <p className="mt-6 font-semibold text-blue-600">
                  View program →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          ALL PROGRAMS
      ===================================================== */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                EDSEC ICT INSTITUTE Programs
              </p>

              <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                Learn skills for the digital economy.
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                From essential computer skills to advanced technology
                programs, EDSEC ICT INSTITUTE provides learning pathways for
                different stages of your technology journey.
              </p>

              <Link
                href="/courses"
                className="mt-7 inline-flex rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-700"
              >
                Explore All Programs
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {learningAreas.map((area, index) => (
                <Link
                  href="/courses"
                  key={area}
                  className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-blue-200 hover:bg-blue-50"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-xs font-bold text-blue-600 shadow-sm">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="font-medium text-slate-800 group-hover:text-blue-700">
                    {area}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          HOW WE TEACH
      ===================================================== */}
      <section className="bg-slate-950 py-24 text-white">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-400">
              The EDSEC ICT INSTITUTE Method
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Learn. Build. Test. Grow.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-400">
              Our approach combines learning, practical exercises, projects,
              assessments, and portfolio development.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-4">
            {[
              ["01", "Learn", "Understand the concepts and technology."],
              ["02", "Practice", "Apply what you learn through exercises."],
              ["03", "Build", "Create practical projects and solutions."],
              ["04", "Grow", "Test your knowledge and build your portfolio."],
            ].map(([number, title, text], index) => (
              <div
                key={number}
                className={`rounded-2xl border p-7 ${
                  index === 0
                    ? "border-blue-500/30 bg-blue-600"
                    : "border-white/10 bg-white/5"
                }`}
              >
                <p className="text-3xl font-bold">{number}</p>

                <h3 className="mt-6 text-xl font-semibold">
                  {title}
                </h3>

                <p
                  className={`mt-3 leading-7 ${
                    index === 0 ? "text-blue-100" : "text-slate-400"
                  }`}
                >
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          SERVICES
      ===================================================== */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              What EDSEC ICT INSTITUTE Does
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              More than an ICT classroom.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              EDSEC ICT INSTITUTE connects ICT education, professional
              development, practical projects, and organizational technology
              training.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {services.map((service) => (
              <Link
                href={service.href}
                key={service.title}
                className="group rounded-2xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-600 text-sm font-bold text-white">
                  {service.number}
                </div>

                <h3 className="mt-6 text-xl font-semibold text-slate-950">
                  {service.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {service.description}
                </p>

                <p className="mt-6 font-semibold text-blue-600">
                  Learn more →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          STUDENT PORTAL
      ===================================================== */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="overflow-hidden rounded-4xl bg-slate-950 p-8 sm:p-12 lg:p-16">
            <div className="grid gap-12 lg:grid-cols-[1fr_.7fr] lg:items-center">
              <div>
                <div className="flex items-center gap-4">
                  <div className="grid h-14 w-14 place-items-center rounded-xl bg-white p-1.5">
                    <img
                      src="/edsec-logo.png"
                      alt="EDSEC ICT INSTITUTE Logo"
                      className="h-11 w-auto object-contain"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-400">
                      EDSEC ICT INSTITUTE
                    </p>

                    <p className="mt-1 font-semibold text-white">
                      Student Portal
                    </p>
                  </div>
                </div>

                <h2 className="mt-7 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  Learn, track, test and grow.
                </h2>

                <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-400">
                  Your student account gives you one place to access your ICT
                  programs, attend online classes, monitor your progress,
                  complete lessons, take assessments, and manage your profile.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/login"
                    className="rounded-xl bg-blue-600 px-6 py-3.5 text-center font-semibold text-white transition hover:bg-blue-500"
                  >
                    Student Login
                  </Link>

                  <Link
                    href="/register"
                    className="rounded-xl border border-slate-700 px-6 py-3.5 text-center font-semibold text-white transition hover:bg-white/5"
                  >
                    Create Account
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Courses", "Access your ICT programs"],
                  ["Progress", "Track your development"],
                  ["Classes", "Join online learning"],
                  ["Tests", "Check your knowledge"],
                ].map(([title, text]) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5"
                  >
                    <p className="font-semibold text-white">
                      {title}
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          VIRTUAL CLASS
      ===================================================== */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-10 rounded-4xl border border-slate-200 bg-white p-8 sm:p-12 lg:grid-cols-[1fr_.8fr] lg:items-center lg:p-14">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                Online Learning
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Attend classes from wherever you are.
              </h2>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                EDSEC ICT INSTITUTE is designed to support flexible learning.
                Students can access scheduled online classes, learning
                materials, and lessons directly from their student portal.
              </p>

              <div className="mt-7 flex flex-wrap gap-3 text-sm font-medium text-slate-600">
                <span className="rounded-full bg-slate-100 px-4 py-2">
                  Audio-friendly
                </span>

                <span className="rounded-full bg-slate-100 px-4 py-2">
                  Low-bandwidth friendly
                </span>

                <span className="rounded-full bg-slate-100 px-4 py-2">
                  Class materials
                </span>

                <span className="rounded-full bg-slate-100 px-4 py-2">
                  Online access
                </span>
              </div>
            </div>

            <div className="rounded-3xl bg-slate-950 p-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">
                      Upcoming Class
                    </p>

                    <p className="mt-2 text-xl font-semibold text-white">
                      Full-Stack Web Development
                    </p>
                  </div>

                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-600 text-xl">
                    🎥
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white/5 p-4">
                    <p className="text-xs text-slate-500">
                      Mode
                    </p>

                    <p className="mt-1 font-medium text-white">
                      Online
                    </p>
                  </div>

                  <div className="rounded-xl bg-white/5 p-4">
                    <p className="text-xs text-slate-500">
                      Access
                    </p>

                    <p className="mt-1 font-medium text-white">
                      Student Portal
                    </p>
                  </div>
                </div>

                <Link
                  href="/login"
                  className="mt-5 block rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-blue-500"
                >
                  Enter Student Portal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          COMMUNITY
      ===================================================== */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                EDSEC ICT INSTITUTE Community
              </p>

              <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                See what learning looks like.
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                Explore our ICT learning environment, student activities,
                practical projects, and growing community.
              </p>
            </div>

            <Link
              href="/gallery"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Visit Gallery →
            </Link>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <Link
              href="/gallery"
              className="group relative h-64 overflow-hidden rounded-3xl bg-linear-to-br from-blue-600 via-blue-500 to-cyan-400 p-7"
            >
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full border-25 border-white/10" />

              <div className="absolute bottom-8 right-8 h-20 w-20 rotate-12 rounded-2xl border border-white/20 bg-white/10" />

              <div className="relative flex h-full flex-col justify-between">
                <span className="text-sm font-semibold text-blue-100">
                  01
                </span>

                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Training
                  </h3>

                  <p className="mt-2 text-sm text-blue-100">
                    Explore the EDSEC ICT INSTITUTE learning environment.
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/projects"
              className="group relative h-64 overflow-hidden rounded-3xl bg-slate-900 p-7"
            >
              <div className="absolute right-8 top-8 grid h-24 w-24 rotate-12 place-items-center rounded-3xl border border-blue-400/30 bg-blue-500/10 text-4xl text-blue-400">
                ⌘
              </div>

              <div className="relative flex h-full flex-col justify-between">
                <span className="text-sm font-semibold text-blue-400">
                  02
                </span>

                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Projects
                  </h3>

                  <p className="mt-2 text-sm text-slate-400">
                    Discover what our learners build.
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/gallery"
              className="group relative h-64 overflow-hidden rounded-3xl bg-linear-to-br from-slate-100 to-blue-100 p-7"
            >
              <div className="absolute right-8 top-8 h-28 w-28 rounded-full border-18 border-blue-200/70" />

              <div className="absolute bottom-8 right-10 h-14 w-14 rotate-12 rounded-xl bg-blue-600/20" />

              <div className="relative flex h-full flex-col justify-between">
                <span className="text-sm font-semibold text-blue-600">
                  03
                </span>

                <div>
                  <h3 className="text-2xl font-bold text-slate-950">
                    Community
                  </h3>

                  <p className="mt-2 text-sm text-slate-600">
                    Learn and grow together.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          CORPORATE TRAINING
      ===================================================== */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="rounded-4xl border border-slate-200 bg-white p-8 sm:p-12">
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                  For Organizations
                </p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  Build stronger digital teams.
                </h2>

                <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                  EDSEC ICT INSTITUTE provides customized ICT and
                  digital-skills training for businesses, schools, hospitals,
                  churches, hotels, banks, and other organizations.
                </p>
              </div>

              <Link
                href="/corporate-training"
                className="rounded-xl bg-blue-600 px-7 py-3.5 text-center font-semibold text-white transition hover:bg-blue-700"
              >
                Corporate Training →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}
      <section className="bg-slate-950 py-24">
        <div className="mx-auto max-w-5xl px-5 text-center lg:px-8">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-2xl bg-white p-2 shadow-xl">
            <img
              src="/edsec-logo.png"
              alt="EDSEC ICT INSTITUTE Logo"
              className="h-16 w-auto object-contain"
            />
          </div>

          <p className="mt-7 text-sm font-semibold uppercase tracking-[0.18em] text-blue-400">
            Start Your ICT Journey
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Your next skill can change your future.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-400">
            Explore our ICT programs, join the student community, or submit
            an application and take the next step toward practical technology
            skills with EDSEC ICT INSTITUTE.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/apply"
              className="rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white transition hover:bg-blue-500"
            >
              Apply to EDSEC ICT INSTITUTE
            </Link>

            <Link
              href="/courses"
              className="rounded-xl border border-slate-700 px-7 py-3.5 font-semibold text-white transition hover:bg-white/5"
            >
              Explore Programs
            </Link>

            <Link
              href="/login"
              className="rounded-xl border border-slate-700 px-7 py-3.5 font-semibold text-white transition hover:bg-white/5"
            >
              Student Portal
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}