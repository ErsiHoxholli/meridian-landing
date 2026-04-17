import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await req.formData();
  const email = String(data.get("email") ?? "").trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email." },
      { status: 400 }
    );
  }
  console.log("[waitlist]", email);
  return NextResponse.json({ ok: true });
}
