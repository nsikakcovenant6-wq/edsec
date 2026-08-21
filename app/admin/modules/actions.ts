/* eslint-disable @next/next/no-assign-module-variable */
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";

export type ModuleActionResult = {
  success: boolean;
  message: string;
  moduleId?: string;
};

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

async function verifyModule(moduleId: string) {
  return prisma.courseModule.findUnique({
    where: {
      id: moduleId,
    },
    select: {
      id: true,
      courseId: true,
      title: true,
      isPublished: true,
      displayOrder: true,
    },
  });
}

export async function createModule(
  formData: FormData
): Promise<ModuleActionResult> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    return {
      success: false,
      message: "Unauthorized.",
    };
  }

  const courseId = String(
    formData.get("courseId") ?? ""
  ).trim();

  const title = String(
    formData.get("title") ?? ""
  ).trim();

  const description = String(
    formData.get("description") ?? ""
  ).trim();

  if (!courseId) {
    return {
      success: false,
      message: "Course is required.",
    };
  }

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

    const module = await prisma.courseModule.create({
      data: {
        courseId,
        title,
        description: description || null,
        displayOrder:
          (lastModule?.displayOrder ?? 0) + 1,
        isPublished: false,
      },
      select: {
        id: true,
      },
    });

    revalidatePath("/admin/modules");
    revalidatePath(`/admin/courses/${courseId}`);
    revalidatePath(`/admin/courses/${courseId}/modules`);

    return {
      success: true,
      message: "Module created successfully.",
      moduleId: module.id,
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
  moduleId: string,
  formData: FormData
): Promise<ModuleActionResult> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    return {
      success: false,
      message: "Unauthorized.",
    };
  }

  if (!moduleId) {
    return {
      success: false,
      message: "Module ID is required.",
    };
  }

  const title = String(
    formData.get("title") ?? ""
  ).trim();

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
    const existing = await verifyModule(moduleId);

    if (!existing) {
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

    revalidatePath("/admin/modules");
    revalidatePath(
      `/admin/courses/${existing.courseId}`
    );
    revalidatePath(
      `/admin/courses/${existing.courseId}/modules`
    );
    revalidatePath(`/admin/modules/${moduleId}`);

    return {
      success: true,
      message: "Module updated successfully.",
      moduleId,
    };
  } catch (error) {
    console.error("UPDATE MODULE ERROR:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to update module.",
    };
  }
}

export async function toggleModulePublished(
  moduleId: string
): Promise<ModuleActionResult> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    return {
      success: false,
      message: "Unauthorized.",
    };
  }

  if (!moduleId) {
    return {
      success: false,
      message: "Module ID is required.",
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

    const newPublishedState = !module.isPublished;

    await prisma.courseModule.update({
      where: {
        id: moduleId,
      },
      data: {
        isPublished: newPublishedState,
      },
    });

    revalidatePath("/admin/modules");
    revalidatePath(
      `/admin/courses/${module.courseId}`
    );
    revalidatePath(
      `/admin/courses/${module.courseId}/modules`
    );
    revalidatePath(`/admin/modules/${moduleId}`);

    return {
      success: true,
      message: newPublishedState
        ? "Module published successfully."
        : "Module unpublished successfully.",
      moduleId,
    };
  } catch (error) {
    console.error(
      "TOGGLE MODULE PUBLISHED ERROR:",
      error
    );

    return {
      success: false,
      message: "Unable to change module status.",
    };
  }
}

export async function deleteModule(
  moduleId: string
): Promise<ModuleActionResult> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    return {
      success: false,
      message: "Unauthorized.",
    };
  }

  if (!moduleId) {
    return {
      success: false,
      message: "Module ID is required.",
    };
  }

  try {
    const module = await prisma.courseModule.findUnique({
      where: {
        id: moduleId,
      },
      select: {
        id: true,
        courseId: true,
        title: true,
        _count: {
          select: {
            lessons: true,
          },
        },
      },
    });

    if (!module) {
      return {
        success: false,
        message: "Module not found.",
      };
    }

    /*
     * Lessons use onDelete: Cascade in the Prisma schema.
     * Therefore deleting a module also deletes its lessons.
     *
     * We intentionally prevent accidental deletion when
     * lessons exist. The administrator should explicitly
     * remove the lessons first.
     */
    if (module._count.lessons > 0) {
      return {
        success: false,
        message:
          "This module contains lessons and cannot be deleted. Delete its lessons first.",
      };
    }

    await prisma.courseModule.delete({
      where: {
        id: moduleId,
      },
    });

    revalidatePath("/admin/modules");
    revalidatePath(
      `/admin/courses/${module.courseId}`
    );
    revalidatePath(
      `/admin/courses/${module.courseId}/modules`
    );

    return {
      success: true,
      message: "Module deleted successfully.",
      moduleId,
    };
  } catch (error) {
    console.error("DELETE MODULE ERROR:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to delete module.",
    };
  }
}

export async function moveModuleUp(
  moduleId: string
): Promise<ModuleActionResult> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    return {
      success: false,
      message: "Unauthorized.",
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

    const previousModule =
      await prisma.courseModule.findFirst({
        where: {
          courseId: module.courseId,
          displayOrder: {
            lt: module.displayOrder,
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
      return {
        success: false,
        message: "Module is already at the top.",
        moduleId,
      };
    }

    await prisma.$transaction([
      prisma.courseModule.update({
        where: {
          id: module.id,
        },
        data: {
          displayOrder:
            previousModule.displayOrder,
        },
      }),
      prisma.courseModule.update({
        where: {
          id: previousModule.id,
        },
        data: {
          displayOrder: module.displayOrder,
        },
      }),
    ]);

    revalidatePath("/admin/modules");
    revalidatePath(
      `/admin/courses/${module.courseId}`
    );
    revalidatePath(
      `/admin/courses/${module.courseId}/modules`
    );

    return {
      success: true,
      message: "Module moved up.",
      moduleId,
    };
  } catch (error) {
    console.error("MOVE MODULE UP ERROR:", error);

    return {
      success: false,
      message: "Unable to move module up.",
    };
  }
}

export async function moveModuleDown(
  moduleId: string
): Promise<ModuleActionResult> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    return {
      success: false,
      message: "Unauthorized.",
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

    const nextModule =
      await prisma.courseModule.findFirst({
        where: {
          courseId: module.courseId,
          displayOrder: {
            gt: module.displayOrder,
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
      return {
        success: false,
        message: "Module is already at the bottom.",
        moduleId,
      };
    }

    await prisma.$transaction([
      prisma.courseModule.update({
        where: {
          id: module.id,
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
          displayOrder: module.displayOrder,
        },
      }),
    ]);

    revalidatePath("/admin/modules");
    revalidatePath(
      `/admin/courses/${module.courseId}`
    );
    revalidatePath(
      `/admin/courses/${module.courseId}/modules`
    );

    return {
      success: true,
      message: "Module moved down.",
      moduleId,
    };
  } catch (error) {
    console.error("MOVE MODULE DOWN ERROR:", error);

    return {
      success: false,
      message: "Unable to move module down.",
    };
  }
}