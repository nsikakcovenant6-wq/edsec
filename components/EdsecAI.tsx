"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Bot, ChevronDown, Loader2, MessageCircle, Send, X } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  text: string;
  needsWhatsApp?: boolean;
  whatsappUrl?: string;
};

const starterQuestions = [
  "What courses does EDSEC offer?",
  "How much is Full-Stack?",
  "What is the Launch Promo?",
  "How do I verify an EDSEC certificate?",
];

export default function EdsecAI() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hi! I’m EDSEC AI 👋 I can answer basic questions about EDSEC courses, fees, the Launch Promo, applications, login and certificates. For anything that needs the EDSEC team, I’ll connect you to WhatsApp.",
    },
  ]);

  async function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed || loading) return;

    setInput("");
    setMessages((current) => [...current, { role: "user", text: trimmed }]);
    setLoading(true);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = await response.json();
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: data.answer || data.error || "I could not answer that right now.",
          needsWhatsApp: Boolean(data.needsWhatsApp),
          whatsappUrl: data.whatsappUrl,
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: "I could not connect to EDSEC AI right now. Please chat with the EDSEC team on WhatsApp.",
          needsWhatsApp: true,
          whatsappUrl: "https://wa.me/2348142137101?text=Hello%20EDSEC%2C%20I%20need%20help%20with%20an%20enquiry.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void ask(input);
  }

  return (
    <div className="fixed bottom-5 right-5 z-[70] sm:bottom-6 sm:right-6">
      {open && (
        <section className="mb-3 flex h-[min(620px,calc(100vh-110px))] w-[min(390px,calc(100vw-24px))] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/20">
          <header className="flex items-center justify-between bg-slate-950 px-4 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600"><Bot className="h-5 w-5" /></div>
              <div><p className="font-black">EDSEC AI</p><p className="text-[11px] text-slate-400">Basic information assistant</p></div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close EDSEC AI" className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"><X className="h-5 w-5" /></button>
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className="max-w-[88%]">
                  <div className={`whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === "user" ? "rounded-br-md bg-blue-600 text-white" : "rounded-bl-md border border-slate-200 bg-white text-slate-700"}`}>
                    {message.text}
                  </div>
                  {message.needsWhatsApp && message.whatsappUrl && (
                    <a
                      href={message.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-2 rounded-xl bg-green-500 px-3 py-2 text-xs font-black text-white shadow-sm transition hover:bg-green-600"
                    >
                      <MessageCircle className="h-4 w-4" /> Chat with EDSEC on WhatsApp
                    </a>
                  )}
                </div>
              </div>
            ))}
            {messages.length === 1 && (
              <div className="grid gap-2 pt-1">
                {starterQuestions.map((question) => (
                  <button key={question} onClick={() => void ask(question)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50">{question}</button>
                ))}
              </div>
            )}
            {loading && <div className="flex items-center gap-2 text-xs font-semibold text-slate-400"><Loader2 className="h-4 w-4 animate-spin" />EDSEC AI is checking…</div>}
          </div>

          <div className="border-t border-slate-200 bg-white p-3">
            <form onSubmit={submit} className="flex items-center gap-2">
              <input value={input} onChange={(event) => setInput(event.target.value)} maxLength={600} placeholder="Ask about EDSEC…" aria-label="Ask EDSEC AI" className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
              <button disabled={loading || !input.trim()} aria-label="Send question" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"><Send className="h-4 w-4" /></button>
            </form>
            <div className="mt-2 flex items-center justify-between gap-3 text-[10px] text-slate-400"><span>Basic EDSEC information only.</span><Link href="/verify" className="font-bold text-blue-600">Verify certificates</Link></div>
          </div>
        </section>
      )}

      <button onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? "Close EDSEC AI" : "Open EDSEC AI"} className="ml-auto flex items-center gap-2 rounded-full bg-blue-600 px-4 py-3 text-sm font-black text-white shadow-xl shadow-blue-900/30 transition hover:-translate-y-0.5 hover:bg-blue-700">
        {open ? <ChevronDown className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
        <span>{open ? "Close" : "Ask EDSEC AI"}</span>
      </button>
    </div>
  );
}
