/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";

type ActionResult = {
  success: boolean;
  message?: string;
  error?: string;
};

function getString(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function getOptionalString(
  formData: FormData,
  key: string
): string | null {
  const value = String(formData.get(key) ?? "").trim();

  return value.length > 0 ? value : null;
}

function getNumber(
  formData: FormData,
  key: string,
  fallback = 0
): number {
  const value = Number(formData.get(key));

  return Number.isFinite(value) ? value : fallback;
}

function getBoolean(
  formData: FormData,
  key: string
): boolean {
  const value = String(formData.get(key) ?? "").toLowerCase();

  return value === "true" || value === "1" || value === "on";
}

/* =========================================================
   TEST ACTIONS
========================================================= */

export async function createTest(
  formData: FormData
): Promise<ActionResult> {
  await requireRole("ADMIN");

  const title = getString(formData, "title");
  const courseId = getString(formData, "courseId");
  const description = getOptionalString(formData, "description");

  const durationValue = getString(formData, "duration");

  const duration =
    durationValue.length > 0
      ? Number(durationValue)
      : null;

  if (!title) {
    return {
      success: false,
      error: "Test title is required.",
    };
  }

  if (!courseId) {
    return {
      success: false,
      error: "Please select a course.",
    };
  }

  if (
    duration !== null &&
    (!Number.isFinite(duration) || duration <= 0)
  ) {
    return {
      success: false,
      error: "Duration must be greater than zero.",
    };
  }

  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    select: {
      id: true,
    },
  });

  if (!course) {
    return {
      success: false,
      error: "Selected course was not found.",
    };
  }

  const test = await prisma.test.create({
    data: {
      title,
      courseId,
      description,
      duration,
      status: "DRAFT",
    },
    select: {
      id: true,
    },
  });

  revalidatePath("/admin/tests");
  revalidatePath(`/admin/tests/${test.id}`);

  redirect(`/admin/tests/${test.id}`);
}

export async function updateTest(
  formData: FormData
): Promise<ActionResult> {
  await requireRole("ADMIN");

  const testId = getString(formData, "testId");
  const title = getString(formData, "title");
  const courseId = getString(formData, "courseId");
  const description = getOptionalString(formData, "description");

  const durationValue = getString(formData, "duration");

  const duration =
    durationValue.length > 0
      ? Number(durationValue)
      : null;

  const status = getString(formData, "status");

  if (!testId) {
    return {
      success: false,
      error: "Test ID is required.",
    };
  }

  if (!title) {
    return {
      success: false,
      error: "Test title is required.",
    };
  }

  if (!courseId) {
    return {
      success: false,
      error: "Please select a course.",
    };
  }

  if (
    duration !== null &&
    (!Number.isFinite(duration) || duration <= 0)
  ) {
    return {
      success: false,
      error: "Duration must be greater than zero.",
    };
  }

  if (
    status !== "DRAFT" &&
    status !== "PUBLISHED" &&
    status !== "CLOSED"
  ) {
    return {
      success: false,
      error: "Invalid test status.",
    };
  }

  const existingTest = await prisma.test.findUnique({
    where: {
      id: testId,
    },
    select: {
      id: true,
      publishedAt: true,
    },
  });

  if (!existingTest) {
    return {
      success: false,
      error: "Test not found.",
    };
  }

  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    select: {
      id: true,
    },
  });

  if (!course) {
    return {
      success: false,
      error: "Selected course was not found.",
    };
  }

  const publishedAt =
    status === "PUBLISHED"
      ? existingTest.publishedAt ?? new Date()
      : null;

  await prisma.test.update({
    where: {
      id: testId,
    },
    data: {
      title,
      courseId,
      description,
      duration,
      status,
      publishedAt,
    },
  });

  revalidatePath("/admin/tests");
  revalidatePath(`/admin/tests/${testId}`);

  return {
    success: true,
    message: "Test updated successfully.",
  };
}

