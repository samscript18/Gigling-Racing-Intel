"use client";

import { motion } from "framer-motion";
import { Shield, Skull, Swords, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { useAccount } from "wagmi";

import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { MetricCard } from "@/components/shared/metric-card";
import { RaceCard } from "@/components/shared/race-card";
import { SectionHeader } from "@/components/shared/section-header";
import { WalletConnectButton } from "@/components/shared/wallet-connect-button";
import { usePlayerRaceHistory, useRivalries } from "@/hooks/use-stable";
import { cn } from "@/lib/utils/cn";
import { formatPercent, shortenAddress } from "@/lib/utils/format";
import type { Race, RivalryRecord } from "@/types";

type RelationshipFilter = "all" | RivalryRecord["relationshipType"];

type RivalryIntelligenceProps = {
  records: RivalryRecord[];
  races: Race[];
};

export function LiveRivalryIntelligence() {
  const { address, isConnected } = useAccount();
  const raceQuery = usePlayerRaceHistory(address);
  const rivalryQuery = useRivalries(address);

  if (!isConnected || !address) {
    return (
      <EmptyState
        action={<WalletConnectButton />}
        description="Connect your racing wallet to calculate repeat opponents from its live Gigaverse race history."
        icon={Swords}
        title="Connect a wallet to find rivals"
      />
    );
  }

  if (raceQuery.isLoading || rivalryQuery.isLoading) {
    return <LoadingState />;
  }

  if (raceQuery.isError || rivalryQuery.isError) {
    const error = raceQuery.error ?? rivalryQuery.error;
    return (
      <ErrorState
        description={
          error instanceof Error
            ? error.message
            : "Gigaverse could not load the live race history for this wallet."
        }
        title="Rivalry data unavailable"
      />
    );
  }

  const races = raceQuery.data ?? [];
  const records = rivalryQuery.data ?? [];

  if (records.length === 0) {
    return (
      <EmptyState
        description="The live race history has no opponent with at least two completed head-to-head encounters yet. More races will create a reliable rivalry signal."
        icon={Swords}
        title="No repeat rivalries found"
      />
    );
  }

  return <RivalryIntelligence races={races} records={records} />;
}

const relationshipStyles: Record<RivalryRecord["relationshipType"], string> = {
  ally: "border-emerald-racing/30 bg-emerald-racing/10 text-emerald-racing",
  rival: "border-cyan-racing/30 bg-cyan-racing/10 text-cyan-racing",
  nemesis: "border-orange-racing/35 bg-orange-racing/10 text-orange-racing",
  unknown: "border-white/15 bg-white/[0.05] text-white/62"
};

const relationshipIcons: Record<RivalryRecord["relationshipType"], typeof Swords> = {
  ally: Shield,
  rival: Swords,
  nemesis: Skull,
  unknown: Users
};

const filters: Array<{
  label: string;
  value: RelationshipFilter;
}> = [
  { label: "All", value: "all" },
  { label: "Rivals", value: "rival" },
  { label: "Allies", value: "ally" },
  { label: "Nemeses", value: "nemesis" }
];

function RelationshipBadge({ type }: { type: RivalryRecord["relationshipType"] }) {
  const Icon = relationshipIcons[type];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold capitalize",
        relationshipStyles[type]
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {type}
    </span>
  );
}

