"use client";

import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BrainCircuit,
  Flag,
  Gauge,
  LineChart,
  Medal,
  Radar,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Swords,
  Trophy,
  Users,
  WalletCards,
  Zap
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useMemo } from "react";

import { FactionBadge } from "@/components/shared/faction-badge";
import { GiglingAvatar } from "@/components/shared/gigling-avatar";
import { InsightCard } from "@/components/shared/insight-card";
import { MetricCard } from "@/components/shared/metric-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { cn } from "@/lib/utils/cn";
import { formatPercent, formatToken } from "@/lib/utils/format";
import type { FactionPerformance, Gigling, MetaInsight, Race } from "@/types";

type LandingExperienceProps = {
  factionPerformance: FactionPerformance[];
  giglings: Gigling[];
  insights: MetaInsight[];
  races: Race[];
};

type ShowcaseItem = {
  accent: "cyan" | "emerald" | "orange" | "violet";
  body: string;
  href: string;
  icon: typeof Radar;
  label: string;
  metric: string;
  title: string;
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 }
};

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

const accentStyles: Record<ShowcaseItem["accent"], string> = {
  cyan: "border-cyan-racing/28 bg-cyan-racing/10 text-cyan-racing",
  emerald: "border-emerald-racing/28 bg-emerald-racing/10 text-emerald-racing",
  orange: "border-orange-racing/28 bg-orange-racing/10 text-orange-racing",
  violet: "border-violet-racing/28 bg-violet-racing/10 text-violet-200"
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function compactAddress(value?: string) {
  if (!value) {
    return "Unknown stable";
  }

  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

function getRaceLabel(race?: Race) {
  if (!race) {
    return "Live race unavailable";
  }

  return `Race #${race.raceNumber}`;
}

function getHeuristicEstimate(races: Race[], giglings: Gigling[]) {
  if (races.length === 0 || giglings.length === 0) {
    return "--";
  }

  const completedShare = races.filter((race) => race.status === "completed").length / races.length;
  const participantDensity =
    races.reduce((total, race) => total + race.participants.length, 0) / races.length;
  const signalDepth = Math.min(24, participantDensity * 4);
  const historyDepth = Math.min(20, giglings.length / 2);
  const estimate = Math.round(48 + completedShare * 22 + signalDepth + historyDepth);

  return `${Math.min(91, Math.max(58, estimate))}%`;
}

function ProductMockup({
  className,
  giglings,
  races,
  topFaction
}: {
  className?: string;
  giglings: Gigling[];
  races: Race[];
  topFaction?: FactionPerformance;
}) {
  const topGigling = giglings[0];
  const featuredRace = races.find((race) => race.status === "live") ?? races[0];
  const bars = [
    { label: "Win fit", value: topGigling?.winRate ?? 0, tone: "from-cyan-racing to-violet-racing" },
    {
      label: "Podium",
      value: topGigling?.podiumRate ?? 0,
      tone: "from-orange-racing to-emerald-racing"
    },
    {
      label: "Faction",
      value: topFaction?.winRate ?? 0,
      tone: "from-violet-racing to-cyan-racing"
    }
  ];

  return (
    <motion.div
      className={cn("premium-panel rounded-lg p-4 shadow-glow", className)}
      variants={fadeUp}
      whileHover={{ rotateX: 1.5, rotateY: -1.5, y: -4 }}
    >
      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-racing">
              Race Intel
            </p>
            <h2 className="mt-1 text-xl font-black text-white">{getRaceLabel(featuredRace)}</h2>
          </div>
          {featuredRace ? <StatusBadge status={featuredRace.status} /> : null}
        </div>

        <div className="grid gap-4 md:grid-cols-[0.82fr_1fr]">
          <div className="rounded-lg border border-white/10 bg-black/22 p-3">
            {topGigling ? (
              <GiglingAvatar
                className="aspect-square rounded-lg"
                imageUrl={topGigling.imageUrl}
                name={topGigling.name}
                priority
              />
            ) : (
              <div className="flex aspect-square items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-center text-sm font-bold text-white/52">
                Awaiting live Gigling art
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/42">
                Current pick
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <h3 className="text-2xl font-black text-white">
                  {topGigling?.name ?? "No live leader"}
                </h3>
                {topGigling ? <FactionBadge faction={topGigling.faction} /> : null}
              </div>
              <p className="mt-2 text-sm leading-6 text-white/56">
                {topGigling
                  ? `${topGigling.totalRaces} races, ${formatPercent(topGigling.winRate)} wins, ${formatToken(topGigling.earnings)} earned.`
                  : "Live leaderboard records are unavailable, so no substitute racer is shown."}
              </p>
            </div>

            <div className="space-y-3">
              {bars.map((bar) => (
                <div key={bar.label}>
                  <div className="mb-1 flex items-center justify-between text-xs font-bold uppercase tracking-[0.16em] text-white/46">
                    <span>{bar.label}</span>
                    <span>{formatPercent(bar.value)}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/[0.07]">
                    <motion.div
                      className={cn("h-full rounded-full bg-gradient-to-r", bar.tone)}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${Math.min(100, Math.max(0, bar.value))}%` }}
                      transition={{ duration: 0.9, ease: "easeOut" }}
                      viewport={{ once: true }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MiniLeaderboard({ giglings }: { giglings: Gigling[] }) {
  const leaders = giglings.slice(0, 4);

  return (
    <div className="space-y-3">
      {leaders.length > 0 ? (
        leaders.map((gigling, index) => (
          <motion.div
            key={gigling.id}
            className="group flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-3 transition hover:border-cyan-racing/30 hover:bg-cyan-racing/[0.07]"
            variants={fadeUp}
            whileHover={{ x: 4 }}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/12 bg-black/24 text-sm font-black text-white">
              {index + 1}
            </div>
            <GiglingAvatar
              className="h-12 w-12 shrink-0 rounded-lg"
              imageUrl={gigling.imageUrl}
              name={gigling.name}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-black text-white">{gigling.name}</p>
              <p className="text-xs text-white/46">{compactAddress(gigling.ownerAddress)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-cyan-racing">{formatPercent(gigling.winRate)}</p>
              <p className="text-xs text-white/42">win rate</p>
            </div>
          </motion.div>
        ))
      ) : (
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5 text-sm text-white/56">
          Live leaderboard data is unavailable right now.
        </div>
      )}
    </div>
  );
}

function RacingSignal({ label, value, tone }: { label: string; tone: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/42">{label}</p>
      <p className={cn("mt-2 text-2xl font-black", tone)}>{value}</p>
    </div>
  );
}

export function LandingExperience({
  factionPerformance,
  giglings,
  insights,
  races
}: LandingExperienceProps) {
  const reduceMotion = useReducedMotion();
  const topGiglings = useMemo(
    () => [...giglings].sort((first, second) => second.winRate - first.winRate),
    [giglings]
  );
  const topGigling = topGiglings[0];
  const activeRaceCount = races.filter(
    (race) => race.status === "live" || race.status === "scheduled"
  ).length;
  const completedRaceCount = races.filter((race) => race.status === "completed").length;
  const latestRace = races[0];
  const topFaction = [...factionPerformance]
    .filter((entry) => entry.races > 0)
    .sort((first, second) => second.winRate - first.winRate)[0];
  const activePrizePool = races
    .filter((race) => race.status === "live" || race.status === "scheduled")
    .reduce((total, race) => total + race.prizePool, 0);
  const averageFieldSize =
    races.length > 0
      ? (
          races.reduce((total, race) => total + race.participants.length, 0) / races.length
        ).toFixed(1)
      : "--";
  const heuristicAccuracyEstimate = getHeuristicEstimate(races, giglings);

  const showcaseItems: ShowcaseItem[] = [
    {
      accent: "cyan",
      body: "Race fit, volatility, pressure, and confidence are translated into a pre-race decision panel.",
      href: "/predictor",
      icon: Radar,
      label: "Predict",
      metric: heuristicAccuracyEstimate,
      title: "Race Intelligence Engine"
    },
    {
      accent: "orange",
      body: "Losses become practical lessons with condition pressure, stat gaps, item impact, and next-race adjustments.",
      href: latestRace ? `/races/${latestRace.id}` : "/races",
      icon: BrainCircuit,
      label: "Review",
      metric: `${completedRaceCount}`,
      title: "Why Did I Lose"
    },
    {
      accent: "violet",
      body: "Faction strength, weather pressure, distance curves, and track volatility are framed as racing signals.",
      href: "/meta",
      icon: LineChart,
      label: "Detect",
      metric: `${insights.length}`,
      title: "Meta Detection"
    },
    {
      accent: "emerald",
      body: "Connected wallets become stable command centers with owned Giglings, eligibility, and race fit guidance.",
      href: "/stable",
      icon: WalletCards,
      label: "Manage",
      metric: `${topGiglings.length}`,
      title: "Stable Manager"
    }
  ];

  return (
    <main className="min-h-screen overflow-hidden">
      <section className="relative min-h-[92vh] px-4 py-5 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-track-radial" />
        <div className="absolute inset-0 bg-racing-grid opacity-40 [background-size:42px_42px]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#05070d] to-transparent" />
        <div className="absolute left-1/2 top-[18%] h-[44rem] w-[44rem] -translate-x-1/2 rounded-full border border-cyan-racing/12" />
        <div className="absolute left-1/2 top-[24%] h-[31rem] w-[31rem] -translate-x-1/2 rounded-full border border-orange-racing/12" />
        <div className="absolute left-[8%] top-[20%] hidden h-[70%] w-24 -skew-x-12 border-x border-cyan-racing/18 bg-cyan-racing/[0.03] lg:block" />
        <div className="absolute right-[10%] top-[14%] hidden h-[72%] w-24 skew-x-12 border-x border-orange-racing/18 bg-orange-racing/[0.03] lg:block" />

        {!reduceMotion ? (
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            {Array.from({ length: 16 }).map((_, index) => (
              <motion.span
                key={index}
                className="absolute h-px w-20 bg-gradient-to-r from-transparent via-cyan-racing/60 to-transparent"
                initial={{
                  opacity: 0,
                  x: `${(index * 17) % 100}vw`,
                  y: `${(index * 23) % 90}vh`
                }}
                animate={{
                  opacity: [0, 0.75, 0],
                  x: [`${(index * 17) % 100}vw`, `${((index * 17) % 100) + 12}vw`]
                }}
                transition={{
                  delay: index * 0.18,
                  duration: 3.6 + (index % 4),
                  repeat: Infinity,
                  repeatDelay: 1.2
                }}
              />
            ))}
          </div>
        ) : null}

        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-cyan-racing/35 bg-cyan-racing/10 shadow-glow">
              <span className="text-sm font-black tracking-[0.18em] text-cyan-racing">GRI</span>
            </div>
            <div>
              <p className="text-sm font-bold text-white">Gigling Racing Intel</p>
              <p className="text-xs text-white/48">The intelligence layer for Gigling Racing.</p>
            </div>
          </Link>
          <div className="hidden items-center gap-2 md:flex">
            <Link className="rounded-lg px-3 py-2 text-sm font-semibold text-white/62 transition hover:text-white" href="/giglings">
              Giglings
            </Link>
            <Link className="rounded-lg px-3 py-2 text-sm font-semibold text-white/62 transition hover:text-white" href="/meta">
              Meta
            </Link>
            <Link className="rounded-lg border border-cyan-racing/35 bg-cyan-racing/10 px-4 py-2 text-sm font-bold text-cyan-racing transition hover:bg-cyan-racing/16" href="/dashboard">
              Open app
            </Link>
          </div>
        </nav>

        <motion.div
          animate="show"
          className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 pb-16 pt-20 sm:pt-24 lg:grid-cols-[1fr_0.86fr] lg:pt-28"
          initial="hidden"
          variants={stagger}
        >
          <div className="text-center lg:text-left">
            <motion.p
              className="mx-auto mb-5 inline-flex rounded-full border border-orange-racing/30 bg-orange-racing/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.26em] text-orange-racing lg:mx-0"
              variants={fadeUp}
            >
              GIGATHON 1 - Player Tools & Analytics
            </motion.p>
            <motion.h1
              className="max-w-5xl text-5xl font-black tracking-normal text-white sm:text-7xl lg:text-8xl"
              variants={fadeUp}
            >
              Gigling Racing Intel
            </motion.h1>
            <motion.p
              className="mt-5 max-w-3xl text-lg leading-8 text-white/66 sm:text-xl"
              variants={fadeUp}
            >
              The Intelligence Layer for Gigling Racing.
            </motion.p>
            <motion.p
              className="mt-4 max-w-3xl text-base leading-7 text-white/56 sm:text-lg"
              variants={fadeUp}
            >
              Live race history becomes prediction context, post-race lessons, meta reads,
              rivalry stories, and stable decisions for competitive Gigaverse players.
            </motion.p>
            <motion.div className="mt-9 flex flex-col gap-3 sm:flex-row lg:justify-start" variants={fadeUp}>
              <Link
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-racing px-5 py-3 text-sm font-black text-[#031018] shadow-glow transition hover:scale-[1.02]"
                href="/dashboard"
              >
                Launch Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-orange-racing/40 bg-orange-racing/10 px-5 py-3 text-sm font-black text-orange-racing transition hover:bg-orange-racing/16"
                href="/giglings"
              >
                Explore Giglings
                <Radar className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>

          <ProductMockup giglings={topGiglings} races={races} topFaction={topFaction} />
        </motion.div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-7xl"
          initial="hidden"
          variants={stagger}
          viewport={{ once: true, margin: "-80px" }}
          whileInView="show"
        >
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              detail="Indexed races with participants, placements, items, and payouts"
              icon="flag"
              label="Races Analyzed"
              tone="cyan"
              value={`${races.length}`}
            />
            <MetricCard
              detail={topGigling ? `${topGigling.name} leads the indexed field` : "No live leaderboard records returned"}
              icon="bot"
              label="Giglings Tracked"
              tone="orange"
              value={`${giglings.length}`}
            />
            <MetricCard
              detail="Faction, rarity, weather, distance, and track reads"
              icon="barChart"
              label="Meta Insights"
              tone="emerald"
              value={`${insights.length}`}
            />
            <MetricCard
              detail="Heuristic decision support, not a backtested guarantee"
              icon="gauge"
              label="Accuracy Estimate"
              tone="violet"
              value={heuristicAccuracyEstimate}
            />
          </div>
        </motion.div>
      </section>

      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-7xl"
          initial="hidden"
          variants={stagger}
          viewport={{ once: true, margin: "-80px" }}
          whileInView="show"
        >
          <motion.div className="mb-8 max-w-3xl" variants={fadeUp}>
            <p className="text-xs font-black uppercase tracking-[0.26em] text-cyan-racing">
              Intelligence Showcase
            </p>
            <h2 className="mt-3 text-3xl font-black text-white sm:text-5xl">
              Four racing views, one decision loop.
            </h2>
            <p className="mt-4 text-base leading-7 text-white/58">
              Every module points back to the same player question: which Gigling should race,
              where is the field vulnerable, and what should change after the result lands?
            </p>
          </motion.div>

          <div className="grid gap-4 lg:grid-cols-4">
            {showcaseItems.map((item) => {
              const Icon = item.icon;

              return (
                <motion.article
                  key={item.title}
                  className="premium-panel group rounded-lg p-5"
                  variants={fadeUp}
                  whileHover={{ y: -5 }}
                >
                  <div className="relative z-10 flex h-full flex-col">
                    <div className="mb-5 flex items-start justify-between gap-4">
                      <div className={cn("rounded-lg border p-3", accentStyles[item.accent])}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white/46">
                        {item.label}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-white">{item.title}</h3>
                    <p className="mt-3 flex-1 text-sm leading-6 text-white/56">{item.body}</p>
                    <div className="mt-5 flex items-end justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/42">
                          Live signal
                        </p>
                        <p className="mt-1 text-2xl font-black text-white">{item.metric}</p>
                      </div>
                      <Link
                        aria-label={`Open ${item.title}`}
                        className="rounded-lg border border-white/10 bg-white/[0.05] p-2 text-white/58 transition group-hover:border-cyan-racing/35 group-hover:text-cyan-racing"
                        href={item.href}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </motion.div>
      </section>

      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[0.88fr_1.12fr]"
          initial="hidden"
          variants={stagger}
          viewport={{ once: true, margin: "-80px" }}
          whileInView="show"
        >
          <motion.div className="premium-panel rounded-lg p-6" variants={fadeUp}>
            <div className="relative z-10">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-lg border border-cyan-racing/28 bg-cyan-racing/10 p-3 text-cyan-racing">
                  <Radar className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-racing">
                    Race Intelligence
                  </p>
                  <h2 className="text-2xl font-black text-white">Pre-race pressure map</h2>
                </div>
              </div>
              <p className="text-sm leading-6 text-white/58">
                The predictor becomes easier to trust when the page explains field volatility,
                confidence, race conditions, and risk instead of dropping a raw probability.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <RacingSignal label="Active races" tone="text-orange-racing" value={`${activeRaceCount}`} />
                <RacingSignal label="Avg field" tone="text-cyan-racing" value={averageFieldSize} />
                <RacingSignal label="Open prizes" tone="text-emerald-racing" value={formatToken(activePrizePool)} />
              </div>
            </div>
          </motion.div>

          <motion.div className="premium-panel rounded-lg p-6" variants={fadeUp}>
            <div className="relative z-10">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-racing">
                    Why Did I Lose
                  </p>
                  <h2 className="mt-1 text-2xl font-black text-white">Turn losses into a next-race plan.</h2>
                </div>
                <ShieldAlert className="h-8 w-8 text-orange-racing" />
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {[
                  {
                    icon: Gauge,
                    label: "Condition pressure",
                    text: latestRace
                      ? `${latestRace.weather} weather and ${latestRace.trackCondition} track state`
                      : "Awaiting a live race state"
                  },
                  {
                    icon: Zap,
                    label: "Item pressure",
                    text: `${races.reduce((total, race) => total + race.participants.reduce((items, participant) => items + participant.itemsUsed.length, 0), 0)} item records indexed`
                  },
                  {
                    icon: BadgeCheck,
                    label: "Next adjustment",
                    text: "Match Gigling strengths to distance, field pressure, and volatility"
                  }
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.label} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                      <Icon className="h-5 w-5 text-cyan-racing" />
                      <p className="mt-3 text-sm font-black text-white">{item.label}</p>
                      <p className="mt-2 text-sm leading-6 text-white/52">{item.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1.15fr_0.85fr]"
          initial="hidden"
          variants={stagger}
          viewport={{ once: true, margin: "-80px" }}
          whileInView="show"
        >
          <motion.div className="premium-panel rounded-lg p-6" variants={fadeUp}>
            <div className="relative z-10">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg border border-violet-racing/28 bg-violet-racing/10 p-3 text-violet-200">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-violet-200">
                    Meta Insights
                  </p>
                  <h2 className="text-2xl font-black text-white">Signals that read like race strategy.</h2>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-cyan-racing/18 bg-cyan-racing/[0.06] p-4">
                  <Flag className="h-5 w-5 text-cyan-racing" />
                  <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-white/42">
                    Emerging Meta
                  </p>
                  <p className="mt-2 text-xl font-black capitalize text-white">
                    {topFaction?.faction ?? "No faction signal"}
                  </p>
                  <p className="mt-2 text-sm text-white/52">
                    {topFaction
                      ? `${formatPercent(topFaction.winRate)} win rate across ${topFaction.races} entries.`
                      : "No completed faction placement data is available."}
                  </p>
                </div>
                <div className="rounded-lg border border-orange-racing/18 bg-orange-racing/[0.06] p-4">
                  <Sparkles className="h-5 w-5 text-orange-racing" />
                  <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-white/42">
                    Faction Surge
                  </p>
                  <p className="mt-2 text-xl font-black text-white">
                    {topFaction ? formatPercent(topFaction.podiumRate) : "--"}
                  </p>
                  <p className="mt-2 text-sm text-white/52">
                    Podium conversion shows whether the faction is consistently threatening.
                  </p>
                </div>
                <div className="rounded-lg border border-emerald-racing/18 bg-emerald-racing/[0.06] p-4">
                  <LineChart className="h-5 w-5 text-emerald-racing" />
                  <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-white/42">
                    Performance Trends
                  </p>
                  <p className="mt-2 text-xl font-black text-white">{formatNumber(completedRaceCount)}</p>
                  <p className="mt-2 text-sm text-white/52">
                    Completed races anchor post-race lessons and meta recommendations.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div className="space-y-4" variants={fadeUp}>
            {insights[0] ? (
              <InsightCard insight={insights[0]} />
            ) : (
              <div className="premium-panel rounded-lg p-6">
                <div className="relative z-10">
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-racing">
                    Live Meta Signal
                  </p>
                  <h3 className="mt-3 text-2xl font-black text-white">Live meta unavailable</h3>
                  <p className="mt-3 text-sm leading-6 text-white/56">
                    Gigaverse meta statistics are unreachable right now. No substitute signal is shown.
                  </p>
                </div>
              </div>
            )}
            {insights[1] ? <InsightCard insight={insights[1]} /> : null}
          </motion.div>
        </motion.div>
      </section>

      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-2"
          initial="hidden"
          variants={stagger}
          viewport={{ once: true, margin: "-80px" }}
          whileInView="show"
        >
          <motion.div className="premium-panel rounded-lg p-6" variants={fadeUp}>
            <div className="relative z-10">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg border border-orange-racing/28 bg-orange-racing/10 p-3 text-orange-racing">
                  <Swords className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-racing">
                    Rivalry Intelligence
                  </p>
                  <h2 className="text-2xl font-black text-white">Make race history social.</h2>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {["Rival", "Nemesis", "Ally"].map((relationship, index) => (
                  <div
                    key={relationship}
                    className="rounded-lg border border-white/10 bg-white/[0.04] p-4"
                  >
                    <Users className={cn("h-5 w-5", index === 1 ? "text-orange-racing" : "text-cyan-racing")} />
                    <p className="mt-3 text-lg font-black text-white">{relationship}</p>
                    <p className="mt-2 text-sm leading-6 text-white/52">
                      {index === 0
                        ? "Repeat opponents become matchup stories."
                        : index === 1
                          ? "Loss-heavy histories expose pressure points."
                          : "Shared podiums identify racers worth tracking."}
                    </p>
                  </div>
                ))}
              </div>
              <Link
                className="mt-6 inline-flex items-center gap-2 rounded-lg border border-orange-racing/35 bg-orange-racing/10 px-4 py-2 text-sm font-black text-orange-racing transition hover:bg-orange-racing/16"
                href="/rivals"
              >
                Open rivalry map
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          <motion.div className="premium-panel rounded-lg p-6" variants={fadeUp}>
            <div className="relative z-10">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg border border-emerald-racing/28 bg-emerald-racing/10 p-3 text-emerald-racing">
                  <WalletCards className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-racing">
                    Stable Manager
                  </p>
                  <h2 className="text-2xl font-black text-white">A strategic control center.</h2>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <RacingSignal label="Wallet ownership" tone="text-emerald-racing" value="Live only" />
                <RacingSignal label="Race alerts" tone="text-orange-racing" value={`${activeRaceCount}`} />
                <RacingSignal label="Top win rate" tone="text-cyan-racing" value={topGigling ? formatPercent(topGigling.winRate) : "--"} />
                <RacingSignal label="Best distance" tone="text-violet-200" value={topGigling?.bestDistance ?? "--"} />
              </div>
              <p className="mt-5 text-sm leading-6 text-white/56">
                Connected wallets load owned Giglings and live race context. If ownership data is
                unavailable, the app shows a readable outage state instead of inventing a stable.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[0.82fr_1.18fr]"
          initial="hidden"
          variants={stagger}
          viewport={{ once: true, margin: "-80px" }}
          whileInView="show"
        >
          <motion.div className="premium-panel rounded-lg p-6" variants={fadeUp}>
            <div className="relative z-10">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-racing">
                Community Layer
              </p>
              <h2 className="mt-3 text-3xl font-black text-white">Leaderboards with a story.</h2>
              <p className="mt-4 text-sm leading-6 text-white/58">
                The platform gives players more than personal analytics: it surfaces top racers,
                leading Giglings, faction pressure, and shareable context that can travel into
                Discord, Telegram, and X.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <RacingSignal label="Top racers" tone="text-cyan-racing" value={`${topGiglings.length}`} />
                <RacingSignal label="Top factions" tone="text-orange-racing" value={`${factionPerformance.length}`} />
                <RacingSignal label="Share cards" tone="text-emerald-racing" value="PNG" />
              </div>
            </div>
          </motion.div>

          <motion.div className="premium-panel rounded-lg p-5" variants={fadeUp}>
            <div className="relative z-10">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-racing">
                    Live Leaderboard
                  </p>
                  <h3 className="mt-1 text-2xl font-black text-white">Top Giglings</h3>
                </div>
                <Trophy className="h-7 w-7 text-orange-racing" />
              </div>
              <MiniLeaderboard giglings={topGiglings} />
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-7xl"
          initial="hidden"
          variants={stagger}
          viewport={{ once: true, margin: "-80px" }}
          whileInView="show"
        >
          <motion.div className="premium-panel rounded-lg p-6 sm:p-8" variants={fadeUp}>
            <div className="relative z-10 grid gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-violet-200">
                  Why It Exists
                </p>
                <h2 className="mt-3 text-3xl font-black text-white sm:text-5xl">
                  Better racers need better feedback loops.
                </h2>
                <p className="mt-5 text-base leading-7 text-white/58">
                  Players lose because fields are volatile, tracks favor different stat profiles,
                  items change outcomes, and the meta moves faster than memory. Gigling Racing Intel
                  turns those moving parts into readable decisions.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { icon: BrainCircuit, label: "Learn", text: "Every result explains the most likely pressure points." },
                  { icon: Radar, label: "Predict", text: "Upcoming races become fit, volatility, and risk estimates." },
                  { icon: Medal, label: "Improve", text: "Stable choices are tied to distance, weather, and field shape." },
                  { icon: ShieldCheck, label: "Share", text: "Reports package the story into a social-ready artifact." }
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.label} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                      <Icon className="h-5 w-5 text-cyan-racing" />
                      <p className="mt-3 text-lg font-black text-white">{item.label}</p>
                      <p className="mt-2 text-sm leading-6 text-white/52">{item.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section className="px-4 pb-28 sm:px-6 lg:px-8">
        <motion.div
          className="relative mx-auto max-w-7xl overflow-hidden rounded-lg border border-cyan-racing/24 bg-[linear-gradient(135deg,rgba(32,247,255,0.14),rgba(168,85,247,0.12)_46%,rgba(255,138,31,0.14))] p-8 shadow-glow sm:p-12"
          initial={{ opacity: 0, y: 18 }}
          viewport={{ once: true, margin: "-80px" }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className="absolute inset-0 bg-racing-grid opacity-35" />
          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.26em] text-cyan-racing">
                Become a Smarter Racer
              </p>
              <h2 className="mt-3 text-4xl font-black text-white sm:text-6xl">
                Open the command center.
              </h2>
              <p className="mt-4 text-base leading-7 text-white/64">
                Inspect the live field, run a prediction, review a race, and export a report
                judges can understand in one pass.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-racing px-5 py-3 text-sm font-black text-[#031018] shadow-glow transition hover:scale-[1.02]"
                href="/dashboard"
              >
                Launch Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/18 bg-white/[0.06] px-5 py-3 text-sm font-black text-white transition hover:border-orange-racing/35 hover:text-orange-racing"
                href="/reports"
              >
                View Reports
                <Trophy className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
