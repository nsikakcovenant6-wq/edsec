import Link from "next/link";
import { redirect } from "next/navigation";

import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

export default async function StudentLiveClassesPage() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");
  if (user.role !== "STUDENT") redirect("/admin");

  const classes = await prisma.liveClass.findMany({
    where: {
      isPublished: true,
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
      scheduledAt: "asc",
    },
    include: {
      course: true,
    },
  });

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/student/dashboard" className="text-sm font-semibold text-blue-600">
          ← Dashboard
        </Link>

        <h1 className="mt-6 text-3xl font-bold">Live Classes</h1>
        <p className="mt-2 text-slate-500">
          Join your upcoming and live EDSEC classes.
        </p>

        <div className="mt-8 space-y-4">
          {classes.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
              No live classes scheduled.
            </div>
          ) : (
            classes.map((liveClass) => {
              const isLive = liveClass.status === "LIVE";

              return (
                <div
                  key={liveClass.id}
                  className="rounded-3xl border border-slate-200 bg-white p-6"
                >
                  <div className="flex flex-col justify-between gap-5 sm:flex-row">
                    <div>
                      <span className="text-sm font-semibold text-blue-600">
                        {liveClass.course.title}
                      </span>

                      <h2 className="mt-2 text-xl font-bold">
                        {liveClass.title}
                      </h2>

                      <p className="mt-2 text-sm text-slate-500">
                        {liveClass.description || "EDSEC live learning session"}
                      </p>

                      <p className="mt-4 text-sm font-semibold text-slate-700">
                        {liveClass.scheduledAt.toLocaleString()}
                      </p>
                    </div>

                    {isLive && (
                      <a
                        href={liveClass.meetingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="h-fit rounded-xl bg-red-600 px-5 py-3 text-center font-semibold text-white"
                      >
                        🔴 Join Live Class
                      </a>
                    )}
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