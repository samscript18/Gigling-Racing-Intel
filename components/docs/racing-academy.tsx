"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  Bot,
  BrainCircuit,
  ChevronRight,
  CircuitBoard,
  CloudSun,
  Code2,
  Compass,
  Download,
  Flag,
  Gauge,
  GitBranch,
  History,
  LineChart,
  Medal,
  Radar,
  Route,
  Share2,
  ShieldAlert,
  Swords,
  Trophy,
  Users,
  WalletCards,
  Zap,
  type LucideIcon
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 }
};

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.075
    }
  }
};

type Tone = "cyan" | "orange" | "violet" | "emerald" | "gold";

const toneStyles: Record<Tone, string> = {
  cyan: "border-cyan-racing/28 bg-cyan-racing/10 text-cyan-racing",
  emerald: "border-emerald-racing/28 bg-emerald-racing/10 text-emerald-racing",
  gold: "border-yellow-300/28 bg-yellow-300/10 text-yellow-200",
  orange: "border-orange-racing/28 bg-orange-racing/10 text-orange-racing",
  violet: "border-violet-racing/28 bg-violet-racing/10 text-violet-200"
};

const sectionLinks = [
  { href: "#learning-path", label: "Learning Path" },
  { href: "#gigling-basics", label: "Gigling Basics" },
  { href: "#race-mechanics", label: "Race Mechanics" },
  { href: "#strategy-guide", label: "Strategy Guide" },
  { href: "#race-intelligence", label: "Race Intelligence" },
  { href: "#why-lose", label: "Why Did I Lose" },
  { href: "#meta-detection", label: "Meta Detection" },
  { href: "#stable-manager", label: "Stable Manager" },
  { href: "#rivalries", label: "Rivalries" },
  { href: "#reports-sharing", label: "Reports" },
  { href: "#data-layer", label: "Data Layer" },
  { href: "#faq", label: "FAQ" }
];

const academyStats = [
  { icon: BookOpenCheck, label: "Mechanics explained", value: "12" },
  { icon: Route, label: "Strategy modules", value: "8" },
  { icon: CircuitBoard, label: "Live data sources", value: "API + contract" },
  { icon: BrainCircuit, label: "Intel models", value: "Fit + risk" }
];

const learningPath = [
  {
    href: "/giglings",
    icon: Bot,
    label: "Understand Giglings",
    text: "Read faction, rarity, traits, owner context, race history, and stat shape before entering."
  },
  {
    href: "/races",
    icon: CloudSun,
    label: "Read Race Conditions",
    text: "Distance, weather, track, entry, prize, field size, and items define the pressure profile."
  },
  {
    href: "/giglings",
    icon: BarChart3,
    label: "Analyze Performance",
    text: "Compare win rate, podium rate, earnings, streaks, distance fit, and condition history."
  },
  {
    href: "/meta",
    icon: LineChart,
    label: "Track the Meta",
    text: "Watch faction, rarity, weather, distance, and track trends move across completed races."
  },
  {
    href: "/predictor",
    icon: Radar,
    label: "Run Race Intelligence",
    text: "Use the decision-support model to rank fields and explain confidence, risk, and warnings."
  },
  {
    href: "/stable",
    icon: WalletCards,
    label: "Manage Your Stable",
    text: "Connect a wallet, inspect owned Giglings, and look for race opportunities or risk alerts."
  },
  {
    href: "/rivals",
    icon: Swords,
    label: "Study Rivals",
    text: "Repeated matchups become rivals, allies, nemeses, and head-to-head learning signals."
  },
  {
    href: "/reports",
    icon: Share2,
    label: "Share Reports",
    text: "Turn race, Gigling, and meta analysis into social cards for Discord, X, or Telegram."
  }
];