export async function deleteTest(
  formData: FormData
): Promise<ActionResult> {
  await requireRole("ADMIN");

  const testId = getString(formData, "testId");

  if (!testId) {
    return {
      success: false,
      error: "Test ID is required.",
    };
  }

  const test = await prisma.test.findUnique({
    where: {
      id: testId,
    },
    select: {
      id: true,
    },
  });

  if (!test) {
    return {
      success: false,
      error: "Test not found.",
    };
  }

  /*
   * Delete dependent records first.
   * This keeps the action safe even when the Prisma schema
   * does not have cascading deletes configured.
   */

  await prisma.$transaction(async (tx) => {
    const questions = await tx.question.findMany({
      where: {
        testId,
      },
      select: {
        id: true,
      },
    });

    const questionIds = questions.map(
      (question) => question.id
    );

    if (questionIds.length > 0) {
      await tx.answerOption.deleteMany({
        where: {
          questionId: {
            in: questionIds,
          },
        },
      });

      await tx.studentAnswer.deleteMany({
        where: {
          questionId: {
            in: questionIds,
          },
        },
      });

      await tx.question.deleteMany({
        where: {
          testId,
        },
      });
    }

    await tx.testAttempt.deleteMany({
      where: {
        testId,
      },
    });

    await tx.test.delete({
      where: {
        id: testId,
      },
    });
  });

  revalidatePath("/admin/tests");

  redirect("/admin/tests");
}

/* =========================================================
   QUESTION ACTIONS
========================================================= */

export async function createQuestion(
  formData: FormData
): Promise<ActionResult> {
  await requireRole("ADMIN");

  const testId = getString(formData, "testId");
  const question = getString(formData, "question");
  const type = getString(formData, "type");

  const points = getNumber(formData, "points", 1);
  const displayOrder = getNumber(
    formData,
    "displayOrder",
    0
  );

  if (!testId) {
    return {
      success: false,
      error: "Test ID is required.",
    };
  }

  if (!question) {
    return {
      success: false,
      error: "Question text is required.",
    };
  }

  if (
    type !== "MULTIPLE_CHOICE" &&
    type !== "TRUE_FALSE"
  ) {
    return {
      success: false,
      error: "Invalid question type.",
    };
  }

  if (!Number.isFinite(points) || points <= 0) {
    return {
      success: false,
      error: "Points must be greater than zero.",
    };
  }

  const test = await prisma.test.findUnique({
    where: {
      id: testId,
    },
    select: {
      id: true,
    },
  });

  if (!test) {
    return {
      success: false,
      error: "Test not found.",
    };
  }

  const createdQuestion = await prisma.question.create({
    data: {
      testId,
      question,
      type,
      points,
      displayOrder,
    },
    select: {
      id: true,
    },
  });

  /*
   * Multiple choice options
   *
   * The form can send:
   *
   * optionText
   * optionText
   * optionText
   * optionText
   *
   * and:
   *
   * correctOption
   *
   * containing the index of the correct option.
   */

  const optionTexts = formData
    .getAll("optionText")
    .map((value) => String(value).trim())
    .filter(Boolean);

  const correctOptionValue = getString(
    formData,
    "correctOption"
  );

  const correctOption =
    correctOptionValue.length > 0
      ? Number(correctOptionValue)
      : -1;

  if (type === "MULTIPLE_CHOICE") {
    if (optionTexts.length < 2) {
      await prisma.question.delete({
        where: {
          id: createdQuestion.id,
        },
      });

      return {
        success: false,
        error:
          "Multiple-choice questions require at least two options.",
      };
    }

    await prisma.answerOption.createMany({
      data: optionTexts.map((optionText, index) => ({
        questionId: createdQuestion.id,
        optionText,
        isCorrect: index === correctOption,
        displayOrder: index,
      })),
    });
  }

  if (type === "TRUE_FALSE") {
    const correctAnswer = getString(
      formData,
      "correctAnswer"
    );

    const normalizedCorrectAnswer =
      correctAnswer.toUpperCase();

    if (
      normalizedCorrectAnswer !== "TRUE" &&
      normalizedCorrectAnswer !== "FALSE"
    ) {
      await prisma.question.delete({
        where: {
          id: createdQuestion.id,
        },
      });

      return {
        success: false,
        error:
          "Please select TRUE or FALSE as the correct answer.",
      };
    }

    await prisma.answerOption.createMany({
      data: [
        {
          questionId: createdQuestion.id,
          optionText: "True",
          isCorrect:
            normalizedCorrectAnswer === "TRUE",
          displayOrder: 0,
        },
        {
          questionId: createdQuestion.id,
          optionText: "False",
          isCorrect:
            normalizedCorrectAnswer === "FALSE",
          displayOrder: 1,
        },
      ],
    });
  }

  revalidatePath(`/admin/tests/${testId}`);
  revalidatePath(
    `/admin/tests/${testId}/questions/new`
  );

  return {
    success: true,
    message: "Question created successfully.",
  };
}

