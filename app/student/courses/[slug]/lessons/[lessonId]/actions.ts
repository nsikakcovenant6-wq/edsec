"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export async function completeLesson(
  enrollmentId: string,
  lessonId: string,
  courseId: string,
) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  if (user.role !== "STUDENT") {
    throw new Error("FORBIDDEN");
  }

  const enrollment = await prisma.enrollment.findFirst({
    where: {
      id: enrollmentId,
      studentId: user.id,
      courseId,
    },
  });

  if (!enrollment) {
    throw new Error("Enrollment not found");
  }

  const lesson = await prisma.lesson.findFirst({
    where: {
      id: lessonId,
      isPublished: true,
      module: {
        courseId,
        isPublished: true,
      },
    },
    include: {
      module: {
        select: {
          course: {
            select: {
              slug: true,
            },
          },
        },
      },
    },
  });

  if (!lesson) {
    throw new Error("Lesson not found");
  }

  await prisma.lessonProgress.upsert({
    where: {
      enrollmentId_lessonId: {
        enrollmentId,
        lessonId,
      },
    },
    create: {
      enrollmentId,
      lessonId,
      completed: true,
      completedAt: new Date(),
    },
    update: {
      completed: true,
      completedAt: new Date(),
    },
  });

  const totalLessons = await prisma.lesson.count({
    where: {
      isPublished: true,
      module: {
        courseId,
        isPublished: true,
      },
    },
  });

  const completedLessons =
    await prisma.lessonProgress.count({
      where: {
        enrollmentId,
        completed: true,
        lesson: {
          isPublished: true,
          module: {
            courseId,
            isPublished: true,
          },
        },
      },
    });

  const progress =
    totalLessons > 0
      ? Math.round(
          (completedLessons / totalLessons) * 100,
        )
      : 0;

  const completed =
    totalLessons > 0 &&
    completedLessons >= totalLessons;

  await prisma.enrollment.update({
    where: {
      id: enrollmentId,
    },
    data: {
      progress,
      status: completed
        ? "COMPLETED"
        : enrollment.status === "COMPLETED"
          ? "ACTIVE"
          : enrollment.status,
      completedAt: completed
        ? new Date()
        : null,
    },
  });

  await prisma.studentActivity.create({
    data: {
      studentId: user.id,
      enrollmentId,
      type: "LESSON_COMPLETED",
      title: `Completed lesson: ${lesson.title}`,
      description: "Lesson completed successfully.",
      metadata: JSON.stringify({
        lessonId,
        courseId,
        progress,
      }),
    },
  });

  const slug =
    lesson.module.course.slug;

  revalidatePath(
    `/student/courses/${slug}`,
  );

  revalidatePath(
    `/student/courses/${slug}/lessons/${lessonId}`,
  );

  revalidatePath(
    "/student/courses",
  );

  revalidatePath(
    "/student/dashboard",
  );
}