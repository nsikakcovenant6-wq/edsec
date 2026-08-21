import Link from "next/link";

import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";
import {
  deleteCorporateInquiry,
  updateCorporateInquiryStatus,
} from "./actions";

export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function statusLabel(status: string) {
  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function statusClass(status: string) {
  switch (status) {
    case "NEW":
      return "bg-blue-50 text-blue-700 ring-blue-600/20";

    case "CONTACTED":
      return "bg-yellow-50 text-yellow-700 ring-yellow-600/20";

    case "IN_PROGRESS":
      return "bg-purple-50 text-purple-700 ring-purple-600/20";

    case "COMPLETED":
      return "bg-green-50 text-green-700 ring-green-600/20";

    case "CLOSED":
      return "bg-gray-100 text-gray-700 ring-gray-600/20";

    default:
      return "bg-gray-100 text-gray-700 ring-gray-600/20";
  }
}

export default async function CorporateTrainingAdminPage() {
  await requireRole("ADMIN");

  const inquiries = await prisma.corporateInquiry.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = inquiries.length;
  const newCount = inquiries.filter(
    (item) => item.status === "NEW",
  ).length;

  const contactedCount = inquiries.filter(
    (item) => item.status === "CONTACTED",
  ).length;

  const inProgressCount = inquiries.filter(
    (item) => item.status === "IN_PROGRESS",
  ).length;

  const completedCount = inquiries.filter(
    (item) => item.status === "COMPLETED",
  ).length;

  const closedCount = inquiries.filter(
    (item) => item.status === "CLOSED",
  ).length;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
              <Link
                href="/admin"
                className="transition hover:text-slate-900"
              >
                Admin
              </Link>

              <span>/</span>

              <span>Corporate Training</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
              Corporate Training Inquiries
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Manage organizations requesting employee training,
              workshops, technical training, and professional development
              services from EDSEC.
            </p>
          </div>

          <Link
            href="/corporate-training"
            target="_blank"
            className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            View Public Form
          </Link>
        </div>

        {/* Statistics */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-950">
              {total}
            </p>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-blue-600">
              New
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-950">
              {newCount}
            </p>
          </div>

          <div className="rounded-2xl border border-yellow-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-yellow-600">
              Contacted
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-950">
              {contactedCount}
            </p>
          </div>

          <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-purple-600">
              In Progress
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-950">
              {inProgressCount}
            </p>
          </div>

          <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-green-600">
              Completed
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-950">
              {completedCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Closed
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-950">
              {closedCount}
            </p>
          </div>
        </section>

        {/* Inquiry list */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-lg font-bold text-slate-950">
              Training Requests
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Review and manage corporate training requests.
            </p>
          </div>

          {inquiries.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                🏢
              </div>

              <h3 className="mt-5 text-lg font-semibold text-slate-950">
                No inquiries yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Corporate training requests submitted through the
                website will appear here.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Organization
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Contact
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Training Needs
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Status
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Date
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200 bg-white">
                    {inquiries.map((inquiry) => (
                      <tr
                        key={inquiry.id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-6 py-5 align-top">
                          <div className="font-semibold text-slate-950">
                            {inquiry.organization}
                          </div>

                          {inquiry.organizationType && (
                            <div className="mt-1 text-xs text-slate-500">
                              {inquiry.organizationType}
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-5 align-top">
                          <div className="font-medium text-slate-800">
                            {inquiry.contactName}
                          </div>

                          <a
                            href={`mailto:${inquiry.email}`}
                            className="mt-1 block text-sm text-slate-500 hover:text-slate-950"
                          >
                            {inquiry.email}
                          </a>

                          {inquiry.phone && (
                            <a
                              href={`tel:${inquiry.phone}`}
                              className="mt-1 block text-sm text-slate-500 hover:text-slate-950"
                            >
                              {inquiry.phone}
                            </a>
                          )}
                        </td>

                        <td className="max-w-xs px-6 py-5 align-top">
                          <p className="line-clamp-3 text-sm leading-6 text-slate-600">
                            {inquiry.trainingNeeds}
                          </p>

                          {inquiry.preferredFormat && (
                            <p className="mt-2 text-xs font-medium text-slate-500">
                              Format: {inquiry.preferredFormat}
                            </p>
                          )}
                        </td>

                        <td className="px-6 py-5 align-top">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${statusClass(
                              inquiry.status,
                            )}`}
                          >
                            {statusLabel(inquiry.status)}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-6 py-5 align-top text-sm text-slate-500">
                          {formatDate(inquiry.createdAt)}
                        </td>

                        <td className="px-6 py-5 align-top">
                          <div className="flex justify-end gap-2">
                            <Link
                              href={`/admin/corporate-training/${inquiry.id}`}
                              className="rounded-lg bg-slate-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                            >
                              View
                            </Link>

                            <form
                              action={deleteCorporateInquiry}
                            >
                              <input
                                type="hidden"
                                name="id"
                                value={inquiry.id}
                              />

                              <button
                                type="submit"
                                className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                              >
                                Delete
                              </button>
                            </form>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile */}
              <div className="divide-y divide-slate-200 lg:hidden">
                {inquiries.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    className="p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-slate-950">
                          {inquiry.organization}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {inquiry.contactName}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${statusClass(
                          inquiry.status,
                        )}`}
                      >
                        {statusLabel(inquiry.status)}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2 text-sm">
                      <a
                        href={`mailto:${inquiry.email}`}
                        className="block text-slate-600"
                      >
                        {inquiry.email}
                      </a>

                      {inquiry.phone && (
                        <a
                          href={`tel:${inquiry.phone}`}
                          className="block text-slate-600"
                        >
                          {inquiry.phone}
                        </a>
                      )}

                      <p className="leading-6 text-slate-600">
                        {inquiry.trainingNeeds}
                      </p>

                      <p className="text-xs text-slate-400">
                        {formatDate(inquiry.createdAt)}
                      </p>
                    </div>

                    <div className="mt-5 flex gap-2">
                      <Link
                        href={`/admin/corporate-training/${inquiry.id}`}
                        className="flex-1 rounded-lg bg-slate-950 px-4 py-2.5 text-center text-sm font-semibold text-white"
                      >
                        View Inquiry
                      </Link>

                      <form action={deleteCorporateInquiry}>
                        <input
                          type="hidden"
                          name="id"
                          value={inquiry.id}
                        />

                        <button
                          type="submit"
                          className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600"
                        >
                          Delete
                        </button>
                      </form>
                    </div>

                    <div className="mt-4">
                      <form
                        action={updateCorporateInquiryStatus}
                        className="flex gap-2"
                      >
                        <input
                          type="hidden"
                          name="id"
                          value={inquiry.id}
                        />

                        <select
                          name="status"
                          defaultValue={inquiry.status}
                          className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-950"
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

                        <button
                          type="submit"
                          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                        >
                          Save
                        </button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}