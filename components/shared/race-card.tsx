"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Coins, Users } from "lucide-react";
import Link from "next/link";

import { StatusBadge } from "@/components/shared/status-badge";
import { cn } from "@/lib/utils/cn";
import { formatDateTime, formatToken } from "@/lib/utils/format";
import type { Race } from "@/types";

type RaceCardProps = {
  race: Race;
  className?: string;
};

export function RaceCard({ race, className }: RaceCardProps) {
  const winner = race.participants.find(
    (participant) => participant.giglingId === race.winnerGiglingId
  );
  const itemCount = race.participants.flatMap((participant) => participant.itemsUsed).length;

  return (
    <motion.article
      className={cn("premium-panel group rounded-lg p-4", className)}
      whileHover={{ y: -4, scale: 1.01 }}
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div>
            <StatusBadge status={race.status} />
            <h3 className="mt-3 text-xl font-black text-white">Race #{race.raceNumber}</h3>
            <p className="mt-1 text-sm text-white/46">{formatDateTime(race.startedAt)}</p>
          </div>
          <Link
            aria-label={`Open race ${race.raceNumber}`}
            className="rounded-lg border border-white/10 bg-white/[0.04] p-2 text-white/52 transition group-hover:border-cyan-racing/40 group-hover:text-cyan-racing"
            href={`/races/${race.id}`}
          >
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-5 grid gap-2 text-sm min-[390px]:grid-cols-3">
          <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
            <p className="text-[11px] uppercase tracking-[0.16em] text-white/36">Distance</p>
            <p className="mt-1 font-bold capitalize text-white">{race.distance}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
            <p className="text-[11px] uppercase tracking-[0.16em] text-white/36">Weather</p>
            <p className="mt-1 font-bold capitalize text-white">{race.weather}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
            <p className="text-[11px] uppercase tracking-[0.16em] text-white/36">Track</p>
            <p className="mt-1 font-bold capitalize text-white">{race.trackCondition}</p>
          </div>
        </div>

        <div className="mt-4 grid gap-2 min-[430px]:grid-cols-2">
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-sm text-white/58">
            <Coins className="h-4 w-4 text-emerald-racing" />
            {formatToken(race.prizePool)}
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-sm text-white/58">
            <Users className="h-4 w-4 text-cyan-racing" />
            {race.participants.length} entrants
            {itemCount > 0 ? ` / ${itemCount} items` : ""}
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-sm">
          <span className="text-white/42">Winner: </span>
          <span className="font-bold text-white">{winner?.giglingName ?? "Pending"}</span>
        </div>
      </div>
    </motion.article>
  );
}
