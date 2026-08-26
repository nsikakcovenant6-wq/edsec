"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteStudent } from "./actions";

type Props = {
  studentId: string;
  studentName: string;
};

export default function DeleteStudentButton({
  studentId,
  studentName,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleDelete() {
    const confirmed = window.confirm(
      `Delete ${studentName} permanently?\n\nThis action cannot be undone. The student's account and related records will be removed.`,
    );

    if (!confirmed) {
      return;
    }

    setError("");

    startTransition(async () => {
      const result = await deleteStudent(studentId);

      if (!result.success) {
        setError(result.message);
        return;
      }

      router.refresh();
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Removing..." : "Remove Student"}
      </button>

      {error && (
        <p className="mt-2 max-w-48 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}