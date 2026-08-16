import Link from "next/link";

const galleryItems = [
  {
    title: "Practical Computer Training",
    category: "Training",
    icon: "💻",
    gradient: "from-blue-600 to-cyan-500",
  },
  {
    title: "Web Development Class",
    category: "Technology",
    icon: "{" + "</>" + "}",
    gradient: "from-indigo-600 to-blue-500",
  },
  {
    title: "Students Learning Technology",
    category: "Students",
    icon: "🎓",
    gradient: "from-violet-600 to-indigo-500",
  },
  {
    title: "Graphic Design Training",
    category: "Design",
    icon: "✦",
    gradient: "from-pink-600 to-purple-600",
  },
  {
    title: "Cybersecurity Training",
    category: "Cybersecurity",
    icon: "🔐",
    gradient: "from-slate-700 to-blue-700",
  },
  {
    title: "Technology Workshop",
    category: "Workshop",
    icon: "⚙",
    gradient: "from-cyan-600 to-teal-500",
  },
  {
    title: "Student Project Development",
    category: "Projects",
    icon: "🚀",
    gradient: "from-blue-700 to-violet-600",
  },
  {
    title: "EDSEC Learning Environment",
    category: "Learning",
    icon: "◈",
    gradient: "from-indigo-700 to-cyan-500",
  },
];

function GeneratedVisual({
  icon,
  gradient,
}: {
  icon: string;
  gradient: string;
}) {
  return (
    <div
      className={`relative flex aspect-4/3 items-center justify-center overflow-hidden bg-linear-to-br ${gradient}`}
    >
      {/* Decorative background */}
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full border border-white/20" />
      <div className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full border border-white/10" />

      <div className="absolute left-8 top-8 h-2 w-2 rounded-full bg-white/60" />
      <div className="absolute right-12 top-20 h-3 w-3 rounded-full bg-white/40" />
      <div className="absolute bottom-10 right-8 h-2 w-2 rounded-full bg-white/50" />

      {/* Main generated illustration */}
      <div className="relative flex h-32 w-32 items-center justify-center rounded-4xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-md">
        <div className="text-6xl font-bold text-white drop-shadow-lg">
          {icon}
        </div>
      </div>

      {/* Bottom glow */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-black/20 to-transparent" />

      {/* EDSEC label */}
      <div className="absolute bottom-5 left-5 rounded-full border border-white/20 bg-black/20 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-white backdrop-blur-sm">
        EDSEC
      </div>
    </div>
  );
}

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950 px-6 py-24 text-white">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
            EDSEC Gallery
          </p>

          <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Learning, building and creating the future.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Explore the learning experience, technology projects, workshops
            and activities happening at EDSEC Computer Training.
          </p>
        </div>
      </section>

      {/* GALLERY */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                Inside EDSEC
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Our learning experience
              </h2>
            </div>

            <p className="max-w-md text-sm leading-6 text-slate-500">
              Practical learning, technology, creativity and collaboration —
              all in one environment.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((item) => (
              <article
                key={item.title}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <GeneratedVisual
                  icon={item.icon}
                  gradient={item.gradient}
                />

                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                    {item.category}
                  </p>

                  <h3 className="mt-2 text-lg font-semibold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Practical technology education designed to help students
                    build useful skills.
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="border-y border-slate-100 bg-slate-50 px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              More than a classroom
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Learn. Build. Create.
            </h2>

            <p className="mt-5 max-w-xl leading-8 text-slate-600">
              EDSEC is designed around practical learning. Students don&apos;t
              simply watch lessons — they develop projects, solve problems,
              experiment with technology and build confidence.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                ["20+", "Systems"],
                ["8+", "Courses"],
                ["100%", "Practical"],
                ["∞", "Possibilities"],
              ].map(([number, label]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-slate-200 bg-white p-4"
                >
                  <div className="text-2xl font-bold text-blue-600">
                    {number}
                  </div>

                  <div className="mt-1 text-xs text-slate-500">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="rounded-3xl bg-slate-950 p-6 shadow-2xl">
              <div className="mb-5 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
              </div>

              <div className="rounded-2xl bg-slate-900 p-6 font-mono text-sm">
                <p className="text-blue-400">const</p>

                <p className="mt-2 text-slate-300">
                  <span className="text-purple-400">student</span> = {"{"}
                </p>

                <p className="ml-5 mt-2 text-slate-400">
                  learn:{" "}
                  <span className="text-green-400">&quot;technology&quot;</span>,
                </p>

                <p className="ml-5 text-slate-400">
                  build:{" "}
                  <span className="text-green-400">&quot;real projects&quot;</span>,
                </p>

                <p className="ml-5 text-slate-400">
                  future:{" "}
                  <span className="text-green-400">&quot;unlimited&quot;</span>
                </p>

                <p className="text-slate-300">{"}"}</p>
              </div>

              <div className="mt-5 text-center text-xs font-semibold tracking-[0.25em] text-slate-500">
                INNOVATE · EDUCATE · ELEVATE
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-blue-600 px-6 py-14 text-center text-white sm:px-12">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Start your technology journey with EDSEC.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-blue-100">
            Learn practical digital skills, build real projects and prepare
            yourself for the future of technology.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/courses"
              className="rounded-xl bg-white px-6 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
            >
              Explore Courses
            </Link>

            <Link
              href="/apply"
              className="rounded-xl border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}