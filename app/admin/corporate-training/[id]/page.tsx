import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";

import {
  deleteCorporateInquiry,
  updateCorporateInquiry,
} from "../actions";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(date);
}

export default async function CorporateTrainingInquiryPage({
  params,
}: PageProps) {
  await requireRole("ADMIN");

  const { id } = await params;

  const inquiry = await prisma.corporateInquiry.findUnique({
    where: {
      id,
    },
  });

  if (!inquiry) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
            <Link
              href="/admin"
              className="hover:text-slate-950"
            >
              Admin
            </Link>

            <span>/</span>

            <Link
              href="/admin/corporate-training"
              className="hover:text-slate-950"
            >
              Corporate Training
            </Link>

            <span>/</span>

            <span>Inquiry</span>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                {inquiry.organization}
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Submitted {formatDate(inquiry.createdAt)}
              </p>
            </div>

            <Link
              href="/admin/corporate-training"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              ← Back to Inquiries
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main information */}
          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-6 py-5">
                <h2 className="text-lg font-bold text-slate-950">
                  Organization Information
                </h2>
              </div>

              <div className="grid gap-6 p-6 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Organization
                  </p>

                  <p className="mt-2 font-semibold text-slate-950">
                    {inquiry.organization}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Organization Type
                  </p>

                  <p className="mt-2 font-semibold text-slate-950">
                    {inquiry.organizationType || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Contact Person
                  </p>

                  <p className="mt-2 font-semibold text-slate-950">
                    {inquiry.contactName}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Email
                  </p>

                  <a
                    href={`mailto:${inquiry.email}`}
                    className="mt-2 block font-semibold text-slate-950 hover:underline"
                  >
                    {inquiry.email}
                  </a>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Phone
                  </p>

                  {inquiry.phone ? (
                    <a
                      href={`tel:${inquiry.phone}`}
                      className="mt-2 block font-semibold text-slate-950 hover:underline"
                    >
                      {inquiry.phone}
                    </a>
                  ) : (
                    <p className="mt-2 font-semibold text-slate-400">
                      Not provided
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Preferred Format
                  </p>

                  <p className="mt-2 font-semibold text-slate-950">
                    {inquiry.preferredFormat || "Not provided"}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-6 py-5">
                <h2 className="text-lg font-bold text-slate-950">
                  Training Requirements
                </h2>
              </div>

              <div className="space-y-6 p-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Training Needs
                  </p>

                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                    {inquiry.trainingNeeds}
                  </p>
                </div>

                {inquiry.message && (
                  <div className="border-t border-slate-100 pt-6">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Additional Message
                    </p>

                    <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                      {inquiry.message}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Admin editing */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-6 py-5">
                <h2 className="text-lg font-bold text-slate-950">
                  Manage Inquiry
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update the inquiry details and internal notes.
                </p>
              </div>

              <form
                action={updateCorporateInquiry}
                className="space-y-6 p-6"
              >
                <input
                  type="hidden"
                  name="id"
                  value={inquiry.id}
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="organization"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Organization
                    </label>

                    <input
                      id="organization"
                      name="organization"
                      defaultValue={inquiry.organization}
                      required
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contactName"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Contact Name
                    </label>

                    <input
                      id="contactName"
                      name="contactName"
                      defaultValue={inquiry.contactName}
                      required
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Email
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={inquiry.email}
                      required
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Phone
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      defaultValue={inquiry.phone || ""}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="organizationType"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Organization Type
                    </label>

                    <select
                      id="organizationType"
                      name="organizationType"
                      defaultValue={inquiry.organizationType || ""}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
                    >
                      <option value="">
                        Select organization type
                      </option>
                      <option value="Bank">
                        Bank / Financial Institution
                      </option>
                      <option value="Hospital">
                        Hospital / Healthcare
                      </option>
                      <option value="Hotel">
                        Hotel / Hospitality
                      </option>
                      <option value="School">
                        School / Educational Institution
                      </option>
                      <option value="Church">
                        Church / Religious Organization
                      </option>
                      <option value="Retail">
                        Retail / Business
                      </option>
                      <option value="Government">
                        Government
                      </option>
                      <option value="NGO">
                        NGO
                      </option>
                      <option value="Technology">
                        Technology Company
                      </option>
                      <option value="Other">
                        Other
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="preferredFormat"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Preferred Format
                    </label>

                    <select
                      id="preferredFormat"
                      name="preferredFormat"
                      defaultValue={inquiry.preferredFormat || ""}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
                    >
                      <option value="">
                        Select format
                      </option>
                      <option value="On-site">
                        On-site
                      </option>
                      <option value="Online">
                        Online
                      </option>
                      <option value="Hybrid">
                        Hybrid
                      </option>
                      <option value="Flexible">
                        Flexible
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="trainingNeeds"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Training Needs
                  </label>

                  <textarea
                    id="trainingNeeds"
                    name="trainingNeeds"
                    defaultValue={inquiry.trainingNeeds}
                    required
                    rows={6}
                    className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Additional Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    defaultValue={inquiry.message || ""}
                    rows={4}
                    className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="status"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Status
                  </label>

                  <select
                    id="status"
                    name="status"
                    defaultValue={inquiry.status}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
                  >
                    <option value="NEW">New</option>
                    <option value="CONTACTED">
                      Contacted
                    </option>
                    <option value="IN_PROGRESS">
                      In Progress
                    </option>
                    <option value="COMPLETED">
                      Completed
                    </option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="adminNotes"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Internal Admin Notes
                  </label>

                  <textarea
                    id="adminNotes"
                    name="adminNotes"
                    defaultValue={inquiry.adminNotes || ""}
                    rows={5}
                    placeholder="Add private notes about this inquiry..."
                    className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800 sm:w-auto"
                >
                  Save Changes
                </button>
              </form>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Current Status
              </p>

              <div className="mt-3">
                <span className="inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">
                  {inquiry.status
                    .replaceAll("_", " ")
                    .toLowerCase()
                    .replace(/\b\w/g, (letter) =>
                      letter.toUpperCase(),
                    )}
                </span>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-bold text-slate-950">
                Contact
              </h2>

              <div className="mt-5 space-y-4">
                <a
                  href={`mailto:${inquiry.email}`}
                  className="block rounded-xl bg-slate-50 p-4 transition hover:bg-slate-100"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Email
                  </p>

                  <p className="mt-1 break-all text-sm font-semibold text-slate-800">
                    {inquiry.email}
                  </p>
                </a>

                {inquiry.phone && (
                  <a
                    href={`tel:${inquiry.phone}`}
                    className="block rounded-xl bg-slate-50 p-4 transition hover:bg-slate-100"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Phone
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {inquiry.phone}
                    </p>
                  </a>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
              <h2 className="font-bold text-red-700">
                Danger Zone
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Deleting this inquiry permanently removes it from
                the EDSEC admin system.
              </p>

              <form
                action={deleteCorporateInquiry}
                className="mt-5"
              >
                <input
                  type="hidden"
                  name="id"
                  value={inquiry.id}
                />

                <button
                  type="submit"
                  className="w-full rounded-xl border border-red-200 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50"
                >
                  Delete Inquiry
                </button>
              </form>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}