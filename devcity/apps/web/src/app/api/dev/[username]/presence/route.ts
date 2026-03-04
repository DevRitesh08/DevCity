// ─── GET/POST /api/dev/[username]/presence ─────────────────────
// GET: Returns current viewer count for a profile.
// POST: Heartbeat — marks caller as viewing this profile.

import { NextResponse } from "next/server";
import { setPresence, getViewerCount } from "@/lib/presence";

interface RouteParams {
  params: Promise<{ username: string }>;
}

export async function GET(_req: Request, { params }: RouteParams) {
  const { username } = await params;
  const count = getViewerCount(username);
  return NextResponse.json({ login: username, viewers: count });
}

export async function POST(req: Request, { params }: RouteParams) {
  const { username } = await params;
  const body = await req.json().catch(() => ({}));
  const viewerId = (body as { viewerId?: string }).viewerId || `anon-${Math.random().toString(36).slice(2, 8)}`;

  setPresence(viewerId, username);
  const count = getViewerCount(username);

  return NextResponse.json({ login: username, viewers: count, viewerId });
}
