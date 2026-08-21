import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";
import {
  updateTest,
  deleteTest,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "../actions";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TestDetailsPage({
  params,
}: PageProps) {
  await requireRole("ADMIN");

  const { id } = await params;

  const test = await prisma.test.findUnique({
    where: {
      id,
    },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
      questions: {
        orderBy: {
          displayOrder: "asc",
        },
        include: {
          options: {
            orderBy: {
              displayOrder: "asc",
            },
          },
        },
      },
      _count: {
        select: {
          attempts: true,
        },
      },
    },
  });

  if (!test) {
    notFound();
  }

  const totalPoints = test.questions.reduce(
    (sum, question) => sum + question.points,
    0
  );

  /*
   * Server Action wrappers.
   *
   * Your actions return result objects, but HTML form actions in the
   * current React/Next.js typings expect void | Promise<void>.
   *
   * These wrappers call the actual server actions and intentionally
   * discard their result.
   */

  async function handleUpdateTest(formData: FormData): Promise<void> {
    await updateTest(formData);
  }

  async function handleDeleteTest(formData: FormData): Promise<void> {
    await deleteTest(formData);
  }

  async function handleCreateQuestion(
    formData: FormData
  ): Promise<void> {
    await createQuestion(formData);
  }

  async function handleUpdateQuestion(
    formData: FormData
  ): Promise<void> {
    await updateQuestion(formData);
  }

  async function handleDeleteQuestion(
    formData: FormData
  ): Promise<void> {
    await deleteQuestion(formData);
  }

  const statusClass: Record<string, string> = {
    DRAFT: "bg-slate-100 text-slate-700",
    PUBLISHED: "bg-emerald-100 text-emerald-700",
    CLOSED: "bg-red-100 text-red-700",
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link
              href="/admin/tests"
              className="mb-2 inline-flex text-sm font-medium text-slate-500 hover:text-slate-900"
            >
              ← Back to Tests
            </Link>

            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              {test.title}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {test.course.title}
            </p>
          </div>

          <span
            className={`inline-flex w-fit rounded-full px-3 py-1 text-sm font-semibold ${
              statusClass[test.status] ??
              "bg-slate-100 text-slate-700"
            }`}
          >
            {test.status}
          </span>
        </div>

        {/* Test Information */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Test Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Update the test settings and publishing status.
              </p>
            </div>
          </div>

          <form
            action={handleUpdateTest}
            className="grid gap-5 md:grid-cols-2"
          >
            <input
              type="hidden"
              name="id"
              value={test.id}
            />

            <div className="md:col-span-2">
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Test Title
              </label>

              <input
                id="title"
                name="title"
                type="text"
                required
                defaultValue={test.title}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
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
                rows={4}
                defaultValue={test.description ?? ""}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                placeholder="Describe this test..."
              />
            </div>

            <div>
              <label
                htmlFor="duration"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Duration (minutes)
              </label>

              <input
                id="duration"
                name="duration"
                type="number"
                min="1"
                defaultValue={test.duration ?? ""}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                placeholder="e.g. 60"
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
                defaultValue={test.status}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>

            <div className="md:col-span-2 flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Save Changes
              </button>
            </div>
          </form>

          <div className="mt-5 border-t border-slate-100 pt-5">
            <form action={handleDeleteTest}>
              <input
                type="hidden"
                name="id"
                value={test.id}
              />

              <button
                type="submit"
                className="rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                Delete Test
              </button>
            </form>
          </div>
        </section>

        {/* Statistics */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Questions
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {test.questions.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Total Points
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {totalPoints}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Student Attempts
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {test._count.attempts}
            </p>
          </div>
        </div>

        {/* Questions */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Questions
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Manage the questions and answer options for this test.
                </p>
              </div>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {test.questions.length} question
                {test.questions.length === 1 ? "" : "s"}
              </span>
            </div>
          </div>

          {test.questions.length === 0 ? (
            <div className="p-6">
              <p className="text-sm text-slate-500">
                No questions have been added to this test yet.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {test.questions.map((question, index) => (
                <div
                  key={question.id}
                  className="p-6"
                >
                  <div className="flex flex-col gap-5">

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                            Question {index + 1}
                          </span>

                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                            {question.type}
                          </span>

                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                            {question.points} point
                            {question.points === 1 ? "" : "s"}
                          </span>
                        </div>

                        <p className="mt-4 font-semibold text-slate-900">
                          {question.question}
                        </p>
                      </div>
                    </div>

                    {/* Options */}
                    {question.options.length > 0 && (
                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Answer Options
                        </p>

                        <div className="space-y-2">
                          {question.options.map(
                            (option, optionIndex) => (
                              <div
                                key={option.id}
                                className={`flex items-center gap-3 rounded-lg border px-3 py-2 text-sm ${
                                  option.isCorrect
                                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                                    : "border-slate-200 bg-white text-slate-700"
                                }`}
                              >
                                <span className="font-semibold">
                                  {String.fromCharCode(
                                    65 + optionIndex
                                  )}
                                  .
                                </span>

                                <span className="flex-1">
                                  {option.optionText}
                                </span>

                                {option.isCorrect && (
                                  <span className="text-xs font-semibold text-emerald-700">
                                    Correct
                                  </span>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* Update Question */}
                    <form
                      action={handleUpdateQuestion}
                      className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4"
                    >
                      <input
                        type="hidden"
                        name="id"
                        value={question.id}
                      />

                      <input
                        type="hidden"
                        name="testId"
                        value={test.id}
                      />

                      <div>
                        <label
                          htmlFor={`question-${question.id}`}
                          className="mb-2 block text-sm font-medium text-slate-700"
                        >
                          Question
                        </label>

                        <textarea
                          id={`question-${question.id}`}
                          name="question"
                          required
                          rows={3}
                          defaultValue={question.question}
                          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
                        />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor={`type-${question.id}`}
                            className="mb-2 block text-sm font-medium text-slate-700"
                          >
                            Type
                          </label>

                          <select
                            id={`type-${question.id}`}
                            name="type"
                            defaultValue={question.type}
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
                          >
                            <option value="MULTIPLE_CHOICE">
                              Multiple Choice
                            </option>

                            <option value="TRUE_FALSE">
                              True / False
                            </option>
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor={`points-${question.id}`}
                            className="mb-2 block text-sm font-medium text-slate-700"
                          >
                            Points
                          </label>

                          <input
                            id={`points-${question.id}`}
                            name="points"
                            type="number"
                            min="1"
                            required
                            defaultValue={question.points}
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor={`displayOrder-${question.id}`}
                          className="mb-2 block text-sm font-medium text-slate-700"
                        >
                          Display Order
                        </label>

                        <input
                          id={`displayOrder-${question.id}`}
                          name="displayOrder"
                          type="number"
                          min="0"
                          defaultValue={question.displayOrder}
                          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
                        />
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <button
                          type="submit"
                          className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                        >
                          Save Question
                        </button>
                      </div>
                    </form>

                    {/* Delete Question */}
                    <form action={handleDeleteQuestion}>
                      <input
                        type="hidden"
                        name="id"
                        value={question.id}
                      />

                      <input
                        type="hidden"
                        name="testId"
                        value={test.id}
                      />

                      <button
                        type="submit"
                        className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                      >
                        Delete Question
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Add Question */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">
              Add Question
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Create a new question for this test.
            </p>
          </div>

          <form
            action={handleCreateQuestion}
            className="space-y-5"
          >
            <input
              type="hidden"
              name="testId"
              value={test.id}
            />

            <div>
              <label
                htmlFor="new-question"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Question
              </label>

              <textarea
                id="new-question"
                name="question"
                required
                rows={4}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                placeholder="Enter the question..."
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <label
                  htmlFor="new-type"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Question Type
                </label>

                <select
                  id="new-type"
                  name="type"
                  defaultValue="MULTIPLE_CHOICE"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
                >
                  <option value="MULTIPLE_CHOICE">
                    Multiple Choice
                  </option>

                  <option value="TRUE_FALSE">
                    True / False
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="new-points"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Points
                </label>

                <input
                  id="new-points"
                  name="points"
                  type="number"
                  min="1"
                  defaultValue="1"
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label
                  htmlFor="new-display-order"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Display Order
                </label>

                <input
                  id="new-display-order"
                  name="displayOrder"
                  type="number"
                  min="0"
                  defaultValue={test.questions.length}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Add Question
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}