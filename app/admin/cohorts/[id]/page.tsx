import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";
import {
  updateCohort,
  deleteCohort,
} from "./actions";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const statusClass: Record<string, string> = {
  UPCOMING: "bg-blue-100 text-blue-700",
  ACTIVE: "bg-emerald-100 text-emerald-700",
  COMPLETED: "bg-slate-100 text-slate-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default async function CohortDetailsPage({
  params,
}: PageProps) {
  await requireRole("ADMIN");

  const { id } = await params;

  const [cohort, courses] = await Promise.all([
    prisma.cohort.findUnique({
      where: {
        id,
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            status: true,
          },
        },
        enrollments: {
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
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    }),

    prisma.course.findMany({
      select: {
        id: true,
        title: true,
      },
      orderBy: {
        title: "asc",
      },
    }),
  ]);

  if (!cohort) {
    notFound();
  }

  const formatDate = (date: Date | null) => {
    if (!date) return "—";

    return new Intl.DateTimeFormat("en-NG", {
      dateStyle: "medium",
    }).format(date);
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin/cohorts"
              className="mb-2 inline-flex text-sm font-medium text-slate-500 hover:text-slate-900"
            >
              ← Back to Cohorts
            </Link>

            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              {cohort.name}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage cohort information and enrolled students.
            </p>
          </div>

          <span
            className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${
              statusClass[cohort.status] ??
              "bg-slate-100 text-slate-700"
            }`}
          >
            {cohort.status}
          </span>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Cohort Information
          </h2>

          <form
            action={updateCohort}
            className="mt-5 grid gap-5 md:grid-cols-2"
          >
            <input
              type="hidden"
              name="id"
              value={cohort.id}
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Course
              </label>

              <select
                name="courseId"
                defaultValue={cohort.courseId}
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-900"
              >
                {courses.map((course) => (
                  <option
                    key={course.id}
                    value={course.id}
                  >
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Cohort Name
              </label>

              <input
                name="name"
                defaultValue={cohort.name}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Description
              </label>

              <textarea
                name="description"
                defaultValue={cohort.description ?? ""}
                rows={4}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Start Date
              </label>

              <input
                type="date"
                name="startDate"
                defaultValue={
                  cohort.startDate
                    ? cohort.startDate
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                End Date
              </label>

              <input
                type="date"
                name="endDate"
                defaultValue={
                  cohort.endDate
                    ? cohort.endDate
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Status
              </label>

              <select
                name="status"
                defaultValue={cohort.status}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-900"
              >
                <option value="UPCOMING">Upcoming</option>
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Save Changes
              </button>
            </div>
          </form>

          <div className="mt-5 border-t border-slate-200 pt-5">
            <form action={deleteCohort}>
              <input
                type="hidden"
                name="id"
                value={cohort.id}
              />

              <button
                type="submit"
                className="rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                Delete Cohort
              </button>
            </form>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Enrolled Students
                </h2>

                <p className="text-sm text-slate-500">
                  Students assigned to this cohort.
                </p>
              </div>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                {cohort.enrollments.length} Students
              </span>
            </div>
          </div>

          {cohort.enrollments.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-500">
              No students are currently enrolled in this cohort.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-212.5 text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-6 py-3">Student</th>
                    <th className="px-6 py-3">Student Number</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Phone</th>
                    <th className="px-6 py-3">Enrollment</th>
                    <th className="px-6 py-3">Progress</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {cohort.enrollments.map((enrollment) => {
                    const studentName =
                      `${enrollment.student.firstName} ${enrollment.student.lastName}`.trim();

                    return (
                      <tr key={enrollment.id}>
                        <td className="px-6 py-4">
                          <Link
                            href={`/admin/enrollments/${enrollment.id}`}
                            className="font-semibold text-slate-900 hover:underline"
                          >
                            {studentName}
                          </Link>
                        </td>

                        <td className="px-6 py-4 text-slate-600">
                          {enrollment.student.studentProfile
                            ?.studentNumber ?? "—"}
                        </td>

                        <td className="px-6 py-4 text-slate-600">
                          {enrollment.student.email}
                        </td>

                        <td className="px-6 py-4 text-slate-600">
                          {enrollment.student.phone ?? "—"}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              statusClass[enrollment.status] ??
                              "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {enrollment.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 font-semibold text-slate-900">
                          {enrollment.progress}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Course</p>
            <Link
              href={`/admin/courses/${cohort.course.id}`}
              className="mt-1 block font-bold text-slate-900 hover:underline"
            >
              {cohort.course.title}
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Start Date</p>
            <p className="mt-1 font-bold text-slate-900">
              {formatDate(cohort.startDate)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">End Date</p>
            <p className="mt-1 font-bold text-slate-900">
              {formatDate(cohort.endDate)}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}