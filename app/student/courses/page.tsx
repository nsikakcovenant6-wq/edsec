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

  const [
    courses,
    enrollments,
    applications,
  ] = await Promise.all([
    prisma.course.findMany({
      where: {
        status: "ACTIVE",
      },
      orderBy: {
        displayOrder: "asc",
      },
      include: {
        modules: {
          where: {
            isPublished: true,
          },
          orderBy: {
            displayOrder: "asc",
          },
          include: {
            lessons: {
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
    }),

    prisma.enrollment.findMany({
      where: {
        studentId: user.id,
      },
      include: {
        course: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    }),

    prisma.application.findMany({
      where: {
        applicantId: user.id,
      },
      include: {
        course: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  const enrollmentMap = new Map(
    enrollments.map((enrollment) => [
      enrollment.courseId,
      enrollment,
    ]),
  );

  /*
   * Keep only the newest application for each course.
   */
  const applicationMap = new Map<
    string,
    (typeof applications)[number]
  >();

  for (const application of applications) {
    if (!application.courseId) {
      continue;
    }

    if (!applicationMap.has(application.courseId)) {
      applicationMap.set(
        application.courseId,
        application,
      );
    }
  }

  const pendingApplications =
    applications.filter(
      (application) =>
        application.status === "PENDING" &&
        application.courseId &&
        application.course,
    );

  const rejectedApplications =
    applications.filter(
      (application) =>
        application.status === "REJECTED" &&
        application.courseId &&
        application.course,
    );

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 lg:px-8">
          <div>
            <Link
              href="/student/dashboard"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              ← Back to Dashboard
            </Link>

            <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
              EDSEC ICT Institute
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight">
              My Courses
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Choose a program, request enrollment,
              and start learning after approval.
            </p>
          </div>

          <Link
            href="/student/profile"
            className="hidden rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:block"
          >
            Profile
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        {/* MY ENROLLMENTS */}
        <section>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
              My Learning
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              Your enrolled courses
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Approved courses are available here.
              Pending enrollment requests are shown
              below while they wait for administrator
              approval.
            </p>
          </div>

          {enrollments.length === 0 ? (
            <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-xl font-bold text-blue-600">
                +
              </div>

              <h3 className="mt-5 text-lg font-bold">
                You are not enrolled in a course yet
              </h3>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                Browse the available programs below
                and submit an enrollment request. EDSEC
                will review your request before giving
                you course access.
              </p>

              <a
                href="#available-courses"
                className="mt-5 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Browse Courses
              </a>
            </div>
          ) : (
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {enrollments.map((enrollment) => {
                const completed =
                  enrollment.status ===
                  "COMPLETED";

                return (
                  <div
                    key={enrollment.id}
                    className="overflow-hidden rounded-3xl border border-slate-200 bg-white"
                  >
                    <div className="p-7">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                              completed
                                ? "bg-blue-50 text-blue-700"
                                : enrollment.status ===
                                    "SUSPENDED"
                                  ? "bg-red-50 text-red-700"
                                  : enrollment.status ===
                                      "DROPPED"
                                    ? "bg-slate-100 text-slate-600"
                                    : "bg-green-50 text-green-700"
                            }`}
                          >
                            {enrollment.status.replaceAll(
                              "_",
                              " ",
                            )}
                          </span>

                          <h3 className="mt-4 text-xl font-bold">
                            {
                              enrollment.course
                                .title
                            }
                          </h3>
                        </div>

                        {enrollment.status ===
                          "ACTIVE" && (
                          <span className="text-xl text-green-600">
                            ✓
                          </span>
                        )}
                      </div>

                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
                        {
                          enrollment.course
                            .shortDescription
                        }
                      </p>

                      {enrollment.status ===
                        "SUSPENDED" && (
                        <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-4">
                          <p className="font-semibold text-red-900">
                            Course access suspended
                          </p>

                          <p className="mt-1 text-sm leading-6 text-red-800">
                            Your access to this
                            course has been
                            suspended by EDSEC.
                          </p>
                        </div>
                      )}

                      {enrollment.status ===
                        "DROPPED" && (
                        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <p className="font-semibold text-slate-800">
                            Enrollment ended
                          </p>

                          <p className="mt-1 text-sm leading-6 text-slate-500">
                            This enrollment is no
                            longer active.
                          </p>
                        </div>
                      )}

                      {(enrollment.status ===
                        "ACTIVE" ||
                        completed) && (
                        <Link
                          href={`/student/courses/${enrollment.course.slug}`}
                          className="mt-5 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                        >
                          {completed
                            ? "Review Course →"
                            : "Open Course →"}
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* PENDING REQUESTS */}
        {pendingApplications.length >
          0 && (
          <section className="mt-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-600">
                Awaiting Approval
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight">
                Enrollment requests
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                These requests are currently being
                reviewed by EDSEC administrators.
              </p>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {pendingApplications.map(
                (application) => (
                  <div
                    key={application.id}
                    className="rounded-2xl border border-amber-200 bg-amber-50 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-amber-600">
                          Pending
                        </p>

                        <h3 className="mt-2 font-bold text-amber-950">
                          {
                            application.course
                              ?.title
                          }
                        </h3>
                      </div>

                      <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-amber-700">
                        PENDING
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-amber-800">
                      Your request has been received.
                      An EDSEC administrator needs to
                      approve it before you can access
                      the course.
                    </p>
                  </div>
                ),
              )}
            </div>
          </section>
        )}

        {/* REJECTED REQUESTS */}
        {rejectedApplications.length >
          0 && (
          <section className="mt-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-red-600">
                Application Updates
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight">
                Previous requests
              </h2>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {rejectedApplications.map(
                (application) => (
                  <div
                    key={application.id}
                    className="rounded-2xl border border-red-200 bg-red-50 p-5"
                  >
                    <p className="text-xs font-bold uppercase tracking-wider text-red-600">
                      Request not approved
                    </p>

                    <h3 className="mt-2 font-bold text-red-950">
                      {
                        application.course
                          ?.title
                      }
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-red-800">
                      Your previous enrollment
                      request was not approved. You
                      can submit another request from
                      the available courses below.
                    </p>

                    <a
                      href="#available-courses"
                      className="mt-4 inline-flex rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
                    >
                      View Course
                    </a>
                  </div>
                ),
              )}
            </div>
          </section>
        )}

        {/* AVAILABLE COURSES */}
        <section
          id="available-courses"
          className="mt-12"
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
              Available Programs
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              Choose your learning program
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Select a program and submit an enrollment
              request. Your course access will become
              available after an administrator approves
              your request.
            </p>
          </div>

          {courses.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100">
                📚
              </div>

              <h3 className="mt-5 font-semibold">
                No courses are currently available
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                There are currently no active EDSEC
                programs available for enrollment.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => {
                const enrollment =
                  enrollmentMap.get(course.id);

                const application =
                  applicationMap.get(course.id);

                const isActive =
                  enrollment?.status === "ACTIVE";

                const isCompleted =
                  enrollment?.status ===
                  "COMPLETED";

                const isSuspended =
                  enrollment?.status ===
                  "SUSPENDED";

                const isDropped =
                  enrollment?.status === "DROPPED";

                const isPending =
                  application?.status ===
                  "PENDING";

                const isRejected =
                  application?.status ===
                  "REJECTED";

                const totalLessons =
                  course.modules.reduce(
                    (total, module) =>
                      total +
                      module.lessons.length,
                    0,
                  );

                return (
                  <article
                    key={course.id}
                    className="group overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                  >
                    {/* IMAGE */}
                    <div className="relative h-48 overflow-hidden bg-slate-950">
                      {course.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={course.imageUrl}
                          alt={course.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-slate-950">
                          <div className="text-center">
                            <div className="text-4xl font-bold text-white">
                              EDSEC
                            </div>

                            <div className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                              ICT Institute
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-slate-950/80 to-transparent" />

                      {course.featured && (
                        <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-900 shadow-sm">
                          Featured
                        </span>
                      )}
                    </div>

                    {/* CONTENT */}
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-xl font-bold">
                          {course.title}
                        </h3>

                        <span className="shrink-0 text-xs font-semibold text-slate-400">
                          {
                            course.modules.length
                          }{" "}
                          modules
                        </span>
                      </div>

                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                        {
                          course.shortDescription
                        }
                      </p>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {course.duration && (
                          <span className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
                            {course.duration}
                          </span>
                        )}

                        {course.learningFormat && (
                          <span className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
                            {
                              course.learningFormat
                            }
                          </span>
                        )}

                        <span className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
                          {totalLessons} lessons
                        </span>
                      </div>

                      {/* ACTION */}
                      <div className="mt-6">
                        {isActive && (
                          <Link
                            href={`/student/courses/${course.slug}`}
                            className="block rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
                          >
                            Continue Learning →
                          </Link>
                        )}

                        {isCompleted && (
                          <Link
                            href={`/student/courses/${course.slug}`}
                            className="block rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 text-center font-semibold text-slate-700 transition hover:bg-slate-100"
                          >
                            Review Course →
                          </Link>
                        )}

                        {isPending && (
                          <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-3 text-center text-sm font-semibold text-amber-700">
                            Enrollment Pending
                          </div>
                        )}

                        {isSuspended && (
                          <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-center text-sm font-semibold text-red-700">
                            Enrollment Suspended
                          </div>
                        )}

                        {isDropped && (
                          <Link
                            href={`/student/courses/${course.slug}/enroll`}
                            className="block rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold text-white hover:bg-blue-700"
                          >
                            Request Enrollment Again →
                          </Link>
                        )}

                        {!enrollment &&
                          !isPending && (
                            <Link
                              href={`/student/courses/${course.slug}/enroll`}
                              className="block rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold text-white hover:bg-blue-700"
                            >
                              {isRejected
                                ? "Apply Again →"
                                : "Enroll Now →"}
                            </Link>
                          )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* HOW ENROLLMENT WORKS */}
        <section className="mt-12 overflow-hidden rounded-3xl bg-slate-950 p-7 text-white sm:p-9">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-400">
            Enrollment Process
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            How enrollment works
          </h2>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            <Step
              number="01"
              title="Choose a Course"
              text="Select the EDSEC program you want to study."
            />

            <Step
              number="02"
              title="Submit Enrollment"
              text="Send your enrollment request from your student dashboard."
            />

            <Step
              number="03"
              title="Get Approved"
              text="An EDSEC administrator reviews your request and activates your course access."
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function Step({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-sm font-bold">
        {number}
      </div>

      <h3 className="mt-5 font-bold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {text}
      </p>
    </div>
  );
}