"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Flag, Radio, Search, SlidersHorizontal, WifiOff, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { MetricCard } from "@/components/shared/metric-card";
import { RaceCard } from "@/components/shared/race-card";
import { SectionHeader } from "@/components/shared/section-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { useRaceRealtime, useRaces } from "@/hooks/use-races";
import { formatToken } from "@/lib/utils/format";
import type { Race, RaceDistance, RaceWeather, TrackCondition } from "@/types";

type RaceTab = "live" | "recent" | "historical";
type ItemFilter = "all" | "with-items" | "no-items";

const tabs: Array<{
  label: string;
  value: RaceTab;
  description: string;
}> = [
  {
    label: "Live",
    value: "live",
    description: "Live and scheduled lobbies"
  },
  {
    label: "Recent",
    value: "recent",
    description: "Latest completed finishes"
  },
  {
    label: "Historical",
    value: "historical",
    description: "Completed race archive"
  }
];

const distanceOptions: Array<RaceDistance | "all"> = [
  "all",
  "sprint",
  "medium",
  "long",
  "marathon"
];
const weatherOptions: Array<RaceWeather | "all"> = [
  "all",
  "sunny",
  "rainy",
  "stormy",
  "foggy",
  "windy"
];
const trackOptions: Array<TrackCondition | "all"> = [
  "all",
  "dry",
  "wet",
  "muddy",
  "icy",
  "chaotic"
];
const itemOptions: ItemFilter[] = ["all", "with-items", "no-items"];

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
            {option === "all" ? `All ${label}` : option.replace("-", " ")}
          </option>
        ))}
      </select>
    </label>
  );
}

function getRaceTimestamp(race: Race) {
  return new Date(race.endedAt ?? race.startedAt ?? 0).getTime();
}

function getRaceItemCount(race: Race) {
  return race.participants.reduce(
    (total, participant) => total + participant.itemsUsed.length,
    0
  );
}

function getRaceWinnerName(race: Race) {
  return (
    race.participants.find((participant) => participant.giglingId === race.winnerGiglingId)
      ?.giglingName ?? "Pending"
  );
}

function matchesSearch(race: Race, search: string) {
  const normalized = search.trim().toLowerCase();

  if (!normalized) {
    return true;
  }

  const participantText = race.participants
    .flatMap((participant) => [
      participant.giglingName,
      participant.ownerName ?? "",
      participant.ownerAddress
    ])
    .join(" ")
    .toLowerCase();

  return [
    `#${race.raceNumber}`,
    `${race.raceNumber}`,
    race.id,
    race.distance,
    race.weather,
    race.trackCondition,
    getRaceWinnerName(race),
    participantText
  ].some((value) => value.toLowerCase().includes(normalized));
}

