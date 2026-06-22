"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Check, Play, Radar, Trophy, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { FactionBadge } from "@/components/shared/faction-badge";
import { LoadingState } from "@/components/shared/loading-state";
import { MetricCard } from "@/components/shared/metric-card";
import { RarityBadge } from "@/components/shared/rarity-badge";
import { SectionHeader } from "@/components/shared/section-header";
import { useGiglings } from "@/hooks/use-giglings";
import { runRacePrediction } from "@/lib/gigaverse/predictor";
import { cn } from "@/lib/utils/cn";
import { formatPercent } from "@/lib/utils/format";
import type {
  Gigling,
  PredictionParticipantResult,
  PredictionResult,
  RaceDistance,
  RaceWeather,
  TrackCondition
} from "@/types";

const distanceOptions: RaceDistance[] = ["sprint", "medium", "long", "marathon"];
const weatherOptions: RaceWeather[] = ["sunny", "rainy", "stormy", "foggy", "windy"];
const trackOptions: TrackCondition[] = ["dry", "wet", "muddy", "icy", "chaotic"];

const riskStyles: Record<PredictionParticipantResult["riskLevel"], string> = {
  low: "border-emerald-racing/30 bg-emerald-racing/10 text-emerald-racing",
  medium: "border-orange-racing/35 bg-orange-racing/10 text-orange-racing",
  high: "border-red-400/35 bg-red-500/10 text-red-200"
};

type SelectInputProps<T extends string> = {
  label: string;
  value: T;
  options: T[];
  onChange: (value: T) => void;
};

