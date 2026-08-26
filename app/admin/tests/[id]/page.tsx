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
    (sum, question) =>
      sum + question.points,
    0
  );

  const statusClass: Record<
    string,
    string
  > = {
    DRAFT:
      "bg-slate-100 text-slate-700",
    PUBLISHED:
      "bg-emerald-100 text-emerald-700",
    CLOSED:
      "bg-red-100 text-red-700",
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link
              href="/admin/tests"
              className="mb-2 inline-flex text-sm font-medium text-slate-500 transition hover:text-slate-900"
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

        {/* =====================================================
            TEST INFORMATION
        ====================================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">
              Test Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Update the test settings and publishing status.
            </p>
          </div>

          <form
            action={updateTest}
            className="grid gap-5 md:grid-cols-2"
          >
            <input
              type="hidden"
              name="testId"
              value={test.id}
            />

            {/* TITLE */}

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
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              />
            </div>

            {/* COURSE */}

            <div className="md:col-span-2">
              <label
                htmlFor="courseId"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Course
              </label>

              <select
                id="courseId"
                name="courseId"
                defaultValue={test.courseId}
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              >
                <option value={test.courseId}>
                  {test.course.title}
                </option>
              </select>

              <p className="mt-1 text-xs text-slate-400">
                The test remains associated with its current course.
              </p>
            </div>

            {/* DESCRIPTION */}

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
                defaultValue={
                  test.description ?? ""
                }
                placeholder="Describe this test..."
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              />
            </div>

            {/* DURATION */}

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
                defaultValue={
                  test.duration ?? ""
                }
                placeholder="e.g. 60"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              />
            </div>

            {/* STATUS */}

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
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              >
                <option value="DRAFT">
                  Draft
                </option>

                <option value="PUBLISHED">
                  Published
                </option>

                <option value="CLOSED">
                  Closed
                </option>
              </select>
            </div>

            {/* SAVE */}

            <div className="flex flex-wrap gap-3 pt-2 md:col-span-2">
              <button
                type="submit"
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Save Changes
              </button>
            </div>
          </form>

          {/* DELETE TEST */}

          <div className="mt-5 border-t border-slate-100 pt-5">
            <form action={deleteTest}>
              <input
                type="hidden"
                name="testId"
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

        {/* =====================================================
            STATISTICS
        ====================================================== */}

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

        {/* =====================================================
            QUESTIONS
        ====================================================== */}

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
                {test.questions.length === 1
                  ? ""
                  : "s"}
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

              {test.questions.map(
                (question, index) => (
                  <div
                    key={question.id}
                    className="p-6"
                  >

                    <div className="flex flex-col gap-5">

                      {/* QUESTION HEADER */}

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
                            {question.points === 1
                              ? ""
                              : "s"}
                          </span>

                        </div>

                        <p className="mt-4 font-semibold text-slate-900">
                          {question.question}
                        </p>

                      </div>

                      {/* OPTIONS */}

                      {question.options.length > 0 && (
                        <div className="rounded-xl bg-slate-50 p-4">

                          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Answer Options
                          </p>

                          <div className="space-y-2">

                            {question.options.map(
                              (
                                option,
                                optionIndex
                              ) => (
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
                                      65 +
                                        optionIndex
                                    )}
                                    .
                                  </span>

                                  <span className="flex-1">
                                    {
                                      option.optionText
                                    }
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

                      {/* UPDATE QUESTION */}

                      <form
                        action={updateQuestion}
                        className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4"
                      >

                        <input
                          type="hidden"
                          name="questionId"
                          value={
                            question.id
                          }
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
                            defaultValue={
                              question.question
                            }
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
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
                              defaultValue={
                                question.type
                              }
                              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
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
                              defaultValue={
                                question.points
                              }
                              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
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
                            defaultValue={
                              question.displayOrder
                            }
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                          />

                        </div>

                        {/* MULTIPLE CHOICE */}

                        {question.type ===
                          "MULTIPLE_CHOICE" && (
                          <div className="space-y-3">

                            <p className="text-sm font-semibold text-slate-700">
                              Answer Options
                            </p>

                            {question.options.map(
                              (
                                option,
                                optionIndex
                              ) => (
                                <div
                                  key={option.id}
                                  className="flex gap-3"
                                >

                                  <input
                                    name="optionText"
                                    type="text"
                                    defaultValue={
                                      option.optionText
                                    }
                                    required
                                    className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                                  />

                                  <label className="flex items-center gap-2 text-sm text-slate-600">

                                    <input
                                      type="radio"
                                      name="correctOption"
                                      value={
                                        optionIndex
                                      }
                                      defaultChecked={
                                        option.isCorrect
                                      }
                                    />

                                    Correct

                                  </label>

                                </div>
                              )
                            )}

                          </div>
                        )}

                        {/* TRUE / FALSE */}

                        {question.type ===
                          "TRUE_FALSE" && (
                          <div>

                            <label
                              htmlFor={`correct-answer-${question.id}`}
                              className="mb-2 block text-sm font-medium text-slate-700"
                            >
                              Correct Answer
                            </label>

                            <select
                              id={`correct-answer-${question.id}`}
                              name="correctAnswer"
                              defaultValue={
                                question.options.find(
                                  (
                                    option
                                  ) =>
                                    option.isCorrect
                                )
                                  ?.optionText.toUpperCase() ??
                                "TRUE"
                              }
                              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                            >

                              <option value="TRUE">
                                True
                              </option>

                              <option value="FALSE">
                                False
                              </option>

                            </select>

                          </div>
                        )}

                        <button
                          type="submit"
                          className="w-fit rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                          Save Question
                        </button>

                      </form>

                      {/* DELETE QUESTION */}

                      <form
                        action={deleteQuestion}
                      >

                        <input
                          type="hidden"
                          name="questionId"
                          value={question.id}
                        />

                        <input
                          type="hidden"
                          name="testId"
                          value={test.id}
                        />

                        <button
                          type="submit"
                          className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                        >
                          Delete Question
                        </button>

                      </form>

                    </div>

                  </div>
                )
              )}

            </div>
          )}

        </section>

        {/* =====================================================
            ADD QUESTION
        ====================================================== */}

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
            action={createQuestion}
            className="space-y-5"
          >

            <input
              type="hidden"
              name="testId"
              value={test.id}
            />

            {/* QUESTION */}

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
                placeholder="Enter the question..."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              />

            </div>

            {/* TYPE / POINTS / ORDER */}

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
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
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
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
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
                  defaultValue={
                    test.questions.length
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                />

              </div>

            </div>

            {/* MULTIPLE CHOICE */}

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

              <h3 className="font-semibold text-slate-900">
                Multiple Choice Options
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Enter at least two options and select the correct answer.
              </p>

              <div className="mt-5 space-y-3">

                {[0, 1, 2, 3].map(
                  (index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3"
                    >

                      <span className="w-7 text-sm font-bold text-slate-500">
                        {String.fromCharCode(
                          65 + index
                        )}
                        .
                      </span>

                      <input
                        name="optionText"
                        type="text"
                        placeholder={`Option ${String.fromCharCode(
                          65 + index
                        )}`}
                        className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                      />

                      <label className="flex items-center gap-2 text-xs font-medium text-slate-600">

                        <input
                          type="radio"
                          name="correctOption"
                          value={index}
                          defaultChecked={
                            index === 0
                          }
                        />

                        Correct

                      </label>

                    </div>
                  )
                )}

              </div>

            </div>

            {/* TRUE / FALSE */}

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

              <h3 className="font-semibold text-slate-900">
                True / False Answer
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                This is used when the question type is True / False.
              </p>

              <select
                name="correctAnswer"
                defaultValue="TRUE"
                className="mt-4 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
              >

                <option value="TRUE">
                  True
                </option>

                <option value="FALSE">
                  False
                </option>

              </select>

            </div>

            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Add Question
            </button>

          </form>

        </section>

      </div>
    </main>
  );
}