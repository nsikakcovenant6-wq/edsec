"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";

function getString(formData: FormData, name: string) {
  const value = formData.get(name);

  return typeof value === "string" ? value.trim() : "";
}

function getOptionalString(formData: FormData, name: string) {
  const value = getString(formData, name);

  return value || null;
}

function getFloat(formData: FormData, name: string) {
  const value = getString(formData, name);

  if (!value) {
    return 0;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return parsed;
}

function getOptionalDate(formData: FormData, name: string) {
  const value = getString(formData, name);

  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

const assessmentTypes = [
  "TEST",
  "PROJECT",
  "ASSIGNMENT",
  "EXAM",
  "PRACTICAL",
] as const;

const assessmentStatuses = [
  "DRAFT",
  "PUBLISHED",
  "CLOSED",
] as const;

type AssessmentType = (typeof assessmentTypes)[number];
type AssessmentStatus = (typeof assessmentStatuses)[number];

function isAssessmentType(value: string): value is AssessmentType {
  return assessmentTypes.includes(value as AssessmentType);
}

function isAssessmentStatus(value: string): value is AssessmentStatus {
  return assessmentStatuses.includes(value as AssessmentStatus);
}

export async function createAssessment(
  formData: FormData,
): Promise<void> {
  await requireRole("ADMIN");

  const courseId = getString(formData, "courseId");
  const title = getString(formData, "title");
  const description = getOptionalString(formData, "description");
  const type = getString(formData, "type");
  const maxScore = getFloat(formData, "maxScore");
  const dueDate = getOptionalDate(formData, "dueDate");
  const status = getString(formData, "status") || "DRAFT";

  if (!courseId) {
    throw new Error("Please select a course.");
  }

  if (!title) {
    throw new Error("Assessment title is required.");
  }

  if (!isAssessmentType(type)) {
    throw new Error("Invalid assessment type.");
  }

  if (maxScore <= 0) {
    throw new Error("Maximum score must be greater than zero.");
  }

  if (!isAssessmentStatus(status)) {
    throw new Error("Invalid assessment status.");
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
    throw new Error("Selected course was not found.");
  }

  const assessment = await prisma.assessment.create({
    data: {
      courseId,
      title,
      description,
      type,
      maxScore,
      dueDate,
      status,
    },
  });

  revalidatePath("/admin/assessments");
  revalidatePath(`/admin/assessments/${assessment.id}`);

  redirect(`/admin/assessments/${assessment.id}`);
}

export async function updateAssessment(
  formData: FormData,
): Promise<void> {
  await requireRole("ADMIN");

  const id = getString(formData, "id");
  const courseId = getString(formData, "courseId");
  const title = getString(formData, "title");
  const description = getOptionalString(formData, "description");
  const type = getString(formData, "type");
  const maxScore = getFloat(formData, "maxScore");
  const dueDate = getOptionalDate(formData, "dueDate");
  const status = getString(formData, "status");

  if (!id) {
    throw new Error("Assessment ID is required.");
  }

  if (!courseId) {
    throw new Error("Please select a course.");
  }

  if (!title) {
    throw new Error("Assessment title is required.");
  }

  if (!isAssessmentType(type)) {
    throw new Error("Invalid assessment type.");
  }

  if (!isAssessmentStatus(status)) {
    throw new Error("Invalid assessment status.");
  }

  if (maxScore <= 0) {
    throw new Error("Maximum score must be greater than zero.");
  }

  const assessment = await prisma.assessment.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  if (!assessment) {
    throw new Error("Assessment not found.");
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
    throw new Error("Selected course was not found.");
  }

  await prisma.assessment.update({
    where: {
      id,
    },
    data: {
      courseId,
      title,
      description,
      type,
      maxScore,
      dueDate,
      status,
    },
  });

  revalidatePath("/admin/assessments");
  revalidatePath(`/admin/assessments/${id}`);
}

export async function deleteAssessment(
  formData: FormData,
): Promise<void> {
  await requireRole("ADMIN");

  const id = getString(formData, "id");

  if (!id) {
    throw new Error("Assessment ID is required.");
  }

  const assessment = await prisma.assessment.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  if (!assessment) {
    throw new Error("Assessment not found.");
  }

  await prisma.$transaction([
    prisma.grade.deleteMany({
      where: {
        assessmentId: id,
      },
    }),

    prisma.assessment.delete({
      where: {
        id,
      },
    }),
  ]);

  revalidatePath("/admin/assessments");

  redirect("/admin/assessments");
}

export async function updateAssessmentStatus(
  formData: FormData,
): Promise<void> {
  await requireRole("ADMIN");

  const id = getString(formData, "id");
  const status = getString(formData, "status");

  if (!id) {
    throw new Error("Assessment ID is required.");
  }

  if (!isAssessmentStatus(status)) {
    throw new Error("Invalid assessment status.");
  }

  const assessment = await prisma.assessment.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  if (!assessment) {
    throw new Error("Assessment not found.");
  }

  await prisma.assessment.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });

  revalidatePath("/admin/assessments");
  revalidatePath(`/admin/assessments/${id}`);
}

