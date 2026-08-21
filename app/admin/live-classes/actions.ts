"app/admin/live-classes/actions.ts"

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";

function getString(formData: FormData, name: string): string {
  const value = formData.get(name);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function getOptionalString(
  formData: FormData,
  name: string,
): string | null {
  const value = getString(formData, name);

  return value || null;
}

function getOptionalInt(
  formData: FormData,
  name: string,
): number | null {
  const value = getString(formData, name);

  if (!value) {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return null;
  }

  return Math.round(parsed);
}

function getDateTime(
  date: string,
  time: string,
): Date | null {
  if (!date || !time) {
    return null;
  }

  const value = new Date(`${date}T${time}`);

  if (Number.isNaN(value.getTime())) {
    return null;
  }

  return value;
}

const LIVE_CLASS_STATUSES = [
  "SCHEDULED",
  "LIVE",
  "COMPLETED",
  "CANCELLED",
] as const;

const ATTENDANCE_STATUSES = [
  "PRESENT",
  "ABSENT",
  "LATE",
  "EXCUSED",
] as const;

type LiveClassStatus = (typeof LIVE_CLASS_STATUSES)[number];

type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[number];

function isLiveClassStatus(
  value: string,
): value is LiveClassStatus {
  return LIVE_CLASS_STATUSES.includes(
    value as LiveClassStatus,
  );
}

function isAttendanceStatus(
  value: string,
): value is AttendanceStatus {
  return ATTENDANCE_STATUSES.includes(
    value as AttendanceStatus,
  );
}

/**
 * Create a new live class.
 */
export async function createLiveClass(
  formData: FormData,
): Promise<void> {
  const admin = await requireRole("ADMIN");

  /*
   * requireRole() performs the authorization check, but its
   * TypeScript return type may still allow null.
   *
   * Explicitly guard against that before accessing admin.id.
   */
  if (!admin) {
    throw new Error("Unauthorized.");
  }

  const title = getString(formData, "title");
  const courseId = getString(formData, "courseId");
  const description = getOptionalString(
    formData,
    "description",
  );
  const date = getString(formData, "date");
  const time = getString(formData, "time");
  const meetingUrl = getString(
    formData,
    "meetingUrl",
  );
  const duration = getOptionalInt(
    formData,
    "duration",
  );
  const isPublished =
    getString(formData, "isPublished") === "true";

  if (!title) {
    throw new Error("Live class title is required.");
  }

  if (!courseId) {
    throw new Error("Please select a course.");
  }

  if (!meetingUrl) {
    throw new Error("Meeting URL is required.");
  }

  const scheduledAt = getDateTime(date, time);

  if (!scheduledAt) {
    throw new Error(
      "Please provide a valid date and time.",
    );
  }

  if (duration !== null && duration < 1) {
    throw new Error(
      "Duration must be at least 1 minute.",
    );
  }

  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    select: {
      id: true,
    },
  });

  if (!course) {
    throw new Error(
      "Selected course was not found.",
    );
  }

  const liveClass = await prisma.liveClass.create({
    data: {
      courseId,
      createdById: admin.id,
      title,
      description,
      scheduledAt,
      duration,
      meetingUrl,
      status: "SCHEDULED",
      isPublished,
    },
  });

  /*
   * Automatically attach all active students enrolled
   * in this course to the live class.
   */
  const enrollments =
    await prisma.enrollment.findMany({
      where: {
        courseId,
        status: "ACTIVE",
      },
      select: {
        id: true,
        studentId: true,
      },
    });

  if (enrollments.length > 0) {
    await prisma.liveClassEnrollment.createMany({
      data: enrollments.map((enrollment) => ({
        liveClassId: liveClass.id,
        enrollmentId: enrollment.id,
      })),
      skipDuplicates: true,
    });

    /*
     * Create attendance records for all enrolled
     * students.
     */
    await prisma.attendance.createMany({
      data: enrollments.map((enrollment) => ({
        liveClassId: liveClass.id,
        studentId: enrollment.studentId,
        status: "ABSENT",
      })),
      skipDuplicates: true,
    });
  }

  revalidatePath("/admin/live-classes");
  revalidatePath(
    `/admin/live-classes/${liveClass.id}`,
  );

  redirect(
    `/admin/live-classes/${liveClass.id}`,
  );
}

