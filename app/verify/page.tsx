import { redirect } from "next/navigation";
import { verifyCertificate } from "@/app/lib/certificates";

export const metadata = {
  title: "Verify Certificate",
  description: "Verify an EDSEC ICT Institute certificate by certificate ID.",
};

export default async function VerifyCertificatePage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const params = await searchParams;
  const id = params.id?.trim();
  const certificate = id ? await verifyCertificate(id) : null;

  async function submit(formData: FormData) {
    "use server";
    const value = String(formData.get("certificateId") || "").trim();
    if (value) redirect(`/verify/${encodeURIComponent(value)}`);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-16 text-slate-950 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-10">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">EDSEC ICT INSTITUTE</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Certificate Verification</h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">Enter the certificate ID printed on an EDSEC certificate to confirm its authenticity.</p>
          </div>

          <form action={submit} className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
            <input name="certificateId" defaultValue={id || ""} placeholder="EDSEC-2026-XXXXXXXX" className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold uppercase tracking-wide outline-none ring-blue-600 transition focus:ring-2" required />
            <button className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700">Verify Certificate</button>
          </form>

          {id && !certificate && (
            <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-center">
              <p className="font-bold text-red-800">Certificate not found</p>
              <p className="mt-1 text-sm text-red-700">Check the certificate ID and try again.</p>
            </div>
          )}

          {certificate && (
            <div className="mt-8 overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50">
              <div className="flex items-center gap-3 border-b border-emerald-200 px-5 py-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-lg font-black text-white">✓</span>
                <div>
                  <p className="font-black text-emerald-900">{certificate.status === "VALID" ? "Certificate Verified" : "Certificate Revoked"}</p>
                  <p className="text-xs text-emerald-700">Official EDSEC verification record</p>
                </div>
              </div>
              <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-7">
                <div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Certificate ID</p><p className="mt-1 font-black text-slate-950">{certificate.certificateId}</p></div>
                <div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Status</p><p className="mt-1 font-black text-emerald-700">{certificate.status === "VALID" ? "✓ Verified" : "Revoked"}</p></div>
                <div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Student</p><p className="mt-1 font-bold text-slate-950">{certificate.studentName}</p></div>
                <div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Course</p><p className="mt-1 font-bold text-slate-950">{certificate.courseName}</p></div>
                <div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Issued</p><p className="mt-1 font-bold text-slate-950">{new Date(certificate.issuedAt).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}</p></div>
                {certificate.revocationReason && <div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Revocation reason</p><p className="mt-1 font-bold text-red-700">{certificate.revocationReason}</p></div>}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
