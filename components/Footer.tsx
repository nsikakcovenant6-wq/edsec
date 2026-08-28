import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500 font-black text-slate-950">
                E
              </div>

              <div>
                <p className="font-bold">EDSEC</p>
                <p className="text-[10px] uppercase tracking-[0.15em] text-slate-500">
                  ICT INSTITUTE
                </p>
              </div>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-6 text-slate-400">
              Educational Services Consultancy. Practical technology
              education, digital skills and technology solutions.
            </p>

            <p className="mt-5 text-sm font-semibold text-cyan-400">
              Innovate. Educate. Elevate.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-semibold">Platform</h3>

            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-400">
              <Link className="hover:text-white" href="/courses">
                Courses
              </Link>

              <Link className="hover:text-white" href="/student-projects">
                Student Projects
              </Link>

              <Link className="hover:text-white" href="/gallery">
                Gallery
              </Link>

              <Link className="hover:text-white" href="/apply">
                Apply
              </Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold">Company</h3>

            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-400">
              <Link className="hover:text-white" href="/about">
                About EDSEC
              </Link>

              <Link className="hover:text-white" href="/services">
                Services
              </Link>

              <Link className="hover:text-white" href="/corporate-training">
                Corporate Training
              </Link>

              <Link className="hover:text-white" href="/contact">
                Contact
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold">Contact</h3>

            <div className="mt-4 space-y-3 text-sm text-slate-400">
              <a
                href="tel:+2348142137101"
                className="block transition hover:text-white"
              >
                +234 814 213 7101
              </a>

              <a
                href="mailto:edseceducation@gmail.com"
                className="block break-all transition hover:text-white"
              >
                edseceducation@gmail.com
              </a>

              <p>Port Harcourt, Rivers State, Nigeria</p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} EDSEC Computer Training. All rights
            reserved.
          </p>

          <p>Educational Services Consultancy</p>
        </div>
      </div>
    </footer>
  );
}