export function RaceDashboard() {
  const { data: races, error, isLoading, isError } = useRaces();
  const realtime = useRaceRealtime();
  const [activeTab, setActiveTab] = useState<RaceTab>("live");
  const [search, setSearch] = useState("");
  const [distance, setDistance] = useState<RaceDistance | "all">("all");
  const [weather, setWeather] = useState<RaceWeather | "all">("all");
  const [trackCondition, setTrackCondition] = useState<TrackCondition | "all">("all");
  const [itemFilter, setItemFilter] = useState<ItemFilter>("all");

  const raceBuckets = useMemo(() => {
    const source = races ?? [];
    const active = source
      .filter((race) => race.status === "live" || race.status === "scheduled")
      .sort((first, second) => getRaceTimestamp(first) - getRaceTimestamp(second));
    const completed = source
      .filter((race) => race.status === "completed")
      .sort((first, second) => getRaceTimestamp(second) - getRaceTimestamp(first));

    return {
      live: active,
      recent: completed.slice(0, 8),
      historical: completed
    };
  }, [races]);

  const visibleRaces = useMemo(() => {
    return raceBuckets[activeTab]
      .filter((race) => matchesSearch(race, search))
      .filter((race) => distance === "all" || race.distance === distance)
      .filter((race) => weather === "all" || race.weather === weather)
      .filter((race) => trackCondition === "all" || race.trackCondition === trackCondition)
      .filter((race) => {
        const itemCount = getRaceItemCount(race);

        if (itemFilter === "with-items") {
          return itemCount > 0;
        }

        if (itemFilter === "no-items") {
          return itemCount === 0;
        }

        return true;
      });
  }, [activeTab, distance, itemFilter, raceBuckets, search, trackCondition, weather]);

  const totalPrizePool = visibleRaces.reduce((total, race) => total + race.prizePool, 0);
  const participantCount = visibleRaces.reduce(
    (total, race) => total + race.participants.length,
    0
  );
  const itemCount = visibleRaces.reduce(
    (total, race) => total + getRaceItemCount(race),
    0
  );
  const averagePrizePool =
    visibleRaces.reduce((total, race) => total + race.prizePool, 0) /
    Math.max(visibleRaces.length, 1);

  const columns: DataTableColumn<Race>[] = [
    {
      header: "Race",
      cell: (race) => (
        <Link className="font-bold text-cyan-racing transition hover:text-white" href={`/races/${race.id}`}>
          #{race.raceNumber}
        </Link>
      )
    },
    {
      header: "Status",
      cell: (race) => <StatusBadge status={race.status} />
    },
    {
      header: "Conditions",
      cell: (race) => `${race.distance} / ${race.weather} / ${race.trackCondition}`
    },
    {
      header: "Prize",
      cell: (race) => formatToken(race.prizePool)
    },
    {
      header: "Entrants",
      cell: (race) => race.participants.length
    },
    {
      header: "Winner",
      cell: getRaceWinnerName
    },
    {
      header: "Items",
      cell: (race) => getRaceItemCount(race)
    }
  ];

  function resetFilters() {
    setSearch("");
    setDistance("all");
    setWeather("all");
    setTrackCondition("all");
    setItemFilter("all");
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError || !races) {
    return (
      <ErrorState
        description={
          error instanceof Error
            ? error.message
            : "Gigaverse could not load the live race feed."
        }
        title="Race feed unavailable"
      />
    );
  }

  if (races.length === 0) {
    return (
      <EmptyState
        description="The Gigaverse Racing API responded successfully but currently has no races in its recent feed."
        title="No live races returned"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div
        className={`flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${
          realtime.status === "live"
            ? "border-emerald-racing/25 bg-emerald-racing/8 text-emerald-racing"
            : "border-orange-racing/25 bg-orange-racing/8 text-orange-racing"
        }`}
        role="status"
      >
        <span className="flex items-center gap-2 font-bold">
          {realtime.status === "live" ? (
            <Radio className="h-4 w-4" />
          ) : (
            <WifiOff className="h-4 w-4" />
          )}
          {realtime.status === "live"
            ? "Abstract race events connected"
            : realtime.status === "connecting"
              ? "Connecting to Abstract race events"
              : "Realtime events unavailable; live REST data remains visible"}
        </span>
        <span className="hidden text-xs text-white/48 sm:block">
          {realtime.lastEventAt
            ? `Last event ${new Date(realtime.lastEventAt).toLocaleTimeString()}`
            : "Race feed refreshes when contract events arrive"}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          detail={`${raceBuckets.live.length} live or scheduled`}
          icon="flag"
          label="Races In View"
          value={`${visibleRaces.length}`}
        />
        <MetricCard
          detail="Visible race pools"
          icon="trophy"
          label="Prize Pool"
          tone="emerald"
          value={formatToken(totalPrizePool)}
        />
        <MetricCard
          detail="Across visible races"
          icon="users"
          label="Participants"
          tone="violet"
          value={`${participantCount}`}
        />
        <MetricCard
          detail={`${itemCount} item actions visible`}
          icon="radar"
          label="Avg Prize"
          tone="orange"
          value={formatToken(averagePrizePool)}
        />
      </div>

      <section className="premium-panel rounded-lg p-4 sm:p-5">
        <div className="relative z-10">
          <div className="mb-5 grid gap-3 lg:grid-cols-3">
            {tabs.map((tab) => {
              const active = activeTab === tab.value;
              const count = raceBuckets[tab.value].length;

              return (
                <button
                  key={tab.value}
                  className={`rounded-lg border p-4 text-left transition ${
                    active
                      ? "border-cyan-racing/45 bg-cyan-racing/12 shadow-glow"
                      : "border-white/10 bg-white/[0.035] hover:border-white/18 hover:bg-white/[0.055]"
                  }`}
                  type="button"
                  onClick={() => setActiveTab(tab.value)}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="font-black text-white">{tab.label}</span>
                    <span className="rounded-full border border-white/10 bg-white/[0.05] px-2 py-1 text-xs font-bold text-white/62">
                      {count}
                    </span>
                  </span>
                  <span className="mt-1 block text-sm text-white/48">{tab.description}</span>
                </button>
              );
            })}
          </div>

          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-orange-racing/24 bg-orange-racing/10 text-orange-racing">
                <SlidersHorizontal className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white">Race Filters</h2>
                <p className="text-sm text-white/48">
                  Search race number, winner, entrant, owner, weather, distance, or track condition.
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

          <div className="grid gap-3 lg:grid-cols-[1.35fr_repeat(4,0.75fr)]">
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-white/42">
                Search
              </span>
              <div className="flex h-11 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 transition focus-within:border-cyan-racing/50">
                <Search className="h-4 w-4 text-white/38" />
                <input
                  className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-white outline-none placeholder:text-white/32"
                  placeholder="Race #9017, Volt Vandal, rainy..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
            </label>
            <SelectFilter
              label="Distance"
              options={distanceOptions}
              value={distance}
              onChange={setDistance}
            />
            <SelectFilter
              label="Weather"
              options={weatherOptions}
              value={weather}
              onChange={setWeather}
            />
            <SelectFilter
              label="Track"
              options={trackOptions}
              value={trackCondition}
              onChange={setTrackCondition}
            />
            <SelectFilter
              label="Items"
              options={itemOptions}
              value={itemFilter}
              onChange={setItemFilter}
            />
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            description="Cards carry status, conditions, prize pool, participants, winner, item count, and detail links."
            title={`${tabs.find((tab) => tab.value === activeTab)?.label ?? "Race"} Feed`}
          />
          <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-bold text-white/62">
            <Flag className="h-4 w-4 text-cyan-racing" />
            {visibleRaces.length} races
          </div>
        </div>

        <AnimatePresence mode="wait">
          {visibleRaces.length > 0 ? (
            <motion.div
              key={`${activeTab}-${search}-${distance}-${weather}-${trackCondition}-${itemFilter}`}
              animate={{ opacity: 1, y: 0 }}
              className="grid gap-4 lg:grid-cols-2"
              exit={{ opacity: 0, y: -8 }}
              initial={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              {visibleRaces.map((race) => (
                <RaceCard key={race.id} race={race} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              initial={{ opacity: 0, y: 10 }}
            >
              <EmptyState
                description="Try a different tab, clear the search, or loosen the distance, weather, track, or item filters."
                title="No races match this feed"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <section className="premium-panel rounded-lg p-5">
        <div className="relative z-10">
          <SectionHeader
            description="A denser scan view for comparing race conditions and item usage."
            title="Race Table"
          />
          <DataTable columns={columns} data={visibleRaces} getRowKey={(race) => race.id} />
        </div>
      </section>
    </div>
  );
}