/**
 * Update an existing live class.
 */
export async function updateLiveClass(
  formData: FormData,
): Promise<void> {
  await requireRole("ADMIN");

  const id = getString(formData, "id");
  const title = getString(formData, "title");
  const courseId = getString(
    formData,
    "courseId",
  );
  const description = getOptionalString(
    formData,
    "description",
  );
  const date = getString(formData, "date");
  const time = getString(formData, "time");
  const meetingUrl = getString(
    formData,
    "meetingUrl",
  );
  const duration = getOptionalInt(
    formData,
    "duration",
  );
  const statusValue = getString(
    formData,
    "status",
  );
  const isPublished =
    getString(formData, "isPublished") === "true";

  if (!id) {
    throw new Error(
      "Live class ID is required.",
    );
  }

  if (!title) {
    throw new Error(
      "Live class title is required.",
    );
  }

  if (!courseId) {
    throw new Error("Please select a course.");
  }

  if (!meetingUrl) {
    throw new Error("Meeting URL is required.");
  }

  const scheduledAt = getDateTime(date, time);

  if (!scheduledAt) {
    throw new Error(
      "Please provide a valid date and time.",
    );
  }

  if (
    duration !== null &&
    duration < 1
  ) {
    throw new Error(
      "Duration must be at least 1 minute.",
    );
  }

  if (!isLiveClassStatus(statusValue)) {
    throw new Error(
      "Invalid live class status.",
    );
  }

  const [existing, course] =
    await Promise.all([
      prisma.liveClass.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
        },
      }),

      prisma.course.findUnique({
        where: {
          id: courseId,
        },
        select: {
          id: true,
        },
      }),
    ]);

  if (!existing) {
    throw new Error(
      "Live class not found.",
    );
  }

  if (!course) {
    throw new Error(
      "Selected course was not found.",
    );
  }

  await prisma.liveClass.update({
    where: {
      id,
    },
    data: {
      courseId,
      title,
      description,
      scheduledAt,
      duration,
      meetingUrl,
      status: statusValue,
      isPublished,
    },
  });

  /*
   * If the course changes, synchronize the students
   * attached to the live class with the new course.
   */
  const enrollments =
    await prisma.enrollment.findMany({
      where: {
        courseId,
        status: "ACTIVE",
      },
      select: {
        id: true,
        studentId: true,
      },
    });

  if (enrollments.length > 0) {
    await prisma.liveClassEnrollment.createMany({
      data: enrollments.map((enrollment) => ({
        liveClassId: id,
        enrollmentId: enrollment.id,
      })),
      skipDuplicates: true,
    });

    await prisma.attendance.createMany({
      data: enrollments.map((enrollment) => ({
        liveClassId: id,
        studentId: enrollment.studentId,
        status: "ABSENT",
      })),
      skipDuplicates: true,
    });
  }

  revalidatePath("/admin/live-classes");
  revalidatePath(
    `/admin/live-classes/${id}`,
  );
}

/**
 * Delete a live class.
 *
 * Prisma cascades the related student assignment
 * and attendance records according to the schema.
 */
export async function deleteLiveClass(
  formData: FormData,
): Promise<void> {
  await requireRole("ADMIN");

  const id = getString(formData, "id");

  if (!id) {
    throw new Error(
      "Live class ID is required.",
    );
  }

  const existing =
    await prisma.liveClass.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

  if (!existing) {
    throw new Error(
      "Live class not found.",
    );
  }

  await prisma.liveClass.delete({
    where: {
      id,
    },
  });

  revalidatePath("/admin/live-classes");

  redirect("/admin/live-classes");
}

/**
 * Publish or unpublish a live class.
 */
export async function toggleLiveClassPublished(
  formData: FormData,
): Promise<void> {
  await requireRole("ADMIN");

  const id = getString(formData, "id");

  if (!id) {
    throw new Error(
      "Live class ID is required.",
    );
  }

  const liveClass =
    await prisma.liveClass.findUnique({
      where: {
        id,
      },
        select: {
        id: true,
        isPublished: true,
      },
    });

  if (!liveClass) {
    throw new Error(
      "Live class not found.",
    );
  }

  await prisma.liveClass.update({
    where: {
      id,
    },
    data: {
      isPublished: !liveClass.isPublished,
    },
  });

  revalidatePath("/admin/live-classes");
  revalidatePath(
    `/admin/live-classes/${id}`,
  );
}

