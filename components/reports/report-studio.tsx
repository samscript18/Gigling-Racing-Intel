"use client";

import { motion } from "framer-motion";
import { Check, Copy, Download, Share2, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

import { FactionBadge } from "@/components/shared/faction-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { MetricCard } from "@/components/shared/metric-card";
import { RarityBadge } from "@/components/shared/rarity-badge";
import { SectionHeader } from "@/components/shared/section-header";
import { formatPercent, formatToken } from "@/lib/utils/format";
import type { Gigling, MetaInsight, Race } from "@/types";

type ReportStudioProps = {
  giglings: Gigling[];
  races: Race[];
  insights: MetaInsight[];
};

type ShareAction = "copy" | "share" | "download";

function winnerName(race: Race) {
  return (
    race.participants.find((participant) => participant.giglingId === race.winnerGiglingId)
      ?.giglingName ?? "Pending"
  );
}

async function copyText(value: string) {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function ActionButton({
  action,
  activeAction,
  onAction
}: {
  action: ShareAction;
  activeAction?: ShareAction;
  onAction: (action: ShareAction) => void;
}) {
  const icons = {
    copy: Copy,
    share: Share2,
    download: Download
  };
  const Icon = icons[action];
  const active = activeAction === action;
  const activeLabels: Record<ShareAction, string> = {
    copy: "Copied",
    share: "Shared",
    download: "Downloaded"
  };

  return (
    <button
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-bold capitalize transition ${
        active
          ? "border-emerald-racing/35 bg-emerald-racing/10 text-emerald-racing"
          : "border-white/10 bg-white/[0.04] text-white/62 hover:border-cyan-racing/35 hover:text-cyan-racing"
      }`}
      type="button"
      onClick={() => onAction(action)}
    >
      {active ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
      {active ? activeLabels[action] : action}
    </button>
  );
}

function ReportShell({
  eyebrow,
  title,
  children,
  accent = "cyan"
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  accent?: "cyan" | "orange" | "emerald";
}) {
  const accentClass =
    accent === "orange"
      ? "text-orange-racing border-orange-racing/24 bg-orange-racing/8"
      : accent === "emerald"
        ? "text-emerald-racing border-emerald-racing/24 bg-emerald-racing/8"
        : "text-cyan-racing border-cyan-racing/24 bg-cyan-racing/8";

  return (
    <motion.article
      className="premium-panel min-h-[360px] rounded-lg p-5"
      whileHover={{ y: -4 }}
    >
      <div className="relative z-10">
        <div className={`mb-5 inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] ${accentClass}`}>
          {eyebrow}
        </div>
        <h3 className="text-2xl font-black text-white">{title}</h3>
        {children}
      </div>
    </motion.article>
  );
}

export function ReportStudio({ giglings, races, insights }: ReportStudioProps) {
  const [selectedGiglingId, setSelectedGiglingId] = useState(giglings[0]?.id ?? "");
  const [selectedRaceId, setSelectedRaceId] = useState(races[0]?.id ?? "");
  const [selectedInsightId, setSelectedInsightId] = useState(insights[0]?.id ?? "");
  const [activeAction, setActiveAction] = useState<ShareAction | undefined>();

  const gigling = useMemo(
    () => giglings.find((entry) => entry.id === selectedGiglingId) ?? giglings[0],
    [giglings, selectedGiglingId]
  );
  const race = useMemo(
    () => races.find((entry) => entry.id === selectedRaceId) ?? races[0],
    [races, selectedRaceId]
  );
  const insight = useMemo(
    () => insights.find((entry) => entry.id === selectedInsightId) ?? insights[0],
    [insights, selectedInsightId]
  );

  if (!gigling || !race || !insight) {
    return (
      <EmptyState
        description="Reports require a live Gigling, a completed live race, and a live meta signal. Gigaverse has not returned all three inputs yet."
        title="Not enough live data for a report"
      />
    );
  }

  const socialCopy = `${gigling.name} watchlist: ${formatPercent(gigling.winRate)} win rate, ${formatPercent(gigling.podiumRate)} podium rate, best fit ${gigling.bestDistance}/${gigling.bestWeather}. Race #${race.raceNumber} winner: ${winnerName(race)}. Meta signal: ${insight.title} (${insight.metricValue}). Powered by Gigling Racing Intel.`;

  async function handleAction(action: ShareAction) {
    try {
      if (action === "copy") {
        await copyText(socialCopy);
      }

      if (action === "share") {
        if (navigator.share) {
          await navigator.share({
            title: "Gigling Racing Intel Report",
            text: socialCopy,
            url: window.location.href
          });
        } else {
          await copyText(socialCopy);
        }
      }

      if (action === "download") {
        const report = [
          "Gigling Racing Intel Report",
          "",
          socialCopy,
          "",
          `Gigling: ${gigling.name} (${gigling.tokenId})`,
          `Win rate: ${formatPercent(gigling.winRate)}`,
          `Podium rate: ${formatPercent(gigling.podiumRate)}`,
          `Race: #${race.raceNumber}`,
          `Winner: ${winnerName(race)}`,
          `Meta signal: ${insight.title} - ${insight.metricValue}`
        ].join("\n");
        const blob = new Blob([report], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `gigling-racing-intel-${gigling.id}-race-${race.raceNumber}.txt`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
      }

      setActiveAction(action);
      window.setTimeout(() => setActiveAction(undefined), 2200);
    } catch {
      setActiveAction(undefined);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard detail="Gigling, race, meta" icon="fileStack" label="Report Types" value="3" />
        <MetricCard detail="Copy/share/download actions" icon="share" label="Share Actions" tone="violet" value="Ready" />
        <MetricCard detail={gigling.name} icon="trophy" label="Feature Gigling" tone="orange" value={formatPercent(gigling.winRate)} />
        <MetricCard detail={insight.title} icon="sparkles" label="Meta Alert" tone="emerald" value={insight.metricValue} />
      </div>

      <section className="premium-panel rounded-lg p-5">
        <div className="relative z-10 grid gap-4 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-white/42">
              Gigling Card
            </span>
            <select
              className="h-11 w-full rounded-lg border border-white/10 bg-[#0b1220] px-3 text-sm font-semibold text-white outline-none transition focus:border-cyan-racing/50"
              value={selectedGiglingId}
              onChange={(event) => setSelectedGiglingId(event.target.value)}
            >
              {giglings.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-white/42">
              Race Card
            </span>
            <select
              className="h-11 w-full rounded-lg border border-white/10 bg-[#0b1220] px-3 text-sm font-semibold text-white outline-none transition focus:border-cyan-racing/50"
              value={selectedRaceId}
              onChange={(event) => setSelectedRaceId(event.target.value)}
            >
              {races.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  Race #{entry.raceNumber}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-white/42">
              Meta Card
            </span>
            <select
              className="h-11 w-full rounded-lg border border-white/10 bg-[#0b1220] px-3 text-sm font-semibold text-white outline-none transition focus:border-cyan-racing/50"
              value={selectedInsightId}
              onChange={(event) => setSelectedInsightId(event.target.value)}
            >
              {insights.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.title}
                </option>
              ))}
            </select>
          </label>
          <div className="flex flex-wrap gap-2">
            <ActionButton action="copy" activeAction={activeAction} onAction={handleAction} />
            <ActionButton action="share" activeAction={activeAction} onAction={handleAction} />
            <ActionButton action="download" activeAction={activeAction} onAction={handleAction} />
          </div>
        </div>
      </section>

      <section>
        <SectionHeader
          description="Shareable cards for community posts, match recaps, and meta alerts."
          title="Report Cards"
        />
        <div className="grid gap-5 lg:grid-cols-3">
          <ReportShell accent="cyan" eyebrow="Gigling Report" title={gigling.name}>
            <div className="mt-4 flex flex-wrap gap-2">
              <FactionBadge faction={gigling.faction} />
              <RarityBadge rarity={gigling.rarity} />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
                <p className="text-xs text-white/38">Win</p>
                <p className="mt-1 text-xl font-black text-cyan-racing">{formatPercent(gigling.winRate)}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
                <p className="text-xs text-white/38">Podium</p>
                <p className="mt-1 text-xl font-black text-orange-racing">{formatPercent(gigling.podiumRate)}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
                <p className="text-xs text-white/38">Best Fit</p>
                <p className="mt-1 font-black capitalize text-white">{gigling.bestDistance}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
                <p className="text-xs text-white/38">Earnings</p>
                <p className="mt-1 font-black text-white">{formatToken(gigling.earnings)}</p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-6 text-white/58">
              {gigling.name} is strongest in {gigling.bestWeather} weather and is currently carrying a {gigling.currentStreak} race streak.
            </p>
          </ReportShell>

          <ReportShell accent="orange" eyebrow="Race Report" title={`Race #${race.raceNumber}`}>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
                <p className="text-xs text-white/38">Winner</p>
                <p className="mt-1 font-black text-white">{winnerName(race)}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
                <p className="text-xs text-white/38">Prize</p>
                <p className="mt-1 font-black text-orange-racing">{formatToken(race.prizePool)}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
                <p className="text-xs text-white/38">Conditions</p>
                <p className="mt-1 font-black capitalize text-white">{race.weather} / {race.trackCondition}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
                <p className="text-xs text-white/38">Entrants</p>
                <p className="mt-1 font-black text-white">{race.participants.length}</p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-6 text-white/58">
              {race.distance} race with {race.participants.flatMap((entry) => entry.itemsUsed).length} recorded item actions.
            </p>
          </ReportShell>

          <ReportShell accent="emerald" eyebrow="Meta Alert" title={insight.title}>
            <div className="mt-5 rounded-lg border border-emerald-racing/24 bg-emerald-racing/8 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-racing">
                {insight.metricLabel}
              </p>
              <p className="mt-2 text-3xl font-black text-white">{insight.metricValue}</p>
            </div>
            <p className="mt-5 text-sm leading-6 text-white/58">{insight.description}</p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold capitalize text-white/62">
              <Sparkles className="h-3.5 w-3.5 text-cyan-racing" />
              {insight.severity} / {insight.trendDirection}
            </div>
          </ReportShell>
        </div>
      </section>

      <section className="premium-panel rounded-lg p-5">
        <div className="relative z-10">
          <SectionHeader
            description="Social-ready copy generated from the selected report cards."
            title="Social Sharing Copy"
          />
          <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4 text-sm leading-6 text-white/64">
            {socialCopy}
          </div>
        </div>
      </section>
    </div>
  );
}