function SelectInput<T extends string>({
  label,
  value,
  options,
  onChange
}: SelectInputProps<T>) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-white/42">
        {label}
      </span>
      <select
        className="h-11 w-full rounded-lg border border-white/10 bg-[#0b1220] px-3 text-sm font-semibold capitalize text-white outline-none transition focus:border-cyan-racing/50"
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function ProbabilityBar({
  label,
  value,
  tone = "cyan"
}: {
  label: string;
  value: number;
  tone?: "cyan" | "orange" | "emerald";
}) {
  const gradient =
    tone === "orange"
      ? "from-orange-racing to-violet-racing"
      : tone === "emerald"
        ? "from-emerald-racing to-cyan-racing"
        : "from-cyan-racing to-violet-racing";

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-white/46">
        <span>{label}</span>
        <span className="font-bold text-white">{formatPercent(value)}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/8">
        <motion.div
          animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
          className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
          initial={{ width: "0%" }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function ResultCard({
  result,
  rank
}: {
  result: PredictionParticipantResult;
  rank: number;
}) {
  return (
    <motion.article
      animate={{ opacity: 1, y: 0 }}
      className="premium-panel rounded-lg p-4"
      initial={{ opacity: 0, y: 12 }}
      transition={{ delay: rank * 0.045, duration: 0.22 }}
    >
      <div className="relative z-10">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-racing/70">
              Rank {rank + 1}
            </p>
            <h3 className="mt-1 text-xl font-black text-white">{result.giglingName}</h3>
          </div>
          <span
            className={cn(
              "rounded-full border px-2.5 py-1 text-xs font-bold capitalize",
              riskStyles[result.riskLevel]
            )}
          >
            {result.riskLevel} risk
          </span>
        </div>
        <div className="space-y-3">
          <ProbabilityBar label="Estimated win" value={result.estimatedWinProbability} />
          <ProbabilityBar
            label="Estimated podium"
            tone="orange"
            value={result.estimatedPodiumProbability}
          />
          <ProbabilityBar label="Confidence" tone="emerald" value={result.confidence} />
        </div>
        <div className="mt-4 space-y-2">
          {result.reasons.map((reason) => (
            <p key={reason} className="rounded-lg border border-white/10 bg-white/[0.035] p-3 text-sm leading-6 text-white/58">
              {reason}
            </p>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

function getDefaultSelectedIds(giglings: Gigling[]) {
  return [...giglings]
    .sort((first, second) => second.winRate - first.winRate)
    .slice(0, 6)
    .map((gigling) => gigling.id);
}

export function RaceIntelligenceEngine() {
  const { data: giglings, error, isLoading, isError } = useGiglings();
  const [distance, setDistance] = useState<RaceDistance>("sprint");
  const [weather, setWeather] = useState<RaceWeather>("sunny");
  const [trackCondition, setTrackCondition] = useState<TrackCondition>("dry");
  const [selectedGiglingIds, setSelectedGiglingIds] = useState<string[]>([]);
  const [prediction, setPrediction] = useState<PredictionResult | undefined>();

  useEffect(() => {
    if (giglings?.length) {
      setSelectedGiglingIds((current) =>
        current.length > 0 ? current : getDefaultSelectedIds(giglings)
      );
    }
  }, [giglings]);

  const availableGiglings = useMemo(() => giglings ?? [], [giglings]);
  const selectedGiglings = availableGiglings.filter((gigling) =>
    selectedGiglingIds.includes(gigling.id)
  );
  const topPick = prediction?.participants[0];

  function toggleGigling(id: string) {
    setSelectedGiglingIds((current) =>
      current.includes(id)
        ? current.filter((entry) => entry !== id)
        : current.length >= 8
          ? current
          : [...current, id]
    );
  }

  function resetSelection() {
    if (!giglings) {
      return;
    }

    setDistance("sprint");
    setWeather("sunny");
    setTrackCondition("dry");
    setSelectedGiglingIds(getDefaultSelectedIds(giglings));
    setPrediction(undefined);
  }

  function runPrediction() {
    if (!giglings || selectedGiglingIds.length < 2) {
      return;
    }

    setPrediction(
      runRacePrediction(
        {
          distance,
          weather,
          trackCondition,
          participantGiglingIds: selectedGiglingIds
        },
        giglings
      )
    );
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError || !giglings) {
    return (
      <ErrorState
        description={
          error instanceof Error
            ? error.message
            : "The predictor could not load the live Gigling leaderboard."
        }
        title="Race Intelligence Engine unavailable"
      />
    );
  }

  if (giglings.length < 2) {
    return (
      <EmptyState
        description="The live Gigaverse leaderboard did not return enough Giglings to build a prediction field. At least two live participant profiles are required."
        title="Not enough live Giglings"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          detail={topPick?.giglingName ?? "Run model"}
          icon="trophy"
          label="Suggested Pick"
          mechanic="confidence"
          tone="orange"
          value={topPick ? formatPercent(topPick.estimatedWinProbability) : "--"}
        />
        <MetricCard
          detail={`${distance} / ${weather}`}
          icon="radar"
          label="Race Conditions"
          mechanic="trackCondition"
          value={trackCondition}
        />
        <MetricCard
          detail={`${selectedGiglings.length} selected entrants`}
          icon="users"
          label="Field Size"
          tone="emerald"
          value={`${selectedGiglingIds.length}`}
        />
        <MetricCard
          detail="Directional, explainable estimate"
          icon="alert"
          label="Model Safety"
          mechanic="risk"
          tone="violet"
          value="No guarantees"
        />
      </div>

      <section className="premium-panel rounded-lg p-4 sm:p-5">
        <div className="relative z-10">
          <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-racing/24 bg-cyan-racing/10 text-cyan-racing">
                <Radar className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white">Race Condition Input</h2>
                <p className="text-sm text-white/48">
                  Tune the race environment before selecting the field.
                </p>
              </div>
            </div>
            <button
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm font-bold text-white/64 transition hover:border-orange-racing/40 hover:text-orange-racing"
              type="button"
              onClick={resetSelection}
            >
              <X className="h-4 w-4" />
              Reset selection
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <SelectInput
              label="Distance"
              options={distanceOptions}
              value={distance}
              onChange={setDistance}
            />
            <SelectInput
              label="Weather"
              options={weatherOptions}
              value={weather}
              onChange={setWeather}
            />
            <SelectInput
              label="Track"
              options={trackOptions}
              value={trackCondition}
              onChange={setTrackCondition}
            />
          </div>
        </div>
      </section>

      <section className="premium-panel rounded-lg p-4 sm:p-5">
        <div className="relative z-10">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeader
              description="Select 2 to 8 Giglings. The model ranks selected participants only."
              title="Participant Selector"
            />
            <button
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-cyan-racing px-4 text-sm font-black text-[#031018] shadow-glow transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-45"
              disabled={selectedGiglingIds.length < 2}
              type="button"
              onClick={runPrediction}
            >
              <Play className="h-4 w-4" />
              Run prediction
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {availableGiglings.map((gigling) => {
              const selected = selectedGiglingIds.includes(gigling.id);

              return (
                <button
                  key={gigling.id}
                  className={cn(
                    "rounded-lg border p-3 text-left transition",
                    selected
                      ? "border-cyan-racing/45 bg-cyan-racing/12 shadow-glow"
                      : "border-white/10 bg-white/[0.035] hover:border-white/20 hover:bg-white/[0.055]"
                  )}
                  type="button"
                  onClick={() => toggleGigling(gigling.id)}
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-black text-white">{gigling.name}</p>
                      <p className="mt-1 text-xs text-white/42">{gigling.tokenId}</p>
                    </div>
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border",
                        selected
                          ? "border-cyan-racing/40 bg-cyan-racing/14 text-cyan-racing"
                          : "border-white/10 bg-white/[0.04] text-white/32"
                      )}
                    >
                      {selected ? <Check className="h-4 w-4" /> : null}
                    </span>
                  </div>
                  <div className="mb-3 flex flex-wrap gap-2">
                    <FactionBadge faction={gigling.faction} />
                    <RarityBadge rarity={gigling.rarity} />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg border border-white/10 bg-white/[0.035] p-2">
                      <p className="text-white/38">Win</p>
                      <p className="font-bold text-white">{formatPercent(gigling.winRate)}</p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-white/[0.035] p-2">
                      <p className="text-white/38">Fit</p>
                      <p className="font-bold capitalize text-white">{gigling.bestDistance}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {prediction ? (
        <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <section>
            <SectionHeader
              description="Ranked by estimated win probability with podium chance, confidence, and risk."
              mechanic="confidence"
              title="Ranked Prediction Results"
            />
            <div className="grid gap-4 lg:grid-cols-2">
              {prediction.participants.map((participant, index) => (
                <ResultCard
                  key={participant.giglingId}
                  rank={index}
                  result={participant}
                />
              ))}
            </div>
          </section>

          <section className="premium-panel rounded-lg p-5">
            <div className="relative z-10">
              <SectionHeader
                description="Plain-English explanation and model warnings."
                mechanic="risk"
                title="Suggested Best Pick"
              />
              <div className="rounded-lg border border-orange-racing/25 bg-orange-racing/10 p-4">
                <div className="flex items-center gap-3">
                  <Trophy className="h-6 w-6 text-orange-racing" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-orange-racing">
                      Top pick
                    </p>
                    <p className="text-xl font-black text-white">{topPick?.giglingName}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-white/64">{prediction.summary}</p>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
                  <p className="text-xs text-white/38">Edge</p>
                  <p className="mt-1 text-lg font-black text-cyan-racing">
                    +{prediction.topPickEdge}%
                  </p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
                  <p className="text-xs text-white/38">Volatility</p>
                  <p className="mt-1 text-lg font-black text-orange-racing">
                    {prediction.fieldVolatility}/100
                  </p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
                  <p className="text-xs text-white/38">Confidence</p>
                  <p className="mt-1 text-lg font-black text-emerald-racing">
                    {prediction.confidence}%
                  </p>
                </div>
              </div>

              <p className="mt-4 rounded-lg border border-cyan-racing/20 bg-cyan-racing/8 p-4 text-sm leading-6 text-white/68">
                {prediction.recommendation}
              </p>

              <div className="mt-4 space-y-3">
                {prediction.warnings.map((warning) => (
                  <p key={warning} className="flex gap-2 rounded-lg border border-orange-racing/20 bg-orange-racing/8 p-3 text-sm leading-6 text-white/64">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-orange-racing" />
                    {warning}
                  </p>
                ))}
              </div>
            </div>
          </section>
        </div>
      ) : (
        <EmptyState
          description="Choose race conditions, select at least two Giglings, then run the model to generate ranked predictions and reasoning."
          icon={Radar}
          title="Race Intelligence Engine ready"
        />
      )}
    </div>
  );
}
