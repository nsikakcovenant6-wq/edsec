"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type AuthButtonsProps = {
  isLoggedIn: boolean;
  role?: string | null;
};

export default function AuthButtons({
  isLoggedIn,
  role,
}: AuthButtonsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    try {
      setLoading(true);

      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      setLoading(false);
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-500 hover:text-blue-600"
        >
          Login
        </Link>

        <Link
          href="/apply"
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Apply Now
        </Link>
      </div>
    );
  }

  const dashboardHref = role === "ADMIN"
    ? "/admin"
    : "/student/dashboard";

  return (
    <div className="flex items-center gap-3">
      <Link
        href={dashboardHref}
        className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-500 hover:text-blue-600"
      >
        Dashboard
      </Link>

      <button
        type="button"
        onClick={handleLogout}
        disabled={loading}
        className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Logging out..." : "Logout"}
      </button>
    </div>
  );
}