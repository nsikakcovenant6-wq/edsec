import Link from "next/link";

const values = [
  {
    number: "01",
    title: "Practical",
    text: "We focus on learning by doing. Students don't just study concepts — they apply them.",
  },
  {
    number: "02",
    title: "Accessible",
    text: "Technology education should be understandable and accessible to students at different levels.",
  },
  {
    number: "03",
    title: "Career-focused",
    text: "Our programs are designed around skills that can be applied to real projects and opportunities.",
  },
  {
    number: "04",
    title: "Continuous growth",
    text: "Technology changes constantly, so we encourage students to keep learning and improving.",
  },
];

const milestones = [
  {
    title: "Learn",
    text: "Build a strong foundation through structured lessons and guided practice.",
  },
  {
    title: "Practice",
    text: "Work through exercises that turn concepts into practical skills.",
  },
  {
    title: "Build",
    text: "Create projects that demonstrate what you have learned.",
  },
  {
    title: "Grow",
    text: "Continue developing your skills, portfolio, and confidence.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950">
        {/* CSS VISUAL */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute -bottom-32 left-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="absolute right-[12%] top-1/2 hidden h-64 w-64 -translate-y-1/2 rotate-12 rounded-[3rem] border border-blue-400/20 bg-blue-500/5 lg:block" />

          <div className="absolute right-[17%] top-1/2 hidden h-44 w-44 -translate-y-1/2 rotate-45 rounded-3xl border border-white/10 bg-white/3 lg:block" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300">
              <span className="h-2 w-2 rounded-full bg-blue-400" />
              About EDSEC
            </div>

            <h1 className="mt-7 text-5xl font-bold tracking-tighter text-white sm:text-6xl lg:text-7xl">
              Building people who can
              <span className="block text-blue-400">
                build technology.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400 sm:text-xl">
              EDSEC Computer Training is focused on practical technology
              education that helps students develop useful digital skills,
              build projects, and prepare for the opportunities of a
              technology-driven world.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/courses"
                className="rounded-xl bg-blue-600 px-6 py-3.5 text-center font-semibold text-white transition hover:bg-blue-500"
              >
                Explore Programs
              </Link>

              <Link
                href="/contact"
                className="rounded-xl border border-slate-700 px-6 py-3.5 text-center font-semibold text-white transition hover:bg-white/5"
              >
                Talk to EDSEC
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              Who we are
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Education for the digital generation.
            </h2>

            <div className="mt-6 space-y-5 text-lg leading-8 text-slate-600">
              <p>
                EDSEC stands for{" "}
                <strong className="font-semibold text-slate-900">
                  Educational Services Consultancy.
                </strong>
              </p>

              <p>
                Our goal is to make technology education more practical,
                structured, and relevant to the people who want to use
                technology to create opportunities.
              </p>

              <p>
                From web development and cybersecurity to design, data, IT
                support, and digital skills, our programs are designed to help
                learners move from understanding concepts to applying them.
              </p>
            </div>
          </div>

          {/* CODE-GENERATED VISUAL */}
          <div className="relative">
            <div className="absolute -inset-6 rounded-[3rem] bg-blue-100 blur-3xl" />

            <div className="relative overflow-hidden rounded-4xl border border-slate-200 bg-slate-950 p-5 shadow-2xl">
              <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                      EDSEC
                    </p>

                    <p className="mt-1 font-semibold text-white">
                      Learning System
                    </p>
                  </div>

                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-sm font-bold text-white">
                    E
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3">
                  {[
                    ["Learn", "01"],
                    ["Practice", "02"],
                    ["Build", "03"],
                    ["Grow", "04"],
                  ].map(([title, number], index) => (
                    <div
                      key={title}
                      className={`rounded-2xl p-5 ${
                        index === 0
                          ? "bg-blue-600"
                          : "border border-white/10 bg-white/4"
                      }`}
                    >
                      <p
                        className={`text-xs ${
                          index === 0
                            ? "text-blue-100"
                            : "text-slate-500"
                        }`}
                      >
                        {number}
                      </p>

                      <p className="mt-3 font-semibold text-white">
                        {title}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-3 rounded-2xl border border-white/10 bg-white/3 p-5">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-blue-500" />

                    <div className="h-2 w-32 rounded-full bg-white/10" />
                  </div>

                  <div className="mt-5 h-2 rounded-full bg-white/10">
                    <div className="h-2 w-[72%] rounded-full bg-blue-600" />
                  </div>

                  <div className="mt-3 flex justify-between text-xs text-slate-500">
                    <span>Progress</span>
                    <span>72%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="border-y border-slate-200 bg-slate-50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl bg-blue-600 p-8 sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">
                Our mission
              </p>

              <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Make practical technology education easier to access.
              </h2>

              <p className="mt-5 max-w-xl leading-8 text-blue-100">
                We want learners to have the knowledge, practical experience,
                and confidence required to participate meaningfully in the
                digital economy.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                Our vision
              </p>

              <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                A community of capable digital creators.
              </h2>

              <p className="mt-5 max-w-xl leading-8 text-slate-600">
                We envision an environment where students don&apos;t simply
                consume technology — they understand it, build with it, and
                use it to solve problems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              What we believe
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Built around useful learning.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Everything we build at EDSEC is guided by a simple principle:
              learning should lead somewhere.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.number}
                className="rounded-2xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/50"
              >
                <span className="text-sm font-bold text-blue-600">
                  {value.number}
                </span>

                <h3 className="mt-6 text-xl font-semibold text-slate-950">
                  {value.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {value.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LEARNING MODEL */}
      <section className="bg-slate-950 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-400">
              The EDSEC model
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              From classroom to capability.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-400">
              Our learning experience follows a simple progression that
              encourages students to continuously apply what they learn.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-4">
            {milestones.map((item, index) => (
              <div
                key={item.title}
                className="relative rounded-2xl border border-white/10 bg-white/4 p-7"
              >
                <span className="text-sm font-bold text-blue-400">
                  0{index + 1}
                </span>

                <h3 className="mt-6 text-xl font-semibold text-white">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {item.text}
                </p>

                {index < milestones.length - 1 && (
                  <span className="absolute -right-2 top-1/2 hidden h-4 w-4 rotate-45 border-r border-t border-blue-400/40 bg-slate-950 md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-5 text-center lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
            Innovate. Educate. Elevate.
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Ready to start learning?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Explore our programs and find the technology skill you want to
            develop.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/courses"
              className="rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white transition hover:bg-blue-700"
            >
              Explore Courses
            </Link>

            <Link
              href="/apply"
              className="rounded-xl border border-slate-300 px-7 py-3.5 font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}