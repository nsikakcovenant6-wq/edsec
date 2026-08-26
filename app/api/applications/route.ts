import { NextResponse } from "next/server";

import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

function normalizeText(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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

    const courseName =
      typeof body.courseName === "string"
        ? body.courseName.trim()
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

    // ---------------------------------------------------------
    // VALIDATION
    // ---------------------------------------------------------

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

    if (!phone) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone number is required.",
        },
        { status: 400 }
      );
    }

    if (!courseName) {
      return NextResponse.json(
        {
          success: false,
          message: "Please select a course.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------------------
    // FIND COURSE
    // ---------------------------------------------------------

    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        status: true,
      },
    });

    const requestedCourse = normalizeText(courseName);

    const course = courses.find(
      (item) => normalizeText(item.title) === requestedCourse
    );

    if (!course) {
      console.error("APPLICATION_COURSE_NOT_FOUND", {
        submittedCourse: courseName,
        availableCourses: courses.map((item) => item.title),
      });

      return NextResponse.json(
        {
          success: false,
          message:
            "The selected course could not be found in EDSEC's course database. Please select another course.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------------------
    // CREATE APPLICATION
    // ---------------------------------------------------------

    const application = await prisma.application.create({
      data: {
        applicantId: user?.id ?? null,

        fullName,
        email,
        phone,

        courseId: course.id,

        dateOfBirth: dateOfBirth
          ? new Date(dateOfBirth)
          : null,

        educationalLevel:
          educationalLevel || null,

        preferredFormat:
          preferredFormat || null,

        preferredStartDate: preferredStartDate
          ? new Date(preferredStartDate)
          : null,

        additionalInfo:
          additionalInfo || null,

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
      course: application.course?.title,
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Your application has been submitted successfully. The EDSEC team will review it and contact you with the next steps.",
        application,
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