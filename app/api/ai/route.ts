import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export const runtime = "nodejs";

const MODEL = process.env.EDSEC_AI_MODEL || "gpt-5.6-luna";
const MAX_MESSAGE_LENGTH = 600;
const WHATSAPP_NUMBER = "2348142137101";

const PROMO_PRICES: Record<string, number> = {
  "Microsoft Office Professional": 20_000,
  "Digital Marketing": 20_000,
  "Graphic Design": 20_000,
  "IT Support & Networking": 30_000,
  "Full-Stack Web Development": 50_000,
  "Cloud Computing": 50_000,
  "Data Analysis": 40_000,
  "Virtual Assistant": 20_000,
  "UI/UX Design": 25_000,
  Cybersecurity: 50_000,
};

function naira(value: number) {
  return `₦${value.toLocaleString("en-NG")}`;
}

function whatsappUrl(message = "Hello EDSEC, I need help with an enquiry.") {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * EDSEC AI is intentionally a first-line information assistant, not a general chatbot.
 * Anything account-specific, transactional, complaint-related, corporate, or otherwise
 * beyond normal public information is escalated to EDSEC WhatsApp before calling the AI.
 */
function requiresHumanSupport(message: string) {
  const text = message.toLowerCase();

  const humanPatterns = [
    /\b(my|i)\b.{0,30}\b(balance|owe|payment|receipt|invoice|account|enrollment|enrolment|student number|student id|progress|grade|result|lesson|class|attendance|certificate)\b/,
    /\b(pay|paid|payment|refund|charge|transfer|transaction|bank|account)\b/,
    /\b(application|admission).{0,40}\b(status|rejected|accepted|decision|problem|issue)\b/,
    /\b(login|log in|password|account).{0,40}\b(problem|issue|not working|failed|locked|forgot)\b/,
    /\b(complaint|complain|problem|issue|urgent|support|speak to|talk to|human|staff|admin|administrator|agent)\b/,
    /\b(corporate|company|organisation|organization|staff training|bulk|partnership|partner)\b/,
    /\b(refund|scholarship|discount|installment|instalment|payment plan|special price|negotiat)\b/,
    /\b(technical support|debug|code|coding problem|error|bug|website problem|hosting|domain|server|database|api)\b/,
    /\b(when is my|what is my|where is my|how much do i|have i been|am i)\b/,
    /\b(i want to (speak|talk|contact)|contact (someone|staff|edsec))\b/,
  ];

  return humanPatterns.some((pattern) => pattern.test(text));
}

async function getPublicContext() {
  const courses = await prisma.course.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { displayOrder: "asc" },
    select: {
      title: true,
      shortDescription: true,
      description: true,
      duration: true,
      learningFormat: true,
      requirements: true,
      slug: true,
    },
  });

  return {
    institute: "EDSEC ICT INSTITUTE",
    location: "Oyigbo, Rivers State, Nigeria",
    motto: "Innovate. Educate. Elevate.",
    website: "https://www.edsecict.com",
    applyUrl: "https://www.edsecict.com/apply",
    loginUrl: "https://www.edsecict.com/login",
    verificationUrl: "https://www.edsecict.com/verify",
    launchPromo: {
      active: true,
      message: "EDSEC Launch Promo — learn a professional digital skill from ₦20,000.",
      endDate: process.env.NEXT_PUBLIC_EDSEC_PROMO_END_DATE || "2026-09-30T23:59:59+01:00",
      prices: PROMO_PRICES,
    },
    certificate: {
      name: "EDSEC Certificate of Completion",
      verification:
        "Each issued certificate has a unique certificate ID and can be verified publicly through the EDSEC verification page without an account.",
    },
    courses: courses.map((course) => ({
      ...course,
      promoPrice: PROMO_PRICES[course.title] ? naira(PROMO_PRICES[course.title]) : null,
    })),
  };
}

