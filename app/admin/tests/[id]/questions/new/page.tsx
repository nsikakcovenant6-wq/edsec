import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";
import { createQuestion } from "../../actions";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function NewQuestionPage({
  params,
}: PageProps) {
  await requireRole("ADMIN");

  const { id: testId } = await params;

  const test = await prisma.test.findUnique({
    where: {
      id: testId,
    },
    select: {
      id: true,
      title: true,
      course: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  if (!test) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-6">
          <Link
            href={`/admin/tests/${test.id}`}
            className="mb-3 inline-flex text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            ← Back to Test
          </Link>

          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Add Question
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Add a new question to{" "}
            <span className="font-semibold text-slate-700">
              {test.title}
            </span>
          </p>
        </div>

        {/* Question Form */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <form
            action={async (formData: FormData): Promise<void> => {
              await createQuestion(formData);
            }}
            className="space-y-6"
          >
            {/* Test ID */}
            <input
              type="hidden"
              name="testId"
              value={test.id}
            />

            {/* Question */}
            <div>
              <label
                htmlFor="question"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Question
              </label>

              <textarea
                id="question"
                name="question"
                required
                rows={5}
                placeholder="Enter the question..."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
              />
            </div>

            {/* Question Type */}
            <div>
              <label
                htmlFor="type"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Question Type
              </label>

              <select
                id="type"
                name="type"
                defaultValue="MULTIPLE_CHOICE"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
              >
                <option value="MULTIPLE_CHOICE">
                  Multiple Choice
                </option>

                <option value="TRUE_FALSE">
                  True / False
                </option>

                <option value="SHORT_ANSWER">
                  Short Answer
                </option>
              </select>
            </div>

            {/* Options */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="font-semibold text-slate-900">
                Answer Options
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                For multiple-choice questions, provide the available
                answers and select the correct one.
              </p>

              <div className="mt-5 space-y-4">
                {/* Option A */}
                <div>
                  <label
                    htmlFor="optionA"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Option A
                  </label>

                  <input
                    id="optionA"
                    name="optionA"
                    type="text"
                    placeholder="Enter option A"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-900"
                  />
                </div>

                {/* Option B */}
                <div>
                  <label
                    htmlFor="optionB"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Option B
                  </label>

                  <input
                    id="optionB"
                    name="optionB"
                    type="text"
                    placeholder="Enter option B"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-900"
                  />
                </div>

                {/* Option C */}
                <div>
                  <label
                    htmlFor="optionC"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Option C
                  </label>

                  <input
                    id="optionC"
                    name="optionC"
                    type="text"
                    placeholder="Enter option C"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-900"
                  />
                </div>

                {/* Option D */}
                <div>
                  <label
                    htmlFor="optionD"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Option D
                  </label>

                  <input
                    id="optionD"
                    name="optionD"
                    type="text"
                    placeholder="Enter option D"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Correct Answer */}
            <div>
              <label
                htmlFor="correctAnswer"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Correct Answer
              </label>

              <select
                id="correctAnswer"
                name="correctAnswer"
                defaultValue="A"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
              >
                <option value="A">Option A</option>
                <option value="B">Option B</option>
                <option value="C">Option C</option>
                <option value="D">Option D</option>
              </select>
            </div>

            {/* Points */}
            <div>
              <label
                htmlFor="points"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Points
              </label>

              <input
                id="points"
                name="points"
                type="number"
                min="1"
                defaultValue="1"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
              />
            </div>

            {/* Explanation */}
            <div>
              <label
                htmlFor="explanation"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Explanation
              </label>

              <textarea
                id="explanation"
                name="explanation"
                rows={4}
                placeholder="Optional explanation for the correct answer..."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
              <Link
                href={`/admin/tests/${test.id}`}
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Add Question
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}