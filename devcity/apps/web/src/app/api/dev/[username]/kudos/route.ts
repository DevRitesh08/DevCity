// ─── POST /api/dev/[username]/kudos ─────────────────────────────
// Give kudos to a developer. Returns the new kudos count.

import { NextRequest, NextResponse } from "next/server";
import { giveKudos, getDeveloper } from "@/lib/developer-store";

interface RouteContext {
  params: Promise<{ username: string }>;
}

export async function POST(_request: NextRequest, context: RouteContext) {
  const { username } = await context.params;

  const dev = await getDeveloper(username);
  if (!dev) {
    return NextResponse.json(
      { error: "Developer not found — visit their profile first" },
      { status: 404 },
    );
  }

  const newCount = await giveKudos(username);
  return NextResponse.json({ kudos: newCount });
}
