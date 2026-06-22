"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Gauge } from "lucide-react";
import Link from "next/link";

import { FactionBadge } from "@/components/shared/faction-badge";
import { RarityBadge } from "@/components/shared/rarity-badge";
import { cn } from "@/lib/utils/cn";
import { formatPercent, formatToken } from "@/lib/utils/format";
import type { Gigling } from "@/types";

type GiglingCardProps = {
  gigling: Gigling;
  compact?: boolean;
  className?: string;
};

export function GiglingCard({ gigling, compact = false, className }: GiglingCardProps) {
  return (
    <motion.article
      className={cn("premium-panel group rounded-lg p-4", className)}
      whileHover={{ y: -4, scale: 1.01 }}
    >
      <div className="relative z-10">
        <div className="mb-4 flex items-start gap-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-white/12 bg-track-radial">
            <div className="absolute inset-0 bg-racing-grid opacity-45" />
            <div className="absolute inset-x-3 bottom-3 h-2 rounded-full bg-cyan-racing/45 blur-sm" />
            <span className="absolute inset-0 flex items-center justify-center text-xl font-black text-white">
              {gigling.name.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="truncate text-lg font-black text-white">{gigling.name}</h3>
                <p className="text-sm text-white/46">{gigling.tokenId}</p>
              </div>
              <Link
                aria-label={`Open ${gigling.name}`}
                className="rounded-lg border border-white/10 bg-white/[0.04] p-2 text-white/52 transition group-hover:border-cyan-racing/40 group-hover:text-cyan-racing"
                href={`/giglings/${gigling.id}`}
              >
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <FactionBadge faction={gigling.faction} />
              <RarityBadge rarity={gigling.rarity} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
            <p className="text-[11px] uppercase tracking-[0.16em] text-white/36">Win</p>
            <p className="mt-1 text-sm font-bold text-white">{formatPercent(gigling.winRate)}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
            <p className="text-[11px] uppercase tracking-[0.16em] text-white/36">Podium</p>
            <p className="mt-1 text-sm font-bold text-white">{formatPercent(gigling.podiumRate)}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
            <p className="text-[11px] uppercase tracking-[0.16em] text-white/36">Level</p>
            <p className="mt-1 text-sm font-bold text-white">{gigling.level}</p>
          </div>
        </div>

        {!compact ? (
          <div className="mt-4 flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2">
            <span className="flex items-center gap-2 text-sm text-white/58">
              <Gauge className="h-4 w-4 text-orange-racing" />
              {gigling.bestDistance} / {gigling.bestWeather}
            </span>
            <span className="text-sm font-bold text-emerald-racing">
              {formatToken(gigling.earnings)}
            </span>
          </div>
        ) : null}
      </div>
    </motion.article>
  );
}
