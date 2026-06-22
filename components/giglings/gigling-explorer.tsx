"use client";

import { motion } from "framer-motion";
import { Filter, Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { GiglingCard } from "@/components/shared/gigling-card";
import { LoadingState } from "@/components/shared/loading-state";
import { MetricCard } from "@/components/shared/metric-card";
import { SectionHeader } from "@/components/shared/section-header";
import { useGiglings } from "@/hooks/use-giglings";
import type { Gigling, GiglingFaction, GiglingRarity, RaceDistance, RaceWeather } from "@/types";
import { formatPercent, formatToken } from "@/lib/utils/format";

type SortKey = "winRate" | "podiumRate" | "earnings" | "totalRaces" | "level";

const factionOptions: Array<GiglingFaction | "all"> = [
  "all",
  "crusader",
  "overseer",
  "athena",
  "archon",
  "foxglove",
  "summoner",
  "chobo",
  "gigus"
];

const rarityOptions: Array<GiglingRarity | "all"> = [
  "all",
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary"
];

const weatherOptions: Array<RaceWeather | "all"> = [
  "all",
  "sunny",
  "rainy",
  "stormy",
  "foggy",
  "windy"
];

const distanceOptions: Array<RaceDistance | "all"> = [
  "all",
  "sprint",
  "medium",
  "long",
  "marathon"
];

const sortOptions: Array<{
  label: string;
  value: SortKey;
}> = [
  { label: "Win rate", value: "winRate" },
  { label: "Podium rate", value: "podiumRate" },
  { label: "Earnings", value: "earnings" },
  { label: "Races", value: "totalRaces" },
  { label: "Level", value: "level" }
];

type SelectFilterProps<T extends string> = {
  label: string;
  value: T;
  options: T[];
  onChange: (value: T) => void;
};

function SelectFilter<T extends string>({
  label,
  value,
  options,
  onChange
}: SelectFilterProps<T>) {
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
            {option === "all" ? `All ${label}` : option}
          </option>
        ))}
      </select>
    </label>
  );
}

function matchesSearch(gigling: Gigling, search: string) {
  const normalized = search.trim().toLowerCase();

  if (!normalized) {
    return true;
  }

  return [
    gigling.name,
    gigling.tokenId,
    gigling.ownerName ?? "",
    gigling.ownerAddress
  ].some((value) => value.toLowerCase().includes(normalized));
}

export function GiglingExplorer() {
  const { data: giglings, isLoading, isError } = useGiglings();
  const [search, setSearch] = useState("");
  const [faction, setFaction] = useState<GiglingFaction | "all">("all");
  const [rarity, setRarity] = useState<GiglingRarity | "all">("all");
  const [weather, setWeather] = useState<RaceWeather | "all">("all");
  const [distance, setDistance] = useState<RaceDistance | "all">("all");
  const [sortBy, setSortBy] = useState<SortKey>("winRate");

  const filteredGiglings = useMemo(() => {
    if (!giglings) {
      return [];
    }

    return giglings
      .filter((gigling) => matchesSearch(gigling, search))
      .filter((gigling) => faction === "all" || gigling.faction === faction)
      .filter((gigling) => rarity === "all" || gigling.rarity === rarity)
      .filter((gigling) => weather === "all" || gigling.bestWeather === weather)
      .filter((gigling) => distance === "all" || gigling.bestDistance === distance)
      .sort((first, second) => second[sortBy] - first[sortBy]);
  }, [distance, faction, giglings, rarity, search, sortBy, weather]);

  const topResult = filteredGiglings[0];
  const averageWinRate =
    filteredGiglings.reduce((total, gigling) => total + gigling.winRate, 0) /
    Math.max(filteredGiglings.length, 1);
  const totalEarnings = filteredGiglings.reduce(
    (total, gigling) => total + gigling.earnings,
    0
  );

  function resetFilters() {
    setSearch("");
    setFaction("all");
    setRarity("all");
    setWeather("all");
    setDistance("all");
    setSortBy("winRate");
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError || !giglings) {
    return (
      <ErrorState
        description="The Gigling query layer could not load the live roster or fallback dataset."
        title="Gigling explorer unavailable"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          detail={`${filteredGiglings.length} currently visible`}
          icon="bot"
          label="Giglings Indexed"
          value={`${giglings.length}`}
        />
        <MetricCard
          detail={topResult?.name ?? "No match"}
          icon="trophy"
          label="Best Visible"
          tone="orange"
          value={topResult ? formatPercent(topResult.winRate) : "0%"}
        />
        <MetricCard
          detail="Across filtered results"
          icon="barChart"
          label="Avg Win Rate"
          tone="emerald"
          value={formatPercent(averageWinRate)}
        />
        <MetricCard
          detail="Filtered career earnings"
          icon="coins"
          label="Earnings"
          tone="violet"
          value={formatToken(totalEarnings)}
        />
      </div>

      <section className="premium-panel rounded-lg p-4 sm:p-5">
        <div className="relative z-10">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-racing/24 bg-cyan-racing/10 text-cyan-racing">
                <SlidersHorizontal className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white">Explorer Controls</h2>
                <p className="text-sm text-white/48">
                  Search by name, token ID, owner, or wallet; then filter by racing fit.
                </p>
              </div>
            </div>
            <button
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm font-bold text-white/64 transition hover:border-orange-racing/40 hover:text-orange-racing"
              type="button"
              onClick={resetFilters}
            >
              <X className="h-4 w-4" />
              Reset
            </button>
          </div>

          <div className="grid gap-3 lg:grid-cols-[1.3fr_repeat(5,0.75fr)]">
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-white/42">
                Search
              </span>
              <div className="flex h-11 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 transition focus-within:border-cyan-racing/50">
                <Search className="h-4 w-4 text-white/38" />
                <input
                  className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-white outline-none placeholder:text-white/32"
                  placeholder="Volt Vandal, #4101, ByteBender..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
            </label>

            <SelectFilter
              label="Faction"
              options={factionOptions}
              value={faction}
              onChange={setFaction}
            />
            <SelectFilter
              label="Rarity"
              options={rarityOptions}
              value={rarity}
              onChange={setRarity}
            />
            <SelectFilter
              label="Weather"
              options={weatherOptions}
              value={weather}
              onChange={setWeather}
            />
            <SelectFilter
              label="Distance"
              options={distanceOptions}
              value={distance}
              onChange={setDistance}
            />
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-white/42">
                Sort
              </span>
              <select
                className="h-11 w-full rounded-lg border border-white/10 bg-[#0b1220] px-3 text-sm font-semibold text-white outline-none transition focus:border-cyan-racing/50"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as SortKey)}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            description="Cards link directly into each Gigling detail page."
            title="Filtered Giglings"
          />
          <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-bold text-white/62">
            <Filter className="h-4 w-4 text-cyan-racing" />
            {filteredGiglings.length} results
          </div>
        </div>

        {filteredGiglings.length > 0 ? (
          <motion.div
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.035
                }
              }
            }}
          >
            {filteredGiglings.map((gigling) => (
              <motion.div
                key={gigling.id}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  show: { opacity: 1, y: 0 }
                }}
              >
                <GiglingCard gigling={gigling} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <EmptyState
            description="Try clearing a filter, widening weather or distance fit, or searching by owner instead."
            title="No Giglings match this scout pattern"
          />
        )}
      </section>
    </div>
  );
}
