import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/auth";
import { issueCertificate, listCertificateEligibleEnrollments, listCertificates, revokeCertificate } from "@/app/lib/certificates";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.edsecict.com";

export default async function AdminCertificatesPage({ searchParams }: { searchParams: Promise<{ issued?: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/student");

  const [eligible, certificates] = await Promise.all([listCertificateEligibleEnrollments(), listCertificates()]);
  const params = await searchParams;

  async function issue(formData: FormData) {
    "use server";
    const enrollmentId = String(formData.get("enrollmentId") || "").trim();
    const current = await getCurrentUser();
    if (!current || current.role !== "ADMIN") redirect("/login");
    const certificateId = await issueCertificate(enrollmentId);
    redirect(`/admin/certificates?issued=${encodeURIComponent(certificateId)}`);
  }

  async function revoke(formData: FormData) {
    "use server";
    const certificateId = String(formData.get("certificateId") || "").trim();
    const reason = String(formData.get("reason") || "").trim();
    const current = await getCurrentUser();
    if (!current || current.role !== "ADMIN") redirect("/login");
    await revokeCertificate(certificateId, reason);
    redirect("/admin/certificates");
  }

  const issuedUrl = params.issued ? `${SITE_URL}/verify/${encodeURIComponent(params.issued)}` : null;
  const qrUrl = issuedUrl ? `https://quickchart.io/qr?size=260&margin=2&text=${encodeURIComponent(issuedUrl)}` : null;

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">EDSEC ICT INSTITUTE</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight">Certificate Management</h1>
            <p className="mt-2 text-sm text-slate-500">Issue credentials for completed enrollments and manage their public verification status.</p>
          </div>
          <a href="/verify" className="text-sm font-bold text-blue-600 hover:text-blue-700">Open public verifier →</a>
        </div>

        {params.issued && issuedUrl && qrUrl && (
          <section className="mt-8 rounded-3xl border border-emerald-200 bg-emerald-50 p-6 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-emerald-700">Certificate issued</p>
                <h2 className="mt-2 text-2xl font-black text-slate-950">{params.issued}</h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">Print this QR code on the certificate. Scanning it opens the EDSEC verification page without requiring an account.</p>
                <a href={issuedUrl} className="mt-4 inline-flex rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white">Open verification page</a>
              </div>
              <div className="w-fit rounded-2xl bg-white p-3 shadow-sm">
                <img src={qrUrl} alt={`QR code for ${params.issued}`} width={220} height={220} className="h-[220px] w-[220px]" />
              </div>
            </div>
          </section>
        )}

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div>
            <h2 className="text-xl font-black">Ready for certificate issuance</h2>
            <p className="mt-1 text-sm text-slate-500">Only enrollments marked COMPLETED appear here. One certificate is allowed per enrollment.</p>
          </div>

          <div className="mt-6 space-y-3">
            {eligible.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-500">No completed enrollments are waiting for certificates.</div>
            ) : eligible.map((item) => (
              <div key={item.id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-black">{item.studentName}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.courseName}</p>
                </div>
                <form action={issue}>
                  <input type="hidden" name="enrollmentId" value={item.id} />
                  <button className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 sm:w-auto">Issue Certificate</button>
                </form>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-black">Issued certificates</h2>
          <p className="mt-1 text-sm text-slate-500">Public verification remains available even when the verifier is not logged in.</p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead><tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500"><th className="px-3 py-3">Certificate</th><th className="px-3 py-3">Student</th><th className="px-3 py-3">Course</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Action</th></tr></thead>
              <tbody>
                {certificates.map((certificate) => (
                  <tr key={certificate.certificateId} className="border-b border-slate-100">
                    <td className="px-3 py-4 font-black">{certificate.certificateId}</td>
                    <td className="px-3 py-4 font-semibold">{certificate.studentName}</td>
                    <td className="px-3 py-4">{certificate.courseName}</td>
                    <td className="px-3 py-4"><span className={certificate.status === "VALID" ? "font-bold text-emerald-600" : "font-bold text-red-600"}>{certificate.status}</span></td>
                    <td className="px-3 py-4"><div className="flex gap-3"><a className="font-bold text-blue-600" href={`/verify/${encodeURIComponent(certificate.certificateId)}`}>Verify</a>{certificate.status === "VALID" && <form action={revoke}><input type="hidden" name="certificateId" value={certificate.certificateId} /><input type="hidden" name="reason" value="Revoked by EDSEC administrator." /><button className="font-bold text-red-600">Revoke</button></form>}</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {certificates.length === 0 && <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-500">No certificates have been issued yet.</div>}
          </div>
        </section>
      </div>
    </main>
  );
}