function RivalryCard({ record, index }: { record: RivalryRecord; index: number }) {
  const relationshipDelta = record.winsAgainstRival - record.lossesAgainstRival;

  return (
    <motion.article
      animate={{ opacity: 1, y: 0 }}
      className="premium-panel rounded-lg p-5"
      initial={{ opacity: 0, y: 12 }}
      transition={{ delay: index * 0.045, duration: 0.22 }}
      whileHover={{ y: -3 }}
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div>
            <RelationshipBadge type={record.relationshipType} />
            <h2 className="mt-3 text-xl font-black text-white">
              {record.rivalName ?? shortenAddress(record.rivalAddress)}
            </h2>
            <p className="mt-1 text-sm text-white/42">
              {shortenAddress(record.rivalAddress)}
            </p>
          </div>
          <div
            className={cn(
              "rounded-lg border px-3 py-2 text-sm font-black",
              relationshipDelta >= 0
                ? "border-emerald-racing/25 bg-emerald-racing/10 text-emerald-racing"
                : "border-orange-racing/25 bg-orange-racing/10 text-orange-racing"
            )}
          >
            {relationshipDelta >= 0 ? "+" : ""}
            {relationshipDelta}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2">
          <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
            <p className="text-xs text-white/38">Enc</p>
            <p className="mt-1 font-black text-white">{record.totalEncounters}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
            <p className="text-xs text-white/38">Wins</p>
            <p className="mt-1 font-black text-emerald-racing">{record.winsAgainstRival}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
            <p className="text-xs text-white/38">Loss</p>
            <p className="mt-1 font-black text-orange-racing">{record.lossesAgainstRival}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
            <p className="text-xs text-white/38">Rate</p>
            <p className="mt-1 font-black text-white">
              {formatPercent(record.winRateAgainstRival)}
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {record.notes.map((note) => (
            <p
              key={note}
              className="rounded-lg border border-white/10 bg-white/[0.035] p-3 text-sm leading-6 text-white/56"
            >
              {note}
            </p>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

function getRelationshipStory(record: RivalryRecord) {
  const name = record.rivalName ?? shortenAddress(record.rivalAddress);

  if (record.relationshipType === "nemesis") {
    return `${name} is controlling this matchup. Review the shared race conditions before taking the next rematch.`;
  }

  if (record.relationshipType === "ally") {
    return `${name} repeatedly reaches the front with your stable, making this a useful co-podium benchmark.`;
  }

  if (record.winsAgainstRival > record.lossesAgainstRival) {
    return `Your stable currently leads ${name}, but the repeat sample is still small enough to move quickly.`;
  }

  return `${name} holds a narrow edge. A condition-matched rematch is the cleanest test of the matchup.`;
}

export function RivalryIntelligence({ records, races }: RivalryIntelligenceProps) {
  const [activeFilter, setActiveFilter] = useState<RelationshipFilter>("all");
  const filteredRecords = useMemo(
    () =>
      records.filter(
        (record) => activeFilter === "all" || record.relationshipType === activeFilter
      ),
    [activeFilter, records]
  );
  const nemesis = records.find((record) => record.relationshipType === "nemesis");
  const allies = records.filter((record) => record.relationshipType === "ally");
  const rivals = records.filter((record) => record.relationshipType === "rival");
  const recentRaces = races.filter((race) =>
    records.some((record) => record.mostRecentRaceId === race.id)
  );
  const totalEncounters = records.reduce(
    (total, record) => total + record.totalEncounters,
    0
  );
  const totalWins = records.reduce(
    (total, record) => total + record.winsAgainstRival,
    0
  );
  const overallWinRate = (totalWins / Math.max(totalEncounters, 1)) * 100;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          detail={`${totalEncounters} tracked encounters`}
          icon="swords"
          label="Records"
          value={`${records.length}`}
        />
        <MetricCard
          detail={nemesis?.rivalName ?? "None"}
          icon="skull"
          label="Nemesis"
          tone="orange"
          value={nemesis ? formatPercent(nemesis.winRateAgainstRival) : "0%"}
        />
        <MetricCard
          detail="Cooperative reads"
          icon="shield"
          label="Allies"
          tone="emerald"
          value={`${allies.length}`}
        />
        <MetricCard
          detail="Across all relationships"
          icon="users"
          label="Overall Rate"
          tone="violet"
          value={formatPercent(overallWinRate)}
        />
      </div>

      <section className="premium-panel rounded-lg p-5">
        <div className="relative z-10 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-orange-racing">
              Nemesis Highlight
            </p>
            <h2 className="mt-3 text-3xl font-black text-white">
              {nemesis?.rivalName ?? "No nemesis yet"}
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/58">
              {nemesis
                ? `${nemesis.rivalName} has created the hardest repeat matchup, with ${nemesis.totalEncounters} encounters and ${nemesis.lossesAgainstRival} losses against your stable.`
                : "Keep racing to generate stronger relationship signals."}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-orange-racing/24 bg-orange-racing/8 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-orange-racing">Nemesis</p>
              <p className="mt-2 text-3xl font-black text-white">
                {nemesis ? nemesis.lossesAgainstRival : 0}
              </p>
              <p className="mt-1 text-sm text-white/48">loss pressure</p>
            </div>
            <div className="rounded-lg border border-cyan-racing/24 bg-cyan-racing/8 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-racing">Rivals</p>
              <p className="mt-2 text-3xl font-black text-white">{rivals.length}</p>
              <p className="mt-1 text-sm text-white/48">competitive reads</p>
            </div>
            <div className="rounded-lg border border-emerald-racing/24 bg-emerald-racing/8 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-racing">Allies</p>
              <p className="mt-2 text-3xl font-black text-white">{allies.length}</p>
              <p className="mt-1 text-sm text-white/48">cooperative signals</p>
            </div>
          </div>
        </div>
      </section>

      <section className="premium-panel rounded-lg p-5">
        <div className="relative z-10">
          <SectionHeader
            description="Head-to-head pressure from final placements, with live encounter context."
            title="Relationship Pressure Map"
          />
          <div className="space-y-4">
            {records.slice(0, 5).map((record) => {
              const decided = Math.max(
                record.winsAgainstRival + record.lossesAgainstRival,
                1
              );
              const winShare = (record.winsAgainstRival / decided) * 100;

              return (
                <div
                  key={record.id}
                  className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-4 lg:grid-cols-[0.7fr_1fr_1.3fr] lg:items-center"
                >
                  <div>
                    <RelationshipBadge type={record.relationshipType} />
                    <p className="mt-2 font-black text-white">
                      {record.rivalName ?? shortenAddress(record.rivalAddress)}
                    </p>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold text-white/48">
                      <span>{record.winsAgainstRival} wins</span>
                      <span>{record.lossesAgainstRival} losses</span>
                    </div>
                    <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-orange-racing/35">
                      <span
                        className="h-full bg-emerald-racing"
                        style={{ width: `${winShare}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-sm leading-6 text-white/58">
                    {getRelationshipStory(record)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            description="Filter ally, rival, and nemesis records to read matchup notes quickly."
            title="Relationship Records"
          />
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.value}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm font-bold transition",
                  activeFilter === filter.value
                    ? "border-cyan-racing/40 bg-cyan-racing/12 text-cyan-racing"
                    : "border-white/10 bg-white/[0.04] text-white/58 hover:border-white/20 hover:text-white"
                )}
                type="button"
                onClick={() => setActiveFilter(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {filteredRecords.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {filteredRecords.map((record, index) => (
              <RivalryCard key={record.id} index={index} record={record} />
            ))}
          </div>
        ) : (
          <EmptyState
            description="Try another relationship filter or add more race history to generate records."
            icon={Swords}
            title="No relationship records match"
          />
        )}
      </section>

      <section>
        <SectionHeader
          description="Most recent races tied to tracked rivals or allies."
          title="Recent Rivalry Races"
        />
        <div className="grid gap-4 lg:grid-cols-2">
          {recentRaces.map((race) => (
            <RaceCard key={race.id} race={race} />
          ))}
        </div>
      </section>
    </div>
  );
}
