import { NextResponse } from "next/server";

import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "You must be logged in to request enrollment.",
        },
        { status: 401 },
      );
    }

    if (user.role !== "STUDENT") {
      return NextResponse.json(
        {
          error: "Only students can request course enrollment.",
        },
        { status: 403 },
      );
    }

    const body = await request.json();

    const courseId =
      typeof body.courseId === "string"
        ? body.courseId.trim()
        : "";

    if (!courseId) {
      return NextResponse.json(
        {
          error: "Course ID is required.",
        },
        { status: 400 },
      );
    }

    /*
     * Only ACTIVE courses can receive enrollment requests.
     */
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        status: "ACTIVE",
      },
      select: {
        id: true,
        title: true,
      },
    });

    if (!course) {
      return NextResponse.json(
        {
          error: "This course is not currently available for enrollment.",
        },
        { status: 404 },
      );
    }

    /*
     * If the student is already enrolled, there is no reason
     * to create another application.
     */
    const existingEnrollment =
      await prisma.enrollment.findUnique({
        where: {
          studentId_courseId: {
            studentId: user.id,
            courseId: course.id,
          },
        },
        select: {
          id: true,
          status: true,
        },
      });

    if (existingEnrollment) {
      return NextResponse.json(
        {
          error: "You are already enrolled in this course.",
          status: existingEnrollment.status,
        },
        { status: 409 },
      );
    }

    /*
     * Check whether the student already has an application
     * waiting for admin approval.
     */
    const existingApplication =
      await prisma.application.findFirst({
        where: {
          applicantId: user.id,
          courseId: course.id,
          status: "PENDING",
        },
        select: {
          id: true,
          status: true,
        },
      });

    if (existingApplication) {
      return NextResponse.json(
        {
          error:
            "Your enrollment request is already awaiting admin approval.",
          status: existingApplication.status,
          applicationId: existingApplication.id,
        },
        { status: 409 },
      );
    }

    /*
     * Create the enrollment request as an Application.
     *
     * IMPORTANT:
     * Enrollment itself is created only after an admin
     * approves this application.
     */
    const application = await prisma.application.create({
      data: {
        applicantId: user.id,
        fullName:
          `${user.firstName} ${user.lastName}`.trim(),
        email: user.email,
        phone: user.phone ?? "",
        courseId: course.id,
        status: "PENDING",
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    /*
     * Record the student's activity.
     */
    await prisma.studentActivity.create({
      data: {
        studentId: user.id,
        type: "COURSE_ENROLLED",
        title: "Course enrollment requested",
        description: `Enrollment request submitted for ${course.title}.`,
        metadata: JSON.stringify({
          applicationId: application.id,
          courseId: course.id,
        }),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Your enrollment request has been submitted. Please wait for admin approval.",
        application,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "Student enrollment request error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while submitting your enrollment request.",
      },
      { status: 500 },
    );
  }
}