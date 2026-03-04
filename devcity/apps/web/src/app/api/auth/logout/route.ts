// ─── POST /api/auth/logout ──────────────────────────────────────
// Destroys the session and redirects to home.

import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth";

export async function POST() {
  await destroySession();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3001";
  return NextResponse.redirect(baseUrl, { status: 303 });
}

// Also support GET for simple <a> tag logout
export async function GET() {
  await destroySession();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3001";
  return NextResponse.redirect(baseUrl, { status: 303 });
}
