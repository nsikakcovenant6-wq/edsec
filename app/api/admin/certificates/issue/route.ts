import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";
import { issueCertificate } from "@/app/lib/certificates";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const enrollmentId = typeof body?.enrollmentId === "string" ? body.enrollmentId.trim() : "";
  if (!enrollmentId) {
    return NextResponse.json({ error: "Enrollment ID is required." }, { status: 400 });
  }

  try {
    const certificateId = await issueCertificate(enrollmentId);
    return NextResponse.json({ success: true, certificateId });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to issue certificate." },
      { status: 400 }
    );
  }
}
