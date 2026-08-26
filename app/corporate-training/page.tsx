import Link from "next/link";

import { submitCorporateInquiry } from "./actions";

export default function CorporateTrainingPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      {/* ============================================================
          HERO
      ============================================================ */}

      <section className="overflow-hidden bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
              Corporate Training
            </p>

            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Build stronger teams with practical technology training.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              Equip your employees with practical digital skills,
              cybersecurity awareness, productivity tools, technical
              knowledge, and modern workplace capabilities through
              customized corporate training programs.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#inquiry"
                className="rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-500"
              >
                Request Corporate Training
              </a>

              <Link
                href="/courses"
                className="rounded-xl border border-white/15 px-6 py-3.5 font-semibold text-white transition hover:bg-white/5"
              >
                View Courses
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          INTRODUCTION
      ============================================================ */}

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
              Why EDSEC
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Training designed around your organization.
            </h2>

            <p className="mt-5 text-base leading-8 text-slate-600">
              Every organization has different technology needs. EDSEC
              provides practical and flexible training programs that can
              be adapted to your employees, systems, industry, and
              organizational goals.
            </p>

            <p className="mt-4 text-base leading-8 text-slate-600">
              Our goal is not simply to teach theory. We focus on
              practical skills that employees can apply directly in
              their daily work.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Practical Learning",
                text: "Hands-on training focused on real workplace tasks.",
              },
              {
                title: "Customized Programs",
                text: "Training can be adapted to your organization's needs.",
              },
              {
                title: "Flexible Delivery",
                text: "Choose suitable training formats and schedules.",
              },
              {
                title: "Technology Skills",
                text: "Build stronger digital and technical capabilities.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 font-bold text-blue-600">
                  ✓
                </div>

                <h3 className="mt-5 font-bold text-slate-950">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          TRAINING AREAS
      ============================================================ */}

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
              Training Areas
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Technology training for modern organizations.
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-500">
              Select one or more areas that match your organization&apos;s
              current training needs.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Microsoft Office",
                text: "Word, Excel, PowerPoint and workplace productivity.",
              },
              {
                title: "Cybersecurity",
                text: "Security awareness, safe computing and cyber hygiene.",
              },
              {
                title: "IT Support",
                text: "Computer systems, troubleshooting and technical support.",
              },
              {
                title: "Networking",
                text: "Networking fundamentals and infrastructure awareness.",
              },
              {
                title: "Web Development",
                text: "Modern web technologies and application development.",
              },
              {
                title: "Digital Marketing",
                text: "Digital platforms, online marketing and business growth.",
              },
              {
                title: "Data Analysis",
                text: "Data handling, analysis and practical reporting.",
              },
              {
                title: "Graphic Design",
                text: "Visual communication and digital design skills.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-lg"
              >
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-600 text-lg font-bold text-white">
                  +
                </div>

                <h3 className="mt-5 font-bold">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          WHO WE SERVE
      ============================================================ */}

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            "Banks & Financial Institutions",
            "Hospitals & Healthcare Organizations",
            "Schools & Educational Institutions",
            "Hotels & Hospitality",
            "Churches & Religious Organizations",
            "Retail Businesses",
            "Government Organizations",
            "Technology Companies",
          ].map((organization) => (
            <div
              key={organization}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-5 font-semibold text-slate-800 shadow-sm"
            >
              {organization}
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================
          INQUIRY SECTION
      ============================================================ */}

      <section
        id="inquiry"
        className="bg-slate-950 text-white"
      >
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            {/* LEFT */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-400">
                Corporate Inquiry
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Tell us what your organization needs.
              </h2>

              <p className="mt-5 text-base leading-8 text-slate-400">
                Complete the form and the EDSEC team will review your
                requirements and contact you about a suitable training
                program.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "Customized training programs",
                  "Practical instructor-led sessions",
                  "Flexible delivery formats",
                  "Training designed around your organization",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3"
                  >
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-blue-600 text-xs font-bold">
                      ✓
                    </span>

                    <p className="text-sm leading-6 text-slate-300">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* FORM */}
            <div className="rounded-3xl bg-white p-6 text-slate-950 shadow-2xl sm:p-8 lg:p-10">
              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
                  Request Training
                </p>

                <h3 className="mt-2 text-2xl font-bold">
                  Corporate training inquiry
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Tell us a little about your organization and the
                  training you need.
                </p>
              </div>

              <form
                action={submitCorporateInquiry}
                className="space-y-6"
              >
                {/* ORGANIZATION */}
                <div>
                  <label
                    htmlFor="organization"
                    className="text-sm font-semibold text-slate-800"
                  >
                    Organization Name
                  </label>

                  <input
                    id="organization"
                    name="organization"
                    type="text"
                    required
                    placeholder="e.g. EDSEC Technologies Ltd"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />
                </div>

                {/* CONTACT NAME */}
                <div>
                  <label
                    htmlFor="contactName"
                    className="text-sm font-semibold text-slate-800"
                  >
                    Contact Person
                  </label>

                  <input
                    id="contactName"
                    name="contactName"
                    type="text"
                    required
                    placeholder="Your full name"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />
                </div>

                {/* EMAIL + PHONE */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="email"
                      className="text-sm font-semibold text-slate-800"
                    >
                      Email Address
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@company.com"
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="text-sm font-semibold text-slate-800"
                    >
                      Phone Number
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+234..."
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                    />
                  </div>
                </div>

                {/* ORGANIZATION TYPE */}
                <div>
                  <label
                    htmlFor="organizationType"
                    className="text-sm font-semibold text-slate-800"
                  >
                    Organization Type
                  </label>

                  <select
                    id="organizationType"
                    name="organizationType"
                    defaultValue=""
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  >
                    <option value="" disabled>
                      Select organization type
                    </option>

                    <option value="Bank / Financial Institution">
                      Bank / Financial Institution
                    </option>

                    <option value="Hospital / Healthcare">
                      Hospital / Healthcare
                    </option>

                    <option value="School / Education">
                      School / Education
                    </option>

                    <option value="Hotel / Hospitality">
                      Hotel / Hospitality
                    </option>

                    <option value="Church / Religious Organization">
                      Church / Religious Organization
                    </option>

                    <option value="Retail Business">
                      Retail Business
                    </option>

                    <option value="Government Organization">
                      Government Organization
                    </option>

                    <option value="Technology Company">
                      Technology Company
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>
                </div>

                {/* TRAINING NEEDS */}
                <div>
                  <label
                    htmlFor="trainingNeeds"
                    className="text-sm font-semibold text-slate-800"
                  >
                    Training Needs
                  </label>

                  <textarea
                    id="trainingNeeds"
                    name="trainingNeeds"
                    required
                    rows={5}
                    placeholder="Tell us what skills or areas your employees need training in..."
                    className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />
                </div>

                {/* PREFERRED FORMAT */}
                <div>
                  <label
                    htmlFor="preferredFormat"
                    className="text-sm font-semibold text-slate-800"
                  >
                    Preferred Training Format
                  </label>

                  <select
                    id="preferredFormat"
                    name="preferredFormat"
                    defaultValue=""
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  >
                    <option value="" disabled>
                      Select preferred format
                    </option>

                    <option value="On-site">
                      On-site
                    </option>

                    <option value="Online">
                      Online
                    </option>

                    <option value="Hybrid">
                      Hybrid
                    </option>

                    <option value="Not sure">
                      Not sure
                    </option>
                  </select>
                </div>

                {/* MESSAGE */}
                <div>
                  <label
                    htmlFor="message"
                    className="text-sm font-semibold text-slate-800"
                  >
                    Additional Information
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Anything else you would like us to know..."
                    className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  className="w-full rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
                >
                  Submit Training Inquiry →
                </button>

                <p className="text-center text-xs leading-5 text-slate-400">
                  By submitting this form, you are requesting information
                  about EDSEC corporate training services.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          CTA
      ============================================================ */}

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="rounded-3xl bg-blue-600 px-7 py-10 text-white sm:px-10 lg:flex lg:items-center lg:justify-between lg:gap-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-100">
              EDSEC ICT Institute
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              Innovate. Educate. Elevate.
            </h2>

            <p className="mt-3 max-w-2xl text-blue-100">
              Develop the technology skills your organization needs
              to grow.
            </p>
          </div>

          <a
            href="#inquiry"
            className="mt-7 inline-flex rounded-xl bg-white px-6 py-3.5 font-semibold text-blue-700 transition hover:bg-blue-50 lg:mt-0"
          >
            Start an Inquiry
          </a>
        </div>
      </section>
    </main>
  );
}