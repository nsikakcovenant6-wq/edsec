import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.redirect(
        new URL("/login", request.url)
      );
    }

    if (user.role !== "STUDENT") {
      return NextResponse.redirect(
        new URL("/admin", request.url)
      );
    }

    const formData = await request.formData();

    const testId = formData.get("testId");

    if (typeof testId !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Test ID is required",
        },
        { status: 400 }
      );
    }

    const test = await prisma.test.findUnique({
      where: {
        id: testId,
      },
      include: {
        questions: {
          orderBy: {
            displayOrder: "asc",
          },
          include: {
            options: {
              orderBy: {
                displayOrder: "asc",
              },
            },
          },
        },
      },
    });

    if (!test || test.status !== "PUBLISHED") {
      return NextResponse.json(
        {
          success: false,
          error: "Test not found or not published",
        },
        { status: 404 }
      );
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: user.id,
          courseId: test.courseId,
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        {
          success: false,
          error: "You are not enrolled in this course",
        },
        { status: 403 }
      );
    }

    let score = 0;
    let totalPoints = 0;

    const answers: {
      questionId: string;
      selectedOptionId: string | null;
      isCorrect: boolean;
      pointsAwarded: number;
    }[] = [];

    for (const question of test.questions) {
      totalPoints += question.points;

      const selectedOptionId = formData.get(
        `question_${question.id}`
      );

      const selectedOption =
        typeof selectedOptionId === "string"
          ? question.options.find(
              (option) =>
                option.id === selectedOptionId
            )
          : null;

      const isCorrect =
        selectedOption?.isCorrect === true;

      const pointsAwarded = isCorrect
        ? question.points
        : 0;

      if (isCorrect) {
        score += question.points;
      }

      answers.push({
        questionId: question.id,
        selectedOptionId:
          typeof selectedOptionId === "string"
            ? selectedOptionId
            : null,
        isCorrect,
        pointsAwarded,
      });
    }

    const attempt = await prisma.testAttempt.create({
      data: {
        testId: test.id,
        studentId: user.id,
        status: "GRADED",
        score,
        totalPoints,
        submittedAt: new Date(),

        answers: {
          create: answers.map((answer) => ({
            questionId: answer.questionId,
            selectedOptionId:
              answer.selectedOptionId,
            isCorrect: answer.isCorrect,
            pointsAwarded:
              answer.pointsAwarded,
          })),
        },
      },
    });

    return NextResponse.redirect(
      new URL(
        `/student/tests/${test.id}/result?attemptId=${attempt.id}`,
        request.url
      )
    );
  } catch (error) {
    console.error(
      "TEST_SUBMISSION_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong while submitting the test",
      },
      { status: 500 }
    );
  }
}