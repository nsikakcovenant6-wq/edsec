"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateStudentStatus } from "./actions";

type Props = {
  studentId: string;
  status: "ACTIVE" | "SUSPENDED" | "INACTIVE";
  label: string;
  variant: "primary" | "danger";
};

export default function StudentStatusButton({
  studentId,
  status,
  label,
  variant,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleClick() {
    const confirmed =
      status === "SUSPENDED"
        ? window.confirm(
            "Are you sure you want to suspend this student's account?"
          )
        : window.confirm(
            "Are you sure you want to activate this student's account?"
          );

    if (!confirmed) {
      return;
    }

    setError("");

    startTransition(async () => {
      const result = await updateStudentStatus(studentId, status);

      if (!result.success) {
        setError(result.message);
        return;
      }

      router.refresh();
    });
  }

  const buttonClass =
    variant === "danger"
      ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
      : "bg-blue-600 text-white hover:bg-blue-700";

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${buttonClass}`}
      >
        {isPending ? "Updating..." : label}
      </button>

      {error && (
        <p className="mt-2 max-w-40 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}