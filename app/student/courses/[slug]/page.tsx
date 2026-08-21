import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function StudentCourseDetailsPage({
  params,
}: Props) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "STUDENT") {
    redirect("/admin");
  }

  const { slug } = await params;

  const enrollment = await prisma.enrollment.findFirst({
    where: {
      studentId: user.id,
      course: {
        slug,
      },
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
          tests: {
            where: {
              status: "PUBLISHED",
            },
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      },
    },
  });

  if (!enrollment) {
    notFound();
  }

  const course = enrollment.course;

  const progress = Math.min(Math.max(enrollment.progress, 0), 100);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-5 lg:px-8">
          <Link
            href="/student/courses"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            ← Back to My Courses
          </Link>
        </div>
      </header>

      {/* COURSE HERO */}
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-center">
            <div>
              <span className="inline-flex rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-400">
                My Course
              </span>

              <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
                {course.title}
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                {course.shortDescription}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                {course.duration && (
                  <span className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                    {course.duration}
                  </span>
                )}

                {course.learningFormat && (
                  <span className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                    {course.learningFormat}
                  </span>
                )}

                <span className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                  {course.modules.length} Modules
                </span>
              </div>
            </div>

            {/* PROGRESS CARD */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur">
              <p className="text-sm font-semibold text-slate-400">
                Your Progress
              </p>

              <div className="mt-4 flex items-end justify-between">
                <span className="text-5xl font-bold">
                  {progress}%
                </span>

                <span className="pb-1 text-sm text-slate-400">
                  completed
                </span>
              </div>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-400">
                Continue through the course modules to build your skills and
                complete your training.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* MAIN */}
          <div>
            {/* ABOUT */}
            <section className="rounded-3xl border border-slate-200 bg-white p-7">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
                Course Overview
              </p>

              <h2 className="mt-3 text-2xl font-bold text-slate-950">
                About this course
              </h2>

              <p className="mt-4 whitespace-pre-line leading-7 text-slate-600">
                {course.description ||
                  course.shortDescription}
              </p>
            </section>

            {/* MODULES */}
            <section className="mt-8">
              <div className="mb-5">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
                  Curriculum
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-950">
                  Course Modules
                </h2>
              </div>

              {course.modules.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
                  <h3 className="text-lg font-bold text-slate-950">
                    Course content is being prepared
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Your instructor has not published any modules for this
                    course yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {course.modules.map((module, index) => (
                    <div
                      key={module.id}
                      className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:shadow-sm"
                    >
                      <div className="flex gap-4">
                        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 font-bold text-blue-600">
                          {index + 1}
                        </div>

                        <div className="min-w-0">
                          <h3 className="font-bold text-slate-950">
                            {module.title}
                          </h3>

                          {module.description && (
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                              {module.description}
                            </p>
                          )}

                          <button
                            type="button"
                            className="mt-4 text-sm font-semibold text-blue-600"
                          >
                            Start Module →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-5">
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
                Course Details
              </p>

              <div className="mt-5 space-y-4">
                <Detail
                  label="Duration"
                  value={course.duration || "Not specified"}
                />

                <Detail
                  label="Learning format"
                  value={course.learningFormat || "Not specified"}
                />

                <Detail
                  label="Modules"
                  value={course.modules.length.toString()}
                />

                <Detail
                  label="Published tests"
                  value={course.tests.length.toString()}
                />
              </div>
            </div>

            {/* TESTS */}
            <div className="rounded-3xl bg-slate-950 p-6 text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-400">
                Assessments
              </p>

              <h2 className="mt-3 text-xl font-bold">
                Course Tests
              </h2>

              {course.tests.length === 0 ? (
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  No assessments have been published for this course yet.
                </p>
              ) : (
                <div className="mt-5 space-y-3">
                  {course.tests.map((test) => (
                    <div
                      key={test.id}
                      className="rounded-xl border border-white/10 bg-white/5 p-4"
                    >
                      <p className="font-semibold">
                        {test.title}
                      </p>

                      {test.description && (
                        <p className="mt-1 text-xs leading-5 text-slate-400">
                          {test.description}
                        </p>
                      )}

                      <Link
                        href={`/student/tests/${test.id}`}
                        className="mt-3 inline-block text-sm font-semibold text-blue-400"
                      >
                        Take Test →
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SYLLABUS */}
            {course.syllabus && (
              <div className="rounded-3xl border border-slate-200 bg-white p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
                  Syllabus
                </p>

                <p className="mt-4 whitespace-pre-line text-sm leading-6 text-slate-600">
                  {course.syllabus}
                </p>
              </div>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4 last:border-0 last:pb-0">
      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="text-right text-sm font-semibold text-slate-900">
        {value}
      </span>
    </div>
  );
}