import type { GiglingFaction } from "@/types";
import { cn } from "@/lib/utils/cn";

const factionStyles: Record<GiglingFaction, string> = {
  ember: "border-orange-racing/35 bg-orange-racing/12 text-orange-200",
  aqua: "border-cyan-racing/35 bg-cyan-racing/12 text-cyan-100",
  terra: "border-emerald-racing/35 bg-emerald-racing/12 text-emerald-100",
  volt: "border-yellow-300/35 bg-yellow-300/12 text-yellow-100",
  shadow: "border-violet-racing/35 bg-violet-racing/12 text-violet-100",
  neutral: "border-white/20 bg-white/8 text-white/80"
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
