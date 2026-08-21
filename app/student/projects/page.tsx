import Link from "next/link";
import { redirect } from "next/navigation";

import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

export default async function StudentProjectsPage() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");
  if (user.role !== "STUDENT") redirect("/admin");

  const projects = await prisma.studentProjectRecord.findMany({
    where: {
      studentId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      project: true,
    },
  });

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/student/dashboard" className="text-sm font-semibold text-blue-600">
          ← Dashboard
        </Link>

        <h1 className="mt-6 text-3xl font-bold">My Projects</h1>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {projects.map((record) => (
            <div
              key={record.id}
              className="rounded-3xl border border-slate-200 bg-white p-6"
            >
              <span className="text-xs font-bold uppercase text-blue-600">
                {record.status}
              </span>

              <h2 className="mt-3 text-xl font-bold">
                {record.title}
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                {record.description || record.project?.description}
              </p>

              {record.score !== null && (
                <p className="mt-5 font-bold text-blue-600">
                  Score: {record.score}
                </p>
              )}

              {record.feedback && (
                <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                  {record.feedback}
                </div>
              )}
            </div>
          ))}

          {projects.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 md:col-span-2">
              Your assigned projects will appear here.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}