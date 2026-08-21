import Link from "next/link";
import { redirect } from "next/navigation";

import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

export default async function StudentAchievementsPage() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");
  if (user.role !== "STUDENT") redirect("/admin");

  const achievements = await prisma.studentAchievement.findMany({
    where: {
      studentId: user.id,
    },
    orderBy: {
      earnedAt: "desc",
    },
    include: {
      achievement: true,
    },
  });

  const points = achievements.reduce(
    (sum, item) => sum + item.achievement.points,
    0
  );

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/student/dashboard" className="text-sm font-semibold text-blue-600">
          ← Dashboard
        </Link>

        <div className="mt-6 rounded-3xl bg-slate-950 p-8 text-white">
          <p className="text-sm text-blue-400">Learning Points</p>
          <p className="mt-2 text-5xl font-bold">{points}</p>
        </div>

        <h1 className="mt-8 text-3xl font-bold">Achievements</h1>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-slate-200 bg-white p-6"
            >
              <div className="text-3xl">{item.achievement.icon || "🏆"}</div>
              <h2 className="mt-4 font-bold">{item.achievement.name}</h2>
              <p className="mt-2 text-sm text-slate-500">
                {item.achievement.description}
              </p>
              <p className="mt-4 text-sm font-semibold text-blue-600">
                +{item.achievement.points} points
              </p>
            </div>
          ))}

          {achievements.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 sm:col-span-2 lg:col-span-3">
              Complete lessons, tests and live classes to earn achievements.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}