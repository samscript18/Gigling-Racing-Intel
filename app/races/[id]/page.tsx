import { notFound } from "next/navigation";

import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { FactionBadge } from "@/components/shared/faction-badge";
import { MetricCard } from "@/components/shared/metric-card";
import { PageHeader } from "@/components/shared/page-header";
import { RarityBadge } from "@/components/shared/rarity-badge";
import { RaceCard } from "@/components/shared/race-card";
import { SectionHeader } from "@/components/shared/section-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { explainLoss, explainWinner, getRaceWinner } from "@/lib/gigaverse/analytics";
import { mockGiglings, mockRaces } from "@/lib/gigaverse/mock-data";
import { formatDateTime, formatToken } from "@/lib/utils/format";
import type { RaceParticipant } from "@/types";

type RaceDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function RaceDetailPage({ params }: RaceDetailPageProps) {
  const { id } = await params;
  const race = mockRaces.find((entry) => entry.id === id);

  if (!race) {
    notFound();
  }

  const winner = getRaceWinner(race, mockGiglings);
  const selectedLoser = race.participants.find(
    (participant) => participant.finalPosition && participant.finalPosition > 1
  );
  const loserGigling = selectedLoser
    ? mockGiglings.find((gigling) => gigling.id === selectedLoser.giglingId)
    : undefined;
  const participantColumns: DataTableColumn<RaceParticipant>[] = [
    {
      header: "Gigling",
      cell: (participant) => participant.giglingName
    },
    {
      header: "Owner",
      cell: (participant) => participant.ownerName ?? "Unknown"
    },
    {
      header: "Tags",
      cell: (participant) => (
        <div className="flex flex-wrap gap-2">
          <FactionBadge faction={participant.faction} />
          <RarityBadge rarity={participant.rarity} />
        </div>
      )
    },
    {
      header: "Lane",
      cell: (participant) => participant.startingLane
    },
    {
      header: "Finish",
      cell: (participant) => participant.finalPosition ? `P${participant.finalPosition}` : "Pending"
    },
    {
      header: "Score",
      cell: (participant) => participant.performanceScore ?? "Pending"
    }
  ];
  const itemTimeline = race.participants.flatMap((participant) =>
    participant.itemsUsed.map((item) => ({
      ...item,
      giglingName: participant.giglingName
    }))
  );
  const similarRaces = mockRaces
    .filter(
      (entry) =>
        entry.id !== race.id &&
        (entry.distance === race.distance ||
          entry.weather === race.weather ||
          entry.trackCondition === race.trackCondition)
    )
    .slice(0, 2);

  return (
    <div>
      <PageHeader
        actions={<StatusBadge status={race.status} />}
        description={`Race #${race.raceNumber} ran under ${race.weather} ${race.trackCondition} conditions at ${race.distance} distance.`}
        eyebrow="Race Detail"
        title={`Race #${race.raceNumber}`}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Prize Pool" value={formatToken(race.prizePool)} />
        <MetricCard label="Entry Fee" tone="orange" value={formatToken(race.entryFee)} />
        <MetricCard label="Participants" tone="emerald" value={`${race.participants.length}`} />
        <MetricCard label="Started" tone="violet" value={formatDateTime(race.startedAt)} />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="premium-panel rounded-lg p-5">
          <div className="relative z-10">
            <SectionHeader description="Lane, final placement, faction, rarity, and performance score." title="Participants" />
            <DataTable columns={participantColumns} data={race.participants} getRowKey={(participant) => participant.giglingId} />
          </div>
        </section>

        <section className="premium-panel rounded-lg p-5">
          <div className="relative z-10">
            <SectionHeader description="Boosts, sabotages, defenses, and utility items used during the race." title="Item Timeline" />
            <div className="space-y-3">
              {itemTimeline.length > 0 ? (
                itemTimeline.map((item) => (
                  <div key={item.id} className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
                    <p className="text-sm font-bold text-white">{item.itemName}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-cyan-racing/70">{item.usedAtStage} / {item.type}</p>
                    <p className="mt-2 text-sm text-white/54">{item.giglingName} impact score: {item.impact}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-white/54">No item usage recorded for this race.</p>
              )}
            </div>
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <section className="premium-panel rounded-lg p-5">
          <div className="relative z-10">
            <SectionHeader description="Plain-English race intelligence for the winner." title="Why Winner Won" />
            <div className="space-y-3">
              {winner ? (
                explainWinner(race, winner).map((line) => (
                  <p key={line} className="rounded-lg border border-emerald-racing/20 bg-emerald-racing/8 p-3 text-sm leading-6 text-white/68">
                    {line}
                  </p>
                ))
              ) : (
                <p className="text-sm text-white/54">Winner is pending until the race completes.</p>
              )}
            </div>
          </div>
        </section>

        <section className="premium-panel rounded-lg p-5">
          <div className="relative z-10">
            <SectionHeader description="Demo-ready loss explanation using the first non-winning finisher." title="Why Did I Lose?" />
            <div className="space-y-3">
              {loserGigling ? (
                explainLoss(race, loserGigling).map((line) => (
                  <p key={line} className="rounded-lg border border-orange-racing/20 bg-orange-racing/8 p-3 text-sm leading-6 text-white/68">
                    {line}
                  </p>
                ))
              ) : (
                <p className="text-sm text-white/54">Loss explanation appears after placements are final.</p>
              )}
            </div>
          </div>
        </section>
      </div>

      <section className="mt-6">
        <SectionHeader description="Similar distance, weather, or track condition races." title="Similar Races" />
        <div className="grid gap-4 lg:grid-cols-2">
          {similarRaces.map((entry) => (
            <RaceCard key={entry.id} race={entry} />
          ))}
        </div>
      </section>
    </div>
  );
}
