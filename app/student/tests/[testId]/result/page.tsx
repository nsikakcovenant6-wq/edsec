import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

type ResultPageProps = {
  params: Promise<{
    testId: string;
  }>;
  searchParams: Promise<{
    attemptId?: string;
  }>;
};

export default async function TestResultPage({
  params,
  searchParams,
}: ResultPageProps) {
  const { testId } = await params;
  const { attemptId } = await searchParams;

  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "STUDENT") {
    redirect("/admin");
  }

  if (!attemptId) {
    redirect("/student/dashboard");
  }

  const attempt = await prisma.testAttempt.findFirst({
    where: {
      id: attemptId,
      testId,
      studentId: user.id,
    },
    include: {
      test: {
        include: {
          course: true,
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
        },
      },
      answers: {
        include: {
          question: true,
        },
      },
    },
  });

  if (!attempt) {
    notFound();
  }

  const score = attempt.score ?? 0;
  const totalPoints = attempt.totalPoints ?? 0;

  const percentage =
    totalPoints > 0
      ? Math.round((score / totalPoints) * 100)
      : 0;

  const passed = percentage >= 50;

  const correctAnswers = attempt.answers.filter(
    (answer) => answer.isCorrect
  ).length;

  const totalQuestions = attempt.test.questions.length;

  const getResultMessage = () => {
    if (percentage >= 80) {
      return "Excellent work! You demonstrated a strong understanding of the course material.";
    }

    if (percentage >= 70) {
      return "Great job! You have demonstrated a very good understanding of the material.";
    }

    if (percentage >= 60) {
      return "Good work! You have a solid understanding of the course material.";
    }

    if (percentage >= 50) {
      return "You passed! Keep practicing and continue building your skills.";
    }

    return "Keep learning! Review the lessons and try again when you are ready.";
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-5 lg:px-8">
          <Link
            href={`/student/courses/${attempt.test.course.slug}`}
            className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
          >
            ← Back to Course
          </Link>
        </div>
      </header>

      {/* RESULT HERO */}
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-6xl px-5 py-14 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span
              className={`inline-flex rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider ${
                passed
                  ? "bg-green-500/10 text-green-400"
                  : "bg-red-500/10 text-red-400"
              }`}
            >
              {passed ? "Test Passed" : "Keep Learning"}
            </span>

            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
              {attempt.test.title}
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-400">
              {getResultMessage()}
            </p>
          </div>

          {/* SCORE */}
          <div className="mx-auto mt-10 max-w-xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
              Your Score
            </p>

            <div
              className={`mt-4 text-7xl font-bold ${
                passed
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {percentage}%
            </div>

            <p className="mt-3 text-slate-400">
              {score} out of {totalPoints} points
            </p>

            <div className="mt-7 h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-full rounded-full transition-all ${
                  passed
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
                style={{
                  width: `${percentage}%`,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* SUMMARY */}
      <section className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-sm text-slate-500">
              Questions
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-950">
              {totalQuestions}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-sm text-slate-500">
              Correct Answers
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {correctAnswers}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-sm text-slate-500">
              Result
            </p>

            <p
              className={`mt-2 text-3xl font-bold ${
                passed
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {passed ? "Passed" : "Not Passed"}
            </p>
          </div>
        </div>

        {/* TEST INFORMATION */}
        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 sm:p-9">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
            Assessment
          </p>

          <h2 className="mt-3 text-2xl font-bold text-slate-950">
            {attempt.test.title}
          </h2>

          {attempt.test.description && (
            <p className="mt-3 max-w-3xl leading-7 text-slate-600">
              {attempt.test.description}
            </p>
          )}

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wider text-slate-400">
                Course
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {attempt.test.course.title}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wider text-slate-400">
                Score
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {score}/{totalPoints}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wider text-slate-400">
                Percentage
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {percentage}%
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wider text-slate-400">
                Status
              </p>

              <p
                className={`mt-1 font-semibold ${
                  passed
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {passed ? "Passed" : "Not Passed"}
              </p>
            </div>
          </div>
        </section>

        {/* ANSWER REVIEW */}
        <section className="mt-8">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
              Review
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-950">
              Your Answers
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Review how you performed on each question.
            </p>
          </div>

          <div className="space-y-4">
            {attempt.test.questions.map(
              (question, index) => {
                const answer = attempt.answers.find(
                  (item) =>
                    item.questionId === question.id
                );

                const isCorrect =
                  answer?.isCorrect === true;

                const selectedOption =
                  question.options.find(
                    (option) =>
                      option.id ===
                      answer?.selectedOptionId
                  );

                return (
                  <div
                    key={question.id}
                    className={`rounded-2xl border bg-white p-6 ${
                      isCorrect
                        ? "border-green-200"
                        : "border-red-200"
                    }`}
                  >
                    <div className="flex gap-4">
                      <div
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-sm font-bold ${
                          isCorrect
                            ? "bg-green-50 text-green-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {index + 1}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <h3 className="font-semibold leading-7 text-slate-950">
                            {question.question}
                          </h3>

                          <span
                            className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                              isCorrect
                                ? "bg-green-50 text-green-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            {isCorrect
                              ? "Correct"
                              : "Incorrect"}
                          </span>
                        </div>

                        <div className="mt-4 rounded-xl bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Your answer
                          </p>

                          <p className="mt-2 text-sm font-medium text-slate-700">
                            {selectedOption?.optionText ||
                              "No answer selected"}
                          </p>
                        </div>

                        <div className="mt-4 flex items-center justify-between text-sm">
                          <span className="text-slate-500">
                            Points earned
                          </span>

                          <span className="font-bold text-slate-900">
                            {answer?.pointsAwarded ?? 0} /{" "}
                            {question.points}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </section>

        {/* ACTIONS */}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={`/student/courses/${attempt.test.course.slug}`}
            className="rounded-xl bg-blue-600 px-7 py-3.5 text-center font-semibold text-white transition hover:bg-blue-700"
          >
            Continue Course
          </Link>

          <Link
            href="/student/dashboard"
            className="rounded-xl border border-slate-200 bg-white px-7 py-3.5 text-center font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Go to Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}