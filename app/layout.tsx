import type { Metadata } from "next";
import "./globals.css";

import Navbar from "@/components/Navbar";
import EdsecPageTransition from "@/components/EdsecPageTransition";
import EdsecImmersiveMenu from "@/components/EdsecImmersiveMenu";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import EdsecAI from "@/components/EdsecAI";

export const metadata: Metadata = {
  metadataBase: new URL("https://edsecict.com"),
  title: {
    default: "EDSEC ICT INSTITUTE",
    template: "%s | EDSEC ICT INSTITUTE",
  },

  description:
    "EDSEC — Educational Services Consultancy. Practical technology education, digital skills and technology solutions.",

  openGraph: {
    type: "website",
    siteName: "EDSEC ICT Institute",
    title: "EDSEC ICT Institute — Innovate. Educate. Elevate.",
    description: "Practical ICT training, school digital platforms and technology solutions in Nigeria.",
    url: "https://edsecict.com",
  },
  twitter: { card: "summary_large_image" },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white antialiased">
        <EdsecPageTransition />
        <Navbar />
        <EdsecImmersiveMenu />


        {children}

        <Footer />

        <WhatsAppButton />
        <EdsecAI />
      </body>
    </html>
  );
}
