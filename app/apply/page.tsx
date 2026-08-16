import Link from "next/link";

const courses = [
  "Microsoft Office Professional",
  "Graphic Design",
  "UI/UX Design",
  "Full-Stack Web Development",
  "Cybersecurity",
  "Data Analysis",
  "Digital Marketing",
  "IT Support & Networking",
];

export default function ApplyPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* HERO */}
      <section className="bg-slate-950">
        <div className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
          <Link
            href="/courses"
            className="text-sm font-medium text-blue-400 transition hover:text-blue-300"
          >
            ← Explore Courses
          </Link>

          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-blue-400">
            Apply to EDSEC
          </p>

          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Start building your technology skills.
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-400">
            Complete the application form and tell us about yourself, the
            program you are interested in, and how you would like to learn.
          </p>
        </div>
      </section>

      {/* FORM */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            {/* MAIN FORM */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
              <form className="space-y-9">
                {/* PERSONAL INFORMATION */}
                <div>
                  <h2 className="text-xl font-semibold text-slate-950">
                    Personal information
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Enter your basic information.
                  </p>

                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="text-sm font-medium text-slate-700"
                      >
                        First name
                      </label>

                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        placeholder="First name"
                        className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="lastName"
                        className="text-sm font-medium text-slate-700"
                      >
                        Last name
                      </label>

                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        placeholder="Last name"
                        className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="text-sm font-medium text-slate-700"
                      >
                        Email address
                      </label>

                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="text-sm font-medium text-slate-700"
                      >
                        Phone number
                      </label>

                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        placeholder="+234..."
                        className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="dateOfBirth"
                        className="text-sm font-medium text-slate-700"
                      >
                        Date of birth
                      </label>

                      <input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="educationalLevel"
                        className="text-sm font-medium text-slate-700"
                      >
                        Educational level
                      </label>

                      <select
                        id="educationalLevel"
                        name="educationalLevel"
                        className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="">Select level</option>
                        <option>Secondary School</option>
                        <option>Undergraduate</option>
                        <option>Graduate</option>
                        <option>Working Professional</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* COURSE */}
                <div className="border-t border-slate-200 pt-9">
                  <h2 className="text-xl font-semibold text-slate-950">
                    Choose your program
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Select the course you would like to study.
                  </p>

                  <div className="mt-6">
                    <label
                      htmlFor="course"
                      className="text-sm font-medium text-slate-700"
                    >
                      Preferred course
                    </label>

                    <select
                      id="course"
                      name="course"
                      required
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">Select a course</option>

                      {courses.map((course) => (
                        <option key={course} value={course}>
                          {course}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-6">
                    <p className="text-sm font-medium text-slate-700">
                      Preferred learning format
                    </p>

                    <div className="mt-3 grid gap-3 sm:grid-cols-3">
                      {["On-site", "Online", "Hybrid"].map((format) => (
                        <label
                          key={format}
                          className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/50"
                        >
                          <input
                            type="radio"
                            name="preferredFormat"
                            value={format}
                            required
                            className="h-4 w-4 accent-blue-600"
                          />

                          <span className="text-sm font-medium text-slate-700">
                            {format}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6">
                    <label
                      htmlFor="preferredStartDate"
                      className="text-sm font-medium text-slate-700"
                    >
                      Preferred start date
                    </label>

                    <input
                      id="preferredStartDate"
                      name="preferredStartDate"
                      type="date"
                      className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {/* ADDITIONAL INFORMATION */}
                <div className="border-t border-slate-200 pt-9">
                  <h2 className="text-xl font-semibold text-slate-950">
                    Additional information
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Tell us anything else we should know.
                  </p>

                  <textarea
                    id="additionalInfo"
                    name="additionalInfo"
                    rows={6}
                    placeholder="Tell us about your goals, previous experience, or anything else you would like us to know."
                    className="mt-6 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* SUBMIT */}
                <div className="border-t border-slate-200 pt-9">
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
                  >
                    Submit Application
                  </button>

                  <p className="mt-4 text-sm leading-6 text-slate-500">
                    By submitting this application, you confirm that the
                    information provided is accurate.
                  </p>
                </div>
              </form>
            </div>

            {/* SIDE PANEL */}
            <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-7">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 font-bold text-blue-600">
                E
              </div>

              <h2 className="mt-6 text-xl font-semibold text-slate-950">
                What happens next?
              </h2>

              <div className="mt-6 space-y-6">
                {[
                  [
                    "01",
                    "Application review",
                    "The EDSEC team reviews your application.",
                  ],
                  [
                    "02",
                    "Confirmation",
                    "We contact you with the next steps.",
                  ],
                  [
                    "03",
                    "Enrollment",
                    "You complete enrollment and prepare to begin.",
                  ],
                ].map(([number, title, text]) => (
                  <div key={number} className="flex gap-4">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-600 text-xs font-bold text-white">
                      {number}
                    </span>

                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {title}
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        {text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-2xl bg-slate-950 p-5">
                <p className="text-sm font-semibold text-white">
                  Need help before applying?
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Explore our courses or contact EDSEC before submitting your
                  application.
                </p>

                <Link
                  href="/contact"
                  className="mt-4 inline-flex font-semibold text-blue-400 hover:text-blue-300"
                >
                  Contact EDSEC →
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}