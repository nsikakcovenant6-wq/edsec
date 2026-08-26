import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { randomUUID } from "crypto";

import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function EnrollPage({ params }: Props) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "STUDENT") {
    redirect("/admin");
  }

  const { slug } = await params;

  /*
   * ---------------------------------------------------------
   * Get course
   * ---------------------------------------------------------
   */

  const course = await prisma.course.findUnique({
    where: {
      slug,
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
  });

  if (!course) {
    notFound();
  }

  const courseId = course.id;

  /*
   * ---------------------------------------------------------
   * Get student's existing profile
   * ---------------------------------------------------------
   */

  const student = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    include: {
      studentProfile: true,
    },
  });

  if (!student) {
    redirect("/login");
  }

  /*
   * ---------------------------------------------------------
   * Check existing enrollment
   * ---------------------------------------------------------
   */

  const existingEnrollment = await prisma.enrollment.findFirst({
    where: {
      studentId: student.id,
      courseId,
    },
  });

  if (existingEnrollment) {
    redirect("/student/courses");
  }

  /*
   * ---------------------------------------------------------
   * Get latest application
   * ---------------------------------------------------------
   */

  const latestApplication = await prisma.application.findFirst({
    where: {
      applicantId: student.id,
      courseId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  /*
   * ---------------------------------------------------------
   * Don't allow another application while pending
   * ---------------------------------------------------------
   */

  if (latestApplication?.status === "PENDING") {
    redirect("/student/courses");
  }

  /*
   * ---------------------------------------------------------
   * Calculate course information
   * ---------------------------------------------------------
   */

  const lessonCount = course.modules.reduce(
    (total, module) => total + module.lessons.length,
    0,
  );

  /*
   * ---------------------------------------------------------
   * Format existing date of birth
   * ---------------------------------------------------------
   */

  const dateOfBirthValue = student.studentProfile?.dateOfBirth
    ? formatDateForInput(student.studentProfile.dateOfBirth)
    : "";

  /*
   * ---------------------------------------------------------
   * Submit enrollment application
   * ---------------------------------------------------------
   */

  async function submitEnrollment(formData: FormData) {
    "use server";

    const currentUser = await getCurrentUser();

    if (!currentUser) {
      redirect("/login");
    }

    if (currentUser.role !== "STUDENT") {
      redirect("/admin");
    }

    /*
     * -------------------------------------------------------
     * Get the course again inside the server action.
     * -------------------------------------------------------
     */

    const currentCourse = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!currentCourse) {
      redirect("/student/courses");
    }

    /*
     * -------------------------------------------------------
     * Prevent duplicate enrollment.
     * -------------------------------------------------------
     */

    const existing = await prisma.enrollment.findFirst({
      where: {
        studentId: currentUser.id,
        courseId: currentCourse.id,
      },
    });

    if (existing) {
      redirect("/student/courses");
    }

    /*
     * -------------------------------------------------------
     * Check latest application again.
     * -------------------------------------------------------
     */

    const latest = await prisma.application.findFirst({
      where: {
        applicantId: currentUser.id,
        courseId: currentCourse.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (latest?.status === "PENDING") {
      redirect("/student/courses");
    }

    /*
     * -------------------------------------------------------
     * Read form values
     * -------------------------------------------------------
     */

    const firstName = String(
      formData.get("firstName") || "",
    ).trim();

    const lastName = String(
      formData.get("lastName") || "",
    ).trim();

    const email = String(
      formData.get("email") || "",
    )
      .trim()
      .toLowerCase();

    const phone = String(
      formData.get("phone") || "",
    ).trim();

    const dateOfBirth = String(
      formData.get("dateOfBirth") || "",
    ).trim();

    const educationalLevel = String(
      formData.get("educationalLevel") || "",
    ).trim();

    /*
     * -------------------------------------------------------
     * Validate required fields
     * -------------------------------------------------------
     */

    if (!firstName || !lastName) {
      throw new Error(
        "First name and last name are required.",
      );
    }

    if (!email) {
      throw new Error("Email address is required.");
    }

    if (!phone) {
      throw new Error("Phone number is required.");
    }

    if (!dateOfBirth) {
      throw new Error("Date of birth is required.");
    }

    if (!educationalLevel) {
      throw new Error(
        "Educational level is required.",
      );
    }

    /*
     * -------------------------------------------------------
     * Validate date
     * -------------------------------------------------------
     */

    const parsedDateOfBirth = new Date(
      `${dateOfBirth}T00:00:00`,
    );

    if (Number.isNaN(parsedDateOfBirth.getTime())) {
      throw new Error(
        "Please provide a valid date of birth.",
      );
    }

    /*
     * -------------------------------------------------------
     * Make sure the email belongs to the logged-in student.
     * -------------------------------------------------------
     */

    if (
      email !== currentUser.email.toLowerCase()
    ) {
      throw new Error(
        "The email address must match your EDSEC student account.",
      );
    }

    /*
     * -------------------------------------------------------
     * Update student's basic information.
     * -------------------------------------------------------
     */

    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        firstName,
        lastName,
        phone,
      },
    });

    /*
     * -------------------------------------------------------
     * Create/update student profile
     * -------------------------------------------------------
     */

    const existingProfile =
      await prisma.studentProfile.findUnique({
        where: {
          userId: currentUser.id,
        },
      });

    if (existingProfile) {
      await prisma.studentProfile.update({
        where: {
          userId: currentUser.id,
        },
        data: {
          dateOfBirth: parsedDateOfBirth,
          educationalLevel,
        },
      });
    } else {
      /*
       * StudentProfile requires a studentNumber.
       *
       * Generate a unique EDSEC student number.
       */

      const year = new Date().getFullYear();

      const randomPart = randomUUID()
        .replace(/-/g, "")
        .slice(0, 8)
        .toUpperCase();

      const studentNumber = `EDSEC-${year}-${randomPart}`;

      await prisma.studentProfile.create({
        data: {
          userId: currentUser.id,
          studentNumber,
          dateOfBirth: parsedDateOfBirth,
          educationalLevel,
        },
      });
    }

    /*
     * -------------------------------------------------------
     * Create PENDING application
     *
     * IMPORTANT:
     * No enrollment is created here.
     *
     * The admin must approve the application first.
     * The approveAndEnroll() server action will then create
     * the actual enrollment.
     * -------------------------------------------------------
     */

    await prisma.application.create({
      data: {
        applicantId: currentUser.id,
        fullName: `${firstName} ${lastName}`.trim(),
        email,
        phone,
        dateOfBirth: parsedDateOfBirth,
        educationalLevel,
        courseId: currentCourse.id,
        status: "PENDING",
      },
    });

    /*
     * -------------------------------------------------------
     * Return student to courses page.
     * -------------------------------------------------------
     */

    redirect("/student/courses");
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5 lg:px-8">
          <Link
            href="/student/courses"
            className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
          >
            ← Back to Courses
          </Link>

          <Link
            href="/student/dashboard"
            className="text-sm font-semibold text-slate-600 transition hover:text-slate-900"
          >
            Dashboard
          </Link>
        </div>
      </header>

      {/* Main */}
      <div className="mx-auto max-w-4xl px-5 py-10 lg:px-8">
        {/* Course introduction */}
        <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
            Course Enrollment
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Enroll in {course.title}
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-slate-600">
            Complete the enrollment form below. Your request
            will be sent to an EDSEC administrator for review
            and approval.
          </p>

          {/* Course statistics */}
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <Info
              label="Modules"
              value={course.modules.length.toString()}
            />

            <Info
              label="Lessons"
              value={lessonCount.toString()}
            />

            <Info
              label="Duration"
              value={course.duration || "Flexible"}
            />
          </div>
        </section>

        {/* Enrollment process */}
        <section className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
          <p className="font-semibold text-blue-900">
            What happens after you submit?
          </p>

          <ol className="mt-3 space-y-2 text-sm leading-6 text-blue-800">
            <li>
              1. You complete and submit this enrollment form.
            </li>

            <li>
              2. EDSEC receives your enrollment application.
            </li>

            <li>
              3. An EDSEC administrator reviews your
              application.
            </li>

            <li>
              4. Your application is approved or rejected.
            </li>

            <li>
              5. If approved, you are automatically enrolled
              in the course.
            </li>

            <li>
              6. You can then access the course from your
              student portal.
            </li>
          </ol>
        </section>

        {/* Previous rejection */}
        {latestApplication?.status === "REJECTED" && (
          <section className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-5">
            <p className="font-semibold text-red-900">
              Previous application was not approved
            </p>

            <p className="mt-1 text-sm leading-6 text-red-800">
              You can submit a new enrollment application
              below.
            </p>
          </section>
        )}

        {/* Enrollment form */}
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
              Student Information
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-950">
              Complete your enrollment form
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Please make sure the information you provide is
              accurate. Your details will be used to create
              your EDSEC student enrollment record.
            </p>
          </div>

          <form
            action={submitEnrollment}
            className="mt-8 space-y-6"
          >
            {/* Names */}
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                label="First Name"
                name="firstName"
                type="text"
                defaultValue={student.firstName}
                placeholder="Enter your first name"
                required
              />

              <FormField
                label="Last Name"
                name="lastName"
                type="text"
                defaultValue={student.lastName}
                placeholder="Enter your last name"
                required
              />
            </div>

            {/* Email + Phone */}
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                label="Email Address"
                name="email"
                type="email"
                defaultValue={student.email}
                placeholder="you@example.com"
                required
                readOnly
              />

              <FormField
                label="Phone Number"
                name="phone"
                type="tel"
                defaultValue={student.phone || ""}
                placeholder="08012345678"
                required
              />
            </div>

            {/* DOB + Education */}
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                defaultValue={dateOfBirthValue}
                required
              />

              <div>
                <label
                  htmlFor="educationalLevel"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  Educational Level
                </label>

                <select
                  id="educationalLevel"
                  name="educationalLevel"
                  defaultValue={
                    student.studentProfile
                      ?.educationalLevel || ""
                  }
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="">
                    Select educational level
                  </option>

                  <option value="Secondary School">
                    Secondary School
                  </option>

                  <option value="SSCE / WAEC">
                    SSCE / WAEC
                  </option>

                  <option value="OND">OND</option>

                  <option value="NCE">NCE</option>

                  <option value="HND">HND</option>

                  <option value="BSc">BSc</option>

                  <option value="MSc">MSc</option>

                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Course */}
            <div>
              <label
                htmlFor="course"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Selected Course
              </label>

              <div
                id="course"
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <p className="font-semibold text-slate-950">
                  {course.title}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  This is the course you are applying to join.
                </p>
              </div>
            </div>

            {/* Student number */}
            {student.studentProfile?.studentNumber && (
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Student Number
                </label>

                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="font-semibold text-slate-950">
                    {student.studentProfile.studentNumber}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Your existing EDSEC student number.
                  </p>
                </div>
              </div>
            )}

            {/* Important notice */}
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
              <p className="font-semibold text-amber-900">
                Application review
              </p>

              <p className="mt-1 text-sm leading-6 text-amber-800">
                Submitting this form does not immediately
                enroll you in the course. Your application
                must first be reviewed and approved by an
                EDSEC administrator.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
            >
              Submit Enrollment Application →
            </button>

            <p className="text-center text-xs leading-5 text-slate-400">
              By submitting this application, you confirm
              that the information provided is accurate and
              you are requesting enrollment in this EDSEC
              program.
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}

/*
 * ---------------------------------------------------------
 * Reusable form field
 * ---------------------------------------------------------
 */

function FormField({
  label,
  name,
  type,
  defaultValue,
  placeholder,
  required = false,
  readOnly = false,
}: {
  label: string;
  name: string;
  type: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-slate-800"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        readOnly={readOnly}
        className={`w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${
          readOnly
            ? "cursor-not-allowed bg-slate-50 text-slate-500"
            : "bg-white"
        }`}
      />
    </div>
  );
}

/*
 * ---------------------------------------------------------
 * Course information card
 * ---------------------------------------------------------
 */

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-2 font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

/*
 * ---------------------------------------------------------
 * Date formatting
 * ---------------------------------------------------------
 */

function formatDateForInput(date: Date) {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(
    2,
    "0",
  );

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}