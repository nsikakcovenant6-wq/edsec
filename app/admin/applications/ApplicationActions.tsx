"use client";

import { useState, useTransition } from "react";
import { approveAndEnroll, deleteApplication, markApplicationContacted, rejectApplication } from "./actions";

type Props = { applicationId: string; status: string };
type Result = { success: boolean; message: string; studentNumber?: string; activationUrl?: string; whatsappUrl?: string };

export default function ApplicationActions({ applicationId, status }: Props) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<Result | null>(null);

  function run(action: () => Promise<Result>) {
    startTransition(async () => {
      const response = await action();
      setResult(response);
      if (response.success) window.location.reload();
    });
  }

  function handleApprove() {
    if (!window.confirm("Approve this application, create/upgrade the student account, and enroll the applicant in the selected course?")) return;
    run(() => approveAndEnroll(applicationId));
  }

  function handleContacted() { run(() => markApplicationContacted(applicationId)); }

  function handleReject() {
    if (!window.confirm("Are you sure you want to reject this application?")) return;
    run(() => rejectApplication(applicationId));
  }

  function handleDelete() {
    if (!window.confirm("Delete this application permanently? The student's account, profile, enrollment, and other student records will NOT be deleted.")) return;
    run(() => deleteApplication(applicationId));
  }

  return (
    <div className="flex flex-wrap gap-2">
      {status !== "APPROVED" && status !== "REJECTED" && (
        <>
          {status !== "CONTACTED" && <button type="button" disabled={isPending} onClick={handleContacted} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">{isPending ? "Processing..." : "Mark Contacted"}</button>}
          <button type="button" disabled={isPending} onClick={handleApprove} className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50">{isPending ? "Processing..." : "Approve & Enroll"}</button>
          <button type="button" disabled={isPending} onClick={handleReject} className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50">Reject</button>
        </>
      )}

      {status === "APPROVED" && <span className="inline-flex rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">Approved & Enrolled</span>}
      {status === "REJECTED" && <span className="inline-flex rounded-full bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">Rejected</span>}

      <button type="button" disabled={isPending} onClick={handleDelete} className="inline-flex rounded-lg border border-red-300 bg-white px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50">{isPending ? "Deleting..." : "Delete"}</button>

      {result && (
        <div className="w-full rounded-xl bg-slate-50 p-3">
          <p className={`text-xs ${result.success ? "text-emerald-700" : "text-red-600"}`}>{result.message}</p>
          {result.success && result.studentNumber && <p className="mt-2 text-xs font-semibold text-slate-700">Student No: <span className="font-mono">{result.studentNumber}</span></p>}
          {result.success && result.activationUrl && <a href={result.activationUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700">Open Activation Link</a>}
          {result.success && result.whatsappUrl && <a href={result.whatsappUrl} target="_blank" rel="noreferrer" className="mt-2 ml-2 inline-flex rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100">Send via WhatsApp</a>}
        </div>
      )}
    </div>
  );
}
