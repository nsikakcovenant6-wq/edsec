import Link from "next/link";
import { redirect } from "next/navigation";

import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

export default async function StudentAttendancePage() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");
  if (user.role !== "STUDENT") redirect("/admin");

  const attendance = await prisma.attendance.findMany({
    where: {
      studentId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      liveClass: {
        include: {
          course: true,
        },
      },
    },
  });

  const present = attendance.filter(
    (item) =>
      item.status === "PRESENT" ||
      item.status === "LATE"
  ).length;

  const percentage =
    attendance.length > 0
      ? Math.round((present / attendance.length) * 100)
      : 0;

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/student/dashboard" className="text-sm font-semibold text-blue-600">
          ← Dashboard
        </Link>

        <h1 className="mt-6 text-3xl font-bold">Attendance</h1>

        <div className="mt-6 rounded-3xl bg-white p-7">
          <p className="text-sm text-slate-500">Attendance Rate</p>
          <p className="mt-2 text-4xl font-bold text-blue-600">
            {percentage}%
          </p>
        </div>

        <div className="mt-6 space-y-3">
          {attendance.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="flex justify-between gap-4">
                <div>
                  <h2 className="font-bold">
                    {item.liveClass.title}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {item.liveClass.course.title}
                  </p>
                </div>

                <span className="font-semibold text-blue-600">
                  {item.status}
                </span>
              </div>
            </div>
          ))}

          {attendance.length === 0 && (
            <div className="rounded-3xl bg-white p-10 text-center text-slate-500">
              No attendance records yet.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}