"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";

export type LessonActionResult = {
  success: boolean;
  message: string;
  lessonId?: string;
};

async function verifyLesson(lessonId: string) {
  return prisma.lesson.findUnique({
    where: {
      id: lessonId,
    },
    select: {
      id: true,
      moduleId: true,
      title: true,
      slug: true,
      description: true,
      content: true,
      videoUrl: true,
      duration: true,
      displayOrder: true,
      isPublished: true,
      module: {
        select: {
          id: true,
          title: true,
          courseId: true,
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
      },
    },
  });
}

async function createUniqueLessonSlug(
  moduleId: string,
  title: string,
  excludeId?: string
) {
  const baseSlug =
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-") ||
    `lesson-${Date.now()}`;

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

function getDuration(formData: FormData): {
  value: number | null;
  error?: string;
} {
  const raw = String(formData.get("duration") ?? "").trim();

  if (!raw) {
    return {
      value: null,
    };
  }

  const value = Number.parseInt(raw, 10);

  if (!Number.isInteger(value) || value < 1) {
    return {
      value: null,
      error: "Lesson duration must be a valid positive number.",
    };
  }

  return {
    value,
  };
}

export async function updateLesson(
  lessonId: string,
  formData: FormData
): Promise<LessonActionResult> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    return {
      success: false,
      message: "Unauthorized.",
    };
  }

  if (!lessonId) {
    return {
      success: false,
      message: "Lesson ID is required.",
    };
  }

  const title = String(formData.get("title") ?? "").trim();
  const description = String(
    formData.get("description") ?? ""
  ).trim();
  const content = String(formData.get("content") ?? "").trim();
  const videoUrl = String(formData.get("videoUrl") ?? "").trim();

  const durationResult = getDuration(formData);

  if (!title) {
    return {
      success: false,
      message: "Lesson title is required.",
    };
  }

  if (durationResult.error) {
    return {
      success: false,
      message: durationResult.error,
    };
  }

  try {
    const existing = await verifyLesson(lessonId);

    if (!existing) {
      return {
        success: false,
        message: "Lesson not found.",
      };
    }

    const slug =
      title.toLowerCase() === existing.title.toLowerCase()
        ? existing.slug
        : await createUniqueLessonSlug(
            existing.moduleId,
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
        duration: durationResult.value,
      },
    });

    revalidateLessonPaths(existing);

    return {
      success: true,
      message: "Lesson updated successfully.",
      lessonId,
    };
  } catch (error) {
    console.error("UPDATE LESSON ERROR:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to update lesson.",
    };
  }
}

export async function toggleLessonPublished(
  lessonId: string
): Promise<LessonActionResult> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    return {
      success: false,
      message: "Unauthorized.",
    };
  }

  try {
    const lesson = await verifyLesson(lessonId);

    if (!lesson) {
      return {
        success: false,
        message: "Lesson not found.",
      };
    }

    const newPublishedState = !lesson.isPublished;

    await prisma.lesson.update({
      where: {
        id: lessonId,
      },
      data: {
        isPublished: newPublishedState,
      },
    });

    revalidateLessonPaths(lesson);

    return {
      success: true,
      message: newPublishedState
        ? "Lesson published successfully."
        : "Lesson unpublished successfully.",
      lessonId,
    };
  } catch (error) {
    console.error(
      "TOGGLE LESSON PUBLISHED ERROR:",
      error
    );

    return {
      success: false,
      message: "Unable to change lesson status.",
    };
  }
}

export async function deleteLesson(
  lessonId: string
): Promise<LessonActionResult> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    return {
      success: false,
      message: "Unauthorized.",
    };
  }

  if (!lessonId) {
    return {
      success: false,
      message: "Lesson ID is required.",
    };
  }

  try {
    const lesson = await verifyLesson(lessonId);

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

    revalidateLessonPaths(lesson);

    return {
      success: true,
      message: "Lesson deleted successfully.",
      lessonId,
    };
  } catch (error) {
    console.error("DELETE LESSON ERROR:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to delete lesson. It may have related student progress records.",
    };
  }
}

export async function moveLessonUp(
  lessonId: string
): Promise<LessonActionResult> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    return {
      success: false,
      message: "Unauthorized.",
    };
  }

  try {
    const lesson = await verifyLesson(lessonId);

    if (!lesson) {
      return {
        success: false,
        message: "Lesson not found.",
      };
    }

    const previousLesson =
      await prisma.lesson.findFirst({
        where: {
          moduleId: lesson.moduleId,
          displayOrder: {
            lt: lesson.displayOrder,
          },
        },
        orderBy: {
          displayOrder: "desc",
        },
        select: {
          id: true,
          displayOrder: true,
        },
      });

    if (!previousLesson) {
      return {
        success: false,
        message: "Lesson is already at the top.",
        lessonId,
      };
    }

    await prisma.$transaction([
      prisma.lesson.update({
        where: {
          id: lesson.id,
        },
        data: {
          displayOrder: previousLesson.displayOrder,
        },
      }),
      prisma.lesson.update({
        where: {
          id: previousLesson.id,
        },
        data: {
          displayOrder: lesson.displayOrder,
        },
      }),
    ]);

    revalidateLessonPaths(lesson);

    return {
      success: true,
      message: "Lesson moved up.",
      lessonId,
    };
  } catch (error) {
    console.error("MOVE LESSON UP ERROR:", error);

    return {
      success: false,
      message: "Unable to move lesson up.",
    };
  }
}

export async function moveLessonDown(
  lessonId: string
): Promise<LessonActionResult> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    return {
      success: false,
      message: "Unauthorized.",
    };
  }

  try {
    const lesson = await verifyLesson(lessonId);

    if (!lesson) {
      return {
        success: false,
        message: "Lesson not found.",
      };
    }

    const nextLesson =
      await prisma.lesson.findFirst({
        where: {
          moduleId: lesson.moduleId,
          displayOrder: {
            gt: lesson.displayOrder,
          },
        },
        orderBy: {
          displayOrder: "asc",
        },
        select: {
          id: true,
          displayOrder: true,
        },
      });

    if (!nextLesson) {
      return {
        success: false,
        message: "Lesson is already at the bottom.",
        lessonId,
      };
    }

    await prisma.$transaction([
      prisma.lesson.update({
        where: {
          id: lesson.id,
        },
        data: {
          displayOrder: nextLesson.displayOrder,
        },
      }),
      prisma.lesson.update({
        where: {
          id: nextLesson.id,
        },
        data: {
          displayOrder: lesson.displayOrder,
        },
      }),
    ]);

    revalidateLessonPaths(lesson);

    return {
      success: true,
      message: "Lesson moved down.",
      lessonId,
    };
  } catch (error) {
    console.error("MOVE LESSON DOWN ERROR:", error);

    return {
      success: false,
      message: "Unable to move lesson down.",
    };
  }
}

function revalidateLessonPaths(lesson: {
  id: string;
  moduleId: string;
  module: {
    courseId: string;
  };
}) {
  revalidatePath("/admin/lessons");
  revalidatePath(`/admin/lessons/${lesson.id}`);
  revalidatePath(`/admin/modules/${lesson.moduleId}`);
  revalidatePath(
    `/admin/courses/${lesson.module.courseId}`
  );
  revalidatePath(
    `/admin/courses/${lesson.module.courseId}/modules`
  );
}