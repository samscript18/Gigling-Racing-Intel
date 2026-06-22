import type { GiglingFaction } from "@/types";
import { cn } from "@/lib/utils/cn";

const factionStyles: Record<GiglingFaction, string> = {
  crusader: "border-orange-racing/35 bg-orange-racing/12 text-orange-200",
  overseer: "border-red-300/35 bg-red-300/12 text-red-100",
  athena: "border-cyan-racing/35 bg-cyan-racing/12 text-cyan-100",
  archon: "border-violet-racing/35 bg-violet-racing/12 text-violet-100",
  foxglove: "border-emerald-racing/35 bg-emerald-racing/12 text-emerald-100",
  summoner: "border-fuchsia-300/35 bg-fuchsia-300/12 text-fuchsia-100",
  chobo: "border-yellow-300/35 bg-yellow-300/12 text-yellow-100",
  gigus: "border-white/20 bg-white/8 text-white/80",
  unknown: "border-white/15 bg-white/[0.04] text-white/50"
};

type FactionBadgeProps = {
  faction: GiglingFaction;
  className?: string;
};

export function FactionBadge({ faction, className }: FactionBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold capitalize",
        factionStyles[faction],
        className
      )}
    >
      {faction}
    </span>
  );
}
