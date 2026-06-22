import type { GiglingRarity } from "@/types";
import { cn } from "@/lib/utils/cn";

const rarityStyles: Record<GiglingRarity, string> = {
  common: "border-white/15 bg-white/7 text-white/64",
  uncommon: "border-emerald-racing/30 bg-emerald-racing/10 text-emerald-100",
  rare: "border-cyan-racing/30 bg-cyan-racing/10 text-cyan-100",
  epic: "border-violet-racing/35 bg-violet-racing/12 text-violet-100",
  legendary: "border-orange-racing/40 bg-orange-racing/14 text-orange-100",
  unknown: "border-white/15 bg-white/[0.04] text-white/50"
};

type RarityBadgeProps = {
  rarity: GiglingRarity;
  className?: string;
};

export function RarityBadge({ rarity, className }: RarityBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold capitalize",
        rarityStyles[rarity],
        className
      )}
    >
      {rarity}
    </span>
  );
}
