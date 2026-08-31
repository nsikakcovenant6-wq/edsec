 

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

function formatDate(date: Date | null | undefined) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatScore(score: number | null | undefined) {
  if (score === null || score === undefined) {
    return "Not graded";
  }

  return Number.isInteger(score) ? String(score) : score.toFixed(2);
}

function getPercentage(
  score: number | null | undefined,
  totalPoints: number | null | undefined,
) {
  if (
    score === null ||
    score === undefined ||
    totalPoints === null ||
    totalPoints === undefined ||
    totalPoints <= 0
  ) {
    return null;
  }

  return (score / totalPoints) * 100;
}

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

      attempts: {
        orderBy: {
          startedAt: "desc",
        },

        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },

          answers: {
            include: {
              question: {
                select: {
                  id: true,
                  question: true,
                  points: true,

                  /*
                   * IMPORTANT:
                   * We load the answer options through the Question
                   * relation because StudentAnswer does not have a
                   * selectedOption Prisma relation in your schema.
                   */
                  options: {
                    orderBy: {
                      displayOrder: "asc",
                    },

                    select: {
                      id: true,
                      optionText: true,
                      isCorrect: true,
                      displayOrder: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!test) {
    notFound();
  }

  const totalPoints = test.questions.reduce(
    (sum, question) => sum + question.points,
    0,
  );

  const totalAttempts = test.attempts.length;

  const submittedAttempts = test.attempts.filter(
    (attempt) =>
      attempt.status === "SUBMITTED" ||
      attempt.status === "GRADED",
  );

  const gradedAttempts = test.attempts.filter(
    (attempt) => attempt.status === "GRADED",
  );

  const averageScore =
    gradedAttempts.length > 0
      ? gradedAttempts.reduce(
          (sum, attempt) => sum + (attempt.score ?? 0),
          0,
        ) / gradedAttempts.length
      : null;

  const statusClass: Record<string, string> = {
    DRAFT: "bg-slate-100 text-slate-700",
    PUBLISHED: "bg-emerald-100 text-emerald-700",
    CLOSED: "bg-red-100 text-red-700",
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
                defaultValue={test.description ?? ""}
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
                defaultValue={test.duration ?? ""}
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
                required
                defaultValue={test.status}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
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

          {/* DELETE */}

          <div className="mt-6 border-t border-slate-100 pt-5">
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

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

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
              Attempts
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {totalAttempts}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Submitted
            </p>

            <p className="mt-1 text-2xl font-bold text-blue-600">
              {submittedAttempts.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Average Score
            </p>

            <p className="mt-1 text-2xl font-bold text-emerald-600">
              {averageScore !== null
                ? `${formatScore(averageScore)} / ${totalPoints}`
                : "—"}
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
                  Manage questions, answer options, correct answers,
                  points and question order.
                </p>
              </div>

              <span className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                {test.questions.length}{" "}
                {test.questions.length === 1
                  ? "Question"
                  : "Questions"}
              </span>

            </div>

          </div>

          {test.questions.length === 0 ? (
            <div className="p-10 text-center">

              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-2xl">
                ?
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                No questions yet
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Add your first question using the form below.
              </p>

            </div>
          ) : (
            <div className="divide-y divide-slate-100">

              {test.questions.map(
                (question, questionIndex) => (
                  <div
                    key={question.id}
                    className="p-6"
                  >

                    {/* QUESTION HEADER */}

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                      <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-2">

                          <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white">
                            Question {questionIndex + 1}
                          </span>

                          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                            {question.points}{" "}
                            {question.points === 1
                              ? "point"
                              : "points"}
                          </span>

                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                            {question.type ===
                            "MULTIPLE_CHOICE"
                              ? "Multiple Choice"
                              : "True / False"}
                          </span>

                        </div>

                        <h3 className="mt-4 text-base font-bold leading-7 text-slate-900">
                          {question.question}
                        </h3>

                      </div>

                      <span className="shrink-0 text-xs font-medium text-slate-400">
                        Order: {question.displayOrder}
                      </span>

                    </div>

                    {/* CURRENT ANSWERS */}

                    <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">

                      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Answer Options
                      </p>

                      {question.options.length === 0 ? (
                        <p className="text-sm text-amber-700">
                          No answer options have been added.
                        </p>
                      ) : (
                        <div className="space-y-2">

                          {question.options.map(
                            (
                              option,
                              optionIndex,
                            ) => (
                              <div
                                key={option.id}
                                className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm ${
                                  option.isCorrect
                                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                                    : "border-slate-200 bg-white text-slate-700"
                                }`}
                              >

                                <span className="font-bold">
                                  {String.fromCharCode(
                                    65 + optionIndex,
                                  )}
                                  .
                                </span>

                                <span className="flex-1">
                                  {option.optionText}
                                </span>

                                {option.isCorrect && (
                                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold uppercase text-emerald-700">
                                    Correct
                                  </span>
                                )}

                              </div>
                            ),
                          )}

                        </div>
                      )}

                    </div>

                    {/* EDIT QUESTION */}

                    <details className="mt-5 rounded-xl border border-slate-200">

                      <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                        Edit Question
                      </summary>

                      <div className="border-t border-slate-200 p-4">

                        <form
                          action={updateQuestion}
                          className="space-y-5"
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

                          {/* QUESTION TEXT */}

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
                              rows={4}
                              defaultValue={question.question}
                              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                            />
                          </div>

                          {/* TYPE / POINTS / ORDER */}

                          <div className="grid gap-4 sm:grid-cols-3">

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
                                required
                                defaultValue={question.type}
                                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
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
                                className="w-full rounded-xl border border-slate-300 px-3 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                              />
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
                                required
                                defaultValue={
                                  question.displayOrder
                                }
                                className="w-full rounded-xl border border-slate-300 px-3 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                              />
                            </div>

                          </div>

                          {/* MULTIPLE CHOICE */}

                          {question.type ===
                            "MULTIPLE_CHOICE" && (
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                              <div className="mb-4">
                                <h4 className="font-semibold text-slate-900">
                                  Answer Options
                                </h4>

                                <p className="mt-1 text-xs text-slate-500">
                                  Enter the options and mark the
                                  correct answer.
                                </p>
                              </div>

                              <div className="space-y-3">

                                {Array.from({
                                  length: Math.max(
                                    question.options.length,
                                    4,
                                  ),
                                }).map(
                                  (_, optionIndex) => {

                                    const option =
                                      question.options[
                                        optionIndex
                                      ];

                                    return (
                                      <div
                                        key={
                                          option?.id ??
                                          `new-${optionIndex}`
                                        }
                                        className="grid gap-3 sm:grid-cols-[1fr_auto]"
                                      >

                                        <div className="flex items-center gap-3">

                                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-sm font-bold text-slate-700 shadow-sm">
                                            {String.fromCharCode(
                                              65 +
                                                optionIndex,
                                            )}
                                          </span>

                                          <input
                                            name={`optionText_${optionIndex}`}
                                            type="text"
                                            defaultValue={
                                              option?.optionText ??
                                              ""
                                            }
                                            placeholder={`Option ${String.fromCharCode(
                                              65 +
                                                optionIndex,
                                            )}`}
                                            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-900"
                                          />

                                        </div>

                                        <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700">

                                          <input
                                            type="radio"
                                            name="correctOption"
                                            value={optionIndex}
                                            defaultChecked={
                                              option?.isCorrect ??
                                              false
                                            }
                                          />

                                          Correct

                                        </label>

                                      </div>
                                    );
                                  },
                                )}

                              </div>

                            </div>
                          )}

                          {/* TRUE / FALSE */}

                          {question.type ===
                            "TRUE_FALSE" && (
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

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
                                    (option) =>
                                      option.isCorrect,
                                  )?.optionText.toUpperCase() ??
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
                            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                          >
                            Save Question
                          </button>

                        </form>

                        {/* DELETE QUESTION */}

                        <form
                          action={deleteQuestion}
                          className="mt-3"
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

                    </details>

                  </div>
                ),
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
              Create a new question for this assessment.
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
                  required
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
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                />

              </div>

              <div>

                <label
                  htmlFor="new-displayOrder"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Display Order
                </label>

                <input
                  id="new-displayOrder"
                  name="displayOrder"
                  type="number"
                  min="0"
                  defaultValue={test.questions.length}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                />

              </div>

            </div>

            {/* MULTIPLE CHOICE OPTIONS */}

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

              <h3 className="font-semibold text-slate-900">
                Multiple Choice Options
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Enter four answer options and select the correct one.
              </p>

              <div className="mt-4 space-y-3">

                {[0, 1, 2, 3].map(
                  (optionIndex) => (
                    <div
                      key={optionIndex}
                      className="grid gap-3 sm:grid-cols-[1fr_auto]"
                    >

                      <div className="flex items-center gap-3">

                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-sm font-bold text-slate-700 shadow-sm">
                          {String.fromCharCode(
                            65 + optionIndex,
                          )}
                        </span>

                        <input
                          name={`optionText_${optionIndex}`}
                          type="text"
                          placeholder={`Option ${String.fromCharCode(
                            65 + optionIndex,
                          )}`}
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-900"
                        />

                      </div>

                      <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700">

                        <input
                          type="radio"
                          name="correctOption"
                          value={optionIndex}
                          defaultChecked={
                            optionIndex === 0
                          }
                        />

                        Correct

                      </label>

                    </div>
                  ),
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

        {/* =====================================================
            STUDENT ATTEMPTS / RESULTS
        ====================================================== */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 p-6">

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <h2 className="text-lg font-bold text-slate-900">
                  Student Assessments
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Review student attempts, submitted answers,
                  correct answers and scores.
                </p>

              </div>

              <span className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                {test.attempts.length}{" "}
                {test.attempts.length === 1
                  ? "Attempt"
                  : "Attempts"}
              </span>

            </div>

          </div>

          {test.attempts.length === 0 ? (
            <div className="p-10 text-center">

              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-2xl">
                ✓
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                No student attempts yet
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Student submissions will appear here once students
                take this assessment.
              </p>

            </div>
          ) : (
            <div className="divide-y divide-slate-100">

              {test.attempts.map(
                (attempt, attemptIndex) => {

                  const percentage = getPercentage(
                    attempt.score,
                    attempt.totalPoints,
                  );

                  const studentName =
                    `${attempt.student.firstName ?? ""} ${attempt.student.lastName ?? ""}`.trim() ||
                    "Student";

                  return (
                    <details
                      key={attempt.id}
                      className="group"
                    >

                      {/* =================================================
                          ATTEMPT SUMMARY
                      ================================================== */}

                      <summary className="cursor-pointer list-none p-6 transition hover:bg-slate-50">

                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                          <div className="min-w-0">

                            <div className="flex flex-wrap items-center gap-2">

                              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                Attempt #{attemptIndex + 1}
                              </span>

                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                  attempt.status ===
                                  "GRADED"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : attempt.status ===
                                      "SUBMITTED"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-amber-100 text-amber-700"
                                }`}
                              >
                                {attempt.status}
                              </span>

                            </div>

                            <h3 className="mt-3 font-bold text-slate-900">
                              {studentName}
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                              {attempt.student.email}
                            </p>

                          </div>

                          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-107.5">

                            {/* SCORE */}

                            <div className="rounded-xl bg-slate-50 p-3">
                              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                Score
                              </p>

                              <p className="mt-1 font-bold text-slate-900">
                                {formatScore(
                                  attempt.score,
                                )}
                                {attempt.totalPoints
                                  ? ` / ${attempt.totalPoints}`
                                  : ""}
                              </p>
                            </div>

                            {/* PERCENTAGE */}

                            <div className="rounded-xl bg-slate-50 p-3">
                              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                Percentage
                              </p>

                              <p className="mt-1 font-bold text-slate-900">
                                {percentage !== null
                                  ? `${percentage.toFixed(
                                      1,
                                    )}%`
                                  : "—"}
                              </p>
                            </div>

                            {/* STARTED */}

                            <div className="rounded-xl bg-slate-50 p-3">
                              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                Started
                              </p>

                              <p className="mt-1 text-xs font-semibold text-slate-700">
                                {formatDate(
                                  attempt.startedAt,
                                )}
                              </p>
                            </div>

                            {/* SUBMITTED */}

                            <div className="rounded-xl bg-slate-50 p-3">
                              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                Submitted
                              </p>

                              <p className="mt-1 text-xs font-semibold text-slate-700">
                                {formatDate(
                                  attempt.submittedAt,
                                )}
                              </p>
                            </div>

                          </div>

                        </div>

                      </summary>

                      {/* =================================================
                          ATTEMPT DETAILS
                      ================================================== */}

                      <div className="border-t border-slate-200 bg-slate-50 p-6">

                        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                          <div>

                            <h4 className="font-bold text-slate-900">
                              Submitted Answers
                            </h4>

                            <p className="mt-1 text-xs text-slate-500">
                              Review what the student answered,
                              the correct answer and points awarded.
                            </p>

                          </div>

                          <div className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                            {attempt.answers.length}{" "}
                            {attempt.answers.length === 1
                              ? "Answer"
                              : "Answers"}
                          </div>

                        </div>

                        {attempt.answers.length === 0 ? (
                          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                            No answers were recorded for this attempt.
                          </div>
                        ) : (
                          <div className="space-y-4">

                            {attempt.answers.map(
                              (
                                answer,
                                answerIndex,
                              ) => {

                                /*
                                 * StudentAnswer does not have a
                                 * selectedOption relation.
                                 *
                                 * We therefore find the selected
                                 * option by matching selectedOptionId
                                 * against the question's options.
                                 */

                                const selectedOption =
                                  answer.question.options.find(
                                    (option) =>
                                      option.id ===
                                      answer.selectedOptionId,
                                  );

                                const correctOption =
                                  answer.question.options.find(
                                    (option) =>
                                      option.isCorrect,
                                  );

                                return (
                                  <div
                                    key={answer.id}
                                    className="rounded-2xl border border-slate-200 bg-white p-5"
                                  >

                                    {/* QUESTION */}

                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                                      <div className="min-w-0">

                                        <div className="flex flex-wrap items-center gap-2">

                                          <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                            Question{" "}
                                            {answerIndex + 1}
                                          </span>

                                          {answer.isCorrect !==
                                            null &&
                                            answer.isCorrect !==
                                              undefined && (
                                              <span
                                                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                  answer.isCorrect
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}
                                              >
                                                {answer.isCorrect
                                                  ? "Correct"
                                                  : "Incorrect"}
                                              </span>
                                            )}

                                        </div>

                                        <p className="mt-2 font-semibold leading-6 text-slate-900">
                                          {
                                            answer
                                              .question
                                              .question
                                          }
                                        </p>

                                      </div>

                                      {/* POINTS */}

                                      <div className="shrink-0 rounded-xl bg-slate-50 px-4 py-3 text-right">

                                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                          Points
                                        </p>

                                        <p className="mt-1 font-bold text-slate-900">
                                          {answer.pointsAwarded ??
                                            0}{" "}
                                          /{" "}
                                          {
                                            answer
                                              .question
                                              .points
                                          }
                                        </p>

                                      </div>

                                    </div>

                                    {/* STUDENT ANSWER */}

                                    <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4">

                                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        Student Answer
                                      </p>

                                      <p className="mt-2 text-sm leading-6 text-slate-800">

                                        {selectedOption
                                          ?.optionText ??
                                          answer.answerText ??
                                          "No answer provided"}

                                      </p>

                                    </div>

                                    {/* CORRECT ANSWER */}

                                    <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4">

                                      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                                        Correct Answer
                                      </p>

                                      <p className="mt-2 text-sm font-semibold leading-6 text-emerald-800">

                                        {correctOption
                                          ?.optionText ??
                                          "Correct answer not available"}

                                      </p>

                                    </div>

                                    {/* OPTION REVIEW */}

                                    {answer.question.options.length >
                                      0 && (
                                      <div className="mt-4">

                                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                          Answer Options
                                        </p>

                                        <div className="space-y-2">

                                          {answer.question.options.map(
                                            (
                                              option,
                                              optionIndex,
                                            ) => {

                                              const isSelected =
                                                option.id ===
                                                answer.selectedOptionId;

                                              return (
                                                <div
                                                  key={
                                                    option.id
                                                  }
                                                  className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm ${
                                                    option.isCorrect
                                                      ? "border-emerald-200 bg-emerald-50"
                                                      : isSelected
                                                      ? "border-blue-200 bg-blue-50"
                                                      : "border-slate-200 bg-white"
                                                  }`}
                                                >

                                                  <span className="font-bold text-slate-600">
                                                    {String.fromCharCode(
                                                      65 +
                                                        optionIndex,
                                                    )}
                                                    .
                                                  </span>

                                                  <span className="flex-1 text-slate-800">
                                                    {
                                                      option.optionText
                                                    }
                                                  </span>

                                                  {isSelected && (
                                                    <span className="rounded-full bg-blue-100 px-2 py-1 text-[10px] font-bold uppercase text-blue-700">
                                                      Student
                                                    </span>
                                                  )}

                                                  {option.isCorrect && (
                                                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold uppercase text-emerald-700">
                                                      Correct
                                                    </span>
                                                  )}

                                                </div>
                                              );
                                            },
                                          )}

                                        </div>

                                      </div>
                                    )}

                                  </div>
                                );
                              },
                            )}

                          </div>
                        )}

                      </div>

                    </details>
                  );
                },
              )}

            </div>
          )}

        </section>

      </div>
    </main>
  );
}