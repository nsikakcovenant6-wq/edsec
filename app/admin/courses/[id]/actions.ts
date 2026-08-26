"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";

/* =========================================================
   HELPERS
========================================================= */

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
    const existingLesson = await prisma.lesson.findFirst({
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

    if (!existingLesson) {
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
    },
  });
}

/* =========================================================
   MODULES
========================================================= */

export async function createModule(
  courseId: string,
  formData: FormData
): Promise<void> {
  const admin = await requireRole("ADMIN");

  if (!admin || !courseId) {
    return;
  }

  const title = String(formData.get("title") ?? "").trim();

  const description = String(
    formData.get("description") ?? ""
  ).trim();

  if (!title) {
    return;
  }

  try {
    const course = await verifyCourse(courseId);

    if (!course) {
      return;
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
  } catch (error) {
    console.error("CREATE MODULE ERROR:", error);
  }
}

export async function updateModule(
  courseId: string,
  moduleId: string,
  formData: FormData
): Promise<void> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    return;
  }

  const title = String(formData.get("title") ?? "").trim();

  const description = String(
    formData.get("description") ?? ""
  ).trim();

  if (!title) {
    return;
  }

  try {
    const existingModule = await prisma.courseModule.findFirst({
      where: {
        id: moduleId,
        courseId,
      },
      select: {
        id: true,
      },
    });

    if (!existingModule) {
      return;
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
  } catch (error) {
    console.error("UPDATE MODULE ERROR:", error);
  }
}

export async function toggleModulePublished(
  courseId: string,
  moduleId: string
): Promise<void> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    return;
  }

  try {
    const existingModule = await prisma.courseModule.findFirst({
      where: {
        id: moduleId,
        courseId,
      },
      select: {
        id: true,
        isPublished: true,
      },
    });

    if (!existingModule) {
      return;
    }

    await prisma.courseModule.update({
      where: {
        id: moduleId,
      },
      data: {
        isPublished: !existingModule.isPublished,
      },
    });

    revalidatePath(`/admin/courses/${courseId}`);
  } catch (error) {
    console.error("TOGGLE MODULE ERROR:", error);
  }
}

export async function deleteModule(
  courseId: string,
  moduleId: string
): Promise<void> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    return;
  }

  try {
    const existingModule = await prisma.courseModule.findFirst({
      where: {
        id: moduleId,
        courseId,
      },
      select: {
        id: true,
      },
    });

    if (!existingModule) {
      return;
    }

    await prisma.courseModule.delete({
      where: {
        id: moduleId,
      },
    });

    revalidatePath(`/admin/courses/${courseId}`);
  } catch (error) {
    console.error("DELETE MODULE ERROR:", error);
  }
}

/* =========================================================
   MODULE ORDERING
========================================================= */

