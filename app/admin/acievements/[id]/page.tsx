import Link from "next/link";
import { notFound } from "next/navigation";

import {
  awardAchievement,
  deleteAchievement,
  removeAchievement,
  updateAchievement,
} from "../actions";

import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AchievementDetailsPage({
  params,
}: PageProps) {
  await requireRole("ADMIN");

  const { id } = await params;

  const [achievement, students] = await Promise.all([
    prisma.achievement.findUnique({
      where: {
        id,
      },
      include: {
        students: {
          orderBy: {
            earnedAt: "desc",
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
            enrollment: {
              select: {
                id: true,
                course: {
                  select: {
                    title: true,
                  },
                },
              },
            },
          },
        },
      },
    }),

    prisma.user.findMany({
      where: {
        role: "STUDENT",
        status: "ACTIVE",
      },
      orderBy: [
        {
          firstName: "asc",
        },
        {
          lastName: "asc",
        },
      ],
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    }),
  ]);

  if (!achievement) {
    notFound();
  }

  const awardedStudentIds = new Set(
    achievement.students.map(
      (item) => item.studentId,
    ),
  );

  const availableStudents = students.filter(
    (student) => !awardedStudentIds.has(student.id),
  );

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/achievements"
            className="text-sm font-medium text-orange-600 hover:text-orange-700"
          >
            ← Back to achievements
          </Link>

          <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-3xl">
                {achievement.icon || "🏆"}
              </div>

              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  {achievement.name}
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  {achievement.points} points ·{" "}
                  {achievement.students.length} students
                </p>
              </div>
            </div>

            <form action={deleteAchievement}>
              <input
                type="hidden"
                name="id"
                value={achievement.id}
              />

              <button
                type="submit"
                className="rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                Delete Achievement
              </button>
            </form>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Main */}
          <div className="space-y-8">
            {/* Edit */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-bold text-slate-900">
                Achievement details
              </h2>

              <form
                action={updateAchievement}
                className="mt-6 space-y-5"
              >
                <input
                  type="hidden"
                  name="id"
                  value={achievement.id}
                />

                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    required
                    defaultValue={achievement.name}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Description
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    defaultValue={
                      achievement.description ?? ""
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="icon"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Icon
                    </label>

                    <input
                      id="icon"
                      name="icon"
                      defaultValue={
                        achievement.icon ?? ""
                      }
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="points"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Points
                    </label>

                    <input
                      id="points"
                      name="points"
                      type="number"
                      min="0"
                      required
                      defaultValue={achievement.points}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    />
                  </div>
                </div>

                <div className="flex justify-end border-t border-slate-100 pt-5">
                  <button
                    type="submit"
                    className="rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </section>

            {/* Students */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-6">
                <h2 className="text-xl font-bold text-slate-900">
                  Students who earned this
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {achievement.students.length} student
                  {achievement.students.length === 1
                    ? ""
                    : "s"} awarded
                </p>
              </div>

              {achievement.students.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <div className="text-4xl">🏆</div>

                  <p className="mt-3 font-semibold text-slate-900">
                    No students yet
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Award this achievement to a student
                    using the panel on the right.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {achievement.students.map((award) => (
                    <div
                      key={award.id}
                      className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">
                          {award.student.firstName}{" "}
                          {award.student.lastName}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {award.student.email}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                            Earned
                          </span>

                          {award.enrollment?.course
                            ?.title && (
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                              {
                                award.enrollment.course
                                  .title
                              }
                            </span>
                          )}
                        </div>
                      </div>

                      <form action={removeAchievement}>
                        <input
                          type="hidden"
                          name="studentAchievementId"
                          value={award.id}
                        />

                        <button
                          type="submit"
                          className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                        >
                          Remove
                        </button>
                      </form>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Award panel */}
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Award achievement
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Select an active student to award this
              achievement.
            </p>

            {availableStudents.length === 0 ? (
              <div className="mt-6 rounded-xl bg-slate-50 p-4 text-center">
                <p className="text-sm font-medium text-slate-700">
                  All active students already have this
                  achievement.
                </p>
              </div>
            ) : (
              <form
                action={awardAchievement}
                className="mt-6 space-y-5"
              >
                <input
                  type="hidden"
                  name="achievementId"
                  value={achievement.id}
                />

                <div>
                  <label
                    htmlFor="studentId"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Student
                  </label>

                  <select
                    id="studentId"
                    name="studentId"
                    required
                    defaultValue=""
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  >
                    <option value="" disabled>
                      Select a student
                    </option>

                    {availableStudents.map(
                      (student) => (
                        <option
                          key={student.id}
                          value={student.id}
                        >
                          {student.firstName}{" "}
                          {student.lastName} —{" "}
                          {student.email}
                        </option>
                      ),
                    )}
                  </select>
                </div>

                <div className="rounded-xl bg-orange-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-orange-700">
                    Achievement
                  </p>

                  <p className="mt-1 font-semibold text-orange-900">
                    {achievement.icon || "🏆"}{" "}
                    {achievement.name}
                  </p>

                  <p className="mt-1 text-sm text-orange-700">
                    {achievement.points} points
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-700"
                >
                  Award Achievement
                </button>
              </form>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}