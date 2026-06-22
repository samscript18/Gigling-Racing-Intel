import { MetricCard } from "@/components/shared/metric-card";
import { PageHeader } from "@/components/shared/page-header";
import { RaceCard } from "@/components/shared/race-card";
import { SectionHeader } from "@/components/shared/section-header";
import { mockRaces, mockRivalryRecords } from "@/lib/gigaverse/mock-data";
import { formatPercent, shortenAddress } from "@/lib/utils/format";

export default function RivalsPage() {
  const nemesis = mockRivalryRecords.find((record) => record.relationshipType === "nemesis");
  const allies = mockRivalryRecords.filter((record) => record.relationshipType === "ally");
  const recentRaces = mockRaces.filter((race) =>
    mockRivalryRecords.some((record) => record.mostRecentRaceId === race.id)
  );

  return (
    <div>
      <PageHeader
        description="Track repeat opponents, allies, nemeses, encounter counts, and race notes for social Gigling Racing intelligence."
        eyebrow="Rivalry Intelligence"
        title="Rivals"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard detail="Tracked relationships" icon="swords" label="Records" value={`${mockRivalryRecords.length}`} />
        <MetricCard detail={nemesis?.rivalName ?? "None"} icon="skull" label="Nemesis" tone="orange" value={nemesis ? formatPercent(nemesis.winRateAgainstRival) : "0%"} />
        <MetricCard detail="Cooperative reads" icon="shield" label="Allies" tone="emerald" value={`${allies.length}`} />
        <MetricCard detail="Recent encounters linked" icon="users" label="Race Links" tone="violet" value={`${recentRaces.length}`} />
      </div>

      <section className="mt-6">
        <SectionHeader description="Relationship badges, win/loss records, and behavioral notes." title="Rival Records" />
        <div className="grid gap-4 lg:grid-cols-2">
          {mockRivalryRecords.map((record) => (
            <article key={record.id} className="premium-panel rounded-lg p-5">
              <div className="relative z-10">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-racing/70">
                      {record.relationshipType}
                    </p>
                    <h2 className="mt-2 text-xl font-black text-white">{record.rivalName ?? shortenAddress(record.rivalAddress)}</h2>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-bold text-white">
                    {formatPercent(record.winRateAgainstRival)}
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
                    <p className="text-xs text-white/38">Encounters</p>
                    <p className="mt-1 font-black text-white">{record.totalEncounters}</p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
                    <p className="text-xs text-white/38">Wins</p>
                    <p className="mt-1 font-black text-emerald-racing">{record.winsAgainstRival}</p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
                    <p className="text-xs text-white/38">Losses</p>
                    <p className="mt-1 font-black text-orange-racing">{record.lossesAgainstRival}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {record.notes.map((note) => (
                    <p key={note} className="rounded-lg border border-white/10 bg-white/[0.035] p-3 text-sm leading-6 text-white/56">
                      {note}
                    </p>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <SectionHeader description="Most recent rivalry or ally-linked races." title="Recent Rivalry Races" />
        <div className="grid gap-4 lg:grid-cols-2">
          {recentRaces.map((race) => (
            <RaceCard key={race.id} race={race} />
          ))}
        </div>
      </section>
    </div>
  );
}
