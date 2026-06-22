"use client";

import { CircleHelp } from "lucide-react";
import { useId } from "react";

import { racingMechanics, type RacingMechanic } from "@/lib/gigaverse/mechanics";
import { cn } from "@/lib/utils/cn";

type MechanicTooltipProps = {
  mechanic: RacingMechanic;
  className?: string;
};

export function MechanicTooltip({ mechanic, className }: MechanicTooltipProps) {
  const tooltipId = useId();
  const content = racingMechanics[mechanic];

  return (
    <span className={cn("group relative inline-flex", className)}>
      <button
        aria-describedby={tooltipId}
        aria-label={`Explain ${content.label}`}
        className="flex h-7 w-7 items-center justify-center rounded-md text-white/36 transition hover:bg-white/[0.06] hover:text-cyan-racing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-racing/60"
        type="button"
      >
        <CircleHelp className="h-4 w-4" />
      </button>
      <span
        className="pointer-events-none invisible absolute left-1/2 top-full z-50 mt-2 w-72 -translate-x-1/2 rounded-lg border border-cyan-racing/20 bg-[#07101d]/98 p-3 text-left opacity-0 shadow-glow backdrop-blur-xl transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
        id={tooltipId}
        role="tooltip"
      >
        <span className="block text-xs font-black uppercase tracking-[0.16em] text-cyan-racing">
          {content.label}
        </span>
        <span className="mt-2 block text-xs leading-5 text-white/68">
          {content.explanation}
        </span>
        <span className="mt-2 block border-t border-white/10 pt-2 text-xs leading-5 text-orange-100/75">
          Strategy: {content.strategy}
        </span>
      </span>
    </span>
  );
}
