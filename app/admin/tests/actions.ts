"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";

/* =========================================================
   HELPERS
========================================================= */

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

/* =========================================================
   TEST ACTIONS
========================================================= */

export async function createTest(formData: FormData): Promise<void> {
  await requireRole("ADMIN");

  const title = getString(formData, "title");
  const courseId = getString(formData, "courseId");
  const description = getOptionalString(formData, "description");

  const durationValue = getString(formData, "duration");

  const duration =
    durationValue.length > 0 ? Number(durationValue) : null;

  if (!title) {
    throw new Error("Test title is required.");
  }

  if (!courseId) {
    throw new Error("Please select a course.");
  }

  if (
    duration !== null &&
    (!Number.isFinite(duration) || duration <= 0)
  ) {
    throw new Error("Duration must be greater than zero.");
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
    throw new Error("Selected course was not found.");
  }

  const test = await prisma.test.create({
    data: {
      title,
      courseId,
      description,
      duration,
      status: "DRAFT",
      publishedAt: null,
    },
    select: {
      id: true,
    },
  });

  revalidatePath("/admin/tests");
  revalidatePath(`/admin/tests/${test.id}`);

  redirect(`/admin/tests/${test.id}`);
}

/* =========================================================
   UPDATE TEST
========================================================= */

export async function updateTest(formData: FormData): Promise<void> {
  await requireRole("ADMIN");

  const testId = getString(formData, "testId");
  const title = getString(formData, "title");
  const courseId = getString(formData, "courseId");
  const description = getOptionalString(formData, "description");

  const durationValue = getString(formData, "duration");

  const duration =
    durationValue.length > 0 ? Number(durationValue) : null;

  const status = getString(formData, "status");

  if (!testId) {
    throw new Error("Test ID is required.");
  }

  if (!title) {
    throw new Error("Test title is required.");
  }

  if (!courseId) {
    throw new Error("Please select a course.");
  }

  if (
    duration !== null &&
    (!Number.isFinite(duration) || duration <= 0)
  ) {
    throw new Error("Duration must be greater than zero.");
  }

  if (
    status !== "DRAFT" &&
    status !== "PUBLISHED" &&
    status !== "CLOSED"
  ) {
    throw new Error("Invalid test status.");
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
    throw new Error("Test not found.");
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
    throw new Error("Selected course was not found.");
  }

  /*
   * IMPORTANT:
   *
   * When publishing:
   * - preserve an existing publishedAt
   * - otherwise create a new publication timestamp
   *
   * When moving back to DRAFT or CLOSED:
   * - clear publishedAt
   */
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

  /*
   * Revalidate any student-facing test routes as well.
   * These are harmless if the route does not exist yet.
   */
  revalidatePath("/student/tests");
  revalidatePath("/student");
}

/* =========================================================
   DELETE TEST
========================================================= */

