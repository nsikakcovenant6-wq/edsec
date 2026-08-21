import Link from "next/link";
import { redirect } from "next/navigation";

import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

export default async function StudentTestsPage() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");
  if (user.role !== "STUDENT") redirect("/admin");

  const tests = await prisma.test.findMany({
    where: {
      status: "PUBLISHED",
      course: {
        enrollments: {
          some: {
            studentId: user.id,
            status: "ACTIVE",
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      course: true,
      questions: {
        select: {
          points: true,
        },
      },
      attempts: {
        where: {
          studentId: user.id,
        },
        orderBy: {
          startedAt: "desc",
        },
        take: 1,
      },
    },
  });

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-950 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/student/dashboard"
          className="text-sm font-semibold text-blue-600"
        >
          ← Dashboard
        </Link>

        <div className="mt-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
            Assessments
          </p>
          <h1 className="mt-2 text-3xl font-bold">
            Tests & Assessments
          </h1>
          <p className="mt-2 text-slate-500">
            Complete your available assessments and review your results.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          {tests.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <h2 className="font-bold">No assessments available</h2>
              <p className="mt-2 text-sm text-slate-500">
                Your available tests will appear here.
              </p>
            </div>
          ) : (
            tests.map((test) => {
              const attempt = test.attempts[0];
              const totalPoints = test.questions.reduce(
                (sum, question) => sum + question.points,
                0
              );

              return (
                <div
                  key={test.id}
                  className="rounded-3xl border border-slate-200 bg-white p-6"
                >
                  <div className="flex flex-col justify-between gap-5 sm:flex-row">
                    <div>
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase text-blue-700">
                        {test.course.title}
                      </span>

                      <h2 className="mt-4 text-xl font-bold">
                        {test.title}
                      </h2>

                      <p className="mt-2 text-sm text-slate-500">
                        {test.description ||
                          "Complete this assessment to measure your learning progress."}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
                        <span>{test.questions.length} questions</span>
                        <span>{totalPoints} points</span>
                        {test.duration && (
                          <span>{test.duration} minutes</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center">
                      {attempt?.status === "GRADED" ? (
                        <Link
                          href={`/student/tests/${test.id}/result`}
                          className="rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white"
                        >
                          View Result
                        </Link>
                      ) : (
                        <Link
                          href={`/student/tests/${test.id}`}
                          className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                        >
                          {attempt ? "Continue Test" : "Start Test"}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}