import { notFound } from "next/navigation";
import { verifyCertificate } from "@/app/lib/certificates";

export async function generateMetadata({ params }: { params: Promise<{ certificateId: string }> }) {
  const { certificateId } = await params;
  return { title: `Verify ${certificateId}` };
}

export default async function CertificateVerificationResult({ params }: { params: Promise<{ certificateId: string }> }) {
  const { certificateId } = await params;
  const certificate = await verifyCertificate(decodeURIComponent(certificateId));
  if (!certificate) notFound();

  const valid = certificate.status === "VALID";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-16 text-slate-950 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
          <div className={`px-6 py-8 text-white sm:px-10 ${valid ? "bg-emerald-600" : "bg-red-600"}`}>
            <p className="text-xs font-black uppercase tracking-[0.2em]">EDSEC ICT INSTITUTE</p>
            <div className="mt-5 flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-2xl font-black">{valid ? "✓" : "!"}</span>
              <div>
                <h1 className="text-3xl font-black">{valid ? "Certificate Verified" : "Certificate Revoked"}</h1>
                <p className="mt-1 text-sm text-white/80">Official credential verification record</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-10">
            <div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Certificate ID</p><p className="mt-1 break-all text-lg font-black">{certificate.certificateId}</p></div>
            <div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Status</p><p className={`mt-1 text-lg font-black ${valid ? "text-emerald-600" : "text-red-600"}`}>{valid ? "✓ Verified" : "Revoked"}</p></div>
            <div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Student</p><p className="mt-1 font-bold">{certificate.studentName}</p></div>
            <div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Course</p><p className="mt-1 font-bold">{certificate.courseName}</p></div>
            <div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Issued</p><p className="mt-1 font-bold">{new Date(certificate.issuedAt).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}</p></div>
            {certificate.revocationReason && <div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Reason</p><p className="mt-1 font-bold text-red-700">{certificate.revocationReason}</p></div>}
          </div>

          <div className="border-t border-slate-100 bg-slate-50 px-6 py-5 text-center text-xs leading-5 text-slate-500 sm:px-10">
            This verification page is publicly accessible and does not require an EDSEC account. It confirms the certificate record held by EDSEC ICT INSTITUTE.
          </div>
        </div>
      </div>
    </main>
  );
}
