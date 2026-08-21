import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (user.role !== "STUDENT") {
      return NextResponse.json(
        { error: "Only students can complete lessons" },
        { status: 403 }
      );
    }

    const formData = await request.formData();

    const lessonId = formData.get("lessonId");
    const courseId = formData.get("courseId");

    if (
      typeof lessonId !== "string" ||
      typeof courseId !== "string"
    ) {
      return NextResponse.json(
        { error: "Lesson ID and course ID are required" },
        { status: 400 }
      );
    }

    // Make sure the lesson exists and belongs to the course
    const lesson = await prisma.lesson.findFirst({
      where: {
        id: lessonId,
        module: {
          courseId,
        },
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: "Lesson not found" },
        { status: 404 }
      );
    }

    // Make sure the student is enrolled in the course
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: user.id,
          courseId,
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "You are not enrolled in this course" },
        { status: 403 }
      );
    }

    // Create or update lesson progress
    await prisma.lessonProgress.upsert({
      where: {
        enrollmentId_lessonId: {
          enrollmentId: enrollment.id,
          lessonId,
        },
      },
      create: {
        enrollmentId: enrollment.id,
        lessonId,
        completed: true,
        completedAt: new Date(),
      },
      update: {
        completed: true,
        completedAt: new Date(),
      },
    });

    // Get all lessons in this course
    const totalLessons = await prisma.lesson.count({
      where: {
        module: {
          courseId,
          isPublished: true,
        },
        isPublished: true,
      },
    });

    // Get completed lessons
    const completedLessons = await prisma.lessonProgress.count({
      where: {
        enrollmentId: enrollment.id,
        completed: true,
        lesson: {
          module: {
            courseId,
          },
        },
      },
    });

    // Calculate course progress
    const progress =
      totalLessons > 0
        ? Math.round(
            (completedLessons / totalLessons) * 100
          )
        : 0;

    // Mark enrollment completed when everything is finished
    const isCourseCompleted =
      totalLessons > 0 &&
      completedLessons >= totalLessons;

    await prisma.enrollment.update({
      where: {
        id: enrollment.id,
      },
      data: {
        progress,
        status: isCourseCompleted
          ? "COMPLETED"
          : "ACTIVE",
        completedAt: isCourseCompleted
          ? new Date()
          : null,
      },
    });

    return NextResponse.redirect(
      new URL(
        `/student/courses/${courseId}/lessons/${lessonId}`,
        request.url
      )
    );
  } catch (error) {
    console.error(
      "LESSON_COMPLETION_ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Something went wrong while completing the lesson",
      },
      { status: 500 }
    );
  }
}