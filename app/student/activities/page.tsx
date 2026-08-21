import Link from "next/link";

import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";

function formatActivityType(type: string): string {
  return type
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1),
    )
    .join(" ");
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getActivityIcon(type: string): string {
  switch (type) {
    case "LESSON_COMPLETED":
      return "✓";

    case "TEST_COMPLETED":
      return "✎";

    case "PROJECT_SUBMITTED":
      return "◆";

    case "LIVE_CLASS_ATTENDED":
      return "●";

    case "ACHIEVEMENT_EARNED":
      return "★";

    case "PAYMENT_MADE":
      return "₦";

    case "COURSE_ENROLLED":
      return "+";

    case "LOGIN":
      return "→";

    default:
      return "•";
  }
}

export default async function StudentActivitiesPage() {
  const student = await requireRole("STUDENT");

  if (!student) {
    throw new Error(
      "Student authentication is required.",
    );
  }

  const activities =
    await prisma.studentActivity.findMany({
      where: {
        studentId: student.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
      include: {
        enrollment: {
          select: {
            course: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    });

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <Link
            href="/student/dashboard"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            ← Dashboard
          </Link>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
            My Activities
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Keep track of your learning progress,
            achievements, submissions and other
            activities.
          </p>
        </div>

        {activities.length === 0 ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
              •
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-950">
              No activities yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              Your learning activities will appear
              here as you use the EDSEC student
              platform.
            </p>

            <Link
              href="/student/dashboard"
              className="mt-6 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Go to Dashboard
            </Link>
          </section>
        ) : (
          <section className="relative">
            <div className="absolute bottom-0 left-6 top-0 w-px bg-slate-200" />

            <div className="space-y-5">
              {activities.map((activity) => (
                <article
                  key={activity.id}
                  className="relative pl-14"
                >
                  <div className="absolute left-0 top-1 flex h-12 w-12 items-center justify-center rounded-full border-4 border-slate-50 bg-white text-lg font-bold text-blue-600 shadow-sm">
                    {getActivityIcon(
                      activity.type,
                    )}
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                          {formatActivityType(
                            activity.type,
                          )}
                        </span>

                        <h2 className="mt-2 font-bold text-slate-950">
                          {activity.title}
                        </h2>
                      </div>

                      <time className="shrink-0 text-xs text-slate-400">
                        {formatDate(
                          activity.createdAt,
                        )}
                      </time>
                    </div>

                    {activity.description && (
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {activity.description}
                      </p>
                    )}

                    {activity.enrollment
                      ?.course.title && (
                      <div className="mt-4 border-t border-slate-100 pt-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Course
                        </p>

                        <p className="mt-1 text-sm font-medium text-slate-700">
                          {
                            activity.enrollment
                              .course.title
                          }
                        </p>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}