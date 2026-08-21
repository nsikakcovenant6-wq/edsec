import Link from "next/link";

import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";

import {
  deleteAssessment,
  deleteGrade,
  saveGrade,
  updateAssessment,
  updateAssessmentStatus,
} from "../actions";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatTimeInput(date: Date) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}

function getGradeClass(grade: string | null) {
  if (grade === "A") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (grade === "B") {
    return "bg-blue-100 text-blue-700";
  }

  if (grade === "C") {
    return "bg-cyan-100 text-cyan-700";
  }

  if (grade === "D") {
    return "bg-amber-100 text-amber-700";
  }

  if (grade === "E") {
    return "bg-orange-100 text-orange-700";
  }

  return "bg-red-100 text-red-700";
}

export default async function AssessmentDetailsPage({
  params,
}: PageProps) {
  await requireRole("ADMIN");

  const { id } = await params;

  const [assessment, courses] = await Promise.all([
    prisma.assessment.findUnique({
      where: {
        id,
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },

        grades: {
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
              },
            },
          },

          orderBy: [
            {
              student: {
                firstName: "asc",
              },
            },
            {
              student: {
                lastName: "asc",
              },
            },
          ],
        },
      },
    }),

    prisma.course.findMany({
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
    }),
  ]);

  if (!assessment) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-white p-8 text-center">
          <h1 className="text-xl font-bold text-slate-900">
            Assessment not found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            The assessment does not exist or has been removed.
          </p>

          <Link
            href="/admin/assessments"
            className="mt-5 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
          >
            Back to Assessments
          </Link>
        </div>
      </main>
    );
  }

  const average =
    assessment.grades.length > 0
      ? assessment.grades.reduce(
          (sum, grade) => sum + grade.score,
          0,
        ) / assessment.grades.length
      : 0;

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <Link
            href="/admin/assessments"
            className="text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            ← Back to Assessments
          </Link>

          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  {assessment.title}
                </h1>

                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  {assessment.type}
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {assessment.status}
                </span>
              </div>

              <p className="mt-2 text-sm text-slate-500">
                {assessment.course.title}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {assessment.status !== "PUBLISHED" && (
                <form action={updateAssessmentStatus}>
                  <input
                    type="hidden"
                    name="id"
                    value={assessment.id}
                  />

                  <input
                    type="hidden"
                    name="status"
                    value="PUBLISHED"
                  />

                  <button
                    type="submit"
                    className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    Publish
                  </button>
                </form>
              )}

              {assessment.status !== "CLOSED" && (
                <form action={updateAssessmentStatus}>
                  <input
                    type="hidden"
                    name="id"
                    value={assessment.id}
                  />

                  <input
                    type="hidden"
                    name="status"
                    value="CLOSED"
                  />

                  <button
                    type="submit"
                    className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Close
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Maximum Score
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {assessment.maxScore}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Students Graded
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {assessment.grades.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Average Score
            </p>

            <p className="mt-2 text-3xl font-bold text-emerald-600">
              {average.toFixed(1)}
            </p>
          </div>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="border-b border-slate-200 pb-5">
            <h2 className="text-lg font-bold text-slate-900">
              Edit Assessment
            </h2>
          </div>

          <form
            action={updateAssessment}
            className="mt-6 space-y-6"
          >
            <input
              type="hidden"
              name="id"
              value={assessment.id}
            />

            <div className="grid gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
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
                  defaultValue={assessment.title}
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
                  defaultValue={assessment.courseId}
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
                <label
                  htmlFor="type"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Type
                </label>

                <select
                  id="type"
                  name="type"
                  defaultValue={assessment.type}
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
                  required
                  defaultValue={assessment.maxScore}
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
                  defaultValue={assessment.status}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-900"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">
                    Published
                  </option>
                  <option value="CLOSED">Closed</option>
                </select>
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
                  defaultValue={
                    assessment.dueDate
                      ? `${formatDateInput(
                          assessment.dueDate,
                        )}T${formatTimeInput(
                          assessment.dueDate,
                        )}`
                      : ""
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
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
                  rows={4}
                  defaultValue={assessment.description ?? ""}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Save Changes
            </button>
          </form>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900">
              Student Grades
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter and manage scores for students taking this
              assessment.
            </p>
          </div>

          {assessment.grades.length === 0 ? (
            <div className="p-8 text-center">
              <p className="font-semibold text-slate-900">
                No grades recorded yet.
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Students will appear here after their grades are
                entered.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {assessment.grades.map((grade) => (
                <div
                  key={grade.id}
                  className="p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {grade.student.firstName}{" "}
                        {grade.student.lastName}
                      </p>

                      <p className="text-sm text-slate-500">
                        {grade.student.email}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {grade.student.studentProfile
                          ?.studentNumber ??
                          "No student number"}
                      </p>
                    </div>

                    <span
                      className={`inline-flex w-fit rounded-full px-3 py-1.5 text-xs font-bold ${getGradeClass(
                        grade.grade,
                      )}`}
                    >
                      Grade {grade.grade ?? "-"}
                    </span>
                  </div>

                  <form
                    action={saveGrade}
                    className="mt-5 grid gap-3 md:grid-cols-[150px_1fr_auto]"
                  >
                    <input
                      type="hidden"
                      name="assessmentId"
                      value={assessment.id}
                    />

                    <input
                      type="hidden"
                      name="studentId"
                      value={grade.student.id}
                    />

                    <input
                      type="hidden"
                      name="enrollmentId"
                      value={grade.enrollment?.id ?? ""}
                    />

                    <input
                      name="score"
                      type="number"
                      min="0"
                      max={assessment.maxScore}
                      step="0.01"
                      required
                      defaultValue={grade.score}
                      className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
                      placeholder="Score"
                    />

                    <input
                      name="feedback"
                      defaultValue={grade.feedback ?? ""}
                      placeholder="Feedback"
                      className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
                    />

                    <button
                      type="submit"
                      className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                      Save
                    </button>
                  </form>

                  <div className="mt-3 flex justify-between text-xs text-slate-400">
                    <span>
                      Score: {grade.score} / {grade.maxScore}
                    </span>

                    <form action={deleteGrade}>
                      <input
                        type="hidden"
                        name="id"
                        value={grade.id}
                      />

                      <button
                        type="submit"
                        className="font-semibold text-red-600 hover:text-red-700"
                      >
                        Remove Grade
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-red-700">
            Danger Zone
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Deleting this assessment will also delete all grades
            associated with it.
          </p>

          <form
            action={deleteAssessment}
            className="mt-5"
          >
            <input
              type="hidden"
              name="id"
              value={assessment.id}
            />

            <button
              type="submit"
              className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700"
            >
              Delete Assessment
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}