"use client";

import { useState, useTransition } from "react";
import {
  approveAndEnroll,
  markApplicationContacted,
  rejectApplication,
} from "./actions";

type Props = {
  applicationId: string;
  status: string;
};

export default function ApplicationActions({
  applicationId,
  status,
}: Props) {
  const [isPending, startTransition] = useTransition();

  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    temporaryPassword?: string;
    studentNumber?: string;
  } | null>(null);

  function handleApprove() {
    const confirmed = window.confirm(
      "Approve this application and enroll the applicant in the selected course?"
    );

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      const response = await approveAndEnroll(applicationId);
      setResult(response);

      if (response.success) {
        window.location.reload();
      }
    });
  }

  function handleContacted() {
    startTransition(async () => {
      const response =
        await markApplicationContacted(applicationId);

      setResult(response);

      if (response.success) {
        window.location.reload();
      }
    });
  }

  function handleReject() {
    const confirmed = window.confirm(
      "Are you sure you want to reject this application?"
    );

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      const response = await rejectApplication(applicationId);
      setResult(response);

      if (response.success) {
        window.location.reload();
      }
    });
  }

  if (status === "APPROVED") {
    return (
      <div className="space-y-2">
        <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          Approved & Enrolled
        </span>

        {result && !result.success && (
          <p className="text-xs text-red-600">
            {result.message}
          </p>
        )}
      </div>
    );
  }

  if (status === "REJECTED") {
    return (
      <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
        Rejected
      </span>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {status !== "CONTACTED" && (
        <button
          type="button"
          disabled={isPending}
          onClick={handleContacted}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Processing..." : "Mark Contacted"}
        </button>
      )}

      <button
        type="button"
        disabled={isPending}
        onClick={handleApprove}
        className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Processing..." : "Approve & Enroll"}
      </button>

      <button
        type="button"
        disabled={isPending}
        onClick={handleReject}
        className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Reject
      </button>

      {result && (
        <div className="w-full">
          <p
            className={`text-xs ${
              result.success
                ? "text-emerald-600"
                : "text-red-600"
            }`}
          >
            {result.message}
          </p>

          {result.success && result.studentNumber && (
            <div className="mt-2 rounded-lg bg-slate-50 p-3 text-xs">
              <p className="font-semibold text-slate-900">
                Student Number
              </p>

              <p className="mt-1 font-mono text-slate-600">
                {result.studentNumber}
              </p>
            </div>
          )}

          {result.success && result.temporaryPassword && (
            <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs">
              <p className="font-semibold text-amber-900">
                Temporary Password
              </p>

              <p className="mt-1 font-mono font-bold text-amber-800">
                {result.temporaryPassword}
              </p>

              <p className="mt-2 text-amber-700">
                Give this password to the student securely.
                They should change it after signing in.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}