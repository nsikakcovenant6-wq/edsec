/* eslint-disable @next/next/no-img-element */

import Link from "next/link";

const featuredPrograms = [
  {
    title: "Full-Stack Web Development",
    description:
      "Learn to design, build, deploy, and maintain modern websites and full-stack web applications.",
    icon: "⌘",
    href: "/courses/full-stack-web-development",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Cybersecurity",
    description:
      "Develop practical knowledge of cybersecurity, networking, threats, security tools, and defensive practices.",
    icon: "◈",
    href: "/courses/cybersecurity",
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "UI/UX Design",
    description:
      "Learn how to transform ideas into intuitive, accessible, and engaging digital experiences.",
    icon: "✦",
    href: "/courses/ui-ux-design",
    image:
      "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "IT Support & Networking",
    description:
      "Build practical skills in computer systems, networking, troubleshooting, maintenance, and technical support.",
    icon: "⌁",
    href: "/courses/it-support-networking",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
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

const communityCards = [
  {
    number: "01",
    title: "Training",
    description:
      "Explore the EDSEC ICT INSTITUTE learning environment.",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
    href: "/gallery",
  },
  {
    number: "02",
    title: "Projects",
    description: "Discover what our learners build.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    href: "/projects",
  },
  {
    number: "03",
    title: "Community",
    description: "Learn and grow together.",
    image:
      "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1200&q=80",
    href: "/gallery",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-950">
      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="relative border-b border-slate-200 bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(37,99,235,0.14),transparent_32%),radial-gradient(circle_at_10%_85%,rgba(14,165,233,0.09),transparent_30%)]" />

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

            {/* BUTTONS */}
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
                Student Login
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-sm text-slate-500">
              <span>✓ Practical ICT training</span>
              <span>✓ Project-based learning</span>
              <span>✓ Career-focused skills</span>
            </div>
          </div>

          {/* =================================================
              3D HERO VISUAL
          ================================================= */}
          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-10 rounded-full bg-blue-300/20 blur-3xl" />

            {/* Floating 3D objects */}
            <div className="absolute -right-3 top-8 z-20 hidden h-20 w-20 rotate-12 items-center justify-center rounded-3xl border border-blue-200 bg-white/80 text-3xl shadow-xl backdrop-blur md:flex">
              💻
            </div>

            <div className="absolute -left-5 top-1/3 z-20 hidden h-16 w-16 -rotate-12 items-center justify-center rounded-2xl border border-slate-200 bg-white/90 text-2xl shadow-xl backdrop-blur md:flex">
              ⚡
            </div>

            <div className="absolute -bottom-5 right-12 z-20 hidden h-16 w-16 rotate-12 items-center justify-center rounded-2xl border border-blue-200 bg-white/90 text-2xl shadow-xl backdrop-blur md:flex">
              🔐
            </div>

            {/* Main 3D card */}
            <div className="relative transform-gpu rounded-[2.5rem] border border-slate-200 bg-slate-950 p-3 shadow-[0_35px_90px_rgba(15,23,42,0.25)] transition duration-500 hover:-translate-y-2 hover:rotate-[0.5deg]">
              <div className="relative overflow-hidden rounded-4xl bg-slate-900">
                {/* Image */}
                <div className="relative h-72 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1400&q=80"
                    alt="Students learning technology"
                    className="h-full w-full object-cover opacity-75"
                    loading="eager"
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/30 to-transparent" />

                  {/* 3D glass layer */}
                  <div className="absolute left-6 top-6 h-28 w-28 rotate-12 rounded-3xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-md" />

                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                      EDSEC ICT INSTITUTE
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-white">
                      Learn. Build. Grow.
                    </h2>
                  </div>
                </div>

                {/* Dashboard */}
                <div className="p-5 sm:p-6">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      ["01", "Learn the skill"],
                      ["02", "Build a project"],
                      ["03", "Test knowledge"],
                      ["04", "Build your portfolio"],
                    ].map(([number, title], index) => (
                      <div
                        key={number}
                        className={`relative overflow-hidden rounded-2xl p-5 ${
                          index === 0
                            ? "bg-blue-600"
                            : "border border-white/10 bg-white/5"
                        }`}
                      >
                        <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full border border-white/10" />

                        <p className="relative text-2xl font-bold text-white">
                          {number}
                        </p>

                        <p
                          className={`relative mt-2 text-sm leading-6 ${
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

                  <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-11 w-11 place-items-center rounded-xl bg-white p-1">
                        <img
                          src="/edsec-logo.png"
                          alt="EDSEC"
                          className="h-9 w-auto object-contain"
                        />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-white">
                          EDSEC ICT INSTITUTE
                        </p>

                        <p className="text-xs text-slate-400">
                          Innovate. Educate. Elevate.
                        </p>
                      </div>
                    </div>

                    <Link
                      href="/login"
                      className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-500"
                    >
                      Login
                    </Link>
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
            <div key={stat.label} className="px-4 py-8 sm:px-6 sm:py-10">
              <p className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                {stat.value}
              </p>

              <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================
          ABOUT
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

            {/* 3D ABOUT CARDS */}
            <div className="grid gap-5 md:grid-cols-3">
              {[
                [
                  "Practical Learning",
                  "Learn by doing through guided exercises, projects, and real technology tasks.",
                  "💡",
                ],
                [
                  "Career Focus",
                  "Develop skills and practical experience that can support your next career opportunity.",
                  "🚀",
                ],
                [
                  "Supportive Community",
                  "Learn alongside other people who are building their technology skills and careers.",
                  "🌐",
                ],
              ].map(([title, text, icon], index) => (
                <div
                  key={title}
                  className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
                >
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-50 transition group-hover:scale-125" />

                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-2xl">
                        {icon}
                      </div>

                      <span className="text-xs font-bold text-blue-600">
                        0{index + 1}
                      </span>
                    </div>

                    <h3 className="mt-7 text-xl font-semibold text-slate-950">
                      {title}
                    </h3>

                    <p className="mt-3 leading-7 text-slate-600">{text}</p>
                  </div>
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

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {featuredPrograms.map((program) => (
              <Link
                href={program.href}
                key={program.title}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100/50"
              >
                {/* IMAGE */}
                <div className="relative h-56 overflow-hidden bg-slate-950">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* 3D ICON */}
                  <div className="absolute left-6 top-6 grid h-16 w-16 -rotate-6 place-items-center rounded-2xl border border-white/20 bg-white/15 text-2xl font-bold text-white shadow-2xl backdrop-blur-md transition duration-300 group-hover:rotate-6 group-hover:scale-110">
                    {program.icon}
                  </div>

                  <div className="absolute bottom-5 left-5">
                    <span className="rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
                      EDSEC Program
                    </span>
                  </div>
                </div>

                <div className="p-7">
                  <div className="flex items-start justify-between gap-5">
                    <h3 className="text-xl font-semibold text-slate-950">
                      {program.title}
                    </h3>

                    <span className="text-slate-300 transition group-hover:text-blue-600">
                      ↗
                    </span>
                  </div>

                  <p className="mt-3 leading-7 text-slate-600">
                    {program.description}
                  </p>

                  <p className="mt-6 font-semibold text-blue-600">
                    View program →
                  </p>
                </div>
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
                  className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50 hover:shadow-lg"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-xs font-bold text-blue-600 shadow-sm">
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
      <section className="relative overflow-hidden bg-slate-950 py-24 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(37,99,235,0.2),transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
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
              ["01", "Learn", "Understand the concepts and technology.", "📚"],
              ["02", "Practice", "Apply what you learn through exercises.", "⚙️"],
              ["03", "Build", "Create practical projects and solutions.", "💻"],
              ["04", "Grow", "Test your knowledge and build your portfolio.", "🚀"],
            ].map(([number, title, text, icon], index) => (
              <div
                key={number}
                className={`group relative overflow-hidden rounded-3xl border p-7 transition duration-300 hover:-translate-y-2 ${
                  index === 0
                    ? "border-blue-500/30 bg-blue-600"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full border border-white/10" />

                <div className="relative">
                  <div className="flex items-center justify-between">
                    <p className="text-3xl font-bold">{number}</p>
                    <span className="text-2xl">{icon}</span>
                  </div>

                  <h3 className="mt-6 text-xl font-semibold">{title}</h3>

                  <p
                    className={`mt-3 leading-7 ${
                      index === 0 ? "text-blue-100" : "text-slate-400"
                    }`}
                  >
                    {text}
                  </p>
                </div>
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
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-2xl"
              >
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-50 transition group-hover:scale-125" />

                <div className="relative">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-200">
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
                </div>
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
          <div className="overflow-hidden rounded-[2.5rem] bg-slate-950 p-8 sm:p-12 lg:p-16">
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

              {/* 3D PORTAL CARDS */}
              <div className="relative">
                <div className="absolute -inset-5 rounded-3xl bg-blue-600/10 blur-2xl" />

                <div className="relative grid grid-cols-2 gap-3">
                  {[
                    ["Courses", "Access your ICT programs", "📚"],
                    ["Progress", "Track your development", "📈"],
                    ["Classes", "Join online learning", "🎥"],
                    ["Tests", "Check your knowledge", "✓"],
                  ].map(([title, text, icon]) => (
                    <div
                      key={title}
                      className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-1 hover:bg-white/10"
                    >
                      <div className="text-2xl">{icon}</div>

                      <p className="mt-4 font-semibold text-white">
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
        </div>
      </section>

      {/* =====================================================
          VIRTUAL CLASS
      ===================================================== */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-10 rounded-[2.5rem] border border-slate-200 bg-white p-8 sm:p-12 lg:grid-cols-[1fr_.8fr] lg:items-center lg:p-14">
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

            {/* 3D CLASS CARD */}
            <div className="relative">
              <div className="absolute -inset-5 rounded-3xl bg-blue-200/40 blur-2xl" />

              <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-3 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80"
                  alt="Online technology class"
                  className="h-48 w-full rounded-2xl object-cover opacity-70"
                  loading="lazy"
                />

                <div className="p-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">
                          Upcoming Class
                        </p>

                        <p className="mt-2 text-lg font-semibold text-white">
                          Full-Stack Web Development
                        </p>
                      </div>

                      <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-600 text-xl shadow-lg">
                        🎥
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-white/5 p-4">
                        <p className="text-xs text-slate-500">Mode</p>

                        <p className="mt-1 font-medium text-white">Online</p>
                      </div>

                      <div className="rounded-xl bg-white/5 p-4">
                        <p className="text-xs text-slate-500">Access</p>

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

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {communityCards.map((card) => (
              <Link
                href={card.href}
                key={card.title}
                className="group relative h-72 overflow-hidden rounded-3xl bg-slate-950"
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-700 group-hover:scale-110 group-hover:opacity-80"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/30 to-transparent" />

                <div className="relative flex h-full flex-col justify-between p-7">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-blue-300">
                      {card.number}
                    </span>

                    <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/20 bg-white/10 text-white backdrop-blur-md transition group-hover:rotate-12">
                      ↗
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {card.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {card.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          CORPORATE TRAINING
      ===================================================== */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white">
            <div className="grid lg:grid-cols-[.85fr_1.15fr] lg:items-stretch">
              <div className="p-8 sm:p-12 lg:p-14">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                  For Organizations
                </p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  Build stronger digital teams.
                </h2>

                <p className="mt-5 text-lg leading-8 text-slate-600">
                  EDSEC ICT INSTITUTE provides customized ICT and
                  digital-skills training for businesses, schools, hospitals,
                  churches, hotels, banks, and other organizations.
                </p>

                <Link
                  href="/corporate-training"
                  className="mt-7 inline-flex rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white transition hover:bg-blue-700"
                >
                  Corporate Training →
                </Link>
              </div>

              <div className="relative min-h-72 overflow-hidden bg-slate-950">
                <img
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=80"
                  alt="Corporate technology training"
                  className="absolute inset-0 h-full w-full object-cover opacity-70"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-linear-to-r from-slate-950/90 via-slate-950/20 to-transparent" />

                {/* 3D glass panels */}
                <div className="absolute right-8 top-8 rotate-6 rounded-2xl border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur-md">
                  <p className="text-xs uppercase tracking-widest text-blue-300">
                    Digital Skills
                  </p>

                  <p className="mt-2 text-xl font-bold text-white">
                    Train. Improve. Grow.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}
      <section className="relative overflow-hidden bg-slate-950 py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.3),transparent_40%)]" />

        <div className="relative mx-auto max-w-5xl px-5 text-center lg:px-8">
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

          {/* FINAL BUTTONS INCLUDING LOGIN */}
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
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
              className="rounded-xl border border-blue-500/40 bg-blue-500/10 px-7 py-3.5 font-semibold text-blue-300 transition hover:bg-blue-500/20"
            >
              Student Login
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}