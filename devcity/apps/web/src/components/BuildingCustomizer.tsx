// ─── BuildingCustomizer ────────────────────────────────────────
// UI panel for equipping/unequipping cosmetics on your building.
// Only visible when viewing your own profile while authenticated.

"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/components/AuthProvider";
import {
  COSMETICS,
  isCosmeticUnlocked,
  type CosmeticDef,
  type CosmeticSlot,
  type EquippedCosmetic,
} from "@/lib/cosmetics";
import type { UnlockedAchievement } from "@/lib/achievements";

interface BuildingCustomizerProps {
  login: string;
  kudos: number;
  achievements: UnlockedAchievement[];
}

const SLOT_LABELS: Record<CosmeticSlot, string> = {
  roof: "ROOF",
  antenna: "ANTENNA",
  glow: "GLOW",
  banner: "BANNER",
  facade: "FACADE",
};

const SLOTS: CosmeticSlot[] = ["roof", "antenna", "glow", "banner", "facade"];

export default function BuildingCustomizer({ login, kudos, achievements }: BuildingCustomizerProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [equipped, setEquipped] = useState<EquippedCosmetic[]>([]);
  const [activeSlot, setActiveSlot] = useState<CosmeticSlot>("roof");
  const [saving, setSaving] = useState(false);

  const isOwner = user?.login === login;

  const achIds = useMemo(() => new Set(achievements.map((a) => a.id)), [achievements]);

  // Fetch current equipped state
  useEffect(() => {
    fetch(`/api/dev/${login}/cosmetics`)
      .then((r) => r.json())
      .then((data) => setEquipped(data.equipped || []))
      .catch(() => {});
  }, [login]);

  if (!isOwner) return null;

  const equippedMap = new Map(equipped.map((e) => [e.slot, e.cosmeticId]));
  const slotCosmetics = COSMETICS.filter((c) => c.slot === activeSlot);

  async function handleEquip(cosmeticId: string) {
    setSaving(true);
    try {
      const res = await fetch(`/api/dev/${login}/cosmetics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "equip", cosmeticId }),
      });
      if (res.ok) {
        const data = await res.json();
        setEquipped(data.equipped);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleUnequip(slot: CosmeticSlot) {
    setSaving(true);
    try {
      const res = await fetch(`/api/dev/${login}/cosmetics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "unequip", slot }),
      });
      if (res.ok) {
        const data = await res.json();
        setEquipped(data.equipped);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full border-2 border-accent text-accent px-3 py-2 text-xs font-bold hover:bg-accent hover:text-bg transition-colors"
      >
        {open ? "CLOSE CUSTOMIZER" : "🎨 CUSTOMIZE BUILDING"}
      </button>

      {/* Customizer Panel */}
      {open && (
        <div className="mt-2 space-y-3 border-pixel bg-bg p-3">
          {/* Slot Tabs */}
          <div className="flex flex-wrap gap-1">
            {SLOTS.map((slot) => (
              <button
                key={slot}
                onClick={() => setActiveSlot(slot)}
                className={`px-2 py-1 text-[10px] font-bold border transition-all ${
                  activeSlot === slot
                    ? "border-accent text-accent bg-bg-card"
                    : "border-border text-dim hover:text-cream"
                }`}
              >
                {SLOT_LABELS[slot]}
                {equippedMap.has(slot) && " ●"}
              </button>
            ))}
          </div>

          {/* Cosmetics List */}
          <div className="space-y-1">
            {slotCosmetics.map((c) => (
              <CosmeticRow
                key={c.id}
                def={c}
                isEquipped={equippedMap.get(c.slot) === c.id}
                isUnlocked={isCosmeticUnlocked(c.unlockCondition, achIds, kudos)}
                saving={saving}
                onEquip={() => handleEquip(c.id)}
                onUnequip={() => handleUnequip(c.slot)}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

// ─── Single Cosmetic Row ───────────────────────────────────────

function CosmeticRow({
  def,
  isEquipped,
  isUnlocked,
  saving,
  onEquip,
  onUnequip,
}: {
  def: CosmeticDef;
  isEquipped: boolean;
  isUnlocked: boolean;
  saving: boolean;
  onEquip: () => void;
  onUnequip: () => void;
}) {
  return (
    <div
      className={`flex items-center gap-2 border-pixel px-2 py-1.5 text-xs transition-all ${
        isEquipped
          ? "bg-bg-card border-accent"
          : isUnlocked
          ? "bg-bg-card border-border hover:border-border-light"
          : "bg-bg-card border-border opacity-50"
      }`}
    >
      {/* Color preview */}
      <div
        className="h-6 w-6 border border-border flex-shrink-0 flex items-center justify-center text-sm"
        style={{ backgroundColor: def.previewColor + "33" }}
      >
        {def.icon}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="font-bold text-cream truncate">{def.name}</div>
        <div className="text-[10px] text-dim truncate">{def.description}</div>
        {!isUnlocked && (
          <div className="text-[10px] text-muted mt-0.5">
            🔒 {formatCondition(def.unlockCondition)}
          </div>
        )}
      </div>

      {/* Action */}
      {isEquipped ? (
        <button
          onClick={onUnequip}
          disabled={saving}
          className="flex-shrink-0 border border-red-500 text-red-400 px-2 py-0.5 text-[10px] font-bold hover:bg-red-500/20 disabled:opacity-50"
        >
          REMOVE
        </button>
      ) : isUnlocked ? (
        <button
          onClick={onEquip}
          disabled={saving}
          className="flex-shrink-0 border border-accent text-accent px-2 py-0.5 text-[10px] font-bold hover:bg-accent/20 disabled:opacity-50"
        >
          EQUIP
        </button>
      ) : null}
    </div>
  );
}

function formatCondition(condition: string): string {
  if (condition === "free") return "Free";
  if (condition.startsWith("achievement:")) {
    return `Unlock: ${condition.slice("achievement:".length).replace(/_/g, " ")}`;
  }
  if (condition.startsWith("kudos:")) {
    return `Requires ${condition.slice("kudos:".length)} kudos`;
  }
  return condition;
}
