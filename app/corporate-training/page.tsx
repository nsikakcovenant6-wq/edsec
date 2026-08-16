import Link from "next/link";

const trainingAreas = [
  {
    number: "01",
    title: "Digital Skills",
    description:
      "Equip employees with practical digital skills for modern workplace environments.",
  },
  {
    number: "02",
    title: "IT Support & Networking",
    description:
      "Train teams in computer systems, networking fundamentals, troubleshooting, and technical support.",
  },
  {
    number: "03",
    title: "Cybersecurity",
    description:
      "Help organizations build stronger security awareness and understand common digital threats.",
  },
  {
    number: "04",
    title: "Data & Productivity",
    description:
      "Improve productivity through Microsoft Office, data analysis, reporting, and digital workflows.",
  },
  {
    number: "05",
    title: "Web & Software Development",
    description:
      "Introduce teams to modern web technologies, software development, and digital product creation.",
  },
  {
    number: "06",
    title: "Customized Training",
    description:
      "Build a training program around your organization's specific goals, workforce, and technology needs.",
  },
];

const organizations = [
  "Banks & Financial Institutions",
  "Schools & Educational Institutions",
  "Hospitals & Healthcare Organizations",
  "Hotels & Hospitality Businesses",
  "Churches & Nonprofit Organizations",
  "Retail & Small Businesses",
];

