"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function getString(formData: FormData, name: string): string {
  const value = formData.get(name);

  return typeof value === "string" ? value.trim() : "";
}

function getOptionalString(
  formData: FormData,
  name: string,
): string | null {
  const value = getString(formData, name);

  return value || null;
}

function getFloat(formData: FormData, name: string): number {
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

function getOptionalFloat(
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

  return parsed;
}

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const projectStatuses = [
  "PENDING",
  "SUBMITTED",
  "GRADED",
  "APPROVED",
  "REJECTED",
] as const;

type ProjectStatus = (typeof projectStatuses)[number];

function isProjectStatus(value: string): value is ProjectStatus {
  return projectStatuses.includes(value as ProjectStatus);
}

/* -------------------------------------------------------------------------- */
/* Slug Helpers                                                               */
/* -------------------------------------------------------------------------- */

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function createUniqueSlug(title: string): Promise<string> {
  const baseSlug =
    slugify(title) || `student-project-${Date.now()}`;

  let slug = baseSlug;
  let counter = 1;

  while (
    await prisma.studentProject.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
      },
    })
  ) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return slug;
}

/* -------------------------------------------------------------------------- */
/* Revalidation                                                               */
/* -------------------------------------------------------------------------- */

function revalidateProjectPaths(id?: string) {
  revalidatePath("/admin/student-projects");
  revalidatePath("/student/projects");
  revalidatePath("/student/dashboard");
  revalidatePath("/projects");

  if (id) {
    revalidatePath(`/admin/student-projects/${id}`);
    revalidatePath(`/student/projects/${id}`);
  }
}

/* -------------------------------------------------------------------------- */
/* Project Management                                                         */
/* -------------------------------------------------------------------------- */

export async function createStudentProject(
  formData: FormData,
): Promise<void> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    throw new Error("Administrator authentication is required.");
  }

  const title = getString(formData, "title");
  const description = getString(formData, "description");
  const imageUrl = getOptionalString(formData, "imageUrl");
  const studentName = getOptionalString(formData, "studentName");
  const courseName = getOptionalString(formData, "courseName");
  const technologies = getOptionalString(formData, "technologies");
  const liveDemoUrl = getOptionalString(formData, "liveDemoUrl");
  const githubUrl = getOptionalString(formData, "githubUrl");
  const displayOrder = getFloat(formData, "displayOrder");

  const isFeatured =
    getString(formData, "isFeatured") === "true";

  const isPublished =
    getString(formData, "isPublished") !== "false";

  if (!title) {
    throw new Error("Project title is required.");
  }

  if (!description) {
    throw new Error("Project description is required.");
  }

  const slug = await createUniqueSlug(title);

  const project = await prisma.studentProject.create({
    data: {
      title,
      slug,
      description,
      imageUrl,
      studentName,
      courseName,
      technologies,
      liveDemoUrl,
      githubUrl,
      isFeatured,
      isPublished,
      displayOrder: Math.round(displayOrder),
    },
  });

  revalidateProjectPaths(project.id);

  redirect(`/admin/student-projects/${project.id}`);
}

export async function updateStudentProject(
  formData: FormData,
): Promise<void> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    throw new Error("Administrator authentication is required.");
  }

  const id = getString(formData, "id");
  const title = getString(formData, "title");
  const description = getString(formData, "description");
  const imageUrl = getOptionalString(formData, "imageUrl");
  const studentName = getOptionalString(formData, "studentName");
  const courseName = getOptionalString(formData, "courseName");
  const technologies = getOptionalString(formData, "technologies");
  const liveDemoUrl = getOptionalString(formData, "liveDemoUrl");
  const githubUrl = getOptionalString(formData, "githubUrl");
  const displayOrder = getFloat(formData, "displayOrder");

  const isFeatured =
    getString(formData, "isFeatured") === "true";

  const isPublished =
    getString(formData, "isPublished") === "true";

  if (!id) {
    throw new Error("Project ID is required.");
  }

  if (!title) {
    throw new Error("Project title is required.");
  }

  if (!description) {
    throw new Error("Project description is required.");
  }

  const existing = await prisma.studentProject.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  if (!existing) {
    throw new Error("Student project not found.");
  }

  await prisma.studentProject.update({
    where: {
      id,
    },
    data: {
      title,
      description,
      imageUrl,
      studentName,
      courseName,
      technologies,
      liveDemoUrl,
      githubUrl,
      isFeatured,
      isPublished,
      displayOrder: Math.round(displayOrder),
    },
  });

  revalidateProjectPaths(id);
}

/* -------------------------------------------------------------------------- */
/* Delete Project                                                             */
/* -------------------------------------------------------------------------- */