const basics = [
  { icon: Bot, title: "What a Gigling is", text: "A racing companion with identity, faction, rarity, owner context, traits, stats, and a career record." },
  { icon: Flag, title: "Factions", text: "Faction labels help compare groups of Giglings and detect emerging dominance across race samples." },
  { icon: Medal, title: "Rarity", text: "Rarity gives players another comparison axis for performance, traits, and leaderboard storytelling." },
  { icon: Gauge, title: "Stats", text: "Speed, stamina, handling, acceleration, luck, and consistency shape expected race behavior." },
  { icon: Users, title: "Owner and stable", text: "Wallet ownership lets the app frame decisions around the connected player's available roster." },
  { icon: History, title: "Race history", text: "Past placements, payouts, entries, and conditions reveal where a Gigling has already performed." }
];

const mechanics = [
  { label: "Distance", text: "Sprint, medium, long, and marathon races reward different stat profiles." },
  { label: "Weather", text: "Weather adds pressure to handling, speed, consistency, and race volatility." },
  { label: "Track", text: "Track condition changes how risky the field feels and which stats matter most." },
  { label: "Entry fee", text: "Entry cost frames the downside before committing a Gigling to a lobby." },
  { label: "Prize pool", text: "Prize flow shows the upside available when the race settles." },
  { label: "Participants", text: "Field size and opponent quality shape win probability and risk level." },
  { label: "Placement", text: "Final position anchors win rate, podium rate, rivalry records, and post-race lessons." },
  { label: "Items and payouts", text: "When live data includes item actions or payout rows, the app exposes them in context." }
];

const strategyPairs = [
  {
    title: "Sprint races",
    doText: "Prioritize speed, acceleration, and clean condition fit.",
    avoidText: "Avoid slow starters in crowded fields unless their historical sprint form is strong."
  },
  {
    title: "Medium races",
    doText: "Look for balanced speed, handling, and recent podium consistency.",
    avoidText: "Do not overvalue raw speed if the weather or track punishes handling."
  },
  {
    title: "Long and marathon races",
    doText: "Favor stamina, consistency, and proven late-race performance.",
    avoidText: "Avoid fragile high-variance picks unless the prize flow justifies the risk."
  },
  {
    title: "Wet or chaotic tracks",
    doText: "Treat handling, luck, and volatility warnings as primary signals.",
    avoidText: "Avoid reading win rate without checking whether the Gigling fits the actual conditions."
  }
];

const lossReasons = [
  "Poor condition fit against the race distance, weather, or track.",
  "Weak stat match compared with the top opponent profile.",
  "A stronger rival entered with better recent form or matchup history.",
  "Item pressure changed the expected flow when item data was available.",
  "Low consistency increased placement volatility in a crowded field.",
  "The selected distance favored stamina, speed, or handling differently than expected."
];

const metaSignals = [
  { label: "Emerging Meta", text: "A faction, rarity, or condition cluster begins outperforming recent samples.", tone: "violet" as Tone },
  { label: "Faction Surge", text: "One faction gains podium share and starts appearing more often in winner context.", tone: "orange" as Tone },
  { label: "Performance Trends", text: "Weather, distance, and track curves reveal where the field is becoming exploitable.", tone: "cyan" as Tone }
];

const faqItems = [
  {
    question: "Is the predictor guaranteed?",
    answer: "No. It is decision support. It ranks historical fit, stat shape, conditions, and risk signals, but race outcomes remain uncertain."
  },
  {
    question: "Does this use real Gigaverse data?",
    answer: "The app is designed around live Gigaverse racing APIs, contract reads, wallet ownership, adapters, and typed analytics surfaces."
  },
  {
    question: "Can beginners use this?",
    answer: "Yes. The Academy explains terms, mechanics, and practical decisions so new racers can move from confusion to confident scouting."
  },
  {
    question: "Why do race conditions matter?",
    answer: "Distance, weather, and track condition decide which stats are more valuable and whether a favorite is actually exposed."
  },
  {
    question: "How are rivalries calculated?",
    answer: "Rivalry intelligence compares repeated opponents, encounter counts, placements, and head-to-head outcomes in race history."
  },
  {
    question: "Why is my stable recommendation different from my win rate?",
    answer: "Stable recommendations consider the upcoming race context. A high win-rate Gigling can still be a poor fit for a specific track."
  },
  {
    question: "What happens if live data is unavailable?",
    answer: "The app shows readable unavailable states rather than inventing data. Strategy guidance remains visible, but live metrics pause."
  }
];

