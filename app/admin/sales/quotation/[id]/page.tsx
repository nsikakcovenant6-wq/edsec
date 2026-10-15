import Link from "next/link";
import {notFound} from "next/navigation";
import {getCurrentUser} from "@/app/lib/auth";
import {prisma} from "@/app/lib/prisma";

export const dynamic = "force-dynamic";

export default async function QuotationPage({params}:{params:Promise<{id:string}>}) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") notFound();
  const {id} = await params;
  const lead = await prisma.salesLead.findUnique({where:{id}});
  if (!lead) notFound();
  return (
    <main className="min-h-screen bg-slate-100 px-5 py-10 text-slate-950 print:bg-white print:p-0">
      <div className="mx-auto mb-6 max-w-3xl print:hidden">
        <Link href="/admin/sales" className="font-bold text-blue-700">Back to enquiries</Link>
        <p className="mt-2 text-sm">Use your browser print menu to save this quotation as a PDF.</p>
      </div>
      <article className="mx-auto max-w-3xl bg-white p-10 shadow-lg print:shadow-none">
        <header className="flex flex-wrap justify-between gap-4 border-b-2 border-blue-800 pb-6">
          <div><h1 className="text-3xl font-black text-blue-900">EDSEC ICT Institute</h1><p>Innovate. Educate. Elevate.</p></div>
          <div><h2 className="text-xl font-bold">Service Quotation</h2><p className="text-sm">{lead.reference}</p></div>
        </header>
        <section className="mt-8">
          <p className="text-sm font-bold uppercase text-slate-500">Prepared for</p>
          <h3 className="mt-2 text-xl font-bold">{lead.organization}</h3>
          <p>{lead.contactName}</p><p>{lead.email}</p>
        </section>
        <section className="mt-8"><h3 className="font-bold">Requested scope</h3><p className="mt-3 whitespace-pre-wrap break-words">{lead.requirements}</p></section>
        <section className="mt-8 rounded-xl border p-5">
          <p className="font-semibold">Proposed amount</p>
          <p className="mt-2 text-2xl font-black">{lead.quotationAmount === null ? "To be confirmed" : new Intl.NumberFormat("en-NG",{style:"currency",currency:"NGN"}).format(lead.quotationAmount)}</p>
        </section>
        <p className="mt-8 text-sm text-slate-600">Proposal only, not a receipt. Final scope, payment terms and third-party costs require written agreement.</p>
        <footer className="mt-8 border-t pt-5 text-sm">edsecict.com | edseceducation@gmail.com</footer>
      </article>
    </main>
  );
}
