"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";

export type TestActionResult = {
  success: boolean;
  message: string;
};

export type QuestionActionResult = {
  success: boolean;
  message: string;
};

function getString(
  formData: FormData,
  name: string
): string {
  const value = formData.get(name);

  return typeof value === "string" ? value.trim() : "";
}

function getOptionalString(
  formData: FormData,
  name: string
): string | null {
  const value = getString(formData, name);

  return value.length > 0 ? value : null;
}

function getNumber(
  formData: FormData,
  name: string,
  fallback: number
): number {
  const value = Number(getString(formData, name));

  return Number.isFinite(value) ? value : fallback;
}

/* =========================================================
   CREATE TEST
========================================================= */

export async function createTest(
  formData: FormData
): Promise<TestActionResult> {
  await requireRole("ADMIN");

  const title = getString(formData, "title");
  const description = getOptionalString(formData, "description");
  const courseId = getString(formData, "courseId");
  const durationValue = getString(formData, "duration");
  const status = getString(formData, "status") || "DRAFT";

  if (!title) {
    return {
      success: false,
      message: "Test title is required.",
    };
  }

  if (!courseId) {
    return {
      success: false,
      message: "Course is required.",
    };
  }

  const validStatuses = [
    "DRAFT",
    "PUBLISHED",
    "CLOSED",
  ] as const;

  if (
    !validStatuses.includes(
      status as (typeof validStatuses)[number]
    )
  ) {
    return {
      success: false,
      message: "Invalid test status.",
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
      message: "Selected course was not found.",
    };
  }

  const duration =
    durationValue.length > 0
      ? Number(durationValue)
      : null;

  if (
    duration !== null &&
    (!Number.isFinite(duration) || duration <= 0)
  ) {
    return {
      success: false,
      message: "Duration must be a positive number.",
    };
  }

  const test = await prisma.test.create({
    data: {
      title,
      description,
      courseId,
      duration,
      status: status as "DRAFT" | "PUBLISHED" | "CLOSED",
      publishedAt:
        status === "PUBLISHED" ? new Date() : null,
    },
  });

  revalidatePath("/admin/tests");
  revalidatePath(`/admin/tests/${test.id}`);

  redirect(`/admin/tests/${test.id}`);
}

/* =========================================================
   UPDATE TEST
========================================================= */

export async function updateTest(
  formData: FormData
): Promise<TestActionResult> {
  await requireRole("ADMIN");

  const id = getString(formData, "id");
  const title = getString(formData, "title");
  const description = getOptionalString(
    formData,
    "description"
  );
  const durationValue = getString(
    formData,
    "duration"
  );
  const status = getString(formData, "status");

  if (!id) {
    return {
      success: false,
      message: "Test ID is required.",
    };
  }

  if (!title) {
    return {
      success: false,
      message: "Test title is required.",
    };
  }

  const validStatuses = [
    "DRAFT",
    "PUBLISHED",
    "CLOSED",
  ] as const;

  if (
    !validStatuses.includes(
      status as (typeof validStatuses)[number]
    )
  ) {
    return {
      success: false,
      message: "Invalid test status.",
    };
  }

  const existingTest = await prisma.test.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!existingTest) {
    return {
      success: false,
      message: "Test not found.",
    };
  }

  const duration =
    durationValue.length > 0
      ? Number(durationValue)
      : null;

  if (
    duration !== null &&
    (!Number.isFinite(duration) || duration <= 0)
  ) {
    return {
      success: false,
      message: "Duration must be a positive number.",
    };
  }

  let publishedAt: Date | null = null;

  if (status === "PUBLISHED") {
    publishedAt = new Date();
  }

  await prisma.test.update({
    where: {
      id,
    },
    data: {
      title,
      description,
      duration,
      status: status as "DRAFT" | "PUBLISHED" | "CLOSED",
      publishedAt,
    },
  });

  revalidatePath("/admin/tests");
  revalidatePath(`/admin/tests/${id}`);

  return {
    success: true,
    message: "Test updated successfully.",
  };
}

/* =========================================================
   DELETE TEST
========================================================= */

export async function deleteTest(
  formData: FormData
): Promise<TestActionResult> {
  await requireRole("ADMIN");

  const id = getString(formData, "id");

  if (!id) {
    return {
      success: false,
      message: "Test ID is required.",
    };
  }

  const existingTest = await prisma.test.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  if (!existingTest) {
    return {
      success: false,
      message: "Test not found.",
    };
  }

  await prisma.test.delete({
    where: {
      id,
    },
  });

  revalidatePath("/admin/tests");

  redirect("/admin/tests");
}

/* =========================================================
   CREATE QUESTION
========================================================= */

