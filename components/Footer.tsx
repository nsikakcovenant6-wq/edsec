import Image from "next/image";
import Link from "next/link";

const platformLinks = [
  { label: "Courses", href: "/courses" },
  { label: "Student Projects", href: "/student-projects" },
  { label: "Gallery", href: "/gallery" },
  { label: "Apply", href: "/apply" },
];

const companyLinks = [
  { label: "About EDSEC", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Corporate Training", href: "/corporate-training" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-slate-950 text-white">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute -right-40 bottom-10 h-96 w-96 rounded-full bg-blue-600/10 blur-[130px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
        {/* =========================================================
            TOP CTA
        ========================================================== */}
        <div className="mb-14 overflow-hidden rounded-3xl border border-white/10 bg-white/4">
          <div className="relative px-6 py-8 sm:px-8 lg:flex lg:items-center lg:justify-between lg:px-10">
            <div className="relative z-10">
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />

                <span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
                  Start your journey
                </span>
              </div>

              <h2 className="max-w-2xl text-2xl font-bold tracking-tight sm:text-3xl">
                Ready to build your future with technology?
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                Learn practical technology skills, build real projects and
                prepare for opportunities in the digital economy.
              </p>
            </div>

            <Link
              href="/apply"
              className="group relative z-10 mt-6 inline-flex shrink-0 items-center justify-center gap-3 rounded-xl bg-cyan-400 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/10 transition hover:bg-cyan-300 lg:mt-0"
            >
              Apply to EDSEC

              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>

        {/* =========================================================
            MAIN FOOTER
        ========================================================== */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          {/* =======================================================
              BRAND
          ======================================================== */}
          <div>
            <Link
              href="/"
              className="group inline-flex items-center gap-3"
            >
              {/* Actual EDSEC Logo */}
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-xl shadow-black/20">
                <Image
                  src="/edsec-logo.png"
                  alt="EDSEC ICT Institute"
                  width={48}
                  height={48}
                  className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div>
                <p className="text-lg font-black tracking-tight">
                  EDSEC
                </p>

                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
                  ICT Institute
                </p>
              </div>
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-7 text-slate-400">
              Educational Services Consultancy providing practical
              technology education, digital skills and technology
              solutions.
            </p>

            <div className="mt-6">
              <p className="text-sm font-bold text-white">
                Innovate.
                <span className="text-cyan-400"> Educate.</span>
                <span className="text-blue-400"> Elevate.</span>
              </p>
            </div>
          </div>

          {/* =======================================================
              PLATFORM
          ======================================================== */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-white">
              Platform
            </h3>

            <div className="mt-6 flex flex-col gap-4">
              {platformLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
                >
                  <span className="h-px w-0 bg-cyan-400 transition-all duration-300 group-hover:w-3" />

                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* =======================================================
              COMPANY
          ======================================================== */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-white">
              Company
            </h3>

            <div className="mt-6 flex flex-col gap-4">
              {companyLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
                >
                  <span className="h-px w-0 bg-cyan-400 transition-all duration-300 group-hover:w-3" />

                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* =======================================================
              CONTACT
          ======================================================== */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-white">
              Contact
            </h3>

            <div className="mt-6 space-y-5">
              {/* Phone */}
              <a
                href="tel:+2348142137101"
                className="group flex gap-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-cyan-400 transition group-hover:border-cyan-400/30 group-hover:bg-cyan-400/10">
                  ☎
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Phone
                  </p>

                  <p className="mt-1 text-sm text-slate-300 transition group-hover:text-white">
                    +234 814 213 7101
                  </p>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:edseceducation@gmail.com"
                className="group flex gap-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-cyan-400 transition group-hover:border-cyan-400/30 group-hover:bg-cyan-400/10">
                  @
                </div>

                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Email
                  </p>

                  <p className="mt-1 break-all text-sm text-slate-300 transition group-hover:text-white">
                    edseceducation@gmail.com
                  </p>
                </div>
              </a>

              {/* Location */}
              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-cyan-400">
                  ●
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Location
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    Port Harcourt,
                    <br />
                    Rivers State, Nigeria
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            LARGE WATERMARK
        ========================================================== */}
        <div className="pointer-events-none relative mt-16 hidden select-none overflow-hidden lg:block">
          <p className="text-center text-[clamp(5rem,15vw,12rem)] font-black leading-none tracking-[-0.08em] text-white/2.5">
            EDSEC
          </p>
        </div>

        {/* =========================================================
            BOTTOM BAR
        ========================================================== */}
        <div className="mt-10 flex flex-col gap-5 border-t border-white/10 pt-7 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <p>
              © {new Date().getFullYear()} EDSEC ICT Institute. All
              rights reserved.
            </p>

            <span className="hidden text-slate-700 sm:block">
              •
            </span>

            <p>Port Harcourt, Rivers State, Nigeria</p>
          </div>

          <div className="flex items-center gap-5">
            <Link
              href="/privacy"
              className="transition hover:text-white"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="transition hover:text-white"
            >
              Terms
            </Link>

            <span className="text-slate-700">•</span>

            <p className="text-slate-400">
              Designed &amp; built by{" "}
              <span className="font-semibold text-cyan-400">
                EDSEC
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}