/**
 * Update live class status.
 */
export async function updateLiveClassStatus(
  formData: FormData,
): Promise<void> {
  await requireRole("ADMIN");

  const id = getString(formData, "id");
  const statusValue = getString(
    formData,
    "status",
  );

  if (!id) {
    throw new Error(
      "Live class ID is required.",
    );
  }

  if (!isLiveClassStatus(statusValue)) {
    throw new Error(
      "Invalid live class status.",
    );
  }

  const existing =
    await prisma.liveClass.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

  if (!existing) {
    throw new Error(
      "Live class not found.",
    );
  }

  await prisma.liveClass.update({
    where: {
      id,
    },
    data: {
      status: statusValue,
    },
  });

  revalidatePath("/admin/live-classes");
  revalidatePath(
    `/admin/live-classes/${id}`,
  );
}

/**
 * Update a student's attendance record.
 */
export async function updateAttendance(
  formData: FormData,
): Promise<void> {
  await requireRole("ADMIN");

  const attendanceId = getString(
    formData,
    "attendanceId",
  );

  const statusValue = getString(
    formData,
    "status",
  );

  const notes = getOptionalString(
    formData,
    "notes",
  );

  if (!attendanceId) {
    throw new Error(
      "Attendance ID is required.",
    );
  }

  if (!isAttendanceStatus(statusValue)) {
    throw new Error(
      "Invalid attendance status.",
    );
  }

  const attendance =
    await prisma.attendance.findUnique({
      where: {
        id: attendanceId,
      },
      select: {
        id: true,
        liveClassId: true,
        status: true,
        joinedAt: true,
      },
    });

  if (!attendance) {
    throw new Error(
      "Attendance record not found.",
    );
  }

  const isPresentLike =
    statusValue === "PRESENT" ||
    statusValue === "LATE";

  /*
   * If a student is marked absent/excused,
   * preserve an existing joinedAt value.
   *
   * If marked present/late and there is no
   * joinedAt value, record the current time.
   */
  const joinedAt =
    isPresentLike &&
    !attendance.joinedAt
      ? new Date()
      : attendance.joinedAt;

  await prisma.attendance.update({
    where: {
      id: attendanceId,
    },
    data: {
      status: statusValue,
      notes,
      joinedAt,
    },
  });

  revalidatePath("/admin/live-classes");
  revalidatePath(
    `/admin/live-classes/${attendance.liveClassId}`,
  );
}

/**
 * Synchronize all active course enrollments
 * with a live class.
 *
 * This adds missing students and attendance
 * records without creating duplicates.
 */
export async function syncLiveClassStudents(
  formData: FormData,
): Promise<void> {
  await requireRole("ADMIN");

  const liveClassId = getString(
    formData,
    "liveClassId",
  );

  if (!liveClassId) {
    throw new Error(
      "Live class ID is required.",
    );
  }

  const liveClass =
    await prisma.liveClass.findUnique({
      where: {
        id: liveClassId,
      },
      select: {
        id: true,
        courseId: true,
      },
    });

  if (!liveClass) {
    throw new Error(
      "Live class not found.",
    );
  }

  const enrollments =
    await prisma.enrollment.findMany({
      where: {
        courseId: liveClass.courseId,
        status: "ACTIVE",
      },
      select: {
        id: true,
        studentId: true,
      },
    });

  if (enrollments.length > 0) {
    await prisma.liveClassEnrollment.createMany({
      data: enrollments.map((enrollment) => ({
        liveClassId,
        enrollmentId: enrollment.id,
      })),
      skipDuplicates: true,
    });

    await prisma.attendance.createMany({
      data: enrollments.map((enrollment) => ({
        liveClassId,
        studentId: enrollment.studentId,
        status: "ABSENT",
      })),
      skipDuplicates: true,
    });
  }

  revalidatePath(
    `/admin/live-classes/${liveClassId}`,
  );

  revalidatePath("/admin/live-classes");
}