export async function saveGrade(
  formData: FormData,
): Promise<void> {
  const admin = await requireRole("ADMIN");

  /*
   * requireRole can be typed as returning User | null.
   * Explicitly guard against null before using admin.id.
   */
  if (!admin) {
    throw new Error("Unauthorized.");
  }

  const assessmentId = getString(formData, "assessmentId");
  const studentId = getString(formData, "studentId");
  const enrollmentId = getOptionalString(formData, "enrollmentId");
  const score = getFloat(formData, "score");
  const feedback = getOptionalString(formData, "feedback");

  if (!assessmentId) {
    throw new Error("Assessment ID is required.");
  }

  if (!studentId) {
    throw new Error("Student ID is required.");
  }

  const assessment = await prisma.assessment.findUnique({
    where: {
      id: assessmentId,
    },
    select: {
      id: true,
      courseId: true,
      maxScore: true,
    },
  });

  if (!assessment) {
    throw new Error("Assessment not found.");
  }

  if (score < 0) {
    throw new Error("Score cannot be negative.");
  }

  if (score > assessment.maxScore) {
    throw new Error(
      `Score cannot be greater than ${assessment.maxScore}.`,
    );
  }

  const student = await prisma.user.findUnique({
    where: {
      id: studentId,
    },
    select: {
      id: true,
      role: true,
    },
  });

  if (!student || student.role !== "STUDENT") {
    throw new Error("Student not found.");
  }

  const enrollment = enrollmentId
    ? await prisma.enrollment.findFirst({
        where: {
          id: enrollmentId,
          studentId,
          courseId: assessment.courseId,
        },
        select: {
          id: true,
        },
      })
    : await prisma.enrollment.findFirst({
        where: {
          studentId,
          courseId: assessment.courseId,
        },
        select: {
          id: true,
        },
      });

  const percentage =
    assessment.maxScore > 0
      ? (score / assessment.maxScore) * 100
      : 0;

  let grade = "F";

  if (percentage >= 80) {
    grade = "A";
  } else if (percentage >= 70) {
    grade = "B";
  } else if (percentage >= 60) {
    grade = "C";
  } else if (percentage >= 50) {
    grade = "D";
  } else if (percentage >= 45) {
    grade = "E";
  }

  await prisma.grade.upsert({
    where: {
      studentId_assessmentId: {
        studentId,
        assessmentId,
      },
    },

    update: {
      enrollmentId: enrollment?.id ?? null,
      score,
      maxScore: assessment.maxScore,
      grade,
      feedback,
      gradedById: admin.id,
      gradedAt: new Date(),
    },

    create: {
      studentId,
      assessmentId,
      enrollmentId: enrollment?.id ?? null,
      score,
      maxScore: assessment.maxScore,
      grade,
      feedback,
      gradedById: admin.id,
      gradedAt: new Date(),
    },
  });

  revalidatePath(`/admin/assessments/${assessmentId}`);
  revalidatePath("/admin/assessments");
  revalidatePath("/student/assessments");
}

export async function deleteGrade(
  formData: FormData,
): Promise<void> {
  await requireRole("ADMIN");

  const id = getString(formData, "id");

  if (!id) {
    throw new Error("Grade ID is required.");
  }

  const grade = await prisma.grade.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      assessmentId: true,
    },
  });

  if (!grade) {
    throw new Error("Grade not found.");
  }

  await prisma.grade.delete({
    where: {
      id,
    },
  });

  revalidatePath(`/admin/assessments/${grade.assessmentId}`);
}