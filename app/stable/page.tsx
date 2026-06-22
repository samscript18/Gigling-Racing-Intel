import { GiglingCard } from "@/components/shared/gigling-card";
import { MetricCard } from "@/components/shared/metric-card";
import { PageHeader } from "@/components/shared/page-header";
import { RaceCard } from "@/components/shared/race-card";
import { SectionHeader } from "@/components/shared/section-header";
import { mockGiglings, mockRaces, mockStableSummaries } from "@/lib/gigaverse/mock-data";
import { formatPercent, shortenAddress } from "@/lib/utils/format";

export default function StablePage() {
  const stable = mockStableSummaries[0];
  const bestGigling = mockGiglings.find((gigling) => gigling.id === stable.bestGiglingId) ?? stable.giglings[0];
  const weakestGigling = [...stable.giglings].sort((first, second) => first.winRate - second.winRate)[0];
  const suggestedRaces = mockRaces.filter((race) => stable.recommendedRaceIds.includes(race.id));

  return (
    <div>
      <PageHeader
        description="Mock connected wallet state, owned Giglings, recommendations, and risk alerts are available before real ownership reads are connected."
        eyebrow="Stable Manager"
        title={`${stable.ownerName}'s Stable`}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard detail={shortenAddress(stable.ownerAddress)} icon="wallet" label="Mock Wallet" value="Connected" />
        <MetricCard detail="Owned Giglings" icon="bot" label="Stable Size" tone="violet" value={`${stable.giglings.length}`} />
        <MetricCard detail={bestGigling.name} icon="trophy" label="Best Gigling" tone="orange" value={formatPercent(bestGigling.winRate)} />
        <MetricCard detail={`${stable.alerts.length} active notices`} icon="shieldCheck" label="Average Win Rate" tone="emerald" value={formatPercent(stable.averageWinRate)} />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_0.8fr]">
        <section>
          <SectionHeader description="Owned Giglings from the mock stable summary." title="Owned Giglings" />
          <div className="grid gap-4 md:grid-cols-2">
            {stable.giglings.map((gigling) => (
              <GiglingCard key={gigling.id} gigling={gigling} />
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <div className="premium-panel rounded-lg p-5">
            <div className="relative z-10">
              <SectionHeader description="Best and weakest performers from current stable data." title="Stable Read" />
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <div className="rounded-lg border border-emerald-racing/20 bg-emerald-racing/8 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-racing">Best</p>
                  <p className="mt-2 text-lg font-black text-white">{bestGigling.name}</p>
                </div>
                <div className="rounded-lg border border-orange-racing/20 bg-orange-racing/8 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-orange-racing">Needs Care</p>
                  <p className="mt-2 text-lg font-black text-white">{weakestGigling.name}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="premium-panel rounded-lg p-5">
            <div className="relative z-10">
              <SectionHeader description="Opportunity, risk, meta, and performance notices." title="Stable Alerts" />
              <div className="space-y-3">
                {stable.alerts.map((alert) => (
                  <div key={alert.id} className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
                    <p className="text-sm font-bold text-white">{alert.title}</p>
                    <p className="mt-2 text-sm leading-6 text-white/54">{alert.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="mt-6">
        <SectionHeader description="Races that match stable opportunities and condition fit." title="Suggested Races" />
        <div className="grid gap-4 lg:grid-cols-3">
          {suggestedRaces.map((race) => (
            <RaceCard key={race.id} race={race} />
          ))}
        </div>
      </section>
    </div>
  );
}
