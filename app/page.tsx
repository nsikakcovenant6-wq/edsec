/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

const courses = [
  {
    title: "Full-Stack Web Development",
    description:
      "Build modern websites and full-stack applications from frontend to backend.",
    icon: "⌘",
    href: "/courses/full-stack-web-development",
  },
  {
    title: "Cybersecurity",
    description:
      "Learn practical security fundamentals, networking, threats, and defensive skills.",
    icon: "◈",
    href: "/courses/cybersecurity",
  },
  {
    title: "UI/UX Design",
    description:
      "Turn ideas into intuitive digital experiences using modern design principles.",
    icon: "✦",
    href: "/courses/ui-ux-design",
  },
  {
    title: "IT Support & Networking",
    description:
      "Develop hands-on skills in computer support, networks, systems, and troubleshooting.",
    icon: "⌁",
    href: "/courses/it-support-networking",
  },
];

const stats = [
  {
    value: "20+",
    label: "Training Systems",
  },
  {
    value: "8",
    label: "Core Programs",
  },
  {
    value: "100%",
    label: "Practical Focus",
  },
  {
    value: "1",
    label: "Growing Community",
  },
];

const services = [
  {
    title: "Professional Training",
    text: "Practical technology programs designed for students and professionals.",
    href: "/services",
    icon: "01",
  },
  {
    title: "Corporate Training",
    text: "Technology and digital-skills training for organizations and teams.",
    href: "/corporate-training",
    icon: "02",
  },
  {
    title: "Student Projects",
    text: "Explore practical projects created by EDSEC learners.",
    href: "/projects",
    icon: "03",
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

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-hidden bg-white text-slate-950">

      {/* =====================================================
          PUBLIC NAVIGATION
      ===================================================== */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white">
              <img
                src="/edsec-logo.png"
                alt="EDSEC Computer Training"
                className="h-9 w-auto object-contain"
              />
            </div>

            <div className="hidden sm:block">
              <p className="font-bold tracking-tight text-slate-950">
                EDSEC
              </p>

              <p className="text-[11px] text-slate-500">
                Computer Training
              </p>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden items-center gap-7 lg:flex">
            <Link
              href="/"
              className="text-sm font-medium text-blue-600"
            >
              Home
            </Link>

            <Link
              href="/about"
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              About
            </Link>

            <Link
              href="/courses"
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              Courses
            </Link>

            <Link
              href="/projects"
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              Projects
            </Link>

            <Link
              href="/gallery"
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              Gallery
            </Link>

            <Link
              href="/services"
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              Services
            </Link>

            <Link
              href="/blog"
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              Blog
            </Link>

            <Link
              href="/corporate-training"
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              Corporate
            </Link>

            <Link
              href="/contact"
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              Contact
            </Link>
          </nav>

          {/* ACTIONS */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:block"
            >
              Login
            </Link>

            <Link
              href="/apply"
              className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 sm:px-5"
            >
              Apply Now
            </Link>
          </div>
        </div>

        {/* MOBILE NAV */}
        <div className="border-t border-slate-100 lg:hidden">
          <div className="mx-auto flex max-w-7xl gap-5 overflow-x-auto px-5 py-3 text-sm">
            <Link
              href="/"
              className="whitespace-nowrap font-semibold text-blue-600"
            >
              Home
            </Link>

            <Link
              href="/about"
              className="whitespace-nowrap text-slate-600"
            >
              About
            </Link>

            <Link
              href="/courses"
              className="whitespace-nowrap text-slate-600"
            >
              Courses
            </Link>

            <Link
              href="/projects"
              className="whitespace-nowrap text-slate-600"
            >
              Projects
            </Link>

            <Link
              href="/gallery"
              className="whitespace-nowrap text-slate-600"
            >
              Gallery
            </Link>

            <Link
              href="/services"
              className="whitespace-nowrap text-slate-600"
            >
              Services
            </Link>

            <Link
              href="/blog"
              className="whitespace-nowrap text-slate-600"
            >
              Blog
            </Link>

            <Link
              href="/corporate-training"
              className="whitespace-nowrap text-slate-600"
            >
              Corporate
            </Link>

            <Link
              href="/contact"
              className="whitespace-nowrap text-slate-600"
            >
              Contact
            </Link>

            <Link
              href="/login"
              className="whitespace-nowrap font-semibold text-blue-600"
            >
              Login
            </Link>
          </div>
        </div>
      </header>

      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="relative border-b border-slate-200 bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(37,99,235,0.10),transparent_32%),radial-gradient(circle_at_15%_80%,rgba(14,165,233,0.08),transparent_28%)]" />

        <div className="relative mx-auto grid min-h-170 max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-[1.05fr_.95fr] lg:px-8">

          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              Practical technology education
            </div>

            <h1 className="max-w-4xl text-5xl font-bold tracking-[-0.04em] text-slate-950 sm:text-6xl lg:text-7xl">
              Learn technology.
              <span className="block text-blue-600">
                Build the future.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              EDSEC Computer Training helps students and professionals develop
              practical digital skills through project-based learning, modern
              technology, and career-focused training.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/courses"
                className="rounded-xl bg-blue-600 px-6 py-3.5 text-center font-semibold text-white transition hover:bg-blue-700"
              >
                Explore Courses
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
              <span>✓ Project-based learning</span>
              <span>✓ Career-focused skills</span>
              <span>✓ Modern training environment</span>
            </div>
          </div>

          {/* HERO VISUAL */}
          <div className="relative">
            <div className="absolute -inset-5 rounded-4xl bg-blue-100/60 blur-3xl" />

            <div className="relative overflow-hidden rounded-4xl border border-slate-200 bg-slate-950 p-4 shadow-2xl">
              <div className="rounded-3xl bg-slate-900 p-6">

                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-blue-400">
                      EDSEC LAB
                    </p>

                    <p className="mt-1 text-lg font-semibold text-white">
                      Build. Test. Learn.
                    </p>
                  </div>

                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    ["01", "Learn the skill"],
                    ["02", "Build a project"],
                    ["03", "Test your knowledge"],
                    ["04", "Grow your portfolio"],
                  ].map(([number, title], index) => (
                    <div
                      key={number}
                      className={`rounded-2xl p-5 ${
                        index === 0
                          ? "bg-blue-600"
                          : "bg-white/10"
                      }`}
                    >
                      <p className="text-3xl font-bold text-white">
                        {number}
                      </p>

                      <p
                        className={`mt-2 text-sm ${
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

                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center gap-4">

                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-white">
                      <img
                        src="/edsec-logo.png"
                        alt="EDSEC"
                        className="h-9 w-auto object-contain"
                      />
                    </div>

                    <div>
                      <p className="font-semibold text-white">
                        Innovate. Educate. Elevate.
                      </p>

                      <p className="text-sm text-slate-400">
                        Practical skills for the digital world.
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
              className="px-4 py-8 sm:px-6"
            >
              <p className="text-3xl font-bold tracking-tight text-slate-950">
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
          WHY EDSEC
      ===================================================== */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">

          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              Why EDSEC
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Education designed around doing.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              We believe technology is best learned by building, experimenting,
              solving problems, and applying knowledge to real situations.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              [
                "Practical learning",
                "Less theory-only learning. More guided practice and real projects.",
              ],
              [
                "Career-focused",
                "Build skills and a portfolio that can support your next opportunity.",
              ],
              [
                "Supportive community",
                "Learn alongside people who are exploring technology and growing together.",
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
      </section>

      {/* =====================================================
          COURSES
      ===================================================== */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">

          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                Featured learning
              </p>

              <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                Skills that move you forward.
              </h2>
            </div>

            <Link
              href="/courses"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              View all courses →
            </Link>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {courses.map((course) => (
              <Link
                href={course.href}
                key={course.title}
                className="group rounded-2xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/50"
              >
                <div className="flex items-start justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-xl font-bold text-blue-600">
                    {course.icon}
                  </div>

                  <span className="text-slate-300 transition group-hover:text-blue-600">
                    ↗
                  </span>
                </div>

                <h3 className="mt-7 text-xl font-semibold text-slate-950">
                  {course.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {course.description}
                </p>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* =====================================================
          LEARNING AREAS
      ===================================================== */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">

          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-center">

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                Our programs
              </p>

              <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                Learn skills for the digital economy.
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                From foundational computer skills to advanced technology
                programs, EDSEC provides practical learning pathways for
                different stages of your journey.
              </p>

              <Link
                href="/courses"
                className="mt-7 inline-flex rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-700"
              >
                Explore all programs
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
          SERVICES
      ===================================================== */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">

          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              What we do
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              More than a training centre.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              EDSEC connects education, practical projects, professional
              development, and organizational technology training.
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
                  {service.icon}
                </div>

                <h3 className="mt-6 text-xl font-semibold text-slate-950">
                  {service.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {service.text}
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
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-400">
                  Student Portal
                </p>

                <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  Learn, track, test and grow.
                </h2>

                <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-400">
                  Your EDSEC student account will give you one place to access
                  your courses, monitor learning progress, take assessments,
                  and manage your student profile.
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
                  ["Courses", "Access your learning"],
                  ["Progress", "Track your development"],
                  ["Tests", "Check your knowledge"],
                  ["Profile", "Manage your account"],
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
          GALLERY / COMMUNITY
      ===================================================== */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">

          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                EDSEC Community
              </p>

              <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                See what learning looks like.
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                Explore our training environment, student activities, projects,
                and learning community.
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
              <div className="absolute bottom-8 right-8 h-20 w-20 rounded-2xl border border-white/20 bg-white/10 rotate-12" />

              <div className="relative flex h-full flex-col justify-between">
                <span className="text-sm font-semibold text-blue-100">
                  01
                </span>

                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Training
                  </h3>

                  <p className="mt-2 text-sm text-blue-100">
                    Explore the EDSEC environment.
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
              <div className="absolute bottom-8 right-10 h-14 w-14 rounded-xl bg-blue-600/20 rotate-12" />

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
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">

          <div className="rounded-4xl border border-slate-200 bg-slate-50 p-8 sm:p-12">
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                  For organizations
                </p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  Build stronger digital teams.
                </h2>

                <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                  EDSEC provides customized technology and digital-skills
                  training for businesses, schools, hospitals, churches,
                  hotels, banks, and other organizations.
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

          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-400">
            Start your journey
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Your next skill can change your future.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-400">
            Explore our programs, speak with EDSEC, or submit an application
            and take the first step toward practical technology skills.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">

            <Link
              href="/apply"
              className="rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white transition hover:bg-blue-500"
            >
              Apply to EDSEC
            </Link>

            <Link
              href="/login"
              className="rounded-xl border border-slate-700 px-7 py-3.5 font-semibold text-white transition hover:bg-white/5"
            >
              Student Login
            </Link>

            <Link
              href="/contact"
              className="rounded-xl border border-slate-700 px-7 py-3.5 font-semibold text-white transition hover:bg-white/5"
            >
              Contact Us
            </Link>

          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}
      <footer className="border-t border-white/10 bg-slate-950 text-slate-400">

        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">

          {/* BRAND */}
          <div>
            <Link href="/" className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-white">
                <img
                  src="/edsec-logo.png"
                  alt="EDSEC"
                  className="h-9 w-auto object-contain"
                />
              </div>

              <div>
                <p className="font-bold text-white">
                  EDSEC
                </p>

                <p className="text-xs text-slate-500">
                  Computer Training
                </p>
              </div>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-6 text-slate-500">
              Practical technology education designed to help students and
              professionals build useful digital skills.
            </p>

            <p className="mt-5 text-sm font-medium text-blue-400">
              Innovate. Educate. Elevate.
            </p>
          </div>

          {/* PLATFORM */}
          <div>
            <h3 className="font-semibold text-white">
              Platform
            </h3>

            <div className="mt-5 space-y-3 text-sm">
              <Link href="/courses" className="block hover:text-white">
                Courses
              </Link>

              <Link href="/projects" className="block hover:text-white">
                Student Projects
              </Link>

              <Link href="/gallery" className="block hover:text-white">
                Gallery
              </Link>

              <Link href="/blog" className="block hover:text-white">
                Blog
              </Link>

              <Link href="/login" className="block hover:text-white">
                Student Login
              </Link>

              <Link href="/register" className="block hover:text-white">
                Create Account
              </Link>
            </div>
          </div>

          {/* COMPANY */}
          <div>
            <h3 className="font-semibold text-white">
              Company
            </h3>

            <div className="mt-5 space-y-3 text-sm">
              <Link href="/about" className="block hover:text-white">
                About EDSEC
              </Link>

              <Link href="/services" className="block hover:text-white">
                Services
              </Link>

              <Link
                href="/corporate-training"
                className="block hover:text-white"
              >
                Corporate Training
              </Link>

              <Link href="/contact" className="block hover:text-white">
                Contact
              </Link>

              <Link href="/apply" className="block hover:text-white">
                Apply
              </Link>
            </div>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="font-semibold text-white">
              Contact
            </h3>

            <div className="mt-5 space-y-3 text-sm">
              <a
                href="tel:+2348142137101"
                className="block hover:text-white"
              >
                +234 814 213 7101
              </a>

              <a
                href="mailto:mmekanudoh@gmail.com"
                className="block hover:text-white"
              >
                mmekanudoh@gmail.com
              </a>

              <p>
                Port Harcourt, Rivers State,
                <br />
                Nigeria
              </p>
            </div>
          </div>

        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-5 py-6 text-xs text-slate-600 sm:flex-row lg:px-8">
            <p>
              © {new Date().getFullYear()} EDSEC Computer Training. All rights reserved.
            </p>

            <p>
              Educational Services Consultancy
            </p>
          </div>
        </div>

      </footer>
    </div>
  );
}