function MotionLaneBackground({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="absolute inset-0 bg-racing-grid opacity-[0.18] [background-size:48px_48px]" />
      <div className="absolute inset-0 bg-track-radial opacity-45" />
      {reduceMotion
        ? null
        : Array.from({ length: 8 }).map((_, index) => (
            <motion.span
              key={index}
              className="absolute left-[-40%] h-px w-[34rem] -skew-x-12 bg-gradient-to-r from-transparent via-cyan-racing/70 to-transparent"
              style={{ top: `${18 + index * 9}%` }}
              animate={{ x: ["0vw", "150vw"], opacity: [0, 0.9, 0] }}
              transition={{
                delay: index * 0.18,
                duration: 3.2 + (index % 3) * 0.45,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 0.8
              }}
            />
          ))}
    </div>
  );
}

function DocsSection({
  children,
  description,
  id,
  kicker,
  title
}: {
  children: ReactNode;
  description?: string;
  id: string;
  kicker: string;
  title: string;
}) {
  return (
    <motion.section
      id={id}
      className="scroll-mt-28"
      initial="hidden"
      variants={stagger}
      viewport={{ once: true, margin: "-90px" }}
      whileInView="show"
    >
      <motion.div className="mb-5" variants={fadeUp}>
        <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-racing">{kicker}</p>
        <h2 className="hero-title-gradient mt-2 text-3xl font-black sm:text-4xl">{title}</h2>
        {description ? <p className="mt-3 max-w-3xl text-sm leading-6 text-white/58 sm:text-base">{description}</p> : null}
      </motion.div>
      {children}
    </motion.section>
  );
}

function AcademyCard({
  children,
  className,
  icon: Icon,
  title,
  tone = "cyan"
}: {
  children: ReactNode;
  className?: string;
  icon: LucideIcon;
  title: string;
  tone?: Tone;
}) {
  return (
    <motion.article className={cn("premium-panel group rounded-lg p-5", className)} variants={fadeUp} whileHover={{ y: -4 }}>
      <div className="relative z-10">
        <div className={cn("mb-4 inline-flex rounded-lg border p-3", toneStyles[tone])}>
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-black text-white">{title}</h3>
        <div className="mt-3 text-sm leading-6 text-white/56">{children}</div>
      </div>
    </motion.article>
  );
}

