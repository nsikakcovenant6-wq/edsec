import Link from "next/link";

import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";

import { createAssessment } from "../actions";

export default async function NewAssessmentPage() {
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
      <div className="mx-auto max-w-4xl">
        <Link
          href="/admin/assessments"
          className="text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          ← Back to Assessments
        </Link>

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="border-b border-slate-200 pb-6">
            <h1 className="text-2xl font-bold text-slate-900">
              Create Assessment
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Create a test, assignment, project, examination or
              practical assessment.
            </p>
          </div>

          {courses.length === 0 ? (
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5">
              <p className="font-semibold text-amber-800">
                No active courses available.
              </p>

              <p className="mt-1 text-sm text-amber-700">
                Create or activate a course before creating an
                assessment.
              </p>

              <Link
                href="/admin/courses"
                className="mt-4 inline-flex rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
              >
                Manage Courses
              </Link>
            </div>
          ) : (
            <form
              action={createAssessment}
              className="mt-6 space-y-6"
            >
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Assessment Title
                </label>

                <input
                  id="title"
                  name="title"
                  required
                  placeholder="e.g. Web Development Final Project"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
                />
              </div>

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
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-900"
                >
                  <option value="" disabled>
                    Select course
                  </option>

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

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="type"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Assessment Type
                  </label>

                  <select
                    id="type"
                    name="type"
                    defaultValue="ASSIGNMENT"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-900"
                  >
                    <option value="TEST">Test</option>
                    <option value="PROJECT">Project</option>
                    <option value="ASSIGNMENT">
                      Assignment
                    </option>
                    <option value="EXAM">Exam</option>
                    <option value="PRACTICAL">
                      Practical
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="maxScore"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Maximum Score
                  </label>

                  <input
                    id="maxScore"
                    name="maxScore"
                    type="number"
                    min="1"
                    step="0.01"
                    defaultValue="100"
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="dueDate"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Due Date
                </label>

                <input
                  id="dueDate"
                  name="dueDate"
                  type="datetime-local"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
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
                  rows={5}
                  placeholder="Describe the assessment..."
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Status
                </label>

                <select
                  id="status"
                  name="status"
                  defaultValue="DRAFT"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-900"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">
                    Published
                  </option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Link
                  href="/admin/assessments"
                  className="inline-flex justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Create Assessment
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}