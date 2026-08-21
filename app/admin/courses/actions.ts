"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";

export type CourseActionResult = {
  success: boolean;
  message: string;
  courseId?: string;
};

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function uniqueSlug(title: string, excludeId?: string) {
  const baseSlug = createSlug(title) || `course-${Date.now()}`;
  let slug = baseSlug;
  let counter = 2;

  while (true) {
    const existing = await prisma.course.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
      },
    });

    if (!existing || existing.id === excludeId) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

export async function createCourse(formData: FormData): Promise<CourseActionResult> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    return {
      success: false,
      message: "Unauthorized.",
    };
  }

  const title = String(formData.get("title") ?? "").trim();
  const shortDescription = String(
    formData.get("shortDescription") ?? ""
  ).trim();

  const description = String(formData.get("description") ?? "").trim();
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const duration = String(formData.get("duration") ?? "").trim();
  const learningFormat = String(
    formData.get("learningFormat") ?? ""
  ).trim();
  const requirements = String(
    formData.get("requirements") ?? ""
  ).trim();
  const syllabus = String(formData.get("syllabus") ?? "").trim();

  const statusValue = String(formData.get("status") ?? "DRAFT");
  const featured = formData.get("featured") === "true";

  if (!title) {
    return {
      success: false,
      message: "Course title is required.",
    };
  }

  if (!shortDescription) {
    return {
      success: false,
      message: "Short description is required.",
    };
  }

  if (
    statusValue !== "ACTIVE" &&
    statusValue !== "INACTIVE" &&
    statusValue !== "DRAFT"
  ) {
    return {
      success: false,
      message: "Invalid course status.",
    };
  }

  try {
    const slug = await uniqueSlug(title);

    const course = await prisma.course.create({
      data: {
        title,
        slug,
        shortDescription,
        description: description || null,
        imageUrl: imageUrl || null,
        duration: duration || null,
        learningFormat: learningFormat || null,
        requirements: requirements || null,
        syllabus: syllabus || null,
        status: statusValue as "ACTIVE" | "INACTIVE" | "DRAFT",
        featured,
      },
    });

    revalidatePath("/admin/courses");
    revalidatePath("/courses");

    return {
      success: true,
      message: "Course created successfully.",
      courseId: course.id,
    };
  } catch (error) {
    console.error("CREATE COURSE ERROR:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to create course.",
    };
  }
}

export async function updateCourse(
  courseId: string,
  formData: FormData
): Promise<CourseActionResult> {
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
  const shortDescription = String(
    formData.get("shortDescription") ?? ""
  ).trim();

  const description = String(formData.get("description") ?? "").trim();
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const duration = String(formData.get("duration") ?? "").trim();
  const learningFormat = String(
    formData.get("learningFormat") ?? ""
  ).trim();
  const requirements = String(
    formData.get("requirements") ?? ""
  ).trim();
  const syllabus = String(formData.get("syllabus") ?? "").trim();

  const statusValue = String(formData.get("status") ?? "DRAFT");
  const featured = formData.get("featured") === "true";

  if (!title) {
    return {
      success: false,
      message: "Course title is required.",
    };
  }

  if (!shortDescription) {
    return {
      success: false,
      message: "Short description is required.",
    };
  }

  if (
    statusValue !== "ACTIVE" &&
    statusValue !== "INACTIVE" &&
    statusValue !== "DRAFT"
  ) {
    return {
      success: false,
      message: "Invalid course status.",
    };
  }

  try {
    const existing = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        id: true,
        title: true,
        slug: true,
      },
    });

    if (!existing) {
      return {
        success: false,
        message: "Course not found.",
      };
    }

    const slug =
      title.toLowerCase() === existing.title.toLowerCase()
        ? existing.slug
        : await uniqueSlug(title, courseId);

    await prisma.course.update({
      where: {
        id: courseId,
      },
      data: {
        title,
        slug,
        shortDescription,
        description: description || null,
        imageUrl: imageUrl || null,
        duration: duration || null,
        learningFormat: learningFormat || null,
        requirements: requirements || null,
        syllabus: syllabus || null,
        status: statusValue as "ACTIVE" | "INACTIVE" | "DRAFT",
        featured,
      },
    });

    revalidatePath("/admin/courses");
    revalidatePath(`/admin/courses/${courseId}`);
    revalidatePath("/courses");

    return {
      success: true,
      message: "Course updated successfully.",
      courseId,
    };
  } catch (error) {
    console.error("UPDATE COURSE ERROR:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to update course.",
    };
  }
}

export async function toggleCourseStatus(
  courseId: string
): Promise<CourseActionResult> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    return {
      success: false,
      message: "Unauthorized.",
    };
  }

  try {
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        status: true,
      },
    });

    if (!course) {
      return {
        success: false,
        message: "Course not found.",
      };
    }

    const newStatus =
      course.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    await prisma.course.update({
      where: {
        id: courseId,
      },
      data: {
        status: newStatus,
      },
    });

    revalidatePath("/admin/courses");
    revalidatePath(`/admin/courses/${courseId}`);
    revalidatePath("/courses");

    return {
      success: true,
      message:
        newStatus === "ACTIVE"
          ? "Course activated."
          : "Course deactivated.",
      courseId,
    };
  } catch (error) {
    console.error("TOGGLE COURSE STATUS ERROR:", error);

    return {
      success: false,
      message: "Unable to change course status.",
    };
  }
}

export async function toggleCourseFeatured(
  courseId: string
): Promise<CourseActionResult> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    return {
      success: false,
      message: "Unauthorized.",
    };
  }

  try {
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        featured: true,
      },
    });

    if (!course) {
      return {
        success: false,
        message: "Course not found.",
      };
    }

    await prisma.course.update({
      where: {
        id: courseId,
      },
      data: {
        featured: !course.featured,
      },
    });

    revalidatePath("/admin/courses");
    revalidatePath(`/admin/courses/${courseId}`);
    revalidatePath("/courses");

    return {
      success: true,
      message: course.featured
        ? "Course removed from featured courses."
        : "Course marked as featured.",
      courseId,
    };
  } catch (error) {
    console.error("TOGGLE COURSE FEATURED ERROR:", error);

    return {
      success: false,
      message: "Unable to update featured status.",
    };
  }
}

export async function deleteCourse(
  courseId: string
): Promise<CourseActionResult> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    return {
      success: false,
      message: "Unauthorized.",
    };
  }

  try {
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        _count: {
          select: {
            enrollments: true,
            applications: true,
            modules: true,
            tests: true,
            cohorts: true,
            liveClasses: true,
            assessments: true,
          },
        },
      },
    });

    if (!course) {
      return {
        success: false,
        message: "Course not found.",
      };
    }

    const hasRelatedRecords =
      course._count.enrollments > 0 ||
      course._count.applications > 0 ||
      course._count.modules > 0 ||
      course._count.tests > 0 ||
      course._count.cohorts > 0 ||
      course._count.liveClasses > 0 ||
      course._count.assessments > 0;

    if (hasRelatedRecords) {
      return {
        success: false,
        message:
          "This course has related records and cannot be deleted. Deactivate it instead.",
      };
    }

    await prisma.course.delete({
      where: {
        id: courseId,
      },
    });

    revalidatePath("/admin/courses");
    revalidatePath("/courses");

    return {
      success: true,
      message: "Course deleted successfully.",
    };
  } catch (error) {
    console.error("DELETE COURSE ERROR:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to delete course.",
    };
  }
}