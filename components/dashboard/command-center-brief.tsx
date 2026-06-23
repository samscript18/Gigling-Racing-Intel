"use client";

import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Flag,
  Gauge,
  Radar,
  Trophy,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

import { StatusBadge } from "@/components/shared/status-badge";
import { cn } from "@/lib/utils/cn";
import { formatConditionLabel, formatPercent, formatToken } from "@/lib/utils/format";
import type { GiglingFaction, RaceDistance, RaceStatus, RaceWeather, TrackCondition } from "@/types";

type FeaturedRace = {
  distance: RaceDistance;
  entryFee: number;
  id: string;
  itemActions: number;
  participants: number;
  prizePool: number;
  raceNumber: number;
  status: RaceStatus;
  trackCondition: TrackCondition;
  weather: RaceWeather;
};

type CommandCenterBriefProps = {
  activeRaceCount: number;
  averageConditionScore: number;
  completedRaceCount: number;
  featuredRace?: FeaturedRace;
  itemPressure: number;
  topFaction: {
    faction: GiglingFaction;
    podiumRate: number;
    winRate: number;
  };
  topGigling: {
    name: string;
    winRate: number;
  };
  totalPrizePool: number;
};

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 }
};

const laneStyles = [
  "from-cyan-racing/95 to-violet-racing/70",
  "from-orange-racing/95 to-cyan-racing/70",
  "from-emerald-racing/95 to-orange-racing/70"
];

function clampPercent(value: number) {
  return Math.max(4, Math.min(100, value));
}

function SignalTile({
  icon: Icon,
  label,
  tone,
  value
}: {
  icon: typeof Activity;
  label: string;
  tone: string;
  value: string;
}) {
  return (
    <motion.div className="rounded-lg border border-white/10 bg-white/[0.045] p-4" variants={fadeUp}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/42">{label}</p>
        <Icon className={cn("h-5 w-5", tone)} />
      </div>
      <p className="mt-3 text-2xl font-black text-white">{value}</p>
    </motion.div>
  );
}

export function CommandCenterBrief({
  activeRaceCount,
  averageConditionScore,
  completedRaceCount,
  featuredRace,
  itemPressure,
  topFaction,
  topGigling,
  totalPrizePool
}: CommandCenterBriefProps) {
  const volatility = Math.round(averageConditionScore);
  const factionPressurePercent = clampPercent(topFaction.podiumRate);
  const topGiglingPressurePercent = clampPercent(topGigling.winRate);
  const raceHref = featuredRace ? `/races/${featuredRace.id}` : "/races";

  return (
    <motion.section
      animate="show"
      className="premium-panel mb-6 rounded-lg p-5 sm:p-6"
      initial="hidden"
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.08
          }
        }
      }}
    >
      <div className="relative z-10 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div>
          <motion.div className="mb-5 flex flex-wrap items-start justify-between gap-4" variants={fadeUp}>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-racing">
                Live Operations Strip
              </p>
              <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
                Race command pulse
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/56">
                A fast read of lobby supply, condition volatility, faction pressure, and the
                top indexed Gigling before judges dive into the full dashboard.
              </p>
            </div>
            {featuredRace ? <StatusBadge status={featuredRace.status} /> : null}
          </motion.div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <SignalTile
              icon={Flag}
              label="Open lobbies"
              tone="text-cyan-racing"
              value={`${activeRaceCount}`}
            />
            <SignalTile
              icon={Gauge}
              label="Volatility"
              tone="text-orange-racing"
              value={`${volatility}/100`}
            />
            <SignalTile
              icon={Zap}
              label="Item pressure"
              tone="text-violet-200"
              value={`${itemPressure}`}
            />
            <SignalTile
              icon={Trophy}
              label="Prize flow"
              tone="text-emerald-racing"
              value={formatToken(totalPrizePool)}
            />
          </div>

          <motion.div className="mt-5 grid gap-3 md:grid-cols-3" variants={fadeUp}>
            {[
              {
                label: `${topFaction.faction} podium signal`,
                value: factionPressurePercent,
                caption: `${formatPercent(topFaction.podiumRate)} podium rate`,
                icon: Activity
              },
              {
                label: `${topGigling.name} win signal`,
                value: topGiglingPressurePercent,
                caption: `${formatPercent(topGigling.winRate)} win rate`,
                icon: Trophy
              },
              {
                label: "Condition pressure",
                value: clampPercent(volatility),
                caption: `${completedRaceCount} completed races sampled`,
                icon: AlertTriangle
              }
            ].map((item, index) => {
              const Icon = item.icon;

              return (
                <div key={item.label} className="rounded-lg border border-white/10 bg-black/20 p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/44">
                      {item.label}
                    </p>
                    <Icon className="h-4 w-4 text-white/50" />
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/[0.07]">
                    <motion.div
                      className={cn("h-full rounded-full bg-gradient-to-r", laneStyles[index])}
                      initial={{ width: 0 }}
                      transition={{ duration: 0.85, ease: "easeOut" }}
                      viewport={{ once: true }}
                      whileInView={{ width: `${item.value}%` }}
                    />
                  </div>
                  <p className="mt-3 text-sm font-bold text-white/70">{item.caption}</p>
                </div>
              );
            })}
          </motion.div>
        </div>

        <motion.div className="rounded-lg border border-cyan-racing/18 bg-cyan-racing/[0.055] p-5" variants={fadeUp}>
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-racing">
                Dynamic Race Highlight
              </p>
              <h3 className="mt-2 text-2xl font-black text-white">
                {featuredRace ? `Race #${featuredRace.raceNumber}` : "No active race"}
              </h3>
            </div>
            <Radar className="h-8 w-8 text-cyan-racing" />
          </div>

          <div className="space-y-3">
            {[
              {
                label: "Weather",
                value: featuredRace ? formatConditionLabel(featuredRace.weather) : "--"
              },
              {
                label: "Track",
                value: featuredRace ? formatConditionLabel(featuredRace.trackCondition) : "--"
              },
              {
                label: "Distance",
                value: featuredRace ? formatConditionLabel(featuredRace.distance) : "--"
              },
              { label: "Field", value: featuredRace ? `${featuredRace.participants} entrants` : "--" },
              { label: "Items", value: featuredRace ? `${featuredRace.itemActions} actions` : "--" },
              { label: "Entry", value: featuredRace ? formatToken(featuredRace.entryFee) : "--" },
              { label: "Pool", value: featuredRace ? formatToken(featuredRace.prizePool) : "--" }
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-black/18 px-3 py-2"
              >
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-white/42">
                  {item.label}
                </span>
                <span className="text-sm font-black capitalize text-white">{item.value}</span>
              </div>
            ))}
          </div>

          <Link
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-racing/35 bg-cyan-racing/10 px-4 py-3 text-sm font-black text-cyan-racing transition hover:bg-cyan-racing/16"
            href={raceHref}
          >
            Inspect race pressure
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}