export default function CorporateTrainingPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
              Corporate Training
            </p>

            <h1 className="mt-5 text-5xl font-bold tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
              Build a stronger,
              <span className="block text-blue-500">
                more capable team.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400 sm:text-xl">
              EDSEC provides practical technology training designed to help
              organizations improve digital skills, productivity, security,
              and technical capabilities.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#inquiry"
                className="rounded-xl bg-blue-600 px-7 py-3.5 text-center font-semibold text-white transition hover:bg-blue-700"
              >
                Request Corporate Training
              </Link>

              <Link
                href="/contact"
                className="rounded-xl border border-slate-700 px-7 py-3.5 text-center font-semibold text-white transition hover:border-slate-500 hover:bg-white/5"
              >
                Talk to EDSEC
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="border-b border-slate-200 bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                Training for organizations
              </p>

              <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                Technology skills that solve real workplace problems.
              </h2>
            </div>

            <div>
              <p className="text-lg leading-8 text-slate-600">
                Every organization has different challenges. EDSEC can work
                with your organization to identify the right training areas
                and create a practical learning experience for your team.
              </p>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                Training can be delivered for individuals, departments,
                teams, schools, businesses, and other organizations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TRAINING AREAS */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              What we can train
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Programs built around your needs.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Choose an existing training area or tell us what your
              organization needs and we can discuss a customized program.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {trainingAreas.map((area) => (
              <div
                key={area.number}
                className="group rounded-3xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/40"
              >
                <div className="flex items-center justify-between">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-sm font-bold text-blue-600">
                    {area.number}
                  </div>

                  <span className="text-2xl text-slate-200 transition group-hover:text-blue-500">
                    ↗
                  </span>
                </div>

                <h3 className="mt-7 text-xl font-semibold text-slate-950">
                  {area.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {area.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ORGANIZATIONS */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                Who we serve
              </p>

              <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-950">
                Training for different kinds of organizations.
              </h2>

              <p className="mt-5 leading-8 text-slate-600">
                From small businesses to established organizations, EDSEC can
                provide practical technology training based on the team&apos;s
                current level and objectives.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {organizations.map((organization, index) => (
                <div
                  key={organization}
                  className="rounded-2xl border border-slate-200 bg-white p-6"
                >
                  <div className="text-sm font-bold text-blue-600">
                    0{index + 1}
                  </div>

                  <h3 className="mt-4 font-semibold text-slate-950">
                    {organization}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              How it works
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Simple from inquiry to training.
            </h2>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {[
              [
                "01",
                "Tell us what you need",
                "Submit your organization's training requirements through our inquiry form.",
              ],
              [
                "02",
                "Discuss the program",
                "Our team reviews your requirements and discusses the appropriate training approach.",
              ],
              [
                "03",
                "Start training",
                "Once the details are agreed, your organization can begin the training program.",
              ],
            ].map(([number, title, description]) => (
              <div
                key={number}
                className="rounded-3xl border border-slate-200 p-8"
              >
                <div className="text-sm font-bold text-blue-600">
                  {number}
                </div>

                <h3 className="mt-5 text-2xl font-semibold text-slate-950">
                  {title}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================
          CORPORATE INQUIRY
      ========================= */}
      <section
        id="inquiry"
        className="scroll-mt-24 bg-slate-950 py-24"
      >
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            {/* LEFT */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-400">
                Corporate Training Inquiry
              </p>

              <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Tell us what your organization needs.
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate-400">
                Submit your requirements and the EDSEC team can review your
                inquiry and contact you about the appropriate training
                solution.
              </p>

              <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm font-semibold text-white">
                  What happens next?
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Your inquiry will be reviewed by the EDSEC team. We can then
                  discuss your preferred training format, areas of training,
                  team size, and other requirements.
                </p>
              </div>
            </div>

            {/* FORM */}
            <div className="rounded-3xl bg-white p-6 shadow-2xl sm:p-8 lg:p-10">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-slate-950">
                  Corporate training inquiry
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Complete the form and tell us about your organization.
                </p>
              </div>

              <form className="space-y-6">
                {/* ORGANIZATION */}
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

                {/* CONTACT NAME */}
                <div>
                  <label
                    htmlFor="contactName"
                    className="text-sm font-medium text-slate-700"
                  >
                    Contact person
                  </label>

                  <input
                    id="contactName"
                    name="contactName"
                    type="text"
                    required
                    placeholder="Full name"
                    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* EMAIL / PHONE */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-slate-700"
                    >
                      Email
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="organization@email.com"
                      className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="text-sm font-medium text-slate-700"
                    >
                      Phone
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+234..."
                      className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {/* ORGANIZATION TYPE */}
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
                    defaultValue=""
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="" disabled>
                      Select organization type
                    </option>

                    <option value="bank">
                      Bank / Financial Institution
                    </option>

                    <option value="school">School / Education</option>

                    <option value="hospital">Hospital / Healthcare</option>

                    <option value="hotel">Hotel / Hospitality</option>

                    <option value="church">Church / Nonprofit</option>

                    <option value="retail">Retail / Business</option>

                    <option value="government">Government</option>

                    <option value="other">Other</option>
                  </select>
                </div>

                {/* TRAINING NEEDS */}
                <div>
                  <label
                    htmlFor="trainingNeeds"
                    className="text-sm font-medium text-slate-700"
                  >
                    Training needs
                  </label>

                  <textarea
                    id="trainingNeeds"
                    name="trainingNeeds"
                    required
                    rows={5}
                    placeholder="Tell us what you would like your team to learn..."
                    className="mt-2 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* FORMAT */}
                <div>
                  <label
                    htmlFor="preferredFormat"
                    className="text-sm font-medium text-slate-700"
                  >
                    Preferred training format
                  </label>

                  <select
                    id="preferredFormat"
                    name="preferredFormat"
                    defaultValue=""
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="" disabled>
                      Select format
                    </option>

                    <option value="physical">Physical</option>
                    <option value="online">Online</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>

                {/* MESSAGE */}
                <div>
                  <label
                    htmlFor="message"
                    className="text-sm font-medium text-slate-700"
                  >
                    Additional message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Anything else you would like us to know?"
                    className="mt-2 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  className="w-full rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-700"
                >
                  Submit Training Inquiry
                </button>

                <p className="text-center text-xs leading-5 text-slate-500">
                  Your information will be used to respond to your corporate
                  training request.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-blue-600 py-16">
        <div className="mx-auto max-w-4xl px-5 text-center lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to train your team?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-blue-100">
            Tell us what your organization needs and let&apos;s build a practical
            training solution together.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="#inquiry"
              className="rounded-xl bg-white px-7 py-3.5 font-semibold text-blue-600 transition hover:bg-blue-50"
            >
              Send an Inquiry
            </Link>

            <Link
              href="/courses"
              className="rounded-xl border border-blue-400 px-7 py-3.5 font-semibold text-white transition hover:bg-blue-700"
            >
              View Courses
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}