function DocsHero() {
  return (
    <section className="relative overflow-hidden rounded-lg border border-white/10 bg-[#05070d] px-5 py-10 shadow-glow sm:px-8 lg:px-10">
      <MotionLaneBackground />
      <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_0.82fr] lg:items-center">
        <motion.div animate="show" initial="hidden" variants={stagger}>
          <motion.p className="neon-kicker text-xs font-black uppercase tracking-[0.22em]" variants={fadeUp}>
            Built for Gigling Racing players
          </motion.p>
          <motion.h1 className="hero-title-gradient mt-5 max-w-4xl text-5xl font-black leading-[0.9] sm:text-7xl lg:text-8xl" variants={fadeUp}>
            Racing Academy
          </motion.h1>
          <motion.p className="mt-6 max-w-3xl text-lg leading-8 text-white/68" variants={fadeUp}>
            Learn the mechanics, master the meta, and turn Gigling Racing data into smarter race decisions.
          </motion.p>
          <motion.div className="mt-8 flex flex-col gap-3 sm:flex-row" variants={fadeUp}>
            <Link className="glow-button inline-flex items-center justify-center gap-2 rounded-lg bg-violet-racing px-5 py-3 text-sm font-black text-white transition hover:scale-[1.02]" href="#learning-path">
              Start Learning
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link className="inline-flex items-center justify-center gap-2 rounded-lg border border-cyan-racing/35 bg-cyan-racing/10 px-5 py-3 text-sm font-black text-cyan-racing transition hover:bg-cyan-racing/16" href="/predictor">
              Open Race Intelligence Engine
              <Radar className="h-4 w-4" />
            </Link>
            <Link className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/14 bg-white/[0.05] px-5 py-3 text-sm font-black text-white/78 transition hover:border-orange-racing/35 hover:text-orange-racing" href="/giglings">
              Explore Giglings
              <Bot className="h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div className="speed-card rounded-lg p-4" initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
          <div className="relative z-10">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-violet-200">Academy HUD</p>
                <h2 className="mt-1 text-2xl font-black text-white">Strategy Lab</h2>
              </div>
              <Gauge className="h-8 w-8 text-cyan-racing" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {academyStats.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.label} className="rounded-lg border border-white/10 bg-black/24 p-4">
                    <Icon className="h-5 w-5 text-orange-racing" />
                    <p className="mt-3 text-2xl font-black text-white">{item.value}</p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-white/42">{item.label}</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 rounded-lg border border-violet-racing/24 bg-violet-racing/10 p-4">
              <p className="text-sm font-black text-white">Academy objective</p>
              <p className="mt-2 text-sm leading-6 text-white/58">
                Convert race data into practical choices: enter, wait, swap Gigling, scout rivals, or share the result.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function DocsTopNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#05070d]/82 px-4 py-3 shadow-[0_18px_60px_rgba(0,0,0,0.32)] backdrop-blur-2xl sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-violet-racing/40 bg-violet-racing/14 shadow-glow">
            <span className="text-xs font-black tracking-[0.18em] text-violet-200">GRI</span>
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-black text-white">Gigling Racing Intel</p>
            <p className="truncate text-xs text-white/45">Racing Academy</p>
          </div>
        </Link>
        <nav className="flex items-center gap-2" aria-label="Docs navigation">
          <Link
            className="hidden rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-white/68 transition hover:border-cyan-racing/35 hover:text-cyan-racing sm:inline-flex"
            href="/"
          >
            Landing
          </Link>
          <Link
            className="glow-button inline-flex items-center gap-2 rounded-lg bg-violet-racing px-4 py-2 text-sm font-black text-white transition hover:scale-[1.02]"
            href="/dashboard"
          >
            Open App
            <ArrowRight className="h-4 w-4" />
          </Link>
        </nav>
      </div>
    </header>
  );
}

