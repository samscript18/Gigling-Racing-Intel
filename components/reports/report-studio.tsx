"use client";

import { motion } from "framer-motion";
import { Check, Copy, Download, LoaderCircle, Share2, Sparkles } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import type { RefObject } from "react";

import { FactionBadge } from "@/components/shared/faction-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { GiglingAvatar } from "@/components/shared/gigling-avatar";
import { MetricCard } from "@/components/shared/metric-card";
import { RarityBadge } from "@/components/shared/rarity-badge";
import { SectionHeader } from "@/components/shared/section-header";
import {
  formatConditionLabel,
  formatGiglingRaceFit,
  formatOptionalToken,
  formatPercent,
  formatToken
} from "@/lib/utils/format";
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
  pendingAction,
  onAction
}: {
  action: ShareAction;
  activeAction?: ShareAction;
  pendingAction?: ShareAction;
  onAction: (action: ShareAction) => void;
}) {
  const icons = {
    copy: Copy,
    share: Share2,
    download: Download
  };
  const Icon = icons[action];
  const active = activeAction === action;
  const pending = pendingAction === action;
  const activeLabels: Record<ShareAction, string> = {
    copy: "Copied",
    share: "Shared",
    download: "Downloaded"
  };

  return (
    <button
      aria-label={`${action} report`}
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-bold capitalize transition ${
        active
          ? "border-emerald-racing/35 bg-emerald-racing/10 text-emerald-racing"
          : "border-white/10 bg-white/[0.04] text-white/62 hover:border-cyan-racing/35 hover:text-cyan-racing"
      }`}
      disabled={Boolean(pendingAction)}
      type="button"
      onClick={() => onAction(action)}
    >
      {pending ? (
        <LoaderCircle className="h-4 w-4 animate-spin" />
      ) : active ? (
        <Check className="h-4 w-4" />
      ) : (
        <Icon className="h-4 w-4" />
      )}
      {pending ? "Preparing" : active ? activeLabels[action] : action}
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

function SharePreview({
  artifactRef,
  gigling,
  insight,
  race
}: {
  artifactRef: RefObject<HTMLDivElement | null>;
  gigling: Gigling;
  insight: MetaInsight;
  race: Race;
}) {
  return (
    <section className="premium-panel rounded-lg p-5">
      <div className="relative z-10">
        <SectionHeader
          description="A social-format preview of the PNG report generated from the selected live inputs."
          title="Social Preview"
        />
        <div className="w-full overflow-hidden rounded-lg border border-white/10 bg-[#05070d] shadow-glow">
          <div ref={artifactRef} className="relative overflow-hidden bg-[#05070d] p-4 text-white sm:p-5 lg:aspect-[1200/630] lg:p-6">
            <div className="absolute inset-0 bg-racing-grid opacity-35" />
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-cyan-racing via-orange-racing to-violet-racing" />
            <div className="relative z-10 grid gap-5 lg:h-full lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
              <div className="flex min-w-0 flex-col items-start gap-4 sm:flex-row sm:items-center">
                <GiglingAvatar
                  className="h-24 w-24 shrink-0 rounded-lg sm:h-28 sm:w-28 lg:h-36 lg:w-36"
                  imageUrl={gigling.imageUrl}
                  name={gigling.name}
                  priority
                />
                <div className="min-w-0">
                  <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-cyan-racing sm:text-xs sm:tracking-[0.22em]">
                    Gigling Report
                  </p>
                  <h3 className="mt-2 break-words text-2xl font-black leading-tight text-white sm:text-3xl lg:text-4xl">
                    {gigling.name}
                  </h3>
                  <p className="mt-2 text-sm text-white/48">{gigling.tokenId}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <FactionBadge faction={gigling.faction} />
                    <RarityBadge rarity={gigling.rarity} />
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="min-w-0 rounded-lg border border-cyan-racing/22 bg-cyan-racing/[0.07] p-3 sm:p-4">
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-cyan-racing sm:text-xs sm:tracking-[0.18em]">
                    Win rate
                  </p>
                  <p className="mt-2 text-2xl font-black text-white sm:text-3xl">
                    {formatPercent(gigling.winRate)}
                  </p>
                </div>
                <div className="min-w-0 rounded-lg border border-orange-racing/22 bg-orange-racing/[0.07] p-3 sm:p-4">
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-orange-racing sm:text-xs sm:tracking-[0.18em]">
                    Race #{race.raceNumber}
                  </p>
                  <p className="mt-2 break-words text-lg font-black text-white sm:text-xl">
                    {winnerName(race)}
                  </p>
                </div>
                <div className="min-w-0 rounded-lg border border-emerald-racing/22 bg-emerald-racing/[0.07] p-3 sm:col-span-2 sm:p-4">
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-emerald-racing sm:text-xs sm:tracking-[0.18em]">
                    Meta signal
                  </p>
                  <p className="mt-2 break-words text-xl font-black text-white sm:text-2xl">{insight.metricValue}</p>
                  <p className="mt-1 text-sm leading-6 text-white/58">{insight.title}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ReportStudio({ giglings, races, insights }: ReportStudioProps) {
  const [selectedGiglingId, setSelectedGiglingId] = useState(giglings[0]?.id ?? "");
  const [selectedRaceId, setSelectedRaceId] = useState(races[0]?.id ?? "");
  const [selectedInsightId, setSelectedInsightId] = useState(insights[0]?.id ?? "");
  const [activeAction, setActiveAction] = useState<ShareAction | undefined>();
  const [pendingAction, setPendingAction] = useState<ShareAction | undefined>();
  const [actionMessage, setActionMessage] = useState("");
  const exportRef = useRef<HTMLDivElement>(null);

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

  const socialCopy = `${gigling.name} watchlist: ${formatPercent(gigling.winRate)} win rate, ${formatPercent(gigling.podiumRate)} podium rate, best fit ${formatGiglingRaceFit(gigling.bestDistance, gigling.bestWeather).toLowerCase()}. Race #${race.raceNumber} winner: ${winnerName(race)}. Meta signal: ${insight.title} (${insight.metricValue}). Powered by Gigling Racing Intel.`;

  async function renderReportImage() {
    if (!exportRef.current) {
      throw new Error("The visual report is not ready yet.");
    }

    await document.fonts.ready;
    const { toBlob } = await import("html-to-image");
    const blob = await toBlob(exportRef.current, {
      backgroundColor: "#05070d",
      cacheBust: true,
      height: 630,
      pixelRatio: 2,
      width: 970
    });

    if (!blob) {
      throw new Error("The browser could not render the report image.");
    }

    return blob;
  }

  async function handleAction(action: ShareAction) {
    setPendingAction(action);
    setActionMessage("");

    try {
      if (action === "copy") {
        await copyText(socialCopy);
        setActionMessage("Social copy added to your clipboard.");
      }

      if (action === "share") {
        const blob = await renderReportImage();
        const file = new File([blob], `gigling-racing-intel-${gigling.id}.png`, {
          type: "image/png"
        });

        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: "Gigling Racing Intel Report",
            text: socialCopy
          });
          setActionMessage("Visual report shared from your device.");
        } else if (navigator.share) {
          await navigator.share({
            title: "Gigling Racing Intel Report",
            text: socialCopy,
            url: window.location.href
          });
          setActionMessage("This browser shared the report text; use Download for the PNG.");
        } else {
          await copyText(socialCopy);
          setActionMessage("Native sharing is unavailable, so the report text was copied.");
        }
      }

      if (action === "download") {
        const blob = await renderReportImage();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `gigling-racing-intel-${gigling.id}-race-${race.raceNumber}.png`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        setActionMessage("A 970 x 630 PNG report was saved.");
      }

      setActiveAction(action);
      window.setTimeout(() => setActiveAction(undefined), 2200);
    } catch (error) {
      setActiveAction(undefined);
      setActionMessage(
        error instanceof Error
          ? error.message
          : "The report action could not be completed in this browser."
      );
    } finally {
      setPendingAction(undefined);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard detail="Gigling, race, meta" icon="fileStack" label="Report Types" value="3" />
        <MetricCard detail="Copy/share/download actions" icon="share" label="Share Actions" tone="violet" value="Ready" />
        <MetricCard detail={gigling.name} icon="trophy" label="Feature Gigling" mechanic="winRate" tone="orange" value={formatPercent(gigling.winRate)} />
        <MetricCard detail={insight.title} icon="sparkles" label="Meta Alert" mechanic="faction" tone="emerald" value={insight.metricValue} />
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
            <ActionButton action="copy" activeAction={activeAction} pendingAction={pendingAction} onAction={handleAction} />
            <ActionButton action="share" activeAction={activeAction} pendingAction={pendingAction} onAction={handleAction} />
            <ActionButton action="download" activeAction={activeAction} pendingAction={pendingAction} onAction={handleAction} />
          </div>
        </div>
        <p aria-live="polite" className="relative z-10 mt-3 text-sm text-white/52">
          {actionMessage}
        </p>
      </section>

      <SharePreview artifactRef={exportRef} gigling={gigling} insight={insight} race={race} />

      <section>
        <SectionHeader
          description="Shareable cards for community posts, match recaps, and meta alerts."
          title="Report Cards"
        />
        <div className="mobile-card-rail grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <ReportShell accent="cyan" eyebrow="Gigling Report" title={gigling.name}>
            <GiglingAvatar
              className="mt-5 aspect-square max-h-56 rounded-lg"
              imageUrl={gigling.imageUrl}
              name={gigling.name}
            />
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
                <p className="mt-1 font-black capitalize text-white">
                  {formatGiglingRaceFit(gigling.bestDistance, gigling.bestWeather)}
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
                <p className="text-xs text-white/38">Earnings</p>
                <p className="mt-1 font-black text-white">{formatOptionalToken(gigling.earnings)}</p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-6 text-white/58">
              {gigling.bestWeather === "unknown"
                ? `${gigling.name} has no live weather-fit signal yet and is currently carrying a ${gigling.currentStreak} race streak.`
                : `${gigling.name} is strongest in ${formatConditionLabel(gigling.bestWeather)} weather and is currently carrying a ${gigling.currentStreak} race streak.`}
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
                <p className="text-xs text-white/38">Entry</p>
                <p className="mt-1 font-black text-emerald-racing">{formatToken(race.entryFee)}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
                <p className="text-xs text-white/38">Conditions</p>
                <p className="mt-1 font-black capitalize text-white">
                  {formatConditionLabel(race.weather)} / {formatConditionLabel(race.trackCondition)}
                </p>
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
