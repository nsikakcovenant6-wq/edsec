import Link from "next/link";
import { requireRole } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { createTest } from "../actions";

export default async function NewTestPage() {
  await requireRole("ADMIN");

  const courses = await prisma.course.findMany({
    where: {
      status: "ACTIVE",
    },
    select: {
      id: true,
      title: true,
    },
    orderBy: {
      title: "asc",
    },
  });

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/admin/tests"
            className="mb-3 inline-flex text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            ← Back to Tests
          </Link>

          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Create New Test
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Create an assessment for one of your active courses.
          </p>
        </div>

        {/* Form */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {courses.length === 0 ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
              <h2 className="font-semibold text-amber-900">
                No active courses available
              </h2>

              <p className="mt-1 text-sm text-amber-700">
                You need to create or activate a course before creating a
                test.
              </p>

              <Link
                href="/admin/courses"
                className="mt-4 inline-flex rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Manage Courses
              </Link>
            </div>
          ) : (
            <form
              action={async (formData: FormData): Promise<void> => {
                await createTest(formData);
              }}
              className="space-y-6"
            >
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Test Title
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  placeholder="e.g. HTML & CSS Fundamentals Test"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
                />
              </div>

              {/* Course */}
              <div>
                <label
                  htmlFor="courseId"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Course
                </label>

                <select
                  id="courseId"
                  name="courseId"
                  required
                  defaultValue=""
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
                >
                  <option value="" disabled>
                    Select a course
                  </option>

                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration */}
              <div>
                <label
                  htmlFor="duration"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Duration
                </label>

                <div className="flex">
                  <input
                    id="duration"
                    name="duration"
                    type="number"
                    min="1"
                    placeholder="60"
                    className="w-full rounded-l-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
                  />

                  <span className="inline-flex items-center rounded-r-xl border border-l-0 border-slate-300 bg-slate-50 px-4 text-sm text-slate-500">
                    minutes
                  </span>
                </div>

                <p className="mt-1.5 text-xs text-slate-400">
                  Leave empty if the test should have no time limit.
                </p>
              </div>

              {/* Description */}
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
                  rows={5}
                  placeholder="Describe what this assessment covers..."
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
                <Link
                  href="/admin/tests"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Create Test
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}