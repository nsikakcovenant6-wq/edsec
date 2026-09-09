// app/student/page.tsx

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/auth";

export const dynamic = "force-dynamic";

export default async function StudentEntryPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role === "ADMIN") {
    redirect("/admin");
  }

  redirect("/student/dashboard");
}