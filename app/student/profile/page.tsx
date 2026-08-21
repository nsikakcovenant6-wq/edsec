import Link from "next/link";
import { redirect } from "next/navigation";

import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

export default async function StudentProfilePage() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");
  if (user.role !== "STUDENT") redirect("/admin");

  const profile = await prisma.studentProfile.findUnique({
    where: {
      userId: user.id,
    },
  });

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-950 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/student/dashboard"
          className="text-sm font-semibold text-blue-600"
        >
          ← Dashboard
        </Link>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-7 sm:p-9">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-2xl bg-blue-50 text-2xl font-bold text-blue-600">
              {user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatarUrl}
                  alt="Student profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                user.firstName.charAt(0).toUpperCase()
              )}
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
                Student Profile
              </p>
              <h1 className="mt-1 text-3xl font-bold">
                {user.firstName} {user.lastName}
              </h1>
              <p className="mt-2 text-slate-500">
                {profile?.studentNumber || "Student number not assigned"}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Info label="First Name" value={user.firstName} />
            <Info label="Last Name" value={user.lastName} />
            <Info label="Email" value={user.email} />
            <Info label="Phone" value={user.phone || "Not provided"} />
            <Info
              label="Educational Level"
              value={profile?.educationalLevel || "Not provided"}
            />
            <Info
              label="Date of Birth"
              value={
                profile?.dateOfBirth
                  ? profile.dateOfBirth.toLocaleDateString()
                  : "Not provided"
              }
            />
            <Info
              label="Address"
              value={profile?.address || "Not provided"}
            />
            <Info
              label="Emergency Contact"
              value={profile?.emergencyContact || "Not provided"}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="mt-2 font-semibold text-slate-900">{value}</p>
    </div>
  );
}