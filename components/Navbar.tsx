import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/edsec-logo.png"
            alt="EDSEC Computer Training"
            width={46}
            height={46}
            priority
            className="h-10 w-auto object-contain"
          />

          <div>
            <p className="text-base font-bold tracking-tight text-slate-950">
              EDSEC
            </p>
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">
              Computer Training
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <Link href="/" className="text-sm font-medium text-slate-600 hover:text-blue-600">
            Home
          </Link>

          <Link href="/courses" className="text-sm font-medium text-slate-600 hover:text-blue-600">
            Courses
          </Link>

          <Link href="/student-projects" className="text-sm font-medium text-slate-600 hover:text-blue-600">
            Projects
          </Link>

          <Link href="/gallery" className="text-sm font-medium text-slate-600 hover:text-blue-600">
            Gallery
          </Link>

          <Link href="/services" className="text-sm font-medium text-slate-600 hover:text-blue-600">
            Services
          </Link>

          <Link href="/contact" className="text-sm font-medium text-slate-600 hover:text-blue-600">
            Contact
          </Link>

          <Link
            href="/apply"
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Apply Now
          </Link>
        </nav>
      </div>
    </header>
  );
}