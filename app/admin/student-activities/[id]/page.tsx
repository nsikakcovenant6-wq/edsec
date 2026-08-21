import Link from "next/link";

import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";

import {
  deleteStudentActivity,
  updateStudentActivity,
} from "../actions";

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

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(date);
}

export default async function StudentActivityDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("ADMIN");

  const { id } = await params;

  const [activity, students, enrollments] =
    await Promise.all([
      prisma.studentActivity.findUnique({
        where: {
          id,
        },
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              status: true,
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
        },
      }),

      prisma.enrollment.findMany({
        select: {
          id: true,
          studentId: true,
          course: {
            select: {
              title: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 500,
      }),
    ]);

  if (!activity) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-950">
            Activity not found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            The activity may have been deleted.
          </p>

          <Link
            href="/admin/student-activities"
            className="mt-6 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
          >
            Back to Activities
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <Link
              href="/admin/student-activities"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              ← Student Activities
            </Link>

            <h1 className="mt-2 text-3xl font-bold text-slate-950">
              Activity Details
            </h1>
          </div>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
              {activity.type.replaceAll("_", " ")}
            </span>

            <span className="text-sm text-slate-500">
              {formatDate(activity.createdAt)}
            </span>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Student
              </p>

              <p className="mt-1 font-semibold text-slate-950">
                {activity.student.firstName}{" "}
                {activity.student.lastName}
              </p>

              <p className="text-sm text-slate-500">
                {activity.student.email}
              </p>

              {activity.student.studentProfile
                ?.studentNumber && (
                <p className="mt-1 text-xs text-slate-400">
                  {
                    activity.student.studentProfile
                      .studentNumber
                  }
                </p>
              )}
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Course
              </p>

              <p className="mt-1 font-semibold text-slate-950">
                {activity.enrollment?.course.title ??
                  "No course"}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-bold text-slate-950">
            Edit Activity
          </h2>

          <form
            action={updateStudentActivity}
            className="grid gap-5"
          >
            <input
              type="hidden"
              name="id"
              value={activity.id}
            />

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
                defaultValue={activity.studentId}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
              >
                {students.map((student) => (
                  <option
                    key={student.id}
                    value={student.id}
                  >
                    {student.firstName}{" "}
                    {student.lastName} —{" "}
                    {student.email}
                  </option>
                ))}
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
                defaultValue={
                  activity.enrollmentId ?? ""
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
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
                htmlFor="type"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Activity Type
              </label>

              <select
                id="type"
                name="type"
                required
                defaultValue={activity.type}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
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
                htmlFor="title"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Title
              </label>

              <input
                id="title"
                name="title"
                required
                defaultValue={activity.title}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                rows={4}
                defaultValue={
                  activity.description ?? ""
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="metadata"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Metadata
              </label>

              <textarea
                id="metadata"
                name="metadata"
                rows={6}
                defaultValue={
                  activity.metadata ?? ""
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 font-mono text-sm"
              />
            </div>

            <button
              type="submit"
              className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Save Changes
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-red-700">
            Delete Activity
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            This permanently removes this activity
            record.
          </p>

          <form
            action={deleteStudentActivity}
            className="mt-4"
          >
            <input
              type="hidden"
              name="id"
              value={activity.id}
            />

            <button
              type="submit"
              className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700"
            >
              Delete Activity
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}