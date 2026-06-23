import { notFound } from "next/navigation";
import Link from "next/link";

import {
  ItemTimeline,
  PlacementLadder,
  RaceConditionStrip,
  type RaceTimelineItem
} from "@/components/races/race-detail-visuals";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { FactionBadge } from "@/components/shared/faction-badge";
import { MetricCard } from "@/components/shared/metric-card";
import { PageHeader } from "@/components/shared/page-header";
import { RarityBadge } from "@/components/shared/rarity-badge";
import { RaceCard } from "@/components/shared/race-card";
import { SectionHeader } from "@/components/shared/section-header";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  explainLoss,
  explainWinner,
  getLossActionPlan,
  getRaceFieldSummary,
  getRaceLoserCandidate,
  getRaceWinner,
  getSimilarRaces
} from "@/lib/gigaverse/analytics";
import {
  fetchGiglingsByIds,
  fetchRaceById,
  fetchRaces
} from "@/lib/gigaverse/api-client";
import { formatDateTime, formatToken } from "@/lib/utils/format";
import type { RaceParticipant } from "@/types";

export const dynamic = "force-dynamic";

type RaceDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function RaceDetailPage({ params }: RaceDetailPageProps) {
  const { id } = await params;
  const baseRace = await fetchRaceById(id);

  if (!baseRace) {
    notFound();
  }

  const [fieldGiglings, races] = await Promise.all([
    fetchGiglingsByIds(baseRace.participants.map((participant) => participant.giglingId)),
    fetchRaces()
  ]);
  const race = {
    ...baseRace,
    participants: baseRace.participants.map((participant) => {
      const gigling = fieldGiglings.find((entry) => entry.id === participant.giglingId);

      return {
        ...participant,
        giglingName: gigling?.name ?? participant.giglingName,
        ownerName: gigling?.ownerName ?? participant.ownerName,
        faction: gigling?.faction ?? participant.faction,
        rarity: gigling?.rarity ?? participant.rarity
      };
    })
  };
  const winner = getRaceWinner(race, fieldGiglings);
  const selectedLoss = getRaceLoserCandidate(race, fieldGiglings);
  const lossActionPlan = selectedLoss
    ? getLossActionPlan(race, selectedLoss.gigling, winner)
    : [];
  const fieldSummary = getRaceFieldSummary(race, fieldGiglings);
  const participantColumns: DataTableColumn<RaceParticipant>[] = [
    {
      header: "Gigling",
      cell: (participant) => (
        <Link
          className="font-bold text-cyan-racing transition hover:text-white"
          href={`/giglings/${participant.giglingId}`}
        >
          {participant.giglingName}
        </Link>
      )
    },
    {
      header: "Owner",
      cell: (participant) => participant.ownerName ?? "Owner unavailable"
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
  const itemTimeline: RaceTimelineItem[] = race.participants.flatMap((participant) =>
    participant.itemsUsed.map((item) => ({
      ...item,
      giglingName: participant.giglingName,
      targetGiglingName: item.targetGiglingId
        ? race.participants.find((entry) => entry.giglingId === item.targetGiglingId)
            ?.giglingName
        : undefined
    }))
  );
  const similarRaces = getSimilarRaces(race, races);

  return (
    <div>
      <PageHeader
        actions={<StatusBadge status={race.status} />}
        description={`Race #${race.raceNumber} ran under ${race.weather} ${race.trackCondition} conditions at ${race.distance} distance.`}
        eyebrow="Race Detail"
        title={`Race #${race.raceNumber}`}
      />

      <section className="premium-panel rounded-lg p-5">
        <div className="relative z-10 grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="relative min-h-72 overflow-hidden rounded-lg border border-white/10 bg-track-radial">
            <div className="absolute inset-0 bg-racing-grid opacity-55" />
            <div className="absolute inset-x-8 top-8 h-px bg-gradient-to-r from-transparent via-cyan-racing/55 to-transparent" />
            <div className="absolute inset-x-8 bottom-8 h-px bg-gradient-to-r from-transparent via-orange-racing/45 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-cyan-racing">
                Race Intelligence
              </p>
              <p className="mt-4 text-6xl font-black text-white">#{race.raceNumber}</p>
              <p className="mt-3 max-w-xs text-sm leading-6 text-white/54">
                {fieldSummary.summary}
              </p>
            </div>
          </div>

          <div>
            <RaceConditionStrip
              distance={race.distance}
              trackCondition={race.trackCondition}
              weather={race.weather}
            />
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/38">Winner</p>
                <p className="mt-2 text-xl font-black text-white">
                  {winner?.name ?? "Pending"}
                </p>
                <p className="mt-1 text-sm text-white/46">
                  {winner ? `${winner.faction} / ${winner.rarity}` : "Race still resolving"}
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/38">Field Favorite</p>
                <p className="mt-2 text-xl font-black text-white">
                  {fieldSummary.favorite?.name ?? "Pending"}
                </p>
                <p className="mt-1 text-sm text-white/46">
                  Avg field win rate {fieldSummary.averageWinRate}%
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/38">Risk</p>
                <p className="mt-2 text-xl font-black capitalize text-orange-racing">
                  {fieldSummary.conditionRisk}
                </p>
                <p className="mt-1 text-sm text-white/46">
                  {fieldSummary.itemCount} item actions
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/38">Payout Tx</p>
                {race.payoutTxHash ? (
                  <a
                    className="mt-2 block truncate text-sm font-black text-cyan-racing transition hover:text-white"
                    href={`https://abscan.org/tx/${race.payoutTxHash}`}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {race.payoutTxHash}
                  </a>
                ) : (
                  <p className="mt-2 truncate text-sm font-black text-white/56">
                    Pending settlement
                  </p>
                )}
                <p className="mt-1 text-sm text-white/46">
                  {race.payoutTxHash
                    ? "Open transaction on Abstract Explorer"
                    : "Explorer link appears after settlement"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard icon="trophy" label="Prize Pool" value={formatToken(race.prizePool)} />
        <MetricCard icon="coins" label="Entry Fee" tone="orange" value={formatToken(race.entryFee)} />
        <MetricCard icon="users" label="Participants" tone="emerald" value={`${race.participants.length}`} />
        <MetricCard icon="radar" label="Items Used" tone="violet" value={`${fieldSummary.itemCount}`} />
        <MetricCard icon="timer" label="Started" value={formatDateTime(race.startedAt)} />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="premium-panel rounded-lg p-5">
          <div className="relative z-10">
            <SectionHeader
              description="Final placement, lane, faction, rarity, owner, and performance score."
              title="Final Placements"
            />
            <PlacementLadder
              participants={race.participants}
              winnerGiglingId={race.winnerGiglingId}
            />
          </div>
        </section>

        <section className="premium-panel rounded-lg p-5">
          <div className="relative z-10">
            <SectionHeader description="Boosts, sabotages, defenses, and utility items used during the race." mechanic="items" title="Items Used Timeline" />
            <ItemTimeline items={itemTimeline} />
          </div>
        </section>
      </div>

      <section className="mt-6 premium-panel rounded-lg p-5">
        <div className="relative z-10">
          <SectionHeader description="Dense table view for lane, final placement, faction, rarity, and performance score." mechanic="raceStatus" title="Participants Table" />
            <DataTable columns={participantColumns} data={race.participants} getRowKey={(participant) => participant.giglingId} />
        </div>
      </section>

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
            {selectedLoss ? (
              <div className="mt-5 border-t border-white/10 pt-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-racing">
                  Next Race Adjustments
                </p>
                <ol className="mt-3 space-y-2">
                  {lossActionPlan.map((action, index) => (
                    <li
                      key={action}
                      className="flex gap-3 rounded-lg border border-cyan-racing/15 bg-cyan-racing/[0.06] p-3 text-sm leading-6 text-white/68"
                    >
                      <span className="font-black text-cyan-racing">{index + 1}</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}
          </div>
        </section>

        <section className="premium-panel rounded-lg p-5">
          <div className="relative z-10">
            <SectionHeader
              description={
                selectedLoss
                  ? `Selected Gigling: ${selectedLoss.gigling.name}`
                  : "Loss explanation appears after placements are final."
              }
              title="Why Did I Lose?"
            />
            <div className="space-y-3">
              {selectedLoss ? (
                explainLoss(race, selectedLoss.gigling).map((line) => (
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
        <div className="mobile-card-rail grid gap-4 lg:grid-cols-3">
          {similarRaces.map((entry) => (
            <RaceCard key={entry.id} race={entry} />
          ))}
        </div>
      </section>
    </div>
  );
}