export async function deleteStudentProject(
  formData: FormData,
): Promise<void> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    throw new Error("Administrator authentication is required.");
  }

  const id = getString(formData, "id");

  if (!id) {
    throw new Error("Project ID is required.");
  }

  const project = await prisma.studentProject.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  if (!project) {
    throw new Error("Student project not found.");
  }

  await prisma.studentProject.delete({
    where: {
      id,
    },
  });

  revalidateProjectPaths();

  redirect("/admin/student-projects");
}

/* -------------------------------------------------------------------------- */
/* Publish Toggle                                                             */
/* -------------------------------------------------------------------------- */

export async function toggleStudentProjectPublished(
  formData: FormData,
): Promise<void> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    throw new Error("Administrator authentication is required.");
  }

  const id = getString(formData, "id");

  if (!id) {
    throw new Error("Project ID is required.");
  }

  const project = await prisma.studentProject.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      isPublished: true,
    },
  });

  if (!project) {
    throw new Error("Student project not found.");
  }

  await prisma.studentProject.update({
    where: {
      id,
    },
    data: {
      isPublished: !project.isPublished,
    },
  });

  revalidateProjectPaths(id);
}

/* -------------------------------------------------------------------------- */
/* Featured Toggle                                                            */
/* -------------------------------------------------------------------------- */

export async function toggleStudentProjectFeatured(
  formData: FormData,
): Promise<void> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    throw new Error("Administrator authentication is required.");
  }

  const id = getString(formData, "id");

  if (!id) {
    throw new Error("Project ID is required.");
  }

  const project = await prisma.studentProject.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      isFeatured: true,
    },
  });

  if (!project) {
    throw new Error("Student project not found.");
  }

  await prisma.studentProject.update({
    where: {
      id,
    },
    data: {
      isFeatured: !project.isFeatured,
    },
  });

  revalidateProjectPaths(id);
}

/* -------------------------------------------------------------------------- */
/* Student Authentication Helper                                              */
/* -------------------------------------------------------------------------- */

async function requireActiveStudent() {
  const student = await requireRole("STUDENT");

  if (!student) {
    throw new Error("Student authentication is required.");
  }

  const studentRecord = await prisma.user.findUnique({
    where: {
      id: student.id,
    },
    select: {
      id: true,
      role: true,
      status: true,
    },
  });

  if (!studentRecord || studentRecord.role !== "STUDENT") {
    throw new Error("Student account was not found.");
  }

  if (studentRecord.status !== "ACTIVE") {
    throw new Error("Your student account is not active.");
  }

  return studentRecord;
}

/* -------------------------------------------------------------------------- */
/* Student: Create Submission                                                 */
/* -------------------------------------------------------------------------- */

export async function createProjectSubmission(
  formData: FormData,
): Promise<void> {
  const student = await requireActiveStudent();

  const projectId = getOptionalString(formData, "projectId");
  const title = getString(formData, "title");
  const description = getOptionalString(formData, "description");

  if (!title) {
    throw new Error("Project submission title is required.");
  }

  if (projectId) {
    const project = await prisma.studentProject.findUnique({
      where: {
        id: projectId,
      },
      select: {
        id: true,
      },
    });

    if (!project) {
      throw new Error("Selected project was not found.");
    }
  }

  const submission =
    await prisma.studentProjectRecord.create({
      data: {
        studentId: student.id,
        projectId,
        title,
        description,
        status: "SUBMITTED",
        submittedAt: new Date(),
      },
    });

  await prisma.studentActivity.create({
    data: {
      studentId: student.id,
      type: "PROJECT_SUBMITTED",
      title: "Project submitted",
      description: `You submitted "${title}".`,
      metadata: JSON.stringify({
        submissionId: submission.id,
        projectId,
      }),
    },
  });

  revalidateProjectPaths(submission.id);

  redirect(`/student/projects/${submission.id}`);
}

/* -------------------------------------------------------------------------- */
/* Student: Update Submission                                                 */
/* -------------------------------------------------------------------------- */

export async function updateProjectSubmission(
  formData: FormData,
): Promise<void> {
  const student = await requireActiveStudent();

  const id = getString(formData, "id");
  const title = getString(formData, "title");
  const description = getOptionalString(formData, "description");

  if (!id) {
    throw new Error("Submission ID is required.");
  }

  if (!title) {
    throw new Error("Project submission title is required.");
  }

  const submission =
    await prisma.studentProjectRecord.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        studentId: true,
        status: true,
      },
    });

  if (!submission) {
    throw new Error("Project submission not found.");
  }

  if (submission.studentId !== student.id) {
    throw new Error(
      "You are not allowed to edit this submission.",
    );
  }

  if (
    submission.status === "GRADED" ||
    submission.status === "APPROVED"
  ) {
    throw new Error(
      "This submission can no longer be edited.",
    );
  }

  await prisma.studentProjectRecord.update({
    where: {
      id,
    },
    data: {
      title,
      description,
      status: "SUBMITTED",
      submittedAt: new Date(),
    },
  });

  revalidateProjectPaths(id);
}

