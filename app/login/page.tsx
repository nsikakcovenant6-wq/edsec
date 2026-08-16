/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="grid min-h-screen lg:grid-cols-2">
        {/* LEFT SIDE */}
        <div className="relative hidden overflow-hidden bg-slate-950 lg:flex">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative flex w-full flex-col justify-between p-12 xl:p-16">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-white">
                <img
                  src="/edsec-logo.png"
                  alt="EDSEC"
                  className="h-9 w-auto object-contain"
                />
              </div>

              <div>
                <p className="font-bold text-white">EDSEC</p>
                <p className="text-xs text-slate-400">
                  Computer Training
                </p>
              </div>
            </Link>

            <div className="max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
                Welcome back
              </p>

              <h1 className="mt-5 text-5xl font-bold tracking-tight text-white xl:text-6xl">
                Continue your learning journey.
              </h1>

              <p className="mt-6 text-lg leading-8 text-slate-400">
                Sign in to access your courses, track your progress, take
                assessments, and continue building practical technology skills.
              </p>

              <div className="mt-10 grid grid-cols-2 gap-3">
                {[
                  ["01", "Your courses"],
                  ["02", "Learning progress"],
                  ["03", "Assessments"],
                  ["04", "Student community"],
                ].map(([number, title]) => (
                  <div
                    key={number}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5"
                  >
                    <p className="text-xs font-bold text-blue-400">
                      {number}
                    </p>

                    <p className="mt-2 text-sm font-medium text-slate-200">
                      {title}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-sm text-slate-500">
              Innovate. Educate. Elevate.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center px-5 py-12 sm:px-8">
          <div className="w-full max-w-md">
            {/* MOBILE LOGO */}
            <div className="mb-10 flex justify-center lg:hidden">
              <Link href="/" className="inline-flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white">
                  <img
                    src="/edsec-logo.png"
                    alt="EDSEC"
                    className="h-9 w-auto object-contain"
                  />
                </div>

                <div className="text-left">
                  <p className="font-bold text-slate-950">EDSEC</p>
                  <p className="text-xs text-slate-500">
                    Computer Training
                  </p>
                </div>
              </Link>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                  Student Portal
                </p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                  Sign in to EDSEC
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Enter your account details to continue.
                </p>
              </div>

              <form className="mt-8 space-y-5">
                {/* EMAIL */}
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
                    autoComplete="email"
                    required
                    placeholder="you@example.com"
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />
                </div>

                {/* PASSWORD */}
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-slate-700"
                    >
                      Password
                    </label>

                    <Link
                      href="/forgot-password"
                      className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="Enter your password"
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />
                </div>

                {/* REMEMBER */}
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    name="remember"
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />

                  <span className="text-sm text-slate-600">
                    Keep me signed in
                  </span>
                </label>

                {/* SUBMIT */}
                <button
                  type="submit"
                  className="w-full rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-700"
                >
                  Sign In
                </button>
              </form>

              {/* REGISTER */}
              <div className="mt-7 border-t border-slate-200 pt-7 text-center">
                <p className="text-sm text-slate-500">
                  Don&apos;t have an EDSEC account?
                </p>

                <Link
                  href="/register"
                  className="mt-2 inline-flex font-semibold text-blue-600 hover:text-blue-700"
                >
                  Create an account →
                </Link>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                href="/"
                className="text-sm text-slate-500 transition hover:text-slate-900"
              >
                ← Back to EDSEC
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}