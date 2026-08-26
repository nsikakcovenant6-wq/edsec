"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  courseId: string;
  courseSlug: string;
};

export default function EnrollButton({
  courseId,
  courseSlug,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function enroll() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/enrollments",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            courseId,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data?.message ||
            "Unable to enroll in this course.",
        );
        return;
      }

      router.push(
        `/student/courses/${courseSlug}`,
      );

      router.refresh();
    } catch (error) {
      console.error(error);

      setError(
        "Unable to enroll right now. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={enroll}
        disabled={loading}
        className="w-full rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading
          ? "Enrolling..."
          : "Enroll in this Course →"}
      </button>
    </div>
  );
}