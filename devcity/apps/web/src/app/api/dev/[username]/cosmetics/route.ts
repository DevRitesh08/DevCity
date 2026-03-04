// ─── POST /api/dev/[username]/cosmetics ────────────────────────
// Equip or unequip a cosmetic for the authenticated user.

import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { equipCosmetic, unequipCosmetic, getEquippedCosmetics, COSMETICS, isCosmeticUnlocked } from "@/lib/cosmetics";
import { getAchievements } from "@/lib/achievements";
import { getDeveloper } from "@/lib/developer-store";
import type { CosmeticSlot } from "@/lib/cosmetics";

interface RouteParams {
  params: Promise<{ username: string }>;
}

export async function GET(_req: Request, { params }: RouteParams) {
  const { username } = await params;
  const equipped = getEquippedCosmetics(username);
  return NextResponse.json({ login: username, equipped });
}

export async function POST(req: Request, { params }: RouteParams) {
  const { username } = await params;

  // Must be authenticated and operating on own profile
  const user = await getSessionUser();
  if (!user || user.login !== username) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Building must be claimed before customization is allowed
  const devRecord = await getDeveloper(username);
  if (!devRecord?.claimed) {
    return NextResponse.json(
      { error: "Building must be claimed before customizing" },
      { status: 403 },
    );
  }

  const body = await req.json();
  const { action, cosmeticId, slot } = body as {
    action: "equip" | "unequip";
    cosmeticId?: string;
    slot?: CosmeticSlot;
  };

  if (action === "unequip" && slot) {
    unequipCosmetic(username, slot);
    return NextResponse.json({ success: true, equipped: getEquippedCosmetics(username) });
  }

  if (action === "equip" && cosmeticId) {
    // Verify cosmetic exists and is unlocked
    const def = COSMETICS.find((c) => c.id === cosmeticId);
    if (!def) {
      return NextResponse.json({ error: "Cosmetic not found" }, { status: 404 });
    }

    const achievements = getAchievements(username);
    const achIds = new Set(achievements.map((a) => a.id));
    const kudosCount = devRecord.kudos_count;

    if (!isCosmeticUnlocked(def.unlockCondition, achIds, kudosCount)) {
      return NextResponse.json({ error: "Cosmetic not unlocked" }, { status: 403 });
    }

    equipCosmetic(username, cosmeticId);
    return NextResponse.json({ success: true, equipped: getEquippedCosmetics(username) });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
