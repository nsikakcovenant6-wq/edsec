import Link from "next/link";

import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";

import { createStudentActivity } from "./actions";

const activityTypes = [
  ["LESSON_COMPLETED", "Lesson Completed"],
  ["TEST_COMPLETED", "Test Completed"],
  ["PROJECT_SUBMITTED", "Project Submitted"],
  ["LIVE_CLASS_ATTENDED", "Live Class Attended"],
  ["ACHIEVEMENT_EARNED", "Achievement Earned"],
  ["PAYMENT_MADE", "Payment Made"],
  ["COURSE_ENROLLED", "Course Enrolled"],
  ["LOGIN", "Login"],
] as const;

function formatActivityType(type: string): string {
  return type
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1),
    )
    .join(" ");
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function AdminStudentActivitiesPage() {
  await requireRole("ADMIN");

  const [activities, students, enrollments] =
    await Promise.all([
      prisma.studentActivity.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 100,
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              studentProfile: {
                select: {
                  studentNumber: true,
                },
              },
            },
          },
          enrollment: {
            select: {
              id: true,
              course: {
                select: {
                  title: true,
                },
              },
            },
          },
        },
      }),

      prisma.user.findMany({
        where: {
          role: "STUDENT",
          status: "ACTIVE",
        },
        orderBy: [
          {
            firstName: "asc",
          },
          {
            lastName: "asc",
          },
        ],
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          studentProfile: {
            select: {
              studentNumber: true,
            },
          },
        },
      }),

      prisma.enrollment.findMany({
        where: {
          student: {
            role: "STUDENT",
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 500,
        select: {
          id: true,
          studentId: true,
          course: {
            select: {
              title: true,
            },
          },
        },
      }),
    ]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              EDSEC Administration
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
              Student Activities
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Monitor important student actions and
              manage activity records across the
              platform.
            </p>
          </div>

          <Link
            href="/admin"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Back to Admin
          </Link>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-950">
              Record Activity
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manually add an activity to a student&apos;s
              timeline.
            </p>
          </div>

          <form
            action={createStudentActivity}
            className="grid gap-5 md:grid-cols-2"
          >
            <div>
              <label
                htmlFor="studentId"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Student
              </label>

              <select
                id="studentId"
                name="studentId"
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">
                  Select student
                </option>

                {students.map((student) => (
                  <option
                    key={student.id}
                    value={student.id}
                  >
                    {student.firstName}{" "}
                    {student.lastName} —{" "}
                    {student.studentProfile
                      ?.studentNumber ??
                      student.email}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="type"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Activity Type
              </label>

              <select
                id="type"
                name="type"
                required
                defaultValue="LOGIN"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {activityTypes.map(
                  ([value, label]) => (
                    <option
                      key={value}
                      value={value}
                    >
                      {label}
                    </option>
                  ),
                )}
              </select>
            </div>

            <div>
              <label
                htmlFor="enrollmentId"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Enrollment
              </label>

              <select
                id="enrollmentId"
                name="enrollmentId"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">
                  No enrollment
                </option>

                {enrollments.map(
                  (enrollment) => (
                    <option
                      key={enrollment.id}
                      value={enrollment.id}
                    >
                      {enrollment.course.title}
                    </option>
                  ),
                )}
              </select>
            </div>

            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Title
              </label>

              <input
                id="title"
                name="title"
                required
                placeholder="Achievement earned"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                rows={3}
                placeholder="Describe what happened..."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="metadata"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Metadata
              </label>

              <textarea
                id="metadata"
                name="metadata"
                rows={3}
                placeholder='Optional JSON, e.g. {"source":"admin"}'
                className="w-full rounded-xl border border-slate-300 px-4 py-3 font-mono text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Record Activity
              </button>
            </div>
          </form>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-950">
              Recent Activity
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              The latest 100 recorded activities.
            </p>
          </div>

          {activities.length === 0 ? (
            <div className="p-12 text-center">
              <p className="font-semibold text-slate-900">
                No activities yet
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Student activities will appear here as
                students use the platform.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {activities.map((activity) => (
                <Link
                  key={activity.id}
                  href={`/admin/student-activities/${activity.id}`}
                  className="block p-5 transition hover:bg-slate-50"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                          {formatActivityType(
                            activity.type,
                          )}
                        </span>

                        <span className="text-xs text-slate-400">
                          {formatDate(
                            activity.createdAt,
                          )}
                        </span>
                      </div>

                      <h3 className="mt-2 font-semibold text-slate-950">
                        {activity.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-600">
                        {activity.student.firstName}{" "}
                        {activity.student.lastName}
                      </p>

                      {activity.description && (
                        <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                          {activity.description}
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 text-sm text-slate-500">
                      {activity.enrollment
                        ?.course.title ??
                        "No course"}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}