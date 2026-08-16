export default function WhatsAppButton() {
  const message = encodeURIComponent(
    "Hello EDSEC, I would like to make an enquiry."
  );

  return (
    <a
      href={`https://wa.me/2348142137101?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with EDSEC on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-xl font-bold text-white shadow-xl transition hover:scale-105 hover:bg-green-400"
    >
      WA
    </a>
  );
}