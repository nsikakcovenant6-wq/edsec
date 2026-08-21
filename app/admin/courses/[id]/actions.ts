/* eslint-disable @next/next/no-assign-module-variable */
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";

export type CourseManagementResult = {
  success: boolean;
  message: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function createUniqueLessonSlug(
  moduleId: string,
  title: string,
  excludeId?: string
) {
  const baseSlug = slugify(title) || `lesson-${Date.now()}`;

  let slug = baseSlug;
  let counter = 2;

  while (true) {
    const existing = await prisma.lesson.findFirst({
      where: {
        moduleId,
        slug,
        ...(excludeId
          ? {
              NOT: {
                id: excludeId,
              },
            }
          : {}),
      },
      select: {
        id: true,
      },
    });

    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

async function verifyCourse(courseId: string) {
  return prisma.course.findUnique({
    where: {
      id: courseId,
    },
    select: {
      id: true,
      title: true,
    },
  });
}

export async function createModule(
  courseId: string,
  formData: FormData
): Promise<CourseManagementResult> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    return {
      success: false,
      message: "Unauthorized.",
    };
  }

  if (!courseId) {
    return {
      success: false,
      message: "Course ID is required.",
    };
  }

  const title = String(formData.get("title") ?? "").trim();
  const description = String(
    formData.get("description") ?? ""
  ).trim();

  if (!title) {
    return {
      success: false,
      message: "Module title is required.",
    };
  }

  try {
    const course = await verifyCourse(courseId);

    if (!course) {
      return {
        success: false,
        message: "Course not found.",
      };
    }

    const lastModule = await prisma.courseModule.findFirst({
      where: {
        courseId,
      },
      orderBy: {
        displayOrder: "desc",
      },
      select: {
        displayOrder: true,
      },
    });

    await prisma.courseModule.create({
      data: {
        courseId,
        title,
        description: description || null,
        displayOrder: (lastModule?.displayOrder ?? 0) + 1,
        isPublished: false,
      },
    });

    revalidatePath(`/admin/courses/${courseId}`);

    return {
      success: true,
      message: "Module created successfully.",
    };
  } catch (error) {
    console.error("CREATE MODULE ERROR:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to create module.",
    };
  }
}

export async function updateModule(
  courseId: string,
  moduleId: string,
  formData: FormData
): Promise<CourseManagementResult> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    return {
      success: false,
      message: "Unauthorized.",
    };
  }

  const title = String(formData.get("title") ?? "").trim();
  const description = String(
    formData.get("description") ?? ""
  ).trim();

  if (!title) {
    return {
      success: false,
      message: "Module title is required.",
    };
  }

  try {
    const module = await prisma.courseModule.findFirst({
      where: {
        id: moduleId,
        courseId,
      },
      select: {
        id: true,
      },
    });

    if (!module) {
      return {
        success: false,
        message: "Module not found.",
      };
    }

    await prisma.courseModule.update({
      where: {
        id: moduleId,
      },
      data: {
        title,
        description: description || null,
      },
    });

    revalidatePath(`/admin/courses/${courseId}`);

    return {
      success: true,
      message: "Module updated successfully.",
    };
  } catch (error) {
    console.error("UPDATE MODULE ERROR:", error);

    return {
      success: false,
      message: "Unable to update module.",
    };
  }
}

export async function toggleModulePublished(
  courseId: string,
  moduleId: string
): Promise<CourseManagementResult> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    return {
      success: false,
      message: "Unauthorized.",
    };
  }

  try {
    const module = await prisma.courseModule.findFirst({
      where: {
        id: moduleId,
        courseId,
      },
      select: {
        id: true,
        isPublished: true,
      },
    });

    if (!module) {
      return {
        success: false,
        message: "Module not found.",
      };
    }

    await prisma.courseModule.update({
      where: {
        id: moduleId,
      },
      data: {
        isPublished: !module.isPublished,
      },
    });

    revalidatePath(`/admin/courses/${courseId}`);

    return {
      success: true,
      message: module.isPublished
        ? "Module unpublished."
        : "Module published.",
    };
  } catch (error) {
    console.error("TOGGLE MODULE ERROR:", error);

    return {
      success: false,
      message: "Unable to change module status.",
    };
  }
}

export async function deleteModule(
  courseId: string,
  moduleId: string
): Promise<CourseManagementResult> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    return {
      success: false,
      message: "Unauthorized.",
    };
  }

  try {
    const module = await prisma.courseModule.findFirst({
      where: {
        id: moduleId,
        courseId,
      },
      select: {
        id: true,
      },
    });

    if (!module) {
      return {
        success: false,
        message: "Module not found.",
      };
    }

    await prisma.courseModule.delete({
      where: {
        id: moduleId,
      },
    });

    revalidatePath(`/admin/courses/${courseId}`);

    return {
      success: true,
      message: "Module deleted successfully.",
    };
  } catch (error) {
    console.error("DELETE MODULE ERROR:", error);

    return {
      success: false,
      message:
        "Unable to delete module. Make sure its related records allow deletion.",
    };
  }
}

