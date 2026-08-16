import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function StudentDashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "STUDENT") {
    redirect("/admin");
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
            Student Portal
          </p>

          <div className="mt-3 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Welcome, {user.firstName}
              </h1>

              <p className="mt-2 text-slate-600">
                Manage your EDSEC learning journey from one place.
              </p>
            </div>

            <Link
              href="/"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              ← Back to website
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="My Courses"
            description="View your enrolled courses and learning progress."
            href="/student/courses"
          />

          <DashboardCard
            title="My Profile"
            description="View and manage your student information."
            href="/student/profile"
          />

          <DashboardCard
            title="Certificates"
            description="Access certificates earned through EDSEC programs."
            href="/student/certificates"
          />

          <DashboardCard
            title="Announcements"
            description="See important updates from EDSEC."
            href="/student/announcements"
          />
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.4fr_.6fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
              Learning overview
            </p>

            <h2 className="mt-3 text-2xl font-bold text-slate-950">
              Keep building your skills.
            </h2>

            <p className="mt-3 max-w-2xl leading-7 text-slate-600">
              Your courses, progress, assignments, resources, and certificates
              will appear here as you continue your EDSEC training.
            </p>

            <Link
              href="/courses"
              className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Explore Courses
            </Link>
          </section>

          <section className="rounded-2xl bg-slate-950 p-7 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-400">
              Account
            </p>

            <p className="mt-5 text-sm text-slate-400">
              Signed in as
            </p>

            <p className="mt-1 break-all font-medium">
              {user.email}
            </p>

            <div className="mt-6 border-t border-white/10 pt-5">
              <p className="text-sm text-slate-400">Account type</p>

              <p className="mt-1 font-semibold">
                EDSEC Student
              </p>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function DashboardCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/50"
    >
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-lg font-bold text-blue-600">
        →
      </div>

      <h2 className="mt-5 font-semibold text-slate-950 group-hover:text-blue-600">
        {title}
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        {description}
      </p>
    </Link>
  );
}