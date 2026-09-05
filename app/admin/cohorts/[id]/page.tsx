import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";

import {
  updateCohort,
  deleteCohort,
  assignStudentToCohort,
  removeStudentFromCohort,
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

const enrollmentClass: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700",
  COMPLETED: "bg-blue-100 text-blue-700",
  SUSPENDED: "bg-amber-100 text-amber-700",
  DROPPED: "bg-red-100 text-red-700",
};

function formatDate(date: Date | null) {
  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
  }).format(date);
}

function formatDateInput(date: Date | null) {
  if (!date) {
    return "";
  }

  return date.toISOString().split("T")[0];
}

export default async function CohortDetailsPage({
  params,
}: PageProps) {
  await requireRole("ADMIN");

  const { id } = await params;

  const cohort = await prisma.cohort.findUnique({
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
  });

  if (!cohort) {
    notFound();
  }

  const students = await prisma.user.findMany({
    where: {
      role: "STUDENT",
      status: "ACTIVE",
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,

      studentProfile: {
        select: {
          studentNumber: true,
        },
      },

      enrollments: {
        where: {
          courseId: cohort.courseId,
        },
        select: {
          id: true,
          cohortId: true,
          status: true,
        },
        take: 1,
      },
    },
    orderBy: [
      {
        firstName: "asc",
      },
      {
        lastName: "asc",
      },
    ],
  });

  const enrolledStudentIds = new Set(
    cohort.enrollments.map(
      (enrollment) => enrollment.student.id,
    ),
  );

  const availableStudents = students.filter(
    (student) =>
      !enrolledStudentIds.has(student.id),
  );

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
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
              Manage this cohort, its course, and assigned
              students.
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

        {/* Summary */}
        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Course
            </p>

            <p className="mt-2 font-bold text-slate-900">
              {cohort.course.title}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Students
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {cohort.enrollments.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Training Period
            </p>

            <p className="mt-2 text-sm font-semibold text-slate-900">
              {formatDate(cohort.startDate)}
              {" → "}
              {formatDate(cohort.endDate)}
            </p>
          </div>
        </section>

        {/* Cohort Information */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Cohort Information
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Update the course, name, dates, description and
            status.
          </p>

          <form
            action={updateCohort}
            className="mt-6 grid gap-5 md:grid-cols-2"
          >
            <input
              type="hidden"
              name="id"
              value={cohort.id}
            />

            <div>
              <label
                htmlFor="courseId"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Course
              </label>

              <select
                id="courseId"
                name="courseId"
                defaultValue={cohort.courseId}
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              >
                <option value={cohort.courseId}>
                  {cohort.course.title}
                </option>
              </select>

              {cohort.enrollments.length > 0 ? (
                <p className="mt-2 text-xs text-amber-600">
                  The course cannot be changed while students
                  are assigned to this cohort.
                </p>
              ) : (
                <p className="mt-2 text-xs text-slate-400">
                  You can change the course while this cohort
                  has no students.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Cohort Name
              </label>

              <input
                id="name"
                name="name"
                defaultValue={cohort.name}
                required
                placeholder="e.g. Web Development Batch 1"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                defaultValue={cohort.description ?? ""}
                rows={4}
                placeholder="Describe this cohort..."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              />
            </div>

            <div>
              <label
                htmlFor="startDate"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Start Date
              </label>

              <input
                id="startDate"
                type="date"
                name="startDate"
                defaultValue={formatDateInput(
                  cohort.startDate,
                )}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              />
            </div>

            <div>
              <label
                htmlFor="endDate"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                End Date
              </label>

              <input
                id="endDate"
                type="date"
                name="endDate"
                defaultValue={formatDateInput(
                  cohort.endDate,
                )}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              />
            </div>

            <div>
              <label
                htmlFor="status"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Status
              </label>

              <select
                id="status"
                name="status"
                defaultValue={cohort.status}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              >
                <option value="UPCOMING">
                  Upcoming
                </option>

                <option value="ACTIVE">
                  Active
                </option>

                <option value="COMPLETED">
                  Completed
                </option>

                <option value="CANCELLED">
                  Cancelled
                </option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Save Changes
              </button>
            </div>
          </form>

          <div className="mt-6 border-t border-slate-200 pt-6">
            <form action={deleteCohort}>
              <input
                type="hidden"
                name="id"
                value={cohort.id}
              />

              <button
                type="submit"
                className="rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                Delete Cohort
              </button>
            </form>
          </div>
        </section>

        {/* Add Student */}
        <section className="rounded-2xl border border-blue-200 bg-white shadow-sm">
          <div className="border-b border-blue-100 bg-blue-50 p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Add Student to Cohort
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                  Assign an active student to{" "}
                  <span className="font-semibold">
                    {cohort.name}
                  </span>
                  .
                </p>
              </div>

              <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-700">
                {cohort.course.title}
              </span>
            </div>
          </div>

          <div className="p-6">
            {availableStudents.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center">
                <p className="font-semibold text-slate-700">
                  No additional active students available.
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  All active students are already assigned to
                  this cohort.
                </p>
              </div>
            ) : (
              <form
                action={assignStudentToCohort}
                className="flex flex-col gap-4 md:flex-row md:items-end"
              >
                <input
                  type="hidden"
                  name="cohortId"
                  value={cohort.id}
                />

                <div className="flex-1">
                  <label
                    htmlFor="studentId"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Select Student
                  </label>

                  <select
                    id="studentId"
                    name="studentId"
                    required
                    defaultValue=""
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
                  >
                    <option value="" disabled>
                      Choose a student...
                    </option>

                    {availableStudents.map((student) => {
                      const fullName =
                        `${student.firstName} ${student.lastName}`.trim();

                      const existingEnrollment =
                        student.enrollments[0];

                      const isInAnotherCohort =
                        Boolean(
                          existingEnrollment?.cohortId,
                        );

                      return (
                        <option
                          key={student.id}
                          value={student.id}
                        >
                          {fullName}
                          {" — "}
                          {student.studentProfile
                            ?.studentNumber ??
                            "No student number"}
                          {" — "}
                          {isInAnotherCohort
                            ? "Move from another cohort"
                            : "New course enrollment"}
                          {" — "}
                          {student.email}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  + Add Student
                </button>
              </form>
            )}

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs leading-5 text-slate-500">
                <span className="font-semibold text-slate-700">
                  How this works:
                </span>{" "}
                If the student already has an enrollment for{" "}
                <span className="font-semibold">
                  {cohort.course.title}
                </span>
                , that enrollment is reused and assigned to
                this cohort. If no enrollment exists, a new
                active course enrollment is created.
              </p>
            </div>
          </div>
        </section>

        {/* Enrolled Students */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Enrolled Students
                </h2>

                <p className="text-sm text-slate-500">
                  Students currently assigned to this cohort.
                </p>
              </div>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                {cohort.enrollments.length} Student
                {cohort.enrollments.length === 1
                  ? ""
                  : "s"}
              </span>
            </div>
          </div>

          {cohort.enrollments.length === 0 ? (
            <div className="p-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
                👨‍🎓
              </div>

              <p className="mt-4 font-semibold text-slate-700">
                No students in this cohort
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Use the form above to add students.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-250 text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-6 py-3">
                      Student
                    </th>

                    <th className="px-6 py-3">
                      Student Number
                    </th>

                    <th className="px-6 py-3">
                      Email
                    </th>

                    <th className="px-6 py-3">
                      Phone
                    </th>

                    <th className="px-6 py-3">
                      Enrollment
                    </th>

                    <th className="px-6 py-3">
                      Progress
                    </th>

                    <th className="px-6 py-3">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {cohort.enrollments.map(
                    (enrollment) => {
                      const studentName =
                        `${enrollment.student.firstName} ${enrollment.student.lastName}`.trim();

                      const progress = Math.min(
                        Math.max(
                          enrollment.progress,
                          0,
                        ),
                        100,
                      );

                      return (
                        <tr
                          key={enrollment.id}
                          className="hover:bg-slate-50"
                        >
                          <td className="px-6 py-4">
                            <Link
                              href={`/admin/enrollments/${enrollment.id}`}
                              className="font-semibold text-slate-900 hover:text-blue-600 hover:underline"
                            >
                              {studentName}
                            </Link>
                          </td>

                          <td className="px-6 py-4 text-slate-600">
                            {enrollment.student
                              .studentProfile
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
                                enrollmentClass[
                                  enrollment.status
                                ] ??
                                "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {enrollment.status}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                                <div
                                  className="h-full rounded-full bg-blue-600"
                                  style={{
                                    width: `${progress}%`,
                                  }}
                                />
                              </div>

                              <span className="text-xs font-semibold text-slate-600">
                                {progress}%
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <form
                              action={
                                removeStudentFromCohort
                              }
                            >
                              <input
                                type="hidden"
                                name="enrollmentId"
                                value={enrollment.id}
                              />

                              <input
                                type="hidden"
                                name="cohortId"
                                value={cohort.id}
                              />

                              <button
                                type="submit"
                                className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                              >
                                Remove
                              </button>
                            </form>
                          </td>
                        </tr>
                      );
                    },
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Cohort Management */}
        <section className="rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white shadow-sm">
          <h2 className="text-lg font-bold">
            Cohort Management
          </h2>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-semibold">
                Course
              </p>

              <p className="mt-1 text-sm text-slate-400">
                {cohort.course.title}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-semibold">
                Students
              </p>

              <p className="mt-1 text-sm text-slate-400">
                {cohort.enrollments.length} currently assigned
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-semibold">
                Status
              </p>

              <p className="mt-1 text-sm text-slate-400">
                {cohort.status}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}