import Link from "next/link";

import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminAchievementsPage() {
  await requireRole("ADMIN");

  const achievements = await prisma.achievement.findMany({
    orderBy: [
      {
        points: "desc",
      },
      {
        name: "asc",
      },
    ],
    include: {
      _count: {
        select: {
          students: true,
        },
      },
    },
  });

  const totalAchievements = achievements.length;

  const totalAwards = achievements.reduce(
    (total, achievement) =>
      total + achievement._count.students,
    0,
  );

  const totalPoints = achievements.reduce(
    (total, achievement) =>
      total +
      achievement.points *
        achievement._count.students,
    0,
  );

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-orange-600">
              EDSEC Admin
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Achievements
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Create achievements, manage points, and
              recognize student accomplishments.
            </p>
          </div>

          <Link
            href="/admin/achievements/new"
            className="inline-flex items-center justify-center rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700"
          >
            + Create Achievement
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Total achievements
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {totalAchievements}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Awards given
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {totalAwards}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Points awarded
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {totalPoints}
            </p>
          </div>
        </div>

        {/* Achievement list */}
        {achievements.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-3xl">
              🏆
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              No achievements yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              Create your first achievement to start
              recognizing student progress.
            </p>

            <Link
              href="/admin/achievements/new"
              className="mt-6 inline-flex rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-700"
            >
              Create Achievement
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Achievement
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Points
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Students
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {achievements.map((achievement) => (
                    <tr
                      key={achievement.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-2xl">
                            {achievement.icon || "🏆"}
                          </div>

                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900">
                              {achievement.name}
                            </p>

                            {achievement.description && (
                              <p className="mt-1 max-w-lg truncate text-sm text-slate-500">
                                {achievement.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
                          {achievement.points} pts
                        </span>
                      </td>

                      <td className="px-6 py-5 text-sm font-medium text-slate-700">
                        {achievement._count.students}
                      </td>

                      <td className="px-6 py-5 text-right">
                        <Link
                          href={`/admin/achievements/${achievement.id}`}
                          className="inline-flex rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-orange-600"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}