export async function deleteTest(formData: FormData): Promise<void> {
  await requireRole("ADMIN");

  const testId = getString(formData, "testId");

  if (!testId) {
    throw new Error("Test ID is required.");
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
    throw new Error("Test not found.");
  }

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
      await tx.studentAnswer.deleteMany({
        where: {
          questionId: {
            in: questionIds,
          },
        },
      });

      await tx.answerOption.deleteMany({
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
  revalidatePath("/student/tests");

  redirect("/admin/tests");
}

/* =========================================================
   QUESTION ACTIONS
========================================================= */

export async function createQuestion(
  formData: FormData
): Promise<void> {
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
    throw new Error("Test ID is required.");
  }

  if (!question) {
    throw new Error("Question text is required.");
  }

  if (
    type !== "MULTIPLE_CHOICE" &&
    type !== "TRUE_FALSE"
  ) {
    throw new Error("Invalid question type.");
  }

  if (!Number.isFinite(points) || points <= 0) {
    throw new Error("Points must be greater than zero.");
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
    throw new Error("Test not found.");
  }

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

  const correctAnswer = getString(
    formData,
    "correctAnswer"
  ).toUpperCase();

  /*
   * Validate BEFORE creating the question.
   * This prevents orphaned questions when the options
   * are invalid.
   */

  if (type === "MULTIPLE_CHOICE") {
    if (optionTexts.length < 2) {
      throw new Error(
        "Multiple-choice questions require at least two options."
      );
    }

    if (
      !Number.isInteger(correctOption) ||
      correctOption < 0 ||
      correctOption >= optionTexts.length
    ) {
      throw new Error(
        "Please select the correct answer."
      );
    }
  }

  if (type === "TRUE_FALSE") {
    if (
      correctAnswer !== "TRUE" &&
      correctAnswer !== "FALSE"
    ) {
      throw new Error(
        "Please select TRUE or FALSE as the correct answer."
      );
    }
  }

  const createdQuestion =
    await prisma.question.create({
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

  if (type === "MULTIPLE_CHOICE") {
    await prisma.answerOption.createMany({
      data: optionTexts.map(
        (optionText, index) => ({
          questionId: createdQuestion.id,
          optionText,
          isCorrect: index === correctOption,
          displayOrder: index,
        })
      ),
    });
  }

  if (type === "TRUE_FALSE") {
    await prisma.answerOption.createMany({
      data: [
        {
          questionId: createdQuestion.id,
          optionText: "True",
          isCorrect: correctAnswer === "TRUE",
          displayOrder: 0,
        },
        {
          questionId: createdQuestion.id,
          optionText: "False",
          isCorrect: correctAnswer === "FALSE",
          displayOrder: 1,
        },
      ],
    });
  }

  revalidatePath(`/admin/tests/${testId}`);
  revalidatePath(
    `/admin/tests/${testId}/questions/new`
  );
}

/* =========================================================
   UPDATE QUESTION
========================================================= */

export async function updateQuestion(
  formData: FormData
): Promise<void> {
  await requireRole("ADMIN");

  const questionId = getString(
    formData,
    "questionId"
  );

  const testId = getString(
    formData,
    "testId"
  );

  const question = getString(
    formData,
    "question"
  );

  const type = getString(
    formData,
    "type"
  );

  const points = getNumber(
    formData,
    "points",
    1
  );

  const displayOrder = getNumber(
    formData,
    "displayOrder",
    0
  );

  if (!questionId) {
    throw new Error("Question ID is required.");
  }

  if (!testId) {
    throw new Error("Test ID is required.");
  }

  if (!question) {
    throw new Error("Question text is required.");
  }

  if (
    type !== "MULTIPLE_CHOICE" &&
    type !== "TRUE_FALSE"
  ) {
    throw new Error("Invalid question type.");
  }

  if (!Number.isFinite(points) || points <= 0) {
    throw new Error(
      "Points must be greater than zero."
    );
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
    throw new Error("Question not found.");
  }

  if (existingQuestion.testId !== testId) {
    throw new Error(
      "Question does not belong to this test."
    );
  }

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

  const correctAnswer = getString(
    formData,
    "correctAnswer"
  ).toUpperCase();

  /*
   * Validate the new answer structure BEFORE deleting
   * the existing answer options.
   */

  if (type === "MULTIPLE_CHOICE") {
    if (optionTexts.length < 2) {
      throw new Error(
        "Multiple-choice questions require at least two options."
      );
    }

    if (
      !Number.isInteger(correctOption) ||
      correctOption < 0 ||
      correctOption >= optionTexts.length
    ) {
      throw new Error(
        "Please select the correct answer."
      );
    }
  }

  if (type === "TRUE_FALSE") {
    if (
      correctAnswer !== "TRUE" &&
      correctAnswer !== "FALSE"
    ) {
      throw new Error(
        "Please select TRUE or FALSE as the correct answer."
      );
    }
  }

  await prisma.$transaction(async (tx) => {
    await tx.question.update({
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

    await tx.answerOption.deleteMany({
      where: {
        questionId,
      },
    });

    if (type === "MULTIPLE_CHOICE") {
      await tx.answerOption.createMany({
        data: optionTexts.map(
          (optionText, index) => ({
            questionId,
            optionText,
            isCorrect: index === correctOption,
            displayOrder: index,
          })
        ),
      });
    }

    if (type === "TRUE_FALSE") {
      await tx.answerOption.createMany({
        data: [
          {
            questionId,
            optionText: "True",
            isCorrect: correctAnswer === "TRUE",
            displayOrder: 0,
          },
          {
            questionId,
            optionText: "False",
            isCorrect: correctAnswer === "FALSE",
            displayOrder: 1,
          },
        ],
      });
    }
  });

  revalidatePath(`/admin/tests/${testId}`);
}

/* =========================================================
   DELETE QUESTION
========================================================= */

export async function deleteQuestion(
  formData: FormData
): Promise<void> {
  await requireRole("ADMIN");

  const questionId = getString(
    formData,
    "questionId"
  );

  const testId = getString(
    formData,
    "testId"
  );

  if (!questionId) {
    throw new Error("Question ID is required.");
  }

  const question =
    await prisma.question.findUnique({
      where: {
        id: questionId,
      },
      select: {
        id: true,
        testId: true,
      },
    });

  if (!question) {
    throw new Error("Question not found.");
  }

  await prisma.$transaction(
    async (tx) => {
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
    }
  );

  if (testId) {
    revalidatePath(
      `/admin/tests/${testId}`
    );
  }

  revalidatePath("/admin/tests");
}