export async function updateQuestion(
  formData: FormData
): Promise<ActionResult> {
  await requireRole("ADMIN");

  const questionId = getString(
    formData,
    "questionId"
  );

  const testId = getString(formData, "testId");
  const question = getString(formData, "question");
  const type = getString(formData, "type");

  const points = getNumber(formData, "points", 1);

  const displayOrder = getNumber(
    formData,
    "displayOrder",
    0
  );

  if (!questionId) {
    return {
      success: false,
      error: "Question ID is required.",
    };
  }

  if (!testId) {
    return {
      success: false,
      error: "Test ID is required.",
    };
  }

  if (!question) {
    return {
      success: false,
      error: "Question text is required.",
    };
  }

  if (
    type !== "MULTIPLE_CHOICE" &&
    type !== "TRUE_FALSE"
  ) {
    return {
      success: false,
      error: "Invalid question type.",
    };
  }

  if (!Number.isFinite(points) || points <= 0) {
    return {
      success: false,
      error: "Points must be greater than zero.",
    };
  }

  const existingQuestion =
    await prisma.question.findUnique({
      where: {
        id: questionId,
      },
      select: {
        id: true,
        testId: true,
      },
    });

  if (!existingQuestion) {
    return {
      success: false,
      error: "Question not found.",
    };
  }

  if (existingQuestion.testId !== testId) {
    return {
      success: false,
      error: "Question does not belong to this test.",
    };
  }

  await prisma.question.update({
    where: {
      id: questionId,
    },
    data: {
      question,
      type,
      points,
      displayOrder,
    },
  });

  /*
   * Replace answer options.
   */

  await prisma.answerOption.deleteMany({
    where: {
      questionId,
    },
  });

  const optionTexts = formData
    .getAll("optionText")
    .map((value) => String(value).trim())
    .filter(Boolean);

  const correctOptionValue = getString(
    formData,
    "correctOption"
  );

  const correctOption =
    correctOptionValue.length > 0
      ? Number(correctOptionValue)
      : -1;

  if (type === "MULTIPLE_CHOICE") {
    if (optionTexts.length < 2) {
      return {
        success: false,
        error:
          "Multiple-choice questions require at least two options.",
      };
    }

    await prisma.answerOption.createMany({
      data: optionTexts.map((optionText, index) => ({
        questionId,
        optionText,
        isCorrect: index === correctOption,
        displayOrder: index,
      })),
    });
  }

  if (type === "TRUE_FALSE") {
    const correctAnswer = getString(
      formData,
      "correctAnswer"
    ).toUpperCase();

    if (
      correctAnswer !== "TRUE" &&
      correctAnswer !== "FALSE"
    ) {
      return {
        success: false,
        error:
          "Please select TRUE or FALSE as the correct answer.",
      };
    }

    await prisma.answerOption.createMany({
      data: [
        {
          questionId,
          optionText: "True",
          isCorrect:
            correctAnswer === "TRUE",
          displayOrder: 0,
        },
        {
          questionId,
          optionText: "False",
          isCorrect:
            correctAnswer === "FALSE",
          displayOrder: 1,
        },
      ],
    });
  }

  revalidatePath(`/admin/tests/${testId}`);

  return {
    success: true,
    message: "Question updated successfully.",
  };
}

export async function deleteQuestion(
  formData: FormData
): Promise<ActionResult> {
  await requireRole("ADMIN");

  const questionId = getString(
    formData,
    "questionId"
  );

  const testId = getString(formData, "testId");

  if (!questionId) {
    return {
      success: false,
      error: "Question ID is required.",
    };
  }

  const question = await prisma.question.findUnique({
    where: {
      id: questionId,
    },
    select: {
      id: true,
      testId: true,
    },
  });

  if (!question) {
    return {
      success: false,
      error: "Question not found.",
    };
  }

  await prisma.$transaction(async (tx) => {
    await tx.studentAnswer.deleteMany({
      where: {
        questionId,
      },
    });

    await tx.answerOption.deleteMany({
      where: {
        questionId,
      },
    });

    await tx.question.delete({
      where: {
        id: questionId,
      },
    });
  });

  if (testId) {
    revalidatePath(`/admin/tests/${testId}`);
  }

  revalidatePath("/admin/tests");

  return {
    success: true,
    message: "Question deleted successfully.",
  };
}