/* -------------------------------------------------------------------------- */
/* Admin: Grade Submission                                                    */
/* -------------------------------------------------------------------------- */

export async function gradeProjectSubmission(
  formData: FormData,
): Promise<void> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    throw new Error("Administrator authentication is required.");
  }

  const id = getString(formData, "id");
  const score = getOptionalFloat(formData, "score");
  const feedback = getOptionalString(formData, "feedback");

  if (!id) {
    throw new Error("Submission ID is required.");
  }

  if (score === null) {
    throw new Error("Score is required.");
  }

  if (score < 0 || score > 100) {
    throw new Error("Score must be between 0 and 100.");
  }

  const submission =
    await prisma.studentProjectRecord.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        studentId: true,
        title: true,
      },
    });

  if (!submission) {
    throw new Error("Project submission not found.");
  }

  /*
   * StudentProjectRecord does not have gradedById.
   * Only fields defined in the Prisma schema are updated.
   */
  await prisma.studentProjectRecord.update({
    where: {
      id,
    },
    data: {
      score,
      feedback,
      status: "GRADED",
      gradedAt: new Date(),
    },
  });

  await prisma.studentActivity.create({
    data: {
      studentId: submission.studentId,
      type: "PROJECT_SUBMITTED",
      title: "Project graded",
      description: `Your project "${submission.title}" has been graded.`,
      metadata: JSON.stringify({
        submissionId: submission.id,
        score,
      }),
    },
  });

  revalidateProjectPaths(id);
}

/* -------------------------------------------------------------------------- */
/* Compatibility: gradeStudentProject                                         */
/* -------------------------------------------------------------------------- */

export async function gradeStudentProject(
  formData: FormData,
): Promise<void> {
  return gradeProjectSubmission(formData);
}

/* -------------------------------------------------------------------------- */
/* Admin: Approve Submission                                                  */
/* -------------------------------------------------------------------------- */

export async function approveProjectSubmission(
  formData: FormData,
): Promise<void> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    throw new Error("Administrator authentication is required.");
  }

  const id = getString(formData, "id");

  if (!id) {
    throw new Error("Submission ID is required.");
  }

  const submission =
    await prisma.studentProjectRecord.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        studentId: true,
        title: true,
        status: true,
      },
    });

  if (!submission) {
    throw new Error("Project submission not found.");
  }

  await prisma.studentProjectRecord.update({
    where: {
      id,
    },
    data: {
      status: "APPROVED",
      gradedAt: new Date(),
    },
  });

  await prisma.studentActivity.create({
    data: {
      studentId: submission.studentId,
      type: "ACHIEVEMENT_EARNED",
      title: "Project approved",
      description: `Your project "${submission.title}" has been approved.`,
      metadata: JSON.stringify({
        submissionId: submission.id,
      }),
    },
  });

  revalidateProjectPaths(id);
}

/* -------------------------------------------------------------------------- */
/* Admin: Reject Submission                                                   */
/* -------------------------------------------------------------------------- */

export async function rejectProjectSubmission(
  formData: FormData,
): Promise<void> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    throw new Error("Administrator authentication is required.");
  }

  const id = getString(formData, "id");
  const feedback = getOptionalString(formData, "feedback");

  if (!id) {
    throw new Error("Submission ID is required.");
  }

  const submission =
    await prisma.studentProjectRecord.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        studentId: true,
        title: true,
      },
    });

  if (!submission) {
    throw new Error("Project submission not found.");
  }

  await prisma.studentProjectRecord.update({
    where: {
      id,
    },
    data: {
      status: "REJECTED",
      feedback,
      gradedAt: new Date(),
    },
  });

  await prisma.studentActivity.create({
    data: {
      studentId: submission.studentId,
      type: "PROJECT_SUBMITTED",
      title: "Project requires changes",
      description: `Your project "${submission.title}" requires changes.`,
      metadata: JSON.stringify({
        submissionId: submission.id,
      }),
    },
  });

  revalidateProjectPaths(id);
}

/* -------------------------------------------------------------------------- */
/* Admin: Delete Submission                                                   */
/* -------------------------------------------------------------------------- */

export async function deleteProjectSubmission(
  formData: FormData,
): Promise<void> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    throw new Error("Administrator authentication is required.");
  }

  const id = getString(formData, "id");

  if (!id) {
    throw new Error("Submission ID is required.");
  }

  const submission =
    await prisma.studentProjectRecord.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        studentId: true,
      },
    });

  if (!submission) {
    throw new Error("Project submission not found.");
  }

  await prisma.studentProjectRecord.delete({
    where: {
      id,
    },
  });

  revalidateProjectPaths();

  redirect("/admin/student-projects");
}