export async function createLesson(
  courseId: string,
  moduleId: string,
  formData: FormData
): Promise<CourseManagementResult> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    return {
      success: false,
      message: "Unauthorized.",
    };
  }

  const title = String(formData.get("title") ?? "").trim();
  const description = String(
    formData.get("description") ?? ""
  ).trim();
  const content = String(formData.get("content") ?? "").trim();
  const videoUrl = String(formData.get("videoUrl") ?? "").trim();

  const durationRaw = String(
    formData.get("duration") ?? ""
  ).trim();

  const duration = durationRaw
    ? Number.parseInt(durationRaw, 10)
    : null;

  if (!title) {
    return {
      success: false,
      message: "Lesson title is required.",
    };
  }

  if (
    duration !== null &&
    (Number.isNaN(duration) || duration < 1)
  ) {
    return {
      success: false,
      message: "Lesson duration must be a valid positive number.",
    };
  }

  try {
    const module = await prisma.courseModule.findFirst({
      where: {
        id: moduleId,
        courseId,
      },
      select: {
        id: true,
      },
    });

    if (!module) {
      return {
        success: false,
        message: "Module not found.",
      };
    }

    const lastLesson = await prisma.lesson.findFirst({
      where: {
        moduleId,
      },
      orderBy: {
        displayOrder: "desc",
      },
      select: {
        displayOrder: true,
      },
    });

    const slug = await createUniqueLessonSlug(
      moduleId,
      title
    );

    await prisma.lesson.create({
      data: {
        moduleId,
        title,
        slug,
        description: description || null,
        content: content || null,
        videoUrl: videoUrl || null,
        duration,
        displayOrder: (lastLesson?.displayOrder ?? 0) + 1,
        isPublished: false,
      },
    });

    revalidatePath(`/admin/courses/${courseId}`);

    return {
      success: true,
      message: "Lesson created successfully.",
    };
  } catch (error) {
    console.error("CREATE LESSON ERROR:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to create lesson.",
    };
  }
}

export async function updateLesson(
  courseId: string,
  moduleId: string,
  lessonId: string,
  formData: FormData
): Promise<CourseManagementResult> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    return {
      success: false,
      message: "Unauthorized.",
    };
  }

  const title = String(formData.get("title") ?? "").trim();
  const description = String(
    formData.get("description") ?? ""
  ).trim();
  const content = String(formData.get("content") ?? "").trim();
  const videoUrl = String(formData.get("videoUrl") ?? "").trim();

  const durationRaw = String(
    formData.get("duration") ?? ""
  ).trim();

  const duration = durationRaw
    ? Number.parseInt(durationRaw, 10)
    : null;

  if (!title) {
    return {
      success: false,
      message: "Lesson title is required.",
    };
  }

  if (
    duration !== null &&
    (Number.isNaN(duration) || duration < 1)
  ) {
    return {
      success: false,
      message: "Lesson duration must be a valid positive number.",
    };
  }

  try {
    const lesson = await prisma.lesson.findFirst({
      where: {
        id: lessonId,
        moduleId,
        module: {
          courseId,
        },
      },
      select: {
        id: true,
        title: true,
        slug: true,
      },
    });

    if (!lesson) {
      return {
        success: false,
        message: "Lesson not found.",
      };
    }

    const slug =
      title.toLowerCase() === lesson.title.toLowerCase()
        ? lesson.slug
        : await createUniqueLessonSlug(
            moduleId,
            title,
            lessonId
          );

    await prisma.lesson.update({
      where: {
        id: lessonId,
      },
      data: {
        title,
        slug,
        description: description || null,
        content: content || null,
        videoUrl: videoUrl || null,
        duration,
      },
    });

    revalidatePath(`/admin/courses/${courseId}`);

    return {
      success: true,
      message: "Lesson updated successfully.",
    };
  } catch (error) {
    console.error("UPDATE LESSON ERROR:", error);

    return {
      success: false,
      message: "Unable to update lesson.",
    };
  }
}

export async function toggleLessonPublished(
  courseId: string,
  moduleId: string,
  lessonId: string
): Promise<CourseManagementResult> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    return {
      success: false,
      message: "Unauthorized.",
    };
  }

  try {
    const lesson = await prisma.lesson.findFirst({
      where: {
        id: lessonId,
        moduleId,
        module: {
          courseId,
        },
      },
      select: {
        id: true,
        isPublished: true,
      },
    });

    if (!lesson) {
      return {
        success: false,
        message: "Lesson not found.",
      };
    }

    await prisma.lesson.update({
      where: {
        id: lessonId,
      },
      data: {
        isPublished: !lesson.isPublished,
      },
    });

    revalidatePath(`/admin/courses/${courseId}`);

    return {
      success: true,
      message: lesson.isPublished
        ? "Lesson unpublished."
        : "Lesson published.",
    };
  } catch (error) {
    console.error("TOGGLE LESSON ERROR:", error);

    return {
      success: false,
      message: "Unable to change lesson status.",
    };
  }
}

export async function deleteLesson(
  courseId: string,
  moduleId: string,
  lessonId: string
): Promise<CourseManagementResult> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    return {
      success: false,
      message: "Unauthorized.",
    };
  }

  try {
    const lesson = await prisma.lesson.findFirst({
      where: {
        id: lessonId,
        moduleId,
        module: {
          courseId,
        },
      },
      select: {
        id: true,
      },
    });

    if (!lesson) {
      return {
        success: false,
        message: "Lesson not found.",
      };
    }

    await prisma.lesson.delete({
      where: {
        id: lessonId,
      },
    });

    revalidatePath(`/admin/courses/${courseId}`);

    return {
      success: true,
      message: "Lesson deleted successfully.",
    };
  } catch (error) {
    console.error("DELETE LESSON ERROR:", error);

    return {
      success: false,
      message:
        "Unable to delete lesson. It may have student progress records.",
    };
  }
}