function AcademySectionNav() {
  const [activeHref, setActiveHref] = useState(sectionLinks[0]?.href ?? "#learning-path");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const activeEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

        if (activeEntry?.target.id) {
          setActiveHref(`#${activeEntry.target.id}`);
        }
      },
      {
        rootMargin: "-22% 0px -62% 0px",
        threshold: [0.15, 0.35, 0.6]
      }
    );

    for (const link of sectionLinks) {
      const target = document.getElementById(link.href.slice(1));

      if (target) {
        observer.observe(target);
      }
    }

    return () => observer.disconnect();
  }, []);

  return (
    <aside className="sticky top-20 hidden max-h-[calc(100vh-6rem)] self-start overflow-y-auto pr-1 xl:block">
      <div className="premium-panel rounded-lg p-4">
        <div className="relative z-10">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-racing">Manual Index</p>
          <nav aria-label="Docs sections" className="mt-4 space-y-1">
            {sectionLinks.map((link) => {
              const active = activeHref === link.href;

              return (
                <a
                  key={link.href}
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    "group flex items-center justify-between rounded-lg border px-3 py-2 text-sm font-bold transition",
                    active
                      ? "border-cyan-racing/35 bg-cyan-racing/12 text-cyan-racing shadow-glow"
                      : "border-transparent text-white/54 hover:border-white/10 hover:bg-white/[0.05] hover:text-cyan-racing"
                  )}
                  href={link.href}
                >
                  {link.label}
                  <ChevronRight className={cn("h-4 w-4 transition", active ? "opacity-100" : "opacity-0 group-hover:opacity-100")} />
                </a>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}

function LearningPath() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {learningPath.map((step, index) => {
        const Icon = step.icon;

        return (
          <motion.article key={step.label} className="premium-panel rounded-lg p-5" variants={fadeUp} whileHover={{ y: -4 }}>
            <div className="relative z-10 flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-cyan-racing/28 bg-cyan-racing/10 text-cyan-racing">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="mt-3 h-full min-h-14 w-px bg-gradient-to-b from-cyan-racing/60 to-transparent" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-racing">Step {index + 1}</p>
                <h3 className="mt-1 text-lg font-black text-white">{step.label}</h3>
                <p className="mt-2 text-sm leading-6 text-white/56">{step.text}</p>
                <Link className="mt-4 inline-flex items-center gap-2 text-sm font-black text-cyan-racing transition hover:text-white" href={step.href}>
                  Open related module
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}

function RaceLifecycle() {
  const steps = ["Race Created", "Giglings Enter", "Conditions Apply", "Items Impact", "Race Settles", "Results + Payouts"];

  return (
    <div className="grid gap-3 lg:grid-cols-6">
      {steps.map((step, index) => (
        <motion.div key={step} className="relative rounded-lg border border-white/10 bg-white/[0.04] p-4" variants={fadeUp}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-orange-racing/28 bg-orange-racing/10 text-sm font-black text-orange-racing">
            {index + 1}
          </span>
          <p className="mt-4 text-sm font-black text-white">{step}</p>
          {index < steps.length - 1 ? <div aria-hidden="true" className="absolute right-[-0.95rem] top-1/2 hidden h-px w-6 bg-gradient-to-r from-cyan-racing/60 to-transparent lg:block" /> : null}
        </motion.div>
      ))}
    </div>
  );
}

function StrategyCard({ avoidText, doText, title }: { avoidText: string; doText: string; title: string }) {
  return (
    <motion.article className="premium-panel rounded-lg p-5" variants={fadeUp} whileHover={{ y: -4 }}>
      <div className="relative z-10">
        <h3 className="text-lg font-black text-white">{title}</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-emerald-racing/24 bg-emerald-racing/8 p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-racing">Do</p>
            <p className="mt-2 text-sm leading-6 text-white/60">{doText}</p>
          </div>
          <div className="rounded-lg border border-orange-racing/24 bg-orange-racing/8 p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-racing">Avoid</p>
            <p className="mt-2 text-sm leading-6 text-white/60">{avoidText}</p>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function FormulaCard() {
  const terms = [
    ["speed", "0.25"],
    ["stamina", "0.20"],
    ["handling", "0.15"],
    ["consistency", "0.15"],
    ["luck", "0.10"],
    ["historical condition fit", "0.15"]
  ];

  return (
    <motion.div className="premium-panel rounded-lg p-5" variants={fadeUp}>
      <div className="relative z-10">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-violet-200">Model Shape</p>
        <h3 className="mt-2 text-2xl font-black text-white">Base score formula</h3>
        <div className="mt-4 rounded-lg border border-white/10 bg-black/26 p-4 font-mono text-sm leading-7 text-white/72">
          <p>Base score =</p>
          {terms.map(([label, weight], index) => (
            <p key={label}>
              {index === 0 ? "" : "+ "}
              {label} * {weight}
            </p>
          ))}
        </div>
        <p className="mt-4 text-sm leading-6 text-white/56">
          The output is normalized into win probability, podium probability, confidence, risk, warnings, and plain-English recommendations.
        </p>
      </div>
    </motion.div>
  );
}

function ReportPreviewCard({ label, stat, title, tone }: { label: string; stat: string; title: string; tone: Tone }) {
  return (
    <motion.article className={cn("relative overflow-hidden rounded-lg border p-5", toneStyles[tone])} variants={fadeUp} whileHover={{ y: -4 }}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_0%,rgba(255,255,255,0.16),transparent_34%)]" />
      <div className="relative z-10">
        <p className="text-xs font-black uppercase tracking-[0.18em] opacity-80">{label}</p>
        <h3 className="mt-4 text-2xl font-black text-white">{title}</h3>
        <p className="mt-8 text-4xl font-black text-white">{stat}</p>
        <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-white/58">Share-ready card</p>
      </div>
    </motion.article>
  );
}

function ArchitectureFlow() {
  const nodes = [
    "Gigaverse APIs / Contracts",
    "Data Clients",
    "Adapters",
    "Typed App Data",
    "Analytics + Prediction Engines",
    "Player-Facing UI"
  ];

  return (
    <div className="space-y-3">
      {nodes.map((node, index) => (
        <motion.div key={node} className="flex items-center gap-3" variants={fadeUp}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-cyan-racing/28 bg-cyan-racing/10 text-sm font-black text-cyan-racing">
            {index + 1}
          </div>
          <div className="flex-1 rounded-lg border border-white/10 bg-white/[0.04] p-4 text-sm font-black text-white">{node}</div>
        </motion.div>
      ))}
    </div>
  );
}

function DocsFAQ() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {faqItems.map((item) => (
        <motion.details key={item.question} className="premium-panel group rounded-lg p-5" variants={fadeUp}>
          <summary className="relative z-10 cursor-pointer list-none text-base font-black text-white">
            <span className="flex items-center justify-between gap-4">
              {item.question}
              <ChevronRight className="h-4 w-4 shrink-0 text-cyan-racing transition group-open:rotate-90" />
            </span>
          </summary>
          <p className="relative z-10 mt-3 text-sm leading-6 text-white/58">{item.answer}</p>
        </motion.details>
      ))}
    </div>
  );
}

function DocsCTA() {
  return (
    <section className="relative overflow-hidden rounded-lg border border-violet-racing/30 bg-[linear-gradient(135deg,rgba(168,85,247,0.24),rgba(32,247,255,0.12)_48%,rgba(255,138,31,0.16))] p-7 shadow-glow sm:p-10">
      <MotionLaneBackground />
      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-racing">Final Lap</p>
          <h2 className="mt-3 text-4xl font-black text-white sm:text-5xl">Ready to race smarter?</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/64">
            Use the Academy as your manual, then move into the live tools to scout Giglings, inspect races, and run decision support.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link className="glow-button inline-flex items-center justify-center gap-2 rounded-lg bg-violet-racing px-5 py-3 text-sm font-black text-white transition hover:scale-[1.02]" href="/dashboard">
            Launch Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link className="inline-flex items-center justify-center gap-2 rounded-lg border border-cyan-racing/35 bg-cyan-racing/10 px-5 py-3 text-sm font-black text-cyan-racing transition hover:bg-cyan-racing/16" href="/predictor">
            Run Race Intelligence
            <Radar className="h-4 w-4" />
          </Link>
          <Link className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/14 bg-white/[0.05] px-5 py-3 text-sm font-black text-white/78 transition hover:border-orange-racing/35 hover:text-orange-racing" href="/meta">
            Explore Meta
            <LineChart className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function RacingAcademy() {
  return (
    <main className="racing-page-shell min-h-screen overflow-hidden px-4 pb-14 pt-4 sm:px-6 lg:px-8">
      <DocsTopNav />
      <div className="mx-auto mt-5 max-w-7xl space-y-8">
        <DocsHero />

        <div className="grid gap-8 xl:grid-cols-[15rem_1fr]">
          <AcademySectionNav />

          <div className="space-y-16">
          <DocsSection
            description="Start with the player journey: learn the object, read the race, evaluate the field, then choose what to do next."
            id="learning-path"
            kicker="Guided Learning"
            title="Learning Path"
          >
            <LearningPath />
          </DocsSection>

          <DocsSection
            description="Giglings are not interchangeable. Identity, faction, rarity, traits, stats, ownership, and history all influence racing decisions."
            id="gigling-basics"
            kicker="Gigling Basics"
            title="Know Your Racer"
          >
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {basics.map((item, index) => (
                <AcademyCard key={item.title} icon={item.icon} title={item.title} tone={index % 3 === 0 ? "cyan" : index % 3 === 1 ? "violet" : "orange"}>
                  {item.text}
                </AcademyCard>
              ))}
            </div>
          </DocsSection>

          <DocsSection
            description="A race is a sequence of economic, competitive, and condition signals. The app keeps those pieces visible together."
            id="race-mechanics"
            kicker="Race Mechanics Guide"
            title="From Lobby To Payout"
          >
            <div className="premium-panel rounded-lg p-5">
              <div className="relative z-10">
                <RaceLifecycle />
              </div>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {mechanics.map((item) => (
                <motion.div key={item.label} className="rounded-lg border border-white/10 bg-white/[0.04] p-4" variants={fadeUp}>
                  <p className="text-sm font-black text-white">{item.label}</p>
                  <p className="mt-2 text-sm leading-6 text-white/54">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </DocsSection>

          <DocsSection
            description="Use distance, weather, track, and stat fit together. A strong racer can still be a poor entry in the wrong lobby."
            id="strategy-guide"
            kicker="Strategy Guide"
            title="Do The Right Thing For The Right Race"
          >
            <div className="grid gap-4 xl:grid-cols-2">
              {strategyPairs.map((item) => (
                <StrategyCard key={item.title} {...item} />
              ))}
            </div>
          </DocsSection>

          <DocsSection
            description="The predictor is an explainable decision-support model. It helps players think; it never guarantees a result."
            id="race-intelligence"
            kicker="Race Intelligence Engine"
            title="How The Prediction Model Thinks"
          >
            <div className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
              <FormulaCard />
              <motion.div className="premium-panel rounded-lg p-5" variants={fadeUp}>
                <div className="relative z-10">
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-racing">Example Output</p>
                  <h3 className="mt-2 text-2xl font-black text-white">Ranked race decision card</h3>
                  <div className="mt-5 space-y-4">
                    {[
                      ["Win probability", "67%", "from-cyan-racing to-violet-racing"],
                      ["Podium probability", "83%", "from-emerald-racing to-cyan-racing"],
                      ["Confidence score", "78%", "from-orange-racing to-violet-racing"]
                    ].map(([label, value, tone]) => (
                      <div key={label}>
                        <div className="mb-2 flex items-center justify-between text-xs font-black uppercase tracking-[0.16em] text-white/44">
                          <span>{label}</span>
                          <span>{value}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-white/[0.07]">
                          <motion.div className={cn("h-full rounded-full bg-gradient-to-r", tone)} initial={{ width: 0 }} viewport={{ once: true }} whileInView={{ width: value }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 rounded-lg border border-orange-racing/24 bg-orange-racing/8 p-4">
                    <p className="text-sm font-black text-white">Risk level: medium</p>
                    <p className="mt-2 text-sm leading-6 text-white/58">
                      Strong condition fit, but field quality and possible item pressure keep the recommendation cautious.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </DocsSection>

          <DocsSection
            description="Post-race explanation turns a loss into a useful adjustment instead of a dead end."
            id="why-lose"
            kicker="Why Did I Lose Guide"
            title="Convert Losses Into Lessons"
          >
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {lossReasons.map((reason, index) => (
                <AcademyCard key={reason} icon={index % 2 === 0 ? ShieldAlert : Compass} title={`Loss Signal ${index + 1}`} tone={index % 2 === 0 ? "orange" : "cyan"}>
                  {reason}
                </AcademyCard>
              ))}
            </div>
          </DocsSection>

          <DocsSection
            description="Meta analysis is where raw placements become strategic timing: who is surging, where, and why."
            id="meta-detection"
            kicker="Meta Shift Detection"
            title="Read The Field Before It Becomes Obvious"
          >
            <div className="grid gap-4 lg:grid-cols-3">
              {metaSignals.map((signal) => (
                <AcademyCard key={signal.label} icon={signal.label === "Emerging Meta" ? Zap : signal.label === "Faction Surge" ? Trophy : LineChart} title={signal.label} tone={signal.tone}>
                  {signal.text}
                </AcademyCard>
              ))}
            </div>
            <motion.div className="premium-panel mt-4 rounded-lg p-5" variants={fadeUp}>
              <div className="relative z-10">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-racing">Example Interpretation</p>
                <p className="mt-3 text-lg font-black text-white">Volt faction win rate increased from 21% to 34% over the last 7 days.</p>
                <p className="mt-2 text-sm leading-6 text-white/58">Primary cause: stronger medium-distance performance. Recommended action: inspect Volt entries in upcoming medium races before committing against them.</p>
              </div>
            </motion.div>
          </DocsSection>

          <DocsSection
            description="Stable Manager turns the connected wallet into a racing control center: owned Giglings, fit checks, alerts, and opportunities."
            id="stable-manager"
            kicker="Stable Manager Guide"
            title="Optimize The Roster You Actually Own"
          >
            <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
              <AcademyCard icon={WalletCards} title="Wallet-aware analysis" tone="emerald">
                Ownership lookups identify the connected wallet&apos;s Giglings, then compare those racers against live race opportunities.
              </AcademyCard>
              <motion.div className="premium-panel rounded-lg p-5" variants={fadeUp}>
                <div className="relative z-10 grid gap-3 sm:grid-cols-3">
                  {["Best performer", "Race opportunity", "Risk alert"].map((label, index) => (
                    <div key={label} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-white/42">{label}</p>
                      <p className="mt-3 text-xl font-black text-white">{index === 0 ? "High fit" : index === 1 ? "Open lobby" : "Volatile track"}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </DocsSection>

          <DocsSection
            description="Racing is more memorable when relationships emerge from repeated matchups."
            id="rivalries"
            kicker="Rivalry Intelligence Guide"
            title="Turn Matchups Into Stories"
          >
            <div className="grid gap-4 md:grid-cols-3">
              {[
                ["Rival", "Balanced head-to-head results with repeated encounters.", "cyan" as Tone],
                ["Nemesis", "Opponent repeatedly beats your entries in meaningful spots.", "orange" as Tone],
                ["Ally", "Shared podium and non-hostile matchup patterns worth watching.", "emerald" as Tone]
              ].map(([label, text, tone]) => (
                <AcademyCard key={label} icon={Swords} title={label} tone={tone as Tone}>
                  {text}
                </AcademyCard>
              ))}
            </div>
          </DocsSection>

          <DocsSection
            description="Reports package race intelligence into social-ready cards and copy blocks."
            id="reports-sharing"
            kicker="Reports & Sharing"
            title="Share The Race Story"
          >
            <div className="grid gap-4 md:grid-cols-3">
              <ReportPreviewCard label="Gigling profile" stat="58.7%" title="Frostclaw" tone="cyan" />
              <ReportPreviewCard label="Race report" stat="P1" title="Race Victory" tone="orange" />
              <ReportPreviewCard label="Meta alert" stat="+34%" title="Faction Surge" tone="violet" />
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <AcademyCard icon={Download} title="Downloadable cards" tone="emerald">
                Exportable report previews help players carry a clean result into community channels.
              </AcademyCard>
              <AcademyCard icon={Share2} title="Social copy" tone="violet">
                Discord, X, and Telegram copy blocks summarize the insight without burying the signal.
              </AcademyCard>
            </div>
          </DocsSection>

          <DocsSection
            description="The data layer keeps raw external responses away from UI components and turns them into typed racing concepts."
            id="data-layer"
            kicker="Developer / Data Layer"
            title="How The App Uses Gigaverse Data"
          >
            <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
              <motion.div className="premium-panel rounded-lg p-5" variants={fadeUp}>
                <div className="relative z-10">
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-racing">Architecture Flow</p>
                  <div className="mt-4">
                    <ArchitectureFlow />
                  </div>
                </div>
              </motion.div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["Gigaverse APIs", "Race, Gigling, leaderboard, and meta reads.", Code2],
                  ["Contract reads", "Wallet ownership and race-system context where available.", CircuitBoard],
                  ["Adapters", "Normalize raw responses into typed app data.", GitBranch],
                  ["Query layer", "React Query keeps client reads cacheable and resilient.", Activity]
                ].map(([title, text, Icon]) => (
                  <AcademyCard key={title as string} icon={Icon as LucideIcon} title={title as string} tone="cyan">
                    {text as string}
                  </AcademyCard>
                ))}
              </div>
            </div>
          </DocsSection>

          <DocsSection id="faq" kicker="FAQ" title="Common Racer Questions">
            <DocsFAQ />
          </DocsSection>

          <DocsCTA />
          </div>
        </div>
      </div>
    </main>
  );
}