export async function moveModuleUp(
  courseId: string,
  moduleId: string
): Promise<void> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    return;
  }

  try {
    const currentModule = await prisma.courseModule.findFirst({
      where: {
        id: moduleId,
        courseId,
      },
      select: {
        id: true,
        displayOrder: true,
      },
    });

    if (!currentModule) {
      return;
    }

    const previousModule = await prisma.courseModule.findFirst({
      where: {
        courseId,
        displayOrder: {
          lt: currentModule.displayOrder,
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

    if (!previousModule) {
      return;
    }

    await prisma.$transaction([
      prisma.courseModule.update({
        where: {
          id: currentModule.id,
        },
        data: {
          displayOrder: previousModule.displayOrder,
        },
      }),

      prisma.courseModule.update({
        where: {
          id: previousModule.id,
        },
        data: {
          displayOrder: currentModule.displayOrder,
        },
      }),
    ]);

    revalidatePath(`/admin/courses/${courseId}`);
  } catch (error) {
    console.error("MOVE MODULE UP ERROR:", error);
  }
}

export async function moveModuleDown(
  courseId: string,
  moduleId: string
): Promise<void> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    return;
  }

  try {
    const currentModule = await prisma.courseModule.findFirst({
      where: {
        id: moduleId,
        courseId,
      },
      select: {
        id: true,
        displayOrder: true,
      },
    });

    if (!currentModule) {
      return;
    }

    const nextModule = await prisma.courseModule.findFirst({
      where: {
        courseId,
        displayOrder: {
          gt: currentModule.displayOrder,
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

    if (!nextModule) {
      return;
    }

    await prisma.$transaction([
      prisma.courseModule.update({
        where: {
          id: currentModule.id,
        },
        data: {
          displayOrder: nextModule.displayOrder,
        },
      }),

      prisma.courseModule.update({
        where: {
          id: nextModule.id,
        },
        data: {
          displayOrder: currentModule.displayOrder,
        },
      }),
    ]);

    revalidatePath(`/admin/courses/${courseId}`);
  } catch (error) {
    console.error("MOVE MODULE DOWN ERROR:", error);
  }
}

/* =========================================================
   LESSONS
========================================================= */

export async function createLesson(
  courseId: string,
  moduleId: string,
  formData: FormData
): Promise<void> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    return;
  }

  const title = String(formData.get("title") ?? "").trim();

  const description = String(
    formData.get("description") ?? ""
  ).trim();

  const content = String(
    formData.get("content") ?? ""
  ).trim();

  const videoUrl = String(
    formData.get("videoUrl") ?? ""
  ).trim();

  const durationRaw = String(
    formData.get("duration") ?? ""
  ).trim();

  const parsedDuration = durationRaw
    ? Number(durationRaw)
    : null;

  const duration =
    parsedDuration !== null &&
    Number.isInteger(parsedDuration) &&
    parsedDuration >= 1
      ? parsedDuration
      : null;

  if (!title) {
    return;
  }

  if (durationRaw && duration === null) {
    return;
  }

  try {
    const existingModule = await prisma.courseModule.findFirst({
      where: {
        id: moduleId,
        courseId,
      },
      select: {
        id: true,
      },
    });

    if (!existingModule) {
      return;
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
  } catch (error) {
    console.error("CREATE LESSON ERROR:", error);
  }
}

export async function updateLesson(
  courseId: string,
  moduleId: string,
  lessonId: string,
  formData: FormData
): Promise<void> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    return;
  }

  const title = String(formData.get("title") ?? "").trim();

  const description = String(
    formData.get("description") ?? ""
  ).trim();

  const content = String(
    formData.get("content") ?? ""
  ).trim();

  const videoUrl = String(
    formData.get("videoUrl") ?? ""
  ).trim();

  const durationRaw = String(
    formData.get("duration") ?? ""
  ).trim();

  const parsedDuration = durationRaw
    ? Number(durationRaw)
    : null;

  const duration =
    parsedDuration !== null &&
    Number.isInteger(parsedDuration) &&
    parsedDuration >= 1
      ? parsedDuration
      : null;

  if (!title) {
    return;
  }

  if (durationRaw && duration === null) {
    return;
  }

  try {
    const existingLesson = await prisma.lesson.findFirst({
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

    if (!existingLesson) {
      return;
    }

    const slug =
      title.toLowerCase() ===
      existingLesson.title.toLowerCase()
        ? existingLesson.slug
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
  } catch (error) {
    console.error("UPDATE LESSON ERROR:", error);
  }
}

export async function toggleLessonPublished(
  courseId: string,
  moduleId: string,
  lessonId: string
): Promise<void> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    return;
  }

  try {
    const existingLesson = await prisma.lesson.findFirst({
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

    if (!existingLesson) {
      return;
    }

    await prisma.lesson.update({
      where: {
        id: lessonId,
      },
      data: {
        isPublished: !existingLesson.isPublished,
      },
    });

    revalidatePath(`/admin/courses/${courseId}`);
  } catch (error) {
    console.error("TOGGLE LESSON ERROR:", error);
  }
}

export async function deleteLesson(
  courseId: string,
  moduleId: string,
  lessonId: string
): Promise<void> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    return;
  }

  try {
    const existingLesson = await prisma.lesson.findFirst({
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

    if (!existingLesson) {
      return;
    }

    await prisma.lesson.delete({
      where: {
        id: lessonId,
      },
    });

    revalidatePath(`/admin/courses/${courseId}`);
  } catch (error) {
    console.error("DELETE LESSON ERROR:", error);
  }
}

/* =========================================================
   LESSON ORDERING
========================================================= */

export async function moveLessonUp(
  courseId: string,
  moduleId: string,
  lessonId: string
): Promise<void> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    return;
  }

  try {
    const currentLesson = await prisma.lesson.findFirst({
      where: {
        id: lessonId,
        moduleId,
        module: {
          courseId,
        },
      },
      select: {
        id: true,
        displayOrder: true,
      },
    });

    if (!currentLesson) {
      return;
    }

    const previousLesson = await prisma.lesson.findFirst({
      where: {
        moduleId,
        displayOrder: {
          lt: currentLesson.displayOrder,
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
      return;
    }

    await prisma.$transaction([
      prisma.lesson.update({
        where: {
          id: currentLesson.id,
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
          displayOrder: currentLesson.displayOrder,
        },
      }),
    ]);

    revalidatePath(`/admin/courses/${courseId}`);
  } catch (error) {
    console.error("MOVE LESSON UP ERROR:", error);
  }
}

export async function moveLessonDown(
  courseId: string,
  moduleId: string,
  lessonId: string
): Promise<void> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    return;
  }

  try {
    const currentLesson = await prisma.lesson.findFirst({
      where: {
        id: lessonId,
        moduleId,
        module: {
          courseId,
        },
      },
      select: {
        id: true,
        displayOrder: true,
      },
    });

    if (!currentLesson) {
      return;
    }

    const nextLesson = await prisma.lesson.findFirst({
      where: {
        moduleId,
        displayOrder: {
          gt: currentLesson.displayOrder,
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
      return;
    }

    await prisma.$transaction([
      prisma.lesson.update({
        where: {
          id: currentLesson.id,
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
          displayOrder: currentLesson.displayOrder,
        },
      }),
    ]);

    revalidatePath(`/admin/courses/${courseId}`);
  } catch (error) {
    console.error("MOVE LESSON DOWN ERROR:", error);
  }
}