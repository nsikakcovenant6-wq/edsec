import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";
import StudentStatusButton from "./student-status-button";

type SearchParams = {
  search?: string;
  status?: string;
};

export default async function AdminStudentsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    redirect("/login");
  }

  const params = await searchParams;

  const search = params.search?.trim() || "";
  const status = params.status || "ALL";

  const students = await prisma.user.findMany({
    where: {
      role: "STUDENT",

      ...(status !== "ALL"
        ? {
            status: status as
              | "ACTIVE"
              | "INACTIVE"
              | "SUSPENDED",
          }
        : {}),

      ...(search
        ? {
            OR: [
              {
                firstName: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                lastName: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                email: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                phone: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                studentProfile: {
                  studentNumber: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              },
            ],
          }
        : {}),
    },

    include: {
      studentProfile: true,

      enrollments: {
        include: {
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
              status: true,
            },
          },

          cohort: {
            select: {
              id: true,
              name: true,
              status: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      },

      payments: {
        select: {
          id: true,
          amount: true,
          amountPaid: true,
          balance: true,
          status: true,
        },

        orderBy: {
          createdAt: "desc",
        },

        take: 5,
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  const totalStudents = await prisma.user.count({
    where: {
      role: "STUDENT",
    },
  });

  const activeStudents = await prisma.user.count({
    where: {
      role: "STUDENT",
      status: "ACTIVE",
    },
  });

  const suspendedStudents = await prisma.user.count({
    where: {
      role: "STUDENT",
      status: "SUSPENDED",
    },
  });

  const inactiveStudents = await prisma.user.count({
    where: {
      role: "STUDENT",
      status: "INACTIVE",
    },
  });

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <Link
                href="/admin"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                ← Back to Admin Dashboard
              </Link>

              <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                Student Management
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                Students
              </h1>

              <p className="mt-2 max-w-2xl text-slate-600">
                View and manage registered EDSEC students, their courses,
                enrollment progress, and account status.
              </p>
            </div>

            <Link
              href="/admin/applications"
              className="rounded-xl bg-slate-950 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              View Applications
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        {/* Statistics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Students"
            value={totalStudents}
            description="All registered students"
          />

          <StatCard
            label="Active"
            value={activeStudents}
            description="Currently active accounts"
          />

          <StatCard
            label="Suspended"
            value={suspendedStudents}
            description="Temporarily restricted"
          />

          <StatCard
            label="Inactive"
            value={inactiveStudents}
            description="Inactive accounts"
          />
        </div>

        {/* Filters */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <form
            method="GET"
            className="grid gap-4 md:grid-cols-[1fr_220px_auto]"
          >
            <div>
              <label
                htmlFor="search"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Search students
              </label>

              <input
                id="search"
                name="search"
                defaultValue={search}
                placeholder="Name, email, phone or student number..."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="status"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Account status
              </label>

              <select
                id="status"
                name="status"
                defaultValue={status}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                <option value="ALL">All statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 md:w-auto"
              >
                Search
              </button>
            </div>
          </form>
        </section>

        {/* Results */}
        <section className="mt-8">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
                Registered Students
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-950">
                {students.length} student
                {students.length === 1 ? "" : "s"} found
              </h2>
            </div>
          </div>

          {students.length === 0 ? (
            <EmptyState search={search} />
          ) : (
            <div className="space-y-5">
              {students.map((student) => {
                const activeEnrollments = student.enrollments.filter(
                  (enrollment) => enrollment.status === "ACTIVE"
                );

                const latestPayment = student.payments[0];

                return (
                  <article
                    key={student.id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                  >
                    <div className="p-6">
                      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        {/* Student identity */}
                        <div className="flex gap-4">
                          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-blue-50 text-xl font-bold text-blue-600">
                            {getInitials(
                              student.firstName,
                              student.lastName
                            )}
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-3">
                              <h3 className="text-lg font-bold text-slate-950">
                                {student.firstName} {student.lastName}
                              </h3>

                              <StatusBadge status={student.status} />
                            </div>

                            <p className="mt-1 text-sm text-slate-600">
                              {student.email}
                            </p>

                            {student.phone && (
                              <p className="mt-1 text-sm text-slate-500">
                                {student.phone}
                              </p>
                            )}

                            <div className="mt-3 flex flex-wrap gap-2">
                              <InfoBadge
                                label="Student No."
                                value={
                                  student.studentProfile
                                    ?.studentNumber || "Not assigned"
                                }
                              />

                              <InfoBadge
                                label="Joined"
                                value={formatDate(student.createdAt)}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2">
                          {student.status === "ACTIVE" ? (
                            <StudentStatusButton
                              studentId={student.id}
                              status="SUSPENDED"
                              label="Suspend"
                              variant="danger"
                            />
                          ) : (
                            <StudentStatusButton
                              studentId={student.id}
                              status="ACTIVE"
                              label="Activate"
                              variant="primary"
                            />
                          )}

                          <Link
                            href={`/admin/students/${student.id}`}
                            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>

                      {/* Student information */}
                      <div className="mt-6 grid gap-4 border-t border-slate-100 pt-6 md:grid-cols-3">
                        <div className="rounded-xl bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Courses
                          </p>

                          <p className="mt-2 text-xl font-bold text-slate-950">
                            {activeEnrollments.length}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Active enrollment
                            {activeEnrollments.length === 1 ? "" : "s"}
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Latest Payment
                          </p>

                          {latestPayment ? (
                            <>
                              <p className="mt-2 text-lg font-bold text-slate-950">
                                ₦
                                {latestPayment.amountPaid.toLocaleString(
                                  "en-NG"
                                )}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {formatPaymentStatus(
                                  latestPayment.status
                                )}
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="mt-2 text-lg font-bold text-slate-950">
                                —
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                No payment record
                              </p>
                            </>
                          )}
                        </div>

                        <div className="rounded-xl bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Education
                          </p>

                          <p className="mt-2 font-semibold text-slate-950">
                            {student.studentProfile?.educationalLevel ||
                              "Not provided"}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Student profile
                          </p>
                        </div>
                      </div>

                      {/* Enrollments */}
                      <div className="mt-6">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-slate-950">
                            Course Enrollments
                          </h4>

                          <span className="text-xs font-medium text-slate-500">
                            {student.enrollments.length} total
                          </span>
                        </div>

                        {student.enrollments.length === 0 ? (
                          <div className="mt-3 rounded-xl border border-dashed border-slate-300 p-5 text-center">
                            <p className="text-sm font-medium text-slate-700">
                              No course enrollment found.
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              This student has not been enrolled in a course
                              yet.
                            </p>
                          </div>
                        ) : (
                          <div className="mt-3 space-y-3">
                            {student.enrollments.map((enrollment) => (
                              <div
                                key={enrollment.id}
                                className="rounded-xl border border-slate-200 p-4"
                              >
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                  <div>
                                    <p className="font-semibold text-slate-950">
                                      {enrollment.course.title}
                                    </p>

                                    <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-500">
                                      <span>
                                        Status:{" "}
                                        {formatEnrollmentStatus(
                                          enrollment.status
                                        )}
                                      </span>

                                      {enrollment.cohort && (
                                        <span>
                                          • Cohort:{" "}
                                          {enrollment.cohort.name}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="w-full sm:w-48">
                                    <div className="flex justify-between text-xs">
                                      <span className="font-medium text-slate-600">
                                        Progress
                                      </span>

                                      <span className="font-bold text-slate-900">
                                        {enrollment.progress}%
                                      </span>
                                    </div>

                                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                                      <div
                                        className="h-full rounded-full bg-blue-600"
                                        style={{
                                          width: `${Math.min(
                                            100,
                                            Math.max(
                                              0,
                                              enrollment.progress
                                            )
                                          )}%`,
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
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

function StatCard({
  label,
  value,
  description,
}: {
  label: string;
  value: number;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-3xl font-bold tracking-tight text-slate-950">
        {value}
      </p>

      <p className="mt-2 font-semibold text-slate-900">{label}</p>

      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
}) {
  const styles = {
    ACTIVE: "bg-emerald-50 text-emerald-700",
    SUSPENDED: "bg-red-50 text-red-700",
    INACTIVE: "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function InfoBadge({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs text-slate-600">
      <span className="font-semibold">{label}:</span> {value}
    </span>
  );
}

function EmptyState({ search }: { search: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-2xl">
        ◎
      </div>

      <h3 className="mt-5 font-bold text-slate-950">
        No students found
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {search
          ? `No student matched "${search}". Try another name, email, phone number, or student number.`
          : "Students will appear here after applications are approved and enrolled."}
      </p>
    </div>
  );
}

function getInitials(firstName: string, lastName: string) {
  return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`
    .toUpperCase();
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatPaymentStatus(status: string) {
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatEnrollmentStatus(status: string) {
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}