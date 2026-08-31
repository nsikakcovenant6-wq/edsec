"use client";

import Link from "next/link";
import { useState } from "react";
import {
  LogIn,
  LogOut,
  UserPlus,
  LayoutDashboard,
} from "lucide-react";
import { useRouter } from "next/navigation";

type AuthButtonsProps = {
  isLoggedIn: boolean;
  role: string | null;
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

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      setLoading(false);
    }
  }

  /*
   * ---------------------------------------------------------
   * LOGGED OUT
   * ---------------------------------------------------------
   */

  if (!isLoggedIn) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
        >
          <LogIn className="h-4 w-4" />
          Login
        </Link>

        <Link
          href="/register"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <UserPlus className="h-4 w-4" />
          Register
        </Link>
      </div>
    );
  }

  /*
   * ---------------------------------------------------------
   * LOGGED IN
   * ---------------------------------------------------------
   */

  const isAdmin = role === "ADMIN";

  /*
   * Keep the dashboard destinations centralized.
   *
   * ADMIN:
   * /admin
   *
   * STUDENT:
   * /student
   *
   * If your actual student page is /student/dashboard,
   * change only the student value below.
   */

  const dashboardHref = isAdmin ? "/admin" : "/student";

  const dashboardLabel = isAdmin
    ? "Admin Dashboard"
    : "Student Portal";

  return (
    <div className="flex items-center gap-2">
      <Link
        href={dashboardHref}
        className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-100 hover:text-blue-800"
      >
        <LayoutDashboard className="h-4 w-4" />

        {dashboardLabel}
      </Link>

      <button
        type="button"
        onClick={handleLogout}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <LogOut className="h-4 w-4" />

        {loading ? "Logging out..." : "Logout"}
      </button>
    </div>
  );
}