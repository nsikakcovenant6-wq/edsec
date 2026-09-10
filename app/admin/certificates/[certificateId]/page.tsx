import { redirect, notFound } from "next/navigation";
import { getCurrentUser } from "@/app/lib/auth";
import { verifyCertificate } from "@/app/lib/certificates";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.edsecict.com";

export default async function PrintableCertificate({ params }: { params: Promise<{ certificateId: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/student");
  const { certificateId } = await params;
  const certificate = await verifyCertificate(decodeURIComponent(certificateId));
  if (!certificate) notFound();

  const verificationUrl = `${SITE_URL}/verify/${encodeURIComponent(certificate.certificateId)}`;
  const qrUrl = `https://quickchart.io/qr?size=180&margin=1&text=${encodeURIComponent(verificationUrl)}`;

  return (
    <main className="min-h-screen bg-slate-100 p-4 text-slate-950 print:bg-white print:p-0">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 flex items-center justify-between print:hidden">
          <a href="/admin/certificates" className="text-sm font-bold text-blue-600">← Certificate management</a>
          <span className="text-xs font-semibold text-slate-500">Use your browser's Print command</span>
        </div>
        <section className="relative aspect-[1.414/1] overflow-hidden border-[10px] border-blue-700 bg-white p-3 shadow-2xl print:shadow-none">
          <div className="flex h-full flex-col items-center justify-between border-2 border-blue-300 p-[5%] text-center">
            <div><p className="text-sm font-black uppercase tracking-[0.35em] text-blue-700 sm:text-base">EDSEC ICT INSTITUTE</p><p className="mt-4 text-xs font-bold uppercase tracking-[0.25em] text-slate-500 sm:text-sm">Certificate of Completion</p></div>
            <div><p className="font-serif text-lg text-slate-600 sm:text-2xl">This certifies that</p><h1 className="mt-3 border-b border-slate-400 pb-2 font-serif text-2xl font-black text-blue-950 sm:text-4xl">{certificate.studentName}</h1><p className="mt-5 text-xs text-slate-600 sm:text-sm">has successfully completed the requirements for</p><h2 className="mt-2 max-w-2xl text-lg font-black uppercase text-slate-950 sm:text-2xl">{certificate.courseName}</h2></div>
            <div className="grid w-full grid-cols-[1fr_auto_1fr] items-end gap-4 text-left sm:gap-8">
              <div><div className="h-px bg-slate-400" /><p className="mt-1 text-[8px] uppercase tracking-wider text-slate-500 sm:text-[10px]">Authorized Signature</p></div>
              <div className="rounded-lg border border-blue-200 bg-white p-1"><img src={qrUrl} alt="Certificate verification QR code" width={90} height={90} className="h-[70px] w-[70px] sm:h-[90px] sm:w-[90px]" /></div>
              <div className="text-right"><p className="text-[8px] font-black uppercase tracking-wider text-blue-700 sm:text-[10px]">Certificate ID</p><p className="mt-1 text-[9px] font-black sm:text-xs">{certificate.certificateId}</p><p className="mt-1 text-[8px] text-slate-500 sm:text-[10px]">Issued {new Date(certificate.issuedAt).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}</p></div>
            </div>
            <p className="text-[7px] text-slate-400 sm:text-[9px]">Scan the QR code to verify this credential at EDSEC ICT INSTITUTE.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
