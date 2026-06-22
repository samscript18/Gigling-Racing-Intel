import { notFound } from "next/navigation";

import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { FactionBadge } from "@/components/shared/faction-badge";
import { GiglingCard } from "@/components/shared/gigling-card";
import { MetricCard } from "@/components/shared/metric-card";
import { PageHeader } from "@/components/shared/page-header";
import { RarityBadge } from "@/components/shared/rarity-badge";
import { SectionHeader } from "@/components/shared/section-header";
import { getGiglingRaceHistory } from "@/lib/gigaverse/analytics";
import { mockGiglings, mockRaces } from "@/lib/gigaverse/mock-data";
import { formatPercent, formatToken, shortenAddress } from "@/lib/utils/format";
import type { Race } from "@/types";

type GiglingDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function GiglingDetailPage({ params }: GiglingDetailPageProps) {
  const { id } = await params;
  const gigling = mockGiglings.find((entry) => entry.id === id);

  if (!gigling) {
    notFound();
  }

  const raceHistory = getGiglingRaceHistory(gigling.id, mockRaces);
  const columns: DataTableColumn<(typeof raceHistory)[number]>[] = [
    {
      header: "Race",
      cell: ({ race }) => `#${race.raceNumber}`
    },
    {
      header: "Conditions",
      cell: ({ race }) => `${race.distance} / ${race.weather} / ${race.trackCondition}`
    },
    {
      header: "Placement",
      cell: ({ participant }) => participant.finalPosition ? `P${participant.finalPosition}` : "Pending"
    },
    {
      header: "Score",
      cell: ({ participant }) => participant.performanceScore ?? "Pending"
    }
  ];
  const similarGiglings = mockGiglings
    .filter((entry) => entry.id !== gigling.id && entry.faction === gigling.faction)
    .slice(0, 2);

  return (
    <div>
      <PageHeader
        description={`Token ${gigling.tokenId} owned by ${gigling.ownerName ?? shortenAddress(gigling.ownerAddress)}. This foundation detail view already links career data to race history.`}
        eyebrow="Gigling Detail"
        title={gigling.name}
      />

      <div className="grid gap-5 xl:grid-cols-[0.78fr_1.22fr]">
        <div className="space-y-5">
          <div className="premium-panel rounded-lg p-5">
            <div className="relative z-10">
              <div className="mb-5 h-48 overflow-hidden rounded-lg border border-white/10 bg-track-radial">
                <div className="h-full bg-racing-grid opacity-55" />
              </div>
              <div className="flex flex-wrap gap-2">
                <FactionBadge faction={gigling.faction} />
                <RarityBadge rarity={gigling.rarity} />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
                  <p className="text-white/38">Owner</p>
                  <p className="mt-1 font-bold text-white">{gigling.ownerName}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
                  <p className="text-white/38">Wallet</p>
                  <p className="mt-1 font-bold text-white">{shortenAddress(gigling.ownerAddress)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="premium-panel rounded-lg p-5">
            <div className="relative z-10">
              <SectionHeader description="Base stat scan for race-condition matching." title="Stat Profile" />
              <div className="space-y-3">
                {Object.entries(gigling.stats).map(([stat, value]) => (
                  <div key={stat}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="capitalize text-white/64">{stat}</span>
                      <span className="font-bold text-white">{value}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/8">
                      <div className="h-full rounded-full bg-gradient-to-r from-cyan-racing to-orange-racing" style={{ width: `${value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Win Rate" value={formatPercent(gigling.winRate)} />
            <MetricCard label="Podium Rate" tone="emerald" value={formatPercent(gigling.podiumRate)} />
            <MetricCard label="Earnings" tone="orange" value={formatToken(gigling.earnings)} />
            <MetricCard label="Streak" tone="violet" value={`${gigling.currentStreak}`} />
          </div>

          <section className="premium-panel rounded-lg p-5">
            <div className="relative z-10">
              <SectionHeader description="Revealed and hidden traits with plain-English race impact." title="Traits" />
              <div className="grid gap-3 md:grid-cols-3">
                {gigling.traits.map((trait) => (
                  <div key={trait.id} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                    <p className="text-sm font-bold text-white">{trait.name}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-cyan-racing/70">{trait.category}</p>
                    <p className="mt-3 text-sm leading-6 text-white/54">
                      {trait.revealed ? trait.description : "Hidden trait. Scouting confidence is lower until revealed."}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="premium-panel rounded-lg p-5">
            <div className="relative z-10">
              <SectionHeader description="Completed, live, and scheduled races involving this Gigling." title="Race History" />
              <DataTable
                columns={columns}
                data={raceHistory}
                getRowKey={({ race }: { race: Race }) => race.id}
              />
            </div>
          </section>

          <section>
            <SectionHeader description={`${gigling.bestDistance} distance and ${gigling.bestWeather} weather are the strongest starting filters.`} title="Recommended Conditions" />
            <div className="grid gap-4 md:grid-cols-2">
              {similarGiglings.map((entry) => (
                <GiglingCard key={entry.id} compact gigling={entry} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