/* -------------------------------------------------------------------------- */
/* Admin: Update Submission Status                                            */
/* -------------------------------------------------------------------------- */

export async function updateProjectSubmissionStatus(
  formData: FormData,
): Promise<void> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    throw new Error("Administrator authentication is required.");
  }

  const id = getString(formData, "id");
  const status = getString(formData, "status");

  if (!id) {
    throw new Error("Submission ID is required.");
  }

  if (!isProjectStatus(status)) {
    throw new Error("Invalid project submission status.");
  }

  const submission =
    await prisma.studentProjectRecord.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        studentId: true,
        title: true,
      },
    });

  if (!submission) {
    throw new Error("Project submission not found.");
  }

  await prisma.studentProjectRecord.update({
    where: {
      id,
    },
    data: {
      status,
      gradedAt:
        status === "GRADED" ||
        status === "APPROVED" ||
        status === "REJECTED"
          ? new Date()
          : undefined,
    },
  });

  revalidateProjectPaths(id);
}

/* -------------------------------------------------------------------------- */
/* Admin: Update Submission Details                                           */
/* -------------------------------------------------------------------------- */

export async function updateProjectSubmissionDetails(
  formData: FormData,
): Promise<void> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    throw new Error("Administrator authentication is required.");
  }

  const id = getString(formData, "id");
  const title = getString(formData, "title");
  const description = getOptionalString(formData, "description");
  const score = getOptionalFloat(formData, "score");
  const feedback = getOptionalString(formData, "feedback");
  const status = getString(formData, "status");

  if (!id) {
    throw new Error("Submission ID is required.");
  }

  if (!title) {
    throw new Error("Submission title is required.");
  }

  if (score !== null && (score < 0 || score > 100)) {
    throw new Error("Score must be between 0 and 100.");
  }

  if (!isProjectStatus(status)) {
    throw new Error("Invalid project submission status.");
  }

  const submission =
    await prisma.studentProjectRecord.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

  if (!submission) {
    throw new Error("Project submission not found.");
  }

  await prisma.studentProjectRecord.update({
    where: {
      id,
    },
    data: {
      title,
      description,
      score,
      feedback,
      status,
      gradedAt:
        status === "GRADED" ||
        status === "APPROVED" ||
        status === "REJECTED"
          ? new Date()
          : undefined,
    },
  });

  revalidateProjectPaths(id);
}

/* -------------------------------------------------------------------------- */
/* Student: Delete Own Submission                                             */
/* -------------------------------------------------------------------------- */

export async function deleteOwnProjectSubmission(
  formData: FormData,
): Promise<void> {
  const student = await requireActiveStudent();

  const id = getString(formData, "id");

  if (!id) {
    throw new Error("Submission ID is required.");
  }

  const submission =
    await prisma.studentProjectRecord.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        studentId: true,
        status: true,
      },
    });

  if (!submission) {
    throw new Error("Project submission not found.");
  }

  if (submission.studentId !== student.id) {
    throw new Error("You cannot delete this submission.");
  }

  if (
    submission.status === "GRADED" ||
    submission.status === "APPROVED"
  ) {
    throw new Error(
      "A graded or approved submission cannot be deleted.",
    );
  }

  await prisma.studentProjectRecord.delete({
    where: {
      id,
    },
  });

  revalidateProjectPaths();

  redirect("/student/projects");
}

/* -------------------------------------------------------------------------- */
/* Admin: Sync Submission                                                     */
/* -------------------------------------------------------------------------- */

export async function syncProjectSubmission(
  formData: FormData,
): Promise<void> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    throw new Error("Administrator authentication is required.");
  }

  const id = getString(formData, "id");

  if (!id) {
    throw new Error("Submission ID is required.");
  }

  const submission =
    await prisma.studentProjectRecord.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

  if (!submission) {
    throw new Error("Project submission not found.");
  }

  await prisma.studentProjectRecord.update({
    where: {
      id,
    },
    data: {
      updatedAt: new Date(),
    },
  });

  revalidateProjectPaths(id);
}

/* -------------------------------------------------------------------------- */
/* Compatibility Aliases                                                      */
/* -------------------------------------------------------------------------- */

export async function submitProject(
  formData: FormData,
): Promise<void> {
  return createProjectSubmission(formData);
}

export async function gradeProject(
  formData: FormData,
): Promise<void> {
  return gradeProjectSubmission(formData);
}

export async function approveProject(
  formData: FormData,
): Promise<void> {
  return approveProjectSubmission(formData);
}

export async function deleteSubmission(
  formData: FormData,
): Promise<void> {
  return deleteProjectSubmission(formData);
}