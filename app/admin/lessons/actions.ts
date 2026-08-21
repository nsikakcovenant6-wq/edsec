/* eslint-disable @next/next/no-assign-module-variable */
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";

export type LessonActionResult = {
  success: boolean;
  message: string;
  lessonId?: string;
};

async function verifyModule(moduleId: string) {
  return prisma.courseModule.findUnique({
    where: {
      id: moduleId,
    },
    select: {
      id: true,
      courseId: true,
      title: true,
    },
  });
}

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
          courseId: true,
        },
      },
    },
  });
}

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
  const baseSlug =
    slugify(title) || `lesson-${Date.now()}`;

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

function getDuration(formData: FormData) {
  const raw = String(
    formData.get("duration") ?? ""
  ).trim();

  if (!raw) {
    return {
      value: null,
      error: null,
    };
  }

  const value = Number.parseInt(raw, 10);

  if (Number.isNaN(value) || value < 1) {
    return {
      value: null,
      error: "Lesson duration must be a valid positive number.",
    };
  }

  return {
    value,
    error: null,
  };
}

export async function createLesson(
  formData: FormData
): Promise<LessonActionResult> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    return {
      success: false,
      message: "Unauthorized.",
    };
  }

  const moduleId = String(
    formData.get("moduleId") ?? ""
  ).trim();

  const title = String(
    formData.get("title") ?? ""
  ).trim();

  const description = String(
    formData.get("description") ?? ""
  ).trim();

  const content = String(
    formData.get("content") ?? ""
  ).trim();

  const videoUrl = String(
    formData.get("videoUrl") ?? ""
  ).trim();

  if (!moduleId) {
    return {
      success: false,
      message: "Module is required.",
    };
  }

  if (!title) {
    return {
      success: false,
      message: "Lesson title is required.",
    };
  }

  const duration = getDuration(formData);

  if (duration.error) {
    return {
      success: false,
      message: duration.error,
    };
  }

  try {
    const module = await verifyModule(moduleId);

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

    const lesson = await prisma.lesson.create({
      data: {
        moduleId,
        title,
        slug,
        description: description || null,
        content: content || null,
        videoUrl: videoUrl || null,
        duration: duration.value,
        displayOrder:
          (lastLesson?.displayOrder ?? 0) + 1,
        isPublished: false,
      },
      select: {
        id: true,
      },
    });

    revalidatePath("/admin/lessons");
    revalidatePath(
      `/admin/modules/${moduleId}`
    );
    revalidatePath(
      `/admin/courses/${module.courseId}`
    );

    return {
      success: true,
      message: "Lesson created successfully.",
      lessonId: lesson.id,
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

  const title = String(
    formData.get("title") ?? ""
  ).trim();

  const description = String(
    formData.get("description") ?? ""
  ).trim();

  const content = String(
    formData.get("content") ?? ""
  ).trim();

  const videoUrl = String(
    formData.get("videoUrl") ?? ""
  ).trim();

  if (!title) {
    return {
      success: false,
      message: "Lesson title is required.",
    };
  }

  const duration = getDuration(formData);

  if (duration.error) {
    return {
      success: false,
      message: duration.error,
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
      title.toLowerCase() ===
      existing.title.toLowerCase()
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
        duration: duration.value,
      },
    });

    revalidatePath("/admin/lessons");
    revalidatePath(
      `/admin/lessons/${lessonId}`
    );
    revalidatePath(
      `/admin/modules/${existing.moduleId}`
    );
    revalidatePath(
      `/admin/courses/${existing.module.courseId}`
    );

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

    const newPublishedState =
      !lesson.isPublished;

    await prisma.lesson.update({
      where: {
        id: lessonId,
      },
      data: {
        isPublished: newPublishedState,
      },
    });

    revalidatePath("/admin/lessons");
    revalidatePath(
      `/admin/lessons/${lessonId}`
    );
    revalidatePath(
      `/admin/modules/${lesson.moduleId}`
    );
    revalidatePath(
      `/admin/courses/${lesson.module.courseId}`
    );

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

    revalidatePath("/admin/lessons");
    revalidatePath(
      `/admin/modules/${lesson.moduleId}`
    );
    revalidatePath(
      `/admin/courses/${lesson.module.courseId}`
    );

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
          : "Unable to delete lesson.",
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
          displayOrder:
            previousLesson.displayOrder,
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

    revalidatePath("/admin/lessons");
    revalidatePath(
      `/admin/modules/${lesson.moduleId}`
    );
    revalidatePath(
      `/admin/courses/${lesson.module.courseId}`
    );

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

    revalidatePath("/admin/lessons");
    revalidatePath(
      `/admin/modules/${lesson.moduleId}`
    );
    revalidatePath(
      `/admin/courses/${lesson.module.courseId}`
    );

    return {
      success: true,
      message: "Lesson moved down.",
      lessonId,
    };
  } catch (error) {
    console.error(
      "MOVE LESSON DOWN ERROR:",
      error
    );

    return {
      success: false,
      message: "Unable to move lesson down.",
    };
  }
}