import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ApplicantPortalPage() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  if (user.role === "ADMIN") redirect("/admin");

  const [applications, enrollments] = await Promise.all([
    prisma.application.findMany({
      where: { applicantId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        course: { select: { title: true, slug: true } },
      },
    }),
    prisma.enrollment.findMany({
      where: { studentId: user.id },
      orderBy: { updatedAt: "desc" },
      include: {
        course: { select: { title: true, slug: true } },
        cohort: { select: { name: true, startDate: true, endDate: true, status: true } },
      },
    }),
  ]);

  const hasActiveEnrollment = enrollments.some((item) => item.status === "ACTIVE");

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5 lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">EDSEC ICT Institute</p>
            <h1 className="mt-1 text-2xl font-black tracking-tight">Applicant Portal</h1>
          </div>
          <Link href={hasActiveEnrollment ? "/student/dashboard" : "/"} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700">
            {hasActiveEnrollment ? "Student Dashboard →" : "EDSEC Home"}
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 lg:px-8">
        <section className="overflow-hidden rounded-3xl bg-slate-950 p-7 text-white sm:p-9">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-400">Welcome, {user.firstName}</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Track your EDSEC application.</h2>
          <p className="mt-3 max-w-2xl leading-7 text-slate-400">Your application stays connected to this account. Once EDSEC approves you, your account becomes a student account and your enrollment appears here.</p>
        </section>

        <section className="mt-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">Admissions</p>
              <h2 className="mt-2 text-2xl font-black">My Applications</h2>
            </div>
            <Link href="/apply" className="text-sm font-bold text-blue-600 hover:text-blue-700">Apply for another course →</Link>
          </div>

          {applications.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">No application is linked to this account yet.</div>
          ) : (
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              {applications.map((application) => {
                const statusClass = application.status === "APPROVED"
                  ? "bg-emerald-50 text-emerald-700"
                  : application.status === "REJECTED"
                    ? "bg-red-50 text-red-700"
                    : application.status === "CONTACTED"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-amber-50 text-amber-700";

                return (
                  <article key={application.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Course</p>
                        <h3 className="mt-1 text-xl font-black">{application.course?.title || "Course application"}</h3>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass}`}>{application.status}</span>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Applied</p>
                        <p className="mt-1 text-sm font-semibold">{application.createdAt.toLocaleDateString("en-NG", { dateStyle: "medium" })}</p>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Format</p>
                        <p className="mt-1 text-sm font-semibold">{application.preferredFormat || "Not specified"}</p>
                      </div>
                    </div>

                    <p className="mt-5 text-sm leading-6 text-slate-500">
                      {application.status === "PENDING" && "Your application is waiting for the EDSEC admissions team to review it."}
                      {application.status === "CONTACTED" && "The EDSEC team has contacted you. Keep an eye on your email and phone for updates."}
                      {application.status === "APPROVED" && "Congratulations. Your application has been approved. Your student enrollment is ready."}
                      {application.status === "REJECTED" && "This application was not approved. Contact EDSEC if you need clarification."}
                    </p>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {enrollments.length > 0 && (
          <section className="mt-10">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-600">Student Progression</p>
            <h2 className="mt-2 text-2xl font-black">Your Enrollments</h2>
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              {enrollments.map((enrollment) => (
                <div key={enrollment.id} className="rounded-2xl border border-slate-200 bg-white p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-black">{enrollment.course.title}</h3>
                      <p className="mt-1 text-sm text-slate-500">{enrollment.cohort?.name || "Cohort to be assigned"}</p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">{enrollment.status}</span>
                  </div>
                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-600" style={{ width: `${Math.max(0, Math.min(100, enrollment.progress))}%` }} /></div>
                  <p className="mt-2 text-xs font-semibold text-slate-500">{enrollment.progress}% complete</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
