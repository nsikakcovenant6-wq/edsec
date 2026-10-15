import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/auth";
import AdminProfileForm from "./profile-form";

export default async function AdminSettingsPage({ searchParams }: { searchParams: Promise<{updated?:string}> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/student");
  const { updated } = await searchParams;
  return <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-950">
    <div className="mx-auto max-w-3xl">
      <Link href="/admin" className="font-semibold text-blue-700">← Admin dashboard</Link>
      <p className="mt-8 text-xs font-bold uppercase tracking-widest text-blue-600">EDSEC administration</p>
      <h1 className="mt-2 text-3xl font-bold">Admin Settings</h1>
      <p className="mt-2 text-slate-600">Update your own administrator name and profile picture.</p>
      {updated === "1" && <p role="status" className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 font-semibold text-emerald-800">Profile updated successfully.</p>}
      <AdminProfileForm firstName={user.firstName || ""} lastName={user.lastName || ""} avatarUrl={user.avatarUrl || ""} />
    </div>
  </main>;
}
