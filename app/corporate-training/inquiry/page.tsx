import Link from "next/link";

export default function CorporateTrainingInquiryPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <section className="bg-slate-950">
        <div className="mx-auto max-w-5xl px-5 py-20 lg:px-8">
          <Link
            href="/corporate-training"
            className="text-sm font-medium text-blue-400 hover:text-blue-300"
          >
            ← Back to Corporate Training
          </Link>

          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-blue-400">
            Corporate Inquiry
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Tell us about your training needs.
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-400">
            Complete the form below and the EDSEC team can review your
            organization&apos;s training requirements.
          </p>
        </div>
      </section>

      {/* FORM */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
            <form className="space-y-8">
              {/* ORGANIZATION */}
              <div>
                <h2 className="text-xl font-semibold text-slate-950">
                  Organization details
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Tell us about the organization requesting training.
                </p>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="organization"
                      className="text-sm font-medium text-slate-700"
                    >
                      Organization name
                    </label>

                    <input
                      id="organization"
                      name="organization"
                      type="text"
                      required
                      placeholder="Organization name"
                      className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="organizationType"
                      className="text-sm font-medium text-slate-700"
                    >
                      Organization type
                    </label>

                    <select
                      id="organizationType"
                      name="organizationType"
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">Select organization type</option>
                      <option>Bank / Financial Institution</option>
                      <option>School</option>
                      <option>Hospital / Healthcare</option>
                      <option>Hotel / Hospitality</option>
                      <option>Church / Religious Organization</option>
                      <option>Retail Business</option>
                      <option>Technology Company</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* CONTACT */}
              <div className="border-t border-slate-200 pt-8">
                <h2 className="text-xl font-semibold text-slate-950">
                  Contact person
                </h2>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contactName"
                      className="text-sm font-medium text-slate-700"
                    >
                      Full name
                    </label>

                    <input
                      id="contactName"
                      name="contactName"
                      type="text"
                      required
                      placeholder="Your full name"
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
                      placeholder="you@company.com"
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
                      placeholder="+234..."
                      className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="format"
                      className="text-sm font-medium text-slate-700"
                    >
                      Preferred training format
                    </label>

                    <select
                      id="format"
                      name="preferredFormat"
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">Select format</option>
                      <option>On-site</option>
                      <option>Online</option>
                      <option>Hybrid</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* TRAINING */}
              <div className="border-t border-slate-200 pt-8">
                <h2 className="text-xl font-semibold text-slate-950">
                  Training requirements
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Select the areas your organization is interested in.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[
                    "Microsoft Office & Productivity",
                    "Cybersecurity Awareness",
                    "IT Support",
                    "Networking",
                    "Graphic Design",
                    "UI/UX Design",
                    "Web Development",
                    "Data Analysis",
                    "Digital Marketing",
                    "Other",
                  ].map((program) => (
                    <label
                      key={program}
                      className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/50"
                    >
                      <input
                        type="checkbox"
                        name="trainingNeeds"
                        value={program}
                        className="h-4 w-4 accent-blue-600"
                      />

                      <span className="text-sm font-medium text-slate-700">
                        {program}
                      </span>
                    </label>
                  ))}
                </div>

                <div className="mt-6">
                  <label
                    htmlFor="message"
                    className="text-sm font-medium text-slate-700"
                  >
                    Tell us more about your needs
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    placeholder="Describe your organization's training goals, number of participants, preferred dates, or any other important information."
                    className="mt-2 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* SUBMIT */}
              <div className="border-t border-slate-200 pt-8">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
                >
                  Submit Training Inquiry
                </button>

                <p className="mt-4 text-sm text-slate-500">
                  Your information will be reviewed by the EDSEC team.
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}