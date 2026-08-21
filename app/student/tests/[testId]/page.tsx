import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

type TestPageProps = {
  params: Promise<{
    testId: string;
  }>;
};

export default async function TestPage({
  params,
}: TestPageProps) {
  const { testId } = await params;

  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "STUDENT") {
    redirect("/admin");
  }

  const test = await prisma.test.findUnique({
    where: {
      id: testId,
    },
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
  });

  if (!test || test.status !== "PUBLISHED") {
    notFound();
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      studentId_courseId: {
        studentId: user.id,
        courseId: test.courseId,
      },
    },
  });

  if (!enrollment) {
    redirect(`/student/courses/${test.course.slug}`);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-5 py-5 lg:px-8">
          <Link
            href={`/student/courses/${test.course.slug}`}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            ← Back to {test.course.title}
          </Link>
        </div>
      </header>

      {/* TEST HEADER */}
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-5xl px-5 py-12 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-400">
            Course Assessment
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            {test.title}
          </h1>

          {test.description && (
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
              {test.description}
            </p>
          )}

          <div className="mt-7 flex flex-wrap gap-3">
            <span className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
              {test.questions.length} Questions
            </span>

            {test.duration && (
              <span className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                {test.duration} Minutes
              </span>
            )}

            <span className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
              {test.questions.reduce(
                (total, question) => total + question.points,
                0
              )}{" "}
              Points
            </span>
          </div>
        </div>
      </section>

      {/* TEST FORM */}
      <section className="mx-auto max-w-5xl px-5 py-10 lg:px-8">
        {test.questions.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <h2 className="text-xl font-bold text-slate-950">
              This test has no questions yet
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Your instructor has not added questions to this assessment.
            </p>

            <Link
              href={`/student/courses/${test.course.slug}`}
              className="mt-6 inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Back to Course
            </Link>
          </div>
        ) : (
          <form
            action={`/api/student/tests/${test.id}/submit`}
            method="POST"
            className="space-y-6"
          >
            {test.questions.map((question, index) => (
              <div
                key={question.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
              >
                <div className="flex gap-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 font-bold text-blue-600">
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                        Question {index + 1}
                      </p>

                      <span className="text-xs font-semibold text-slate-400">
                        {question.points}{" "}
                        {question.points === 1 ? "point" : "points"}
                      </span>
                    </div>

                    <h2 className="mt-2 text-lg font-bold leading-7 text-slate-950">
                      {question.question}
                    </h2>

                    <div className="mt-5 space-y-3">
                      {question.options.map((option) => (
                        <label
                          key={option.id}
                          className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50"
                        >
                          <input
                            type="radio"
                            name={`question_${question.id}`}
                            value={option.id}
                            required
                            className="mt-1 h-4 w-4 accent-blue-600"
                          />

                          <span className="text-sm leading-6 text-slate-700">
                            {option.optionText}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="rounded-3xl bg-slate-950 p-6 text-white sm:p-8">
              <h2 className="text-xl font-bold">
                Ready to submit?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Make sure you have answered every question before submitting.
                Your answers will be graded automatically.
              </p>

              <button
                type="submit"
                className="mt-6 w-full rounded-xl bg-blue-600 px-6 py-4 font-bold text-white transition hover:bg-blue-700"
              >
                Submit Test
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}