import { redirect } from "next/navigation";
import { requireRole } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import Link from "next/link";
import ApplicationActions from "./ApplicationActions";

export const dynamic = "force-dynamic";

export default async function AdminApplicationsPage() {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    redirect("/login");
  }

  const applications = await prisma.application.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          status: true,
        },
      },
      applicant: {
        select: {
          id: true,
          email: true,
          role: true,
          studentProfile: {
            select: {
              studentNumber: true,
            },
          },
        },
      },
    },
  });

  const pendingCount = applications.filter(
    (application) => application.status === "PENDING"
  ).length;

  const contactedCount = applications.filter(
    (application) => application.status === "CONTACTED"
  ).length;

  const approvedCount = applications.filter(
    (application) => application.status === "APPROVED"
  ).length;

  const rejectedCount = applications.filter(
    (application) => application.status === "REJECTED"
  ).length;

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-6 lg:px-8">
          <div>
            <Link
              href="/admin"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              ← Back to Admin Dashboard
            </Link>

            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              EDSEC Admissions
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              Student Applications
            </h1>

            <p className="mt-2 max-w-2xl text-slate-600">
              Review applicants, contact prospective students, and
              approve successful applicants for enrollment.
            </p>
          </div>

          <div className="hidden rounded-2xl bg-slate-950 px-5 py-4 text-white sm:block">
            <p className="text-xs uppercase tracking-wider text-slate-400">
              Administrator
            </p>

            <p className="mt-1 font-semibold">
              {admin.firstName} {admin.lastName}
            </p>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ApplicationStat
            label="Pending"
            value={pendingCount}
            description="Awaiting review"
            className="bg-amber-50 text-amber-700"
          />

          <ApplicationStat
            label="Contacted"
            value={contactedCount}
            description="Applicant contacted"
            className="bg-blue-50 text-blue-700"
          />

          <ApplicationStat
            label="Approved"
            value={approvedCount}
            description="Successfully enrolled"
            className="bg-emerald-50 text-emerald-700"
          />

          <ApplicationStat
            label="Rejected"
            value={rejectedCount}
            description="Applications rejected"
            className="bg-red-50 text-red-700"
          />
        </div>

        {/* Applications */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="font-bold text-slate-950">
              Applications
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {applications.length} total application
              {applications.length === 1 ? "" : "s"}.
            </p>
          </div>

          {applications.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-2xl">
                ◎
              </div>

              <h3 className="mt-4 font-semibold text-slate-950">
                No applications yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                When students submit the EDSEC application form,
                their applications will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {applications.map((application) => {
                const applicantName =
                  application.fullName.trim() ||
                  "Unnamed Applicant";

                const courseName =
                  application.course?.title ||
                  "No course selected";

                return (
                  <article
                    key={application.id}
                    className="p-6 transition hover:bg-slate-50"
                  >
                    <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                      {/* Applicant */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-bold text-slate-950">
                            {applicantName}
                          </h3>

                          <StatusBadge
                            status={application.status}
                          />
                        </div>

                        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          <Info
                            label="Email"
                            value={application.email}
                          />

                          <Info
                            label="Phone"
                            value={application.phone}
                          />

                          <Info
                            label="Course"
                            value={courseName}
                          />

                          <Info
                            label="Education"
                            value={
                              application.educationalLevel ||
                              "Not provided"
                            }
                          />

                          <Info
                            label="Format"
                            value={
                              application.preferredFormat ||
                              "Not specified"
                            }
                          />

                          <Info
                            label="Applied"
                            value={formatDate(
                              application.createdAt
                            )}
                          />
                        </div>

                        {application.additionalInfo && (
                          <div className="mt-5 rounded-xl bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                              Additional Information
                            </p>

                            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                              {application.additionalInfo}
                            </p>
                          </div>
                        )}

                        {application.adminNotes && (
                          <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                              Admin Notes
                            </p>

                            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-blue-900">
                              {application.adminNotes}
                            </p>
                          </div>
                        )}

                        {application.applicant?.studentProfile
                          ?.studentNumber && (
                          <div className="mt-4 inline-flex rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                            Student No:{" "}
                            {
                              application.applicant
                                .studentProfile.studentNumber
                            }
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="xl:w-77.5">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Application Actions
                        </p>

                        <ApplicationActions
                          applicationId={application.id}
                          status={application.status}
                        />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

function ApplicationStat({
  label,
  value,
  description,
  className,
}: {
  label: string;
  value: number;
  description: string;
  className: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div
        className={`inline-flex rounded-lg px-3 py-1 text-xs font-bold ${className}`}
      >
        {label}
      </div>

      <p className="mt-4 text-3xl font-bold text-slate-950">
        {value}
      </p>

      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-700",
    CONTACTED: "bg-blue-50 text-blue-700",
    APPROVED: "bg-emerald-50 text-emerald-700",
    REJECTED: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] || "bg-slate-100 text-slate-700"
      }`}
    >
      {status}
    </span>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 wrap-break-word text-sm font-medium text-slate-700">
        {value}
      </p>
    </div>
  );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}