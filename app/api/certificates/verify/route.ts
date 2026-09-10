import { NextResponse } from "next/server";
import { verifyCertificate } from "@/app/lib/certificates";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id")?.trim();

  if (!id) {
    return NextResponse.json({ error: "Certificate ID is required." }, { status: 400 });
  }

  const certificate = await verifyCertificate(id);
  if (!certificate) {
    return NextResponse.json({ verified: false }, { status: 404 });
  }

  return NextResponse.json({ verified: true, certificate });
}
