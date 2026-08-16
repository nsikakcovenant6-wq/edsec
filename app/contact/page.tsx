import Link from "next/link";

const contactDetails = {
  phone: "+234 814 213 7101",
  email: "mmekanudoh@gmail.com",
  whatsapp: "2348142137101",
  address: "Port Harcourt, Rivers State, Nigeria",
  hours: "Monday – Saturday, 8:00 AM – 5:00 PM",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <section className="border-b border-white/10 bg-linear-to-brom-cyan-500/[0.08] to-transparent">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Contact EDSEC
            </p>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Let&apos;s talk about your next step.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              Have questions about our courses, corporate training, or
              technology services? We&apos;re ready to help.
            </p>
          </div>
        </div>
      </section>

      {/* Contact content */}
      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          {/* Details */}
          <div>
            <h2 className="text-2xl font-bold">Get in touch</h2>

            <p className="mt-3 leading-7 text-slate-400">
              Reach EDSEC through any of the channels below. For the fastest
              response, contact us on WhatsApp.
            </p>

            <div className="mt-8 space-y-4">
              {/* Phone */}
              <a
                href={`tel:${contactDetails.phone.replace(/\s/g, "")}`}
                className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/3 p-5 transition hover:border-cyan-400/30 hover:bg-white/5"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-xl text-cyan-400">
                  ☎
                </div>

                <div>
                  <p className="text-sm text-slate-500">Phone</p>
                  <p className="mt-1 font-semibold group-hover:text-cyan-400">
                    {contactDetails.phone}
                  </p>
                </div>
              </a>

              {/* Email */}
              <a
                href={`mailto:${contactDetails.email}`}
                className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/3 p-5 transition hover:border-cyan-400/30 hover:bg-white/5"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-xl text-cyan-400">
                  @
                </div>

                <div className="min-w-0">
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="mt-1 break-all font-semibold group-hover:text-cyan-400">
                    {contactDetails.email}
                  </p>
                </div>
              </a>

              {/* Location */}
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/3 p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-xl text-cyan-400">
                  ⌖
                </div>

                <div>
                  <p className="text-sm text-slate-500">Location</p>
                  <p className="mt-1 font-semibold">
                    {contactDetails.address}
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/3 p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-xl text-cyan-400">
                  ◷
                </div>

                <div>
                  <p className="text-sm text-slate-500">Working Hours</p>
                  <p className="mt-1 font-semibold">
                    {contactDetails.hours}
                  </p>
                </div>
              </div>
            </div>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${contactDetails.whatsapp}?text=${encodeURIComponent(
                "Hello EDSEC, I would like to make an enquiry."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center justify-center rounded-xl bg-green-500 px-6 py-4 font-bold text-white transition hover:bg-green-400"
            >
              Chat With EDSEC on WhatsApp
            </a>
          </div>

          {/* Contact form */}
          <div className="rounded-3xl border border-white/10 bg-white/4 p-6 shadow-2xl sm:p-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-cyan-400">
                Send a message
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                How can we help?
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Send us a message and the EDSEC team can get back to you.
              </p>
            </div>

            <form className="mt-8 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium"
                  >
                    Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Your name"
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-medium"
                >
                  Subject
                </label>

                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  placeholder="What would you like to ask about?"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium"
                >
                  Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows={7}
                  required
                  placeholder="Write your message..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-cyan-500 px-6 py-4 font-bold text-slate-950 transition hover:bg-cyan-400"
              >
                Send Message
              </button>

              <p className="text-center text-xs text-slate-500">
                We&apos;ll connect this form to the EDSEC admin dashboard
                later so enquiries can be managed without changing code.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Map area */}
      <section className="mx-auto max-w-7xl px-6 pb-20 sm:px-8 lg:px-12">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/3">
          <div className="flex min-h-70 items-center justify-center bg-linear-to-br from-cyan-500/8 via-slate-900 to-slate-950 p-8 text-center">
            <div>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/10 text-3xl text-cyan-400">
                ⌖
              </div>

              <h2 className="mt-5 text-2xl font-bold">
                Visit EDSEC
              </h2>

              <p className="mt-2 text-slate-400">
                {contactDetails.address}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Google Maps integration will be added here.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Ready to begin?
          </p>

          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            Build skills that move you forward.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Explore EDSEC courses and find a practical technology path that
            fits your goals.
          </p>

          <Link
            href="/apply"
            className="mt-8 inline-flex rounded-xl bg-cyan-500 px-7 py-4 font-bold text-slate-950 transition hover:bg-cyan-400"
          >
            Apply to EDSEC
          </Link>
        </div>
      </section>
    </main>
  );
}