export async function createQuestion(
  formData: FormData
): Promise<QuestionActionResult> {
  await requireRole("ADMIN");

  const testId = getString(formData, "testId");
  const question = getString(formData, "question");
  const type = getString(formData, "type") || "MULTIPLE_CHOICE";

  const points = getNumber(formData, "points", 1);

  const displayOrder = getNumber(
    formData,
    "displayOrder",
    0
  );

  if (!testId) {
    return {
      success: false,
      message: "Test ID is required.",
    };
  }

  if (!question) {
    return {
      success: false,
      message: "Question text is required.",
    };
  }

  const validTypes = [
    "MULTIPLE_CHOICE",
    "TRUE_FALSE",
  ] as const;

  if (
    !validTypes.includes(
      type as (typeof validTypes)[number]
    )
  ) {
    return {
      success: false,
      message: "Invalid question type.",
    };
  }

  if (!Number.isFinite(points) || points < 1) {
    return {
      success: false,
      message: "Points must be at least 1.",
    };
  }

  if (
    !Number.isFinite(displayOrder) ||
    displayOrder < 0
  ) {
    return {
      success: false,
      message: "Display order cannot be negative.",
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
      message: "Test not found.",
    };
  }

  const createdQuestion =
    await prisma.question.create({
      data: {
        testId,
        question,
        type: type as
          | "MULTIPLE_CHOICE"
          | "TRUE_FALSE",
        points,
        displayOrder,
      },
    });

  /*
   * Automatically create True/False options when
   * a TRUE_FALSE question is created.
   */

  if (type === "TRUE_FALSE") {
    await prisma.answerOption.createMany({
      data: [
        {
          questionId: createdQuestion.id,
          optionText: "True",
          isCorrect: false,
          displayOrder: 0,
        },
        {
          questionId: createdQuestion.id,
          optionText: "False",
          isCorrect: false,
          displayOrder: 1,
        },
      ],
    });
  }

  revalidatePath("/admin/tests");
  revalidatePath(`/admin/tests/${testId}`);

  return {
    success: true,
    message: "Question created successfully.",
  };
}

/* =========================================================
   UPDATE QUESTION
========================================================= */

export async function updateQuestion(
  formData: FormData
): Promise<QuestionActionResult> {
  await requireRole("ADMIN");

  const id = getString(formData, "id");
  const testId = getString(formData, "testId");
  const question = getString(formData, "question");
  const type = getString(formData, "type");
  const points = getNumber(formData, "points", 1);

  const displayOrder = getNumber(
    formData,
    "displayOrder",
    0
  );

  if (!id) {
    return {
      success: false,
      message: "Question ID is required.",
    };
  }

  if (!testId) {
    return {
      success: false,
      message: "Test ID is required.",
    };
  }

  if (!question) {
    return {
      success: false,
      message: "Question text is required.",
    };
  }

  const validTypes = [
    "MULTIPLE_CHOICE",
    "TRUE_FALSE",
  ] as const;

  if (
    !validTypes.includes(
      type as (typeof validTypes)[number]
    )
  ) {
    return {
      success: false,
      message: "Invalid question type.",
    };
  }

  if (!Number.isFinite(points) || points < 1) {
    return {
      success: false,
      message: "Points must be at least 1.",
    };
  }

  if (
    !Number.isFinite(displayOrder) ||
    displayOrder < 0
  ) {
    return {
      success: false,
      message: "Display order cannot be negative.",
    };
  }

  const existingQuestion =
    await prisma.question.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        testId: true,
        type: true,
      },
    });

  if (!existingQuestion) {
    return {
      success: false,
      message: "Question not found.",
    };
  }

  if (existingQuestion.testId !== testId) {
    return {
      success: false,
      message: "Question does not belong to this test.",
    };
  }

  await prisma.question.update({
    where: {
      id,
    },
    data: {
      question,
      type: type as
        | "MULTIPLE_CHOICE"
        | "TRUE_FALSE",
      points,
      displayOrder,
    },
  });

  /*
   * If changing from multiple choice to true/false,
   * create the default options if none exist.
   */

  if (
    type === "TRUE_FALSE" &&
    existingQuestion.type !== "TRUE_FALSE"
  ) {
    const existingOptions =
      await prisma.answerOption.count({
        where: {
          questionId: id,
        },
      });

    if (existingOptions === 0) {
      await prisma.answerOption.createMany({
        data: [
          {
            questionId: id,
            optionText: "True",
            isCorrect: false,
            displayOrder: 0,
          },
          {
            questionId: id,
            optionText: "False",
            isCorrect: false,
            displayOrder: 1,
          },
        ],
      });
    }
  }

  revalidatePath("/admin/tests");
  revalidatePath(`/admin/tests/${testId}`);

  return {
    success: true,
    message: "Question updated successfully.",
  };
}

/* =========================================================
   DELETE QUESTION
========================================================= */

