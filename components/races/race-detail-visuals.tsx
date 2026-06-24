"use client";

import { motion } from "framer-motion";
import { Crosshair, Flag, Shield, Sparkles, Trophy, Zap } from "lucide-react";

import { FactionBadge } from "@/components/shared/faction-badge";
import { RarityBadge } from "@/components/shared/rarity-badge";
import type { RaceItemUsage, RaceParticipant } from "@/types";

export type RaceTimelineItem = RaceItemUsage & {
  giglingName: string;
  targetGiglingName?: string;
};

type PlacementLadderProps = {
  participants: RaceParticipant[];
  winnerGiglingId?: string;
};

type ItemTimelineProps = {
  items: RaceTimelineItem[];
};

const itemIcons: Record<RaceItemUsage["type"], typeof Zap> = {
  boost: Zap,
  sabotage: Crosshair,
  defense: Shield,
  utility: Sparkles
};

const stageOrder: Record<RaceItemUsage["usedAtStage"], number> = {
  start: 0,
  mid: 1,
  finish: 2
};

export function PlacementLadder({ participants, winnerGiglingId }: PlacementLadderProps) {
  const sortedParticipants = [...participants].sort((first, second) => {
    const firstPosition = first.finalPosition ?? 99 + first.startingLane;
    const secondPosition = second.finalPosition ?? 99 + second.startingLane;

    return firstPosition - secondPosition;
  });
  const topScore = Math.max(
    ...sortedParticipants.map((participant) => participant.performanceScore ?? 0),
    1
  );

  return (
    <div className="space-y-3">
      {sortedParticipants.map((participant, index) => {
        const isWinner = participant.giglingId === winnerGiglingId;
        const score = participant.performanceScore ?? 0;
        const width = `${Math.max(8, (score / topScore) * 100)}%`;

        return (
          <motion.div
            key={participant.giglingId}
            animate={{ opacity: 1, x: 0 }}
            className={`rounded-lg border p-3 ${
              isWinner
                ? "border-orange-racing/35 bg-orange-racing/10 shadow-orange-glow"
                : "border-white/10 bg-white/[0.035]"
            }`}
            initial={{ opacity: 0, x: -12 }}
            transition={{ delay: index * 0.045, duration: 0.22 }}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border text-sm font-black ${
                    isWinner
                      ? "border-orange-racing/45 bg-orange-racing/14 text-orange-racing"
                      : "border-white/10 bg-white/[0.04] text-white/66"
                  }`}
                >
                  {participant.finalPosition ? `P${participant.finalPosition}` : `L${participant.startingLane}`}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-black text-white">{participant.giglingName}</p>
                    {isWinner ? <Trophy className="h-4 w-4 text-orange-racing" /> : null}
                  </div>
                  <p className="mt-1 text-xs text-white/42">
                    Lane {participant.startingLane} / {participant.ownerName ?? "Owner unavailable"}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <FactionBadge faction={participant.faction} />
                <RarityBadge rarity={participant.rarity} />
              </div>
            </div>
            <div className="mt-3">
              <div className="mb-1 flex justify-between text-xs text-white/42">
                <span>Performance score</span>
                <span>{participant.performanceScore ?? "Pending"}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/8">
                <motion.div
                  animate={{ width }}
                  className="h-full rounded-full bg-gradient-to-r from-cyan-racing via-violet-racing to-orange-racing"
                  initial={{ width: "0%" }}
                  transition={{ delay: index * 0.05, duration: 0.45, ease: "easeOut" }}
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export function ItemTimeline({ items }: ItemTimelineProps) {
  const sortedItems = [...items].sort(
    (first, second) => stageOrder[first.usedAtStage] - stageOrder[second.usedAtStage]
  );

  if (sortedItems.length === 0) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4 text-sm text-white/54">
        No item usage recorded for this race. Outcome analysis leans more heavily on stats,
        conditions, and lane execution.
      </div>
    );
  }

  return (
    <div className="relative space-y-3">
      <div className="absolute bottom-3 left-5 top-3 w-px bg-gradient-to-b from-cyan-racing/50 via-violet-racing/40 to-orange-racing/50" />
      {sortedItems.map((item, index) => {
        const Icon = itemIcons[item.type];

        return (
          <motion.div
            key={item.id}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 flex gap-3"
            initial={{ opacity: 0, y: 12 }}
            transition={{ delay: index * 0.06, duration: 0.22 }}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-cyan-racing/30 bg-cyan-racing/10 text-cyan-racing shadow-glow">
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/[0.035] p-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-black text-white">{item.itemName}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-orange-racing">
                    {item.usedAtStage} split / {item.type}
                  </p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-bold text-white/66">
                  Impact {item.impact}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-white/54">
                {item.giglingName}
                {item.targetGiglingName ? ` targeted ${item.targetGiglingName}` : " used this into the field"}.
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export function RaceConditionStrip({
  distance,
  trackCondition
}: {
  distance: string;
  trackCondition: string;
}) {
  const items = [
    { label: "Distance", value: distance },
    { label: "Condition", value: trackCondition }
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.label} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/38">
            <Flag className="h-3.5 w-3.5 text-cyan-racing" />
            {item.label}
          </div>
          <p className="mt-2 text-xl font-black capitalize text-white">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
