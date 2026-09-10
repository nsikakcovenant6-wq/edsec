import Image from "next/image";
import Link from "next/link";

import { getCurrentUser } from "@/app/lib/auth";
import AuthButtons from "@/components/AuthButtons";

export default async function Navbar() {
  const user = await getCurrentUser();

  /**
   * Route users to the correct dashboard based on their role.
   *
   * ADMIN   → /admin
   * STUDENT → /student/dashboard
   */
  const dashboardHref =
    user?.role === "ADMIN"
      ? "/admin"
      : user?.role === "STUDENT"
        ? "/student/dashboard"
        : "/";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label="EDSEC ICT Institute Home"
        >
          <div className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white shadow-sm">
            <Image
              src="/edsec-logo.png"
              alt="EDSEC ICT Institute"
              width={46}
              height={46}
              priority
              className="h-9 w-auto object-contain"
            />
          </div>

          <div>
            <p className="text-base font-bold tracking-tight text-slate-950">
              EDSEC
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              ICT INSTITUTE
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          <Link href="/" className="text-sm font-medium text-slate-600 transition hover:text-blue-600">
            Home
          </Link>

          <Link href="/courses" className="text-sm font-medium text-slate-600 transition hover:text-blue-600">
            Courses
          </Link>

          <Link
            href="/launch-promo"
            className="rounded-full bg-blue-50 px-3.5 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
          >
            🚨 Launch Promo
          </Link>

          <Link href="/student-projects" className="text-sm font-medium text-slate-600 transition hover:text-blue-600">
            Projects
          </Link>

          <Link href="/gallery" className="text-sm font-medium text-slate-600 transition hover:text-blue-600">
            Gallery
          </Link>

          <Link href="/services" className="text-sm font-medium text-slate-600 transition hover:text-blue-600">
            Services
          </Link>

          <Link href="/contact" className="text-sm font-medium text-slate-600 transition hover:text-blue-600">
            Contact
          </Link>

          {user && (
            <Link
              href={dashboardHref}
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Dashboard
            </Link>
          )}

          <AuthButtons
            isLoggedIn={!!user}
            role={user?.role ?? null}
          />
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          {!user ? (
            <>
              <Link
                href="/launch-promo"
                className="rounded-xl bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
              >
                Promo
              </Link>
              <Link
                href="/login"
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/launch-promo"
                className="rounded-xl bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
              >
                Promo
              </Link>
              <Link
                href={dashboardHref}
                className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Dashboard
              </Link>
              <AuthButtons isLoggedIn={true} role={user.role ?? null} />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
