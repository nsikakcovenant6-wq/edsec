import { NextResponse } from "next/server";

import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

type SubmitTestContext = {
  params: Promise<{
    testId: string;
  }>;
};

export async function POST(
  request: Request,
  { params }: SubmitTestContext,
) {
  try {
    const { testId } = await params;

    // ------------------------------------------------------------
    // AUTHENTICATION
    // ------------------------------------------------------------

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.redirect(
        new URL("/login", request.url),
      );
    }

    if (user.role !== "STUDENT") {
      return NextResponse.redirect(
        new URL("/admin", request.url),
      );
    }

    // ------------------------------------------------------------
    // LOAD TEST
    // ------------------------------------------------------------

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
          error: "Test not found or not published.",
        },
        {
          status: 404,
        },
      );
    }

    // ------------------------------------------------------------
    // CHECK ENROLLMENT
    // ------------------------------------------------------------

    const enrollment =
      await prisma.enrollment.findUnique({
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
          error: "You are not enrolled in this course.",
        },
        {
          status: 403,
        },
      );
    }

    // ------------------------------------------------------------
    // READ SUBMITTED ANSWERS
    // ------------------------------------------------------------

    const formData = await request.formData();

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

      const submittedValue = formData.get(
        `question_${question.id}`,
      );

      const selectedOptionId =
        typeof submittedValue === "string"
          ? submittedValue
          : null;

      // ----------------------------------------------------------
      // IMPORTANT:
      // Only accept an option that actually belongs to this
      // question. This prevents a student from submitting an
      // arbitrary option ID.
      // ----------------------------------------------------------

      const selectedOption = selectedOptionId
        ? question.options.find(
            (option) =>
              option.id === selectedOptionId,
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
        selectedOptionId,
        isCorrect,
        pointsAwarded,
      });
    }

    // ------------------------------------------------------------
    // CREATE TEST ATTEMPT
    // ------------------------------------------------------------

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

    // ------------------------------------------------------------
    // REDIRECT TO RESULT
    // ------------------------------------------------------------

    return NextResponse.redirect(
      new URL(
        `/student/tests/${test.id}/result?attemptId=${attempt.id}`,
        request.url,
      ),
    );
  } catch (error) {
    console.error(
      "TEST_SUBMISSION_ERROR:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong while submitting the test.",
      },
      {
        status: 500,
      },
    );
  }
}