export async function deleteQuestion(
  formData: FormData
): Promise<QuestionActionResult> {
  await requireRole("ADMIN");

  const id = getString(formData, "id");
  const testId = getString(formData, "testId");

  if (!id) {
    return {
      success: false,
      message: "Question ID is required.",
    };
  }

  if (!testId) {
    return {
      success: false,
      message: "Test ID is required.",
    };
  }

  const existingQuestion =
    await prisma.question.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        testId: true,
      },
    });

  if (!existingQuestion) {
    return {
      success: false,
      message: "Question not found.",
    };
  }

  if (existingQuestion.testId !== testId) {
    return {
      success: false,
      message: "Question does not belong to this test.",
    };
  }

  await prisma.question.delete({
    where: {
      id,
    },
  });

  revalidatePath("/admin/tests");
  revalidatePath(`/admin/tests/${testId}`);

  return {
    success: true,
    message: "Question deleted successfully.",
  };
}

/* =========================================================
   CREATE ANSWER OPTION
========================================================= */

export async function createAnswerOption(
  formData: FormData
): Promise<QuestionActionResult> {
  await requireRole("ADMIN");

  const questionId = getString(
    formData,
    "questionId"
  );

  const optionText = getString(
    formData,
    "optionText"
  );

  const displayOrder = getNumber(
    formData,
    "displayOrder",
    0
  );

  const isCorrect =
    getString(formData, "isCorrect") === "true";

  if (!questionId) {
    return {
      success: false,
      message: "Question ID is required.",
    };
  }

  if (!optionText) {
    return {
      success: false,
      message: "Option text is required.",
    };
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
    return {
      success: false,
      message: "Question not found.",
    };
  }

  await prisma.answerOption.create({
    data: {
      questionId,
      optionText,
      displayOrder,
      isCorrect,
    },
  });

  /*
   * If this option is correct, make all other options
   * for the same question incorrect.
   */

  if (isCorrect) {
    await prisma.answerOption.updateMany({
      where: {
        questionId,
        NOT: {
          optionText,
        },
      },
      data: {
        isCorrect: false,
      },
    });
  }

  revalidatePath("/admin/tests");
  revalidatePath(`/admin/tests/${question.testId}`);

  return {
    success: true,
    message: "Answer option created successfully.",
  };
}

/* =========================================================
   UPDATE ANSWER OPTION
========================================================= */

export async function updateAnswerOption(
  formData: FormData
): Promise<QuestionActionResult> {
  await requireRole("ADMIN");

  const id = getString(formData, "id");
  const questionId = getString(
    formData,
    "questionId"
  );

  const optionText = getString(
    formData,
    "optionText"
  );

  const displayOrder = getNumber(
    formData,
    "displayOrder",
    0
  );

  const isCorrect =
    getString(formData, "isCorrect") === "true";

  if (!id) {
    return {
      success: false,
      message: "Answer option ID is required.",
    };
  }

  if (!questionId) {
    return {
      success: false,
      message: "Question ID is required.",
    };
  }

  if (!optionText) {
    return {
      success: false,
      message: "Option text is required.",
    };
  }

  const existingOption =
    await prisma.answerOption.findUnique({
      where: {
        id,
      },
      include: {
        question: {
          select: {
            id: true,
            testId: true,
          },
        },
      },
    });

  if (!existingOption) {
    return {
      success: false,
      message: "Answer option not found.",
    };
  }

  if (existingOption.questionId !== questionId) {
    return {
      success: false,
      message: "Answer option does not belong to this question.",
    };
  }

  await prisma.answerOption.update({
    where: {
      id,
    },
    data: {
      optionText,
      displayOrder,
      isCorrect,
    },
  });

  if (isCorrect) {
    await prisma.answerOption.updateMany({
      where: {
        questionId,
        NOT: {
          id,
        },
      },
      data: {
        isCorrect: false,
      },
    });
  }

  revalidatePath("/admin/tests");
  revalidatePath(
    `/admin/tests/${existingOption.question.testId}`
  );

  return {
    success: true,
    message: "Answer option updated successfully.",
  };
}

/* =========================================================
   DELETE ANSWER OPTION
========================================================= */

export async function deleteAnswerOption(
  formData: FormData
): Promise<QuestionActionResult> {
  await requireRole("ADMIN");

  const id = getString(formData, "id");

  if (!id) {
    return {
      success: false,
      message: "Answer option ID is required.",
    };
  }

  const existingOption =
    await prisma.answerOption.findUnique({
      where: {
        id,
      },
      include: {
        question: {
          select: {
            id: true,
            testId: true,
          },
        },
      },
    });

  if (!existingOption) {
    return {
      success: false,
      message: "Answer option not found.",
    };
  }

  await prisma.answerOption.delete({
    where: {
      id,
    },
  });

  revalidatePath("/admin/tests");
  revalidatePath(
    `/admin/tests/${existingOption.question.testId}`
  );

  return {
    success: true,
    message: "Answer option deleted successfully.",
  };
}