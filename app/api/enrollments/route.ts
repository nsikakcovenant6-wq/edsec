import { NextResponse } from "next/server";

import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          message: "You must be logged in.",
        },
        { status: 401 },
      );
    }

    if (user.role !== "STUDENT") {
      return NextResponse.json(
        {
          message:
            "Only students can enroll in courses.",
        },
        { status: 403 },
      );
    }

    const body = await request.json();

    const courseId =
      typeof body.courseId === "string"
        ? body.courseId
        : "";

    if (!courseId) {
      return NextResponse.json(
        {
          message: "Course is required.",
        },
        { status: 400 },
      );
    }

    const course =
      await prisma.course.findUnique({
        where: {
          id: courseId,
        },
      });

    if (!course) {
      return NextResponse.json(
        {
          message: "Course not found.",
        },
        { status: 404 },
      );
    }

    if (course.status !== "ACTIVE") {
      return NextResponse.json(
        {
          message:
            "This course is not currently available for enrollment.",
        },
        { status: 400 },
      );
    }

    const existing =
      await prisma.enrollment.findUnique({
        where: {
          studentId_courseId: {
            studentId: user.id,
            courseId: course.id,
          },
        },
      });

    if (existing) {
      return NextResponse.json(
        {
          success: true,
          message:
            "You are already enrolled in this course.",
          enrollment: existing,
        },
      );
    }

    const enrollment =
      await prisma.enrollment.create({
        data: {
          studentId: user.id,
          courseId: course.id,
          status: "ACTIVE",
          progress: 0,
        },
        include: {
          course: true,
        },
      });

    await prisma.studentActivity.create({
      data: {
        studentId: user.id,
        enrollmentId: enrollment.id,
        type: "COURSE_ENROLLED",
        title: `Enrolled in ${course.title}`,
        description:
          "Student enrolled in an EDSEC course.",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "You have successfully enrolled in the course.",
        enrollment,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "ENROLLMENT_ERROR:",
      error,
    );

    return NextResponse.json(
      {
        message:
          "Unable to enroll in this course.",
      },
      { status: 500 },
    );
  }
}