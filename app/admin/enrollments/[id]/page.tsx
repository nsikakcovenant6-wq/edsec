import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";
import {
  updateEnrollment,
  updateEnrollmentStatus,
  deleteEnrollment,
} from "./actions";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EnrollmentDetailsPage({
  params,
}: PageProps) {
  await requireRole("ADMIN");

  const { id } = await params;

  const enrollment = await prisma.enrollment.findUnique({
    where: { id },
    include: {
      student: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          status: true,
          studentProfile: {
            select: {
              studentNumber: true,
              educationalLevel: true,
            },
          },
        },
      },

      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          duration: true,
          learningFormat: true,
        },
      },

      cohort: {
        select: {
          id: true,
          name: true,
          status: true,
          startDate: true,
          endDate: true,
        },
      },

      lessonProgress: {
        include: {
          lesson: {
            select: {
              id: true,
              title: true,
              displayOrder: true,
              isPublished: true,
              module: {
                select: {
                  id: true,
                  title: true,
                  displayOrder: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },

      payments: {
        select: {
          id: true,
          amount: true,
          amountPaid: true,
          balance: true,
          status: true,
          method: true,
          reference: true,
          paidAt: true,
          dueDate: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },

      grades: {
        include: {
          assessment: {
            select: {
              id: true,
              title: true,
              type: true,
              maxScore: true,
            },
          },
        },
        orderBy: {
          gradedAt: "desc",
        },
      },

      activities: {
        select: {
          id: true,
          type: true,
          title: true,
          description: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 20,
      },
    },
  });

  if (!enrollment) {
    notFound();
  }

  const studentName =
    `${enrollment.student.firstName} ${enrollment.student.lastName}`.trim();

  const completedLessons = enrollment.lessonProgress.filter(
    (item) => item.completed
  ).length;

  const totalLessons = enrollment.lessonProgress.length;

  const progress =
    totalLessons > 0
      ? Math.round((completedLessons / totalLessons) * 100)
      : enrollment.progress;

  const totalPayments = enrollment.payments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );

  const totalPaid = enrollment.payments.reduce(
    (sum, payment) => sum + payment.amountPaid,
    0
  );

  const totalBalance = enrollment.payments.reduce(
    (sum, payment) => sum + payment.balance,
    0
  );

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "—";

    return new Intl.DateTimeFormat("en-NG", {
      dateStyle: "medium",
    }).format(date);
  };

  const formatDateTime = (date: Date | null | undefined) => {
    if (!date) return "—";

    return new Intl.DateTimeFormat("en-NG", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  const statusClass: Record<string, string> = {
    ACTIVE: "bg-emerald-100 text-emerald-700",
    COMPLETED: "bg-blue-100 text-blue-700",
    SUSPENDED: "bg-amber-100 text-amber-700",
    DROPPED: "bg-red-100 text-red-700",
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin/enrollments"
              className="mb-2 inline-flex text-sm font-medium text-slate-500 hover:text-slate-900"
            >
              ← Back to Enrollments
            </Link>

            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Enrollment Details
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage this student&apos;s course enrollment.
            </p>
          </div>

          <span
            className={`inline-flex w-fit rounded-full px-3 py-1 text-sm font-semibold ${
              statusClass[enrollment.status] ??
              "bg-slate-100 text-slate-700"
            }`}
          >
            {enrollment.status}
          </span>
        </div>

        {/* Student + Course */}
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Student Information
            </h2>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Name
                </p>
                <p className="mt-1 font-semibold text-slate-900">
                  {studentName}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Email
                </p>
                <p className="mt-1 text-slate-700">
                  {enrollment.student.email}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Phone
                </p>
                <p className="mt-1 text-slate-700">
                  {enrollment.student.phone ?? "—"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Student Number
                </p>
                <p className="mt-1 text-slate-700">
                  {enrollment.student.studentProfile?.studentNumber ?? "—"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Educational Level
                </p>
                <p className="mt-1 text-slate-700">
                  {enrollment.student.studentProfile?.educationalLevel ?? "—"}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Course Information
            </h2>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Course
                </p>

                <Link
                  href={`/admin/courses/${enrollment.course.id}`}
                  className="mt-1 inline-block font-semibold text-slate-900 hover:underline"
                >
                  {enrollment.course.title}
                </Link>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Duration
                </p>
                <p className="mt-1 text-slate-700">
                  {enrollment.course.duration ?? "—"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Learning Format
                </p>
                <p className="mt-1 text-slate-700">
                  {enrollment.course.learningFormat ?? "—"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Cohort
                </p>

                <p className="mt-1 text-slate-700">
                  {enrollment.cohort?.name ?? "No cohort assigned"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Enrollment Date
                </p>

                <p className="mt-1 text-slate-700">
                  {formatDate(enrollment.createdAt)}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Progress */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Course Progress
              </h2>

              <p className="text-sm text-slate-500">
                {completedLessons} of {totalLessons} lessons completed
              </p>
            </div>

            <p className="text-2xl font-bold text-slate-900">
              {progress}%
            </p>
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-slate-900 transition-all"
              style={{
                width: `${Math.min(100, Math.max(0, progress))}%`,
              }}
            />
          </div>
        </section>

        {/* Manage Status */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Manage Enrollment
          </h2>

          <div className="mt-5 flex flex-col gap-4 sm:flex-row">
            <form
              action={async (formData) => {
                "use server";
                await updateEnrollmentStatus(formData);
              }}
              className="flex flex-1 gap-2"
            >
              <input
                type="hidden"
                name="enrollmentId"
                value={enrollment.id}
              />

              <select
                name="status"
                defaultValue={enrollment.status}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-900"
              >
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="DROPPED">Dropped</option>
              </select>

              <button
                type="submit"
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Update
              </button>
            </form>

            <form
              action={async (formData) => {
                "use server";
                await deleteEnrollment(formData);
              }}
            >
              <input
                type="hidden"
                name="enrollmentId"
                value={enrollment.id}
              />

              <button
                type="submit"
                className="w-full rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 sm:w-auto"
              >
                Delete Enrollment
              </button>
            </form>
          </div>
        </section>

        {/* Lesson Progress */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900">
              Lesson Progress
            </h2>
          </div>

          {enrollment.lessonProgress.length === 0 ? (
            <div className="p-6 text-sm text-slate-500">
              No lesson progress has been recorded yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {enrollment.lessonProgress.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-slate-900">
                      {item.lesson.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {item.lesson.module.title}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {item.completed ? (
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                        Completed
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        Not completed
                      </span>
                    )}

                    <form
                      action={async (formData) => {
                        "use server";
                        await updateEnrollment(formData);
                      }}
                    >
                      <input
                        type="hidden"
                        name="enrollmentId"
                        value={enrollment.id}
                      />

                      <input
                        type="hidden"
                        name="progress"
                        value={progress}
                      />

                      <input
                        type="hidden"
                        name="studentId"
                        value={enrollment.studentId}
                      />

                      <input
                        type="hidden"
                        name="courseId"
                        value={enrollment.courseId}
                      />

                      <input
                        type="hidden"
                        name="lessonId"
                        value={item.lessonId}
                      />

                      <input
                        type="hidden"
                        name="completed"
                        value={item.completed ? "false" : "true"}
                      />

                      <button
                        type="submit"
                        className="text-xs font-semibold text-slate-700 hover:underline"
                      >
                        {item.completed
                          ? "Mark incomplete"
                          : "Mark complete"}
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Payments */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Payments
                </h2>

                <p className="text-sm text-slate-500">
                  Financial summary for this enrollment.
                </p>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-xs text-slate-500">Balance</p>

                <p className="text-xl font-bold text-slate-900">
                  ₦{totalBalance.toLocaleString("en-NG")}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 border-b border-slate-200 p-6 sm:grid-cols-3">
            <div>
              <p className="text-xs text-slate-500">Total Charges</p>
              <p className="mt-1 font-bold text-slate-900">
                ₦{totalPayments.toLocaleString("en-NG")}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">Total Paid</p>
              <p className="mt-1 font-bold text-emerald-600">
                ₦{totalPaid.toLocaleString("en-NG")}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">Outstanding</p>
              <p className="mt-1 font-bold text-red-600">
                ₦{totalBalance.toLocaleString("en-NG")}
              </p>
            </div>
          </div>

          {enrollment.payments.length === 0 ? (
            <div className="p-6 text-sm text-slate-500">
              No payments recorded.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-175 text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Paid</th>
                    <th className="px-6 py-3">Balance</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Method</th>
                    <th className="px-6 py-3">Date</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {enrollment.payments.map((payment) => (
                    <tr key={payment.id}>
                      <td className="px-6 py-4">
                        ₦{payment.amount.toLocaleString("en-NG")}
                      </td>

                      <td className="px-6 py-4">
                        ₦{payment.amountPaid.toLocaleString("en-NG")}
                      </td>

                      <td className="px-6 py-4">
                        ₦{payment.balance.toLocaleString("en-NG")}
                      </td>

                      <td className="px-6 py-4">
                        {payment.status}
                      </td>

                      <td className="px-6 py-4">
                        {payment.method}
                      </td>

                      <td className="px-6 py-4">
                        {formatDate(payment.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Grades */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900">
              Grades
            </h2>
          </div>

          {enrollment.grades.length === 0 ? (
            <div className="p-6 text-sm text-slate-500">
              No grades recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-175 text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-6 py-3">Assessment</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Score</th>
                    <th className="px-6 py-3">Grade</th>
                    <th className="px-6 py-3">Feedback</th>
                    <th className="px-6 py-3">Date</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {enrollment.grades.map((grade) => (
                    <tr key={grade.id}>
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {grade.assessment.title}
                      </td>

                      <td className="px-6 py-4">
                        {grade.assessment.type}
                      </td>

                      <td className="px-6 py-4">
                        {grade.score}/{grade.maxScore}
                      </td>

                      <td className="px-6 py-4 font-semibold">
                        {grade.grade ?? "—"}
                      </td>

                      <td className="max-w-xs px-6 py-4 text-slate-500">
                        {grade.feedback ?? "—"}
                      </td>

                      <td className="px-6 py-4">
                        {formatDate(grade.gradedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Activity */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900">
              Recent Activity
            </h2>
          </div>

          {enrollment.activities.length === 0 ? (
            <div className="p-6 text-sm text-slate-500">
              No recent activity.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {enrollment.activities.map((activity) => (
                <div key={activity.id} className="p-5">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium text-slate-900">
                        {activity.title}
                      </p>

                      {activity.description && (
                        <p className="mt-1 text-sm text-slate-500">
                          {activity.description}
                        </p>
                      )}
                    </div>

                    <p className="text-xs text-slate-400">
                      {formatDateTime(activity.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}