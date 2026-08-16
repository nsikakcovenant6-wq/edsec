import type { Metadata } from "next";
import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: {
    default: "EDSEC Computer Training",
    template: "%s | EDSEC Computer Training",
  },
  description:
    "EDSEC — Educational Services Consultancy. Practical technology education, digital skills and technology solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white antialiased">
        <Navbar />

        {children}

        <Footer />

        <WhatsAppButton />
      </body>
    </html>
  );
}