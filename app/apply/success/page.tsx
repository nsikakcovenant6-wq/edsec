import Link from "next/link";
import { CheckCircle2, ArrowRight, Home, MessageCircle } from "lucide-react";

export const metadata = {
  title: "Application Submitted | EDSEC",
  description:
    "Your EDSEC Computer Training application has been submitted successfully.",
};

export default function ApplicationSuccessPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <section className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
        <div className="w-full rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200 sm:p-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
            <CheckCircle2 className="h-11 w-11 text-green-600" />
          </div>

          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            EDSEC Computer Training
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Application Submitted Successfully!
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-600">
            Thank you for applying to EDSEC. We have received your application
            and our team will review your information.
          </p>

          <div className="mx-auto mt-8 max-w-xl rounded-2xl bg-slate-50 p-5 text-left ring-1 ring-slate-200">
            <h2 className="font-semibold text-slate-950">
              What happens next?
            </h2>

            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <p>
                <span className="font-semibold text-slate-900">1.</span>{" "}
                Our team will review your application.
              </p>

              <p>
                <span className="font-semibold text-slate-900">2.</span>{" "}
                We will contact you using the phone number or email you
                provided.
              </p>

              <p>
                <span className="font-semibold text-slate-900">3.</span>{" "}
                We will provide you with the next steps for your selected
                training programme.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Link>

            <Link
              href="/courses"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              Explore Courses
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 border-t border-slate-200 pt-6">
            <p className="text-sm text-slate-500">
              Need help or have questions?
            </p>

            <a
              href="https://wa.me/2348142137101"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-green-600 transition hover:text-green-700"
            >
              <MessageCircle className="h-4 w-4" />
              Contact EDSEC on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}