function extractOutputText(data: any) {
  if (typeof data?.output_text === "string" && data.output_text.trim()) return data.output_text.trim();

  const parts: string[] = [];
  for (const item of data?.output ?? []) {
    for (const content of item?.content ?? []) {
      if (content?.type === "output_text" && typeof content.text === "string") parts.push(content.text);
    }
  }
  return parts.join("\n").trim();
}

function supportResponse(message: string) {
  return {
    answer:
      "That needs help from the EDSEC team so you can get the correct information. Please chat with EDSEC on WhatsApp and a team member will assist you.",
    needsWhatsApp: true,
    whatsappUrl: whatsappUrl(`Hello EDSEC, I need help with this enquiry: ${message}`),
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = typeof body?.message === "string" ? body.message.trim() : "";

    if (!message) return NextResponse.json({ error: "Please enter a question." }, { status: 400 });
    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Please keep your question under ${MAX_MESSAGE_LENGTH} characters.` },
        { status: 400 },
      );
    }

    // Keep complicated/private/transactional matters with a real EDSEC team member.
    if (requiresHumanSupport(message)) {
      return NextResponse.json(supportResponse(message));
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        answer:
          "EDSEC AI is temporarily unavailable. Please chat with EDSEC on WhatsApp and the team will help you.",
        needsWhatsApp: true,
        whatsappUrl: whatsappUrl(`Hello EDSEC, I need help with this enquiry: ${message}`),
      });
    }

    const context = await getPublicContext();

    const instructions = `You are EDSEC AI, the official basic-information assistant for EDSEC ICT INSTITUTE in Oyigbo, Rivers State, Nigeria.

IMPORTANT SCOPE:
You are NOT an all-purpose chatbot. Your job is only to answer normal public questions about EDSEC using the verified context below.

You MAY answer:
- What EDSEC is and where it is located
- Courses EDSEC offers
- Course descriptions and what students learn, when supplied in context
- Public course duration/format/requirements when supplied in context
- Launch Promo information and supplied promo prices
- Whether a course is suitable for beginners, when that can be answered from the supplied requirements/context
- How to apply
- How to log in
- How to verify an EDSEC certificate
- Basic public certificate information
- Basic greetings and simple navigation questions about the website

You MUST NOT answer or guess about:
- A person's application/admission status
- A student's account, payment, balance, receipt, enrollment, progress, grades, attendance, lessons or class schedule
- Refunds, payment plans, discounts or negotiated prices
- Complaints, disputes or urgent issues
- Corporate training, partnerships or custom programmes
- Technical support, coding/debugging or website problems
- Internal EDSEC operations, staff decisions, policies not supplied in context, or anything private
- Any complicated question outside normal public EDSEC information

For any question outside the allowed basic scope, say that EDSEC AI cannot handle that request and direct the person to EDSEC WhatsApp. Never improvise an answer to keep the conversation going.

STYLE:
- Be concise, friendly, professional and easy to understand.
- Answer only from the verified context. Never invent facts, prices, dates, policies, schedules or links.
- Use Nigerian naira formatting such as ₦50,000.
- For applications, direct users to https://www.edsecict.com/apply.
- For login, direct users to https://www.edsecict.com/login.
- For certificate verification, direct users to https://www.edsecict.com/verify.
- If the exact requested public detail is missing from context, direct the person to EDSEC WhatsApp instead of guessing.

VERIFIED EDSEC CONTEXT:
${JSON.stringify(context, null, 2)}`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        instructions,
        input: message,
        max_output_tokens: 350,
      }),
    });

    if (!response.ok) {
      console.error("EDSEC AI provider error:", response.status, await response.text());
      return NextResponse.json(supportResponse(message));
    }

    const data = await response.json();
    const answer = extractOutputText(data);

    if (!answer) return NextResponse.json(supportResponse(message));

    return NextResponse.json({ answer, needsWhatsApp: false });
  } catch (error) {
    console.error("EDSEC AI request failed:", error);
    return NextResponse.json({
      answer: "I could not answer that right now. Please chat with EDSEC on WhatsApp and the team will help you.",
      needsWhatsApp: true,
      whatsappUrl: whatsappUrl("Hello EDSEC, I need help with an enquiry."),
    });
  }
}
