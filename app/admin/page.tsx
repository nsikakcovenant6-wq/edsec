import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

const adminSections = [
  {
    title: "Website Overview",
    description: "View important website activity and statistics.",
    href: "/admin",
    icon: "◈",
  },
  {
    title: "Courses",
    description: "Add, edit, publish, hide, and manage training programs.",
    href: "/admin/courses",
    icon: "⌘",
  },
  {
    title: "Services",
    description: "Manage the services displayed on the EDSEC website.",
    href: "/admin/services",
    icon: "✦",
  },
  {
    title: "Announcements",
    description: "Create and publish important student announcements.",
    href: "/admin/announcements",
    icon: "!",
  },
  {
    title: "Applications",
    description: "Review student applications and admission information.",
    href: "/admin/applications",
    icon: "↗",
  },
  {
    title: "Students",
    description: "View and manage registered EDSEC students.",
    href: "/admin/students",
    icon: "◎",
  },
  {
    title: "Corporate Training",
    description: "Manage corporate training inquiries and requests.",
    href: "/admin/corporate-training",
    icon: "▣",
  },
  {
    title: "Blog",
    description: "Create, edit, publish, and manage blog articles.",
    href: "/admin/blog",
    icon: "≡",
  },
  {
    title: "Gallery",
    description: "Manage the images and visual content displayed on the site.",
    href: "/admin/gallery",
    icon: "▦",
  },
  {
    title: "Payments & Bank Details",
    description: "Update payment instructions and official bank information.",
    href: "/admin/payments",
    icon: "₦",
  },
  {
    title: "Website Settings",
    description: "Control contact details, statistics, branding, and other site information.",
    href: "/admin/settings",
    icon: "⚙",
  },
];

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN") {
    redirect("/student");
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-6 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              EDSEC Administration
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              Admin Dashboard
            </h1>

            <p className="mt-1 text-slate-600">
              Welcome back, {user.firstName}.
            </p>
          </div>

          <Link
            href="/"
            className="hidden rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:block"
          >
            View Website
          </Link>
        </div>
      </header>

      {/* Main */}
      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        {/* Quick stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            value="—"
            label="Students"
            description="Registered students"
          />

          <StatCard
            value="—"
            label="Applications"
            description="Pending applications"
          />

          <StatCard
            value="—"
            label="Courses"
            description="Active programs"
          />

          <StatCard
            value="—"
            label="Inquiries"
            description="Corporate inquiries"
          />
        </div>

        {/* Management */}
        <div className="mt-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              Management
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-950">
              Control your EDSEC website
            </h2>

            <p className="mt-2 max-w-2xl text-slate-600">
              Everything that administrators should be able to change on the
              public website will eventually be managed from here.
            </p>
          </div>

          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {adminSections.map((section) => (
              <Link
                key={section.title}
                href={section.href}
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/40"
              >
                <div className="flex items-start justify-between">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-lg font-bold text-blue-600">
                    {section.icon}
                  </div>

                  <span className="text-slate-300 transition group-hover:text-blue-600">
                    ↗
                  </span>
                </div>

                <h3 className="mt-5 font-semibold text-slate-950 group-hover:text-blue-600">
                  {section.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {section.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Admin information */}
        <section className="mt-10 rounded-2xl bg-slate-950 p-7 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-400">
            Administrator
          </p>

          <div className="mt-5 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-sm text-slate-400">Name</p>
              <p className="mt-1 font-semibold">
                {user.firstName} {user.lastName}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-400">Email</p>
              <p className="mt-1 break-all font-semibold">
                {user.email}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-400">Role</p>
              <p className="mt-1 font-semibold">
                {user.role}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-400">Account status</p>
              <p className="mt-1 font-semibold">
                {user.status}
              </p>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

function StatCard({
  value,
  label,
  description,
}: {
  value: string;
  label: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <p className="text-3xl font-bold tracking-tight text-slate-950">
        {value}
      </p>

      <p className="mt-2 font-semibold text-slate-900">
        {label}
      </p>

      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
}