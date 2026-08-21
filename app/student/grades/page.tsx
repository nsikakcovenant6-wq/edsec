import Link from "next/link";
import { redirect } from "next/navigation";

import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

export default async function StudentGradesPage() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");
  if (user.role !== "STUDENT") redirect("/admin");

  const grades = await prisma.grade.findMany({
    where: {
      studentId: user.id,
    },
    orderBy: {
      gradedAt: "desc",
    },
    include: {
      assessment: {
        include: {
          course: true,
        },
      },
    },
  });

  const average =
    grades.length > 0
      ? Math.round(
          grades.reduce(
            (sum, grade) =>
              sum + (grade.score / grade.maxScore) * 100,
            0
          ) / grades.length
        )
      : 0;

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/student/dashboard" className="text-sm font-semibold text-blue-600">
          ← Dashboard
        </Link>

        <h1 className="mt-6 text-3xl font-bold">Grades & Results</h1>

        <div className="mt-6 rounded-3xl bg-slate-950 p-7 text-white">
          <p className="text-sm text-slate-400">Overall Average</p>
          <p className="mt-2 text-4xl font-bold">{average}%</p>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white">
          {grades.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              No grades available yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {grades.map((grade) => (
                <div
                  key={grade.id}
                  className="flex flex-col justify-between gap-3 p-6 sm:flex-row"
                >
                  <div>
                    <h2 className="font-bold">{grade.assessment.title}</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {grade.assessment.course.title}
                    </p>
                    {grade.feedback && (
                      <p className="mt-2 text-sm text-slate-500">
                        {grade.feedback}
                      </p>
                    )}
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-2xl font-bold text-blue-600">
                      {grade.score}/{grade.maxScore}
                    </p>
                    <p className="text-sm font-semibold text-slate-500">
                      {grade.grade || "—"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}