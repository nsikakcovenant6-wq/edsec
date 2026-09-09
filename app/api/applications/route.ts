import { NextResponse } from "next/server";

import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

function parseDate(value: unknown) {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const user = await getCurrentUser();

    const fullName =
      typeof body.fullName === "string"
        ? body.fullName.trim()
        : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const phone =
      typeof body.phone === "string"
        ? body.phone.trim()
        : "";

    const courseId =
      typeof body.courseId === "string"
        ? body.courseId.trim()
        : "";

    const dateOfBirth =
      typeof body.dateOfBirth === "string"
        ? body.dateOfBirth.trim()
        : "";

    const educationalLevel =
      typeof body.educationalLevel === "string"
        ? body.educationalLevel.trim()
        : "";

    const preferredFormat =
      typeof body.preferredFormat === "string"
        ? body.preferredFormat.trim()
        : "";

    const preferredStartDate =
      typeof body.preferredStartDate === "string"
        ? body.preferredStartDate.trim()
        : "";

    const additionalInfo =
      typeof body.additionalInfo === "string"
        ? body.additionalInfo.trim()
        : "";

    if (!fullName) {
      return NextResponse.json(
        {
          success: false,
          message: "Full name is required.",
        },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email address is required.",
        },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    if (!phone) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone number is required.",
        },
        { status: 400 }
      );
    }

    if (!courseId) {
      return NextResponse.json(
        {
          success: false,
          message: "Please select a course.",
        },
        { status: 400 }
      );
    }

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
      },
    });

    if (!course) {
      console.error("APPLICATION_COURSE_NOT_FOUND", {
        courseId,
      });

      return NextResponse.json(
        {
          success: false,
          message:
            "The selected course could not be found. Please refresh the page and select the course again.",
        },
        { status: 400 }
      );
    }

    if (course.status !== "ACTIVE") {
      console.error("APPLICATION_COURSE_NOT_ACTIVE", {
        courseId: course.id,
        courseTitle: course.title,
        status: course.status,
      });

      return NextResponse.json(
        {
          success: false,
          message:
            "This course is currently unavailable for applications. Please select another course.",
        },
        { status: 400 }
      );
    }

    const parsedDateOfBirth = parseDate(dateOfBirth);
    const parsedPreferredStartDate = parseDate(preferredStartDate);

    if (dateOfBirth && !parsedDateOfBirth) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid date of birth.",
        },
        { status: 400 }
      );
    }

    if (preferredStartDate && !parsedPreferredStartDate) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid preferred start date.",
        },
        { status: 400 }
      );
    }

    const application = await prisma.application.create({
      data: {
        applicantId: user?.id ?? null,

        fullName,
        email,
        phone,

        courseId: course.id,

        dateOfBirth: parsedDateOfBirth,
        educationalLevel: educationalLevel || null,
        preferredFormat: preferredFormat || null,
        preferredStartDate: parsedPreferredStartDate,
        additionalInfo: additionalInfo || null,

        status: "PENDING",
      },

      include: {
        course: true,
      },
    });

    console.log("APPLICATION_CREATED", {
      id: application.id,
      fullName: application.fullName,
      email: application.email,
      phone: application.phone,
      courseId: application.courseId,
      course: application.course?.title,
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Your application has been submitted successfully. The EDSEC team will review it and contact you with the next steps.",
        application: {
          id: application.id,
          fullName: application.fullName,
          email: application.email,
          phone: application.phone,
          course: application.course?.title ?? course.title,
          status: application.status,
          createdAt: application.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("APPLICATION_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to submit your application. Please try again.",
      },
      { status: 500 }
    );
  }
}