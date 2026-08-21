/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export default async function StudentCoursesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "STUDENT") {
    redirect("/admin");
  }

  const enrollments = await prisma.enrollment.findMany({
    where: {
      studentId: user.id,
    },
    include: {
      course: {
        include: {
          modules: {
            where: {
              isPublished: true,
            },
            orderBy: {
              displayOrder: "asc",
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const activeCourses = enrollments.filter(
    (enrollment) =>
      enrollment.status === "ACTIVE" ||
      enrollment.status === "COMPLETED"
  );

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <Link
                href="/student/dashboard"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                ← Student Dashboard
              </Link>

              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                My Courses
              </h1>

              <p className="mt-2 text-slate-600">
                Continue learning and track your progress.
              </p>
            </div>

            <Link
              href="/courses"
              className="inline-flex w-fit rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Explore Courses
            </Link>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        {activeCourses.length === 0 ? (
          <EmptyCourses />
        ) : (
          <>
            {/* SUMMARY */}
            <div className="mb-8 grid gap-4 sm:grid-cols-3">
              <SummaryCard
                label="Enrolled Courses"
                value={activeCourses.length.toString()}
              />

              <SummaryCard
                label="Completed"
                value={activeCourses
                  .filter(
                    (enrollment) => enrollment.status === "COMPLETED"
                  )
                  .length.toString()}
              />

              <SummaryCard
                label="Average Progress"
                value={`${Math.round(
                  activeCourses.reduce(
                    (total, enrollment) => total + enrollment.progress,
                    0
                  ) / activeCourses.length
                )}%`}
              />
            </div>

            {/* COURSE GRID */}
            <div className="grid gap-6 lg:grid-cols-2">
              {activeCourses.map((enrollment) => (
                <CourseCard
                  key={enrollment.id}
                  enrollment={enrollment}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

function CourseCard({
  enrollment,
}: {
  enrollment: {
    id: string;
    status: "ACTIVE" | "COMPLETED" | "SUSPENDED" | "DROPPED";
    progress: number;
    course: {
      id: string;
      title: string;
      slug: string;
      shortDescription: string;
      description: string | null;
      imageUrl: string | null;
      duration: string | null;
      learningFormat: string | null;
      modules: {
        id: string;
        title: string;
        description: string | null;
      }[];
    };
  };
}) {
  const progress = Math.min(Math.max(enrollment.progress, 0), 100);

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* IMAGE */}
      <div className="relative h-52 overflow-hidden bg-slate-950">
        {enrollment.course.imageUrl ? (
          <img
            src={enrollment.course.imageUrl}
            alt={enrollment.course.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-linear-to-br from-slate-950 to-blue-950">
            <span className="text-5xl font-black text-white/10">
              EDSEC
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 to-transparent" />

        <div className="absolute bottom-4 left-5">
          <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-slate-900">
            {enrollment.status === "COMPLETED"
              ? "Completed"
              : "In Progress"}
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-6">
        <h2 className="text-2xl font-bold text-slate-950">
          {enrollment.course.title}
        </h2>

        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
          {enrollment.course.shortDescription}
        </p>

        {/* COURSE INFO */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <InfoItem
            label="Duration"
            value={enrollment.course.duration || "Not specified"}
          />

          <InfoItem
            label="Modules"
            value={enrollment.course.modules.length.toString()}
          />
        </div>

        {/* PROGRESS */}
        <div className="mt-7">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-700">
              Learning Progress
            </span>

            <span className="font-bold text-blue-600">
              {progress}%
            </span>
          </div>

          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-600 transition-all"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        {/* ACTION */}
        <Link
          href={`/student/courses/${enrollment.course.slug}`}
          className="mt-7 flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-700"
        >
          {progress === 100 ? "Review Course" : "Continue Learning"}
        </Link>
      </div>
    </article>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <p className="text-sm text-slate-500">{label}</p>

      <p className="mt-2 text-3xl font-bold text-slate-950">
        {value}
      </p>
    </div>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}

function EmptyCourses() {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-2xl text-blue-600">
        →
      </div>

      <h2 className="mt-6 text-2xl font-bold text-slate-950">
        No courses yet
      </h2>

      <p className="mx-auto mt-3 max-w-md leading-7 text-slate-600">
        You haven&apos;t been enrolled in an EDSEC course yet. Explore our
        available programs and apply for a course.
      </p>

      <Link
        href="/courses"
        className="mt-7 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
      >
        Explore Courses
      </Link>
    </div>
  );
}