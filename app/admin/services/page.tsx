import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/auth";

const services = [
  ["Website Design & Development", "Business, school, church and e-commerce websites"],
  ["Software Development", "School portals, POS, inventory and custom applications"],
  ["IT Support & Networking", "Computer troubleshooting, network and printer setup"],
  ["Creative & Brand Design", "Logos, flyers, brochures and brand identity"],
  ["Digital Marketing", "Social media, content, SEO and online advertising"],
  ["Corporate Training", "Office productivity, cybersecurity, AI and digital skills"],
];

export default async function AdminServicesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/student");

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-950">
      <div className="mx-auto max-w-6xl">
        <Link href="/admin" className="font-semibold text-blue-700">← Admin dashboard</Link>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div><p className="text-xs font-bold uppercase tracking-widest text-blue-600">EDSEC administration</p>
            <h1 className="mt-2 text-3xl font-bold">Services</h1>
            <p className="mt-2 text-slate-600">Overview of the services currently shown on EDSEC's public website.</p></div>
          <Link href="/services" target="_blank" className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white">View public Services page ↗</Link>
        </div>
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
          <strong>Service editing is not enabled yet.</strong> The public Services page currently uses content defined in the website code. This page lets administrators review the current service list without pretending that changes are saved. A database-backed editor and publishing controls can be added in a subsequent update.
        </div>
        <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map(([name, description], index) => (
            <article key={name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Service {index + 1}</p>
              <h2 className="mt-3 text-lg font-bold">{name}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/admin/sales" className="rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-blue-700">Manage service enquiries →</Link>
          <Link href="/admin" className="rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700">Back to dashboard</Link>
        </div>
      </div>
    </main>
  );
}
