import { MetaCharts } from "@/components/meta/meta-charts";
import { FactionBadge } from "@/components/shared/faction-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { InsightCard } from "@/components/shared/insight-card";
import { MetricCard } from "@/components/shared/metric-card";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeader } from "@/components/shared/section-header";
import {
	getDistanceImpactData,
	getFactionPerformanceFromRaces,
	getFactionDashboardData,
	getMetaActionPlan,
	getRarityPerformanceData,
	getTopEmergingGiglings,
	getTopFaction,
	getTrackConditionTrendData,
	getConditionImpactData,
	getWeeklyTrendSummary,
} from "@/lib/gigaverse/analytics";
import { fetchGiglings, fetchMetaData, fetchRaces } from "@/lib/gigaverse/api-client";
import { formatPercent } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

export default async function MetaPage() {
	const [races, giglings, metaData] = await Promise.all([fetchRaces(), fetchGiglings(), fetchMetaData()]);
	const factionPerformance = getFactionPerformanceFromRaces(races);
	const completedRaces = races.filter((race) => race.status === "completed" && race.participants.some((participant) => typeof participant.finalPosition === "number"));

	if (completedRaces.length === 0) {
		return (
			<div>
				<PageHeader description="Read the current Gigling Racing meta across faction, rarity, distance, and track-condition performance." eyebrow="Meta Intelligence" title="Meta" />
				<EmptyState description="The live race feed has no completed races with final placements, so faction and condition analytics cannot be calculated yet." title="No completed live samples" />
			</div>
		);
	}

	const topFaction = getTopFaction(factionPerformance);
	const emerging = getTopEmergingGiglings(giglings);
	const factionData = getFactionDashboardData(factionPerformance);
	const rarityData = getRarityPerformanceData(races);
	const conditionData = getConditionImpactData(races);
	const distanceData = getDistanceImpactData(races);
	const trackData = getTrackConditionTrendData(races);
	const weeklySummary = getWeeklyTrendSummary(races, factionPerformance);
	const actionPlan = getMetaActionPlan(races, factionPerformance);
	const highestVolatility = [...conditionData].sort((first, second) => second.volatility - first.volatility)[0];

	return (
		<div>
			<PageHeader description="Read the current Gigling Racing meta across faction, rarity, distance, and track-condition performance." eyebrow="Meta Intelligence" title="Meta" />

			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<MetricCard detail={`${topFaction.faction} leading`} icon="barChart" label="Top Faction" mechanic="faction" value={formatPercent(topFaction.winRate)} />
				<MetricCard detail="Completed races analyzed" icon="activity" label="Samples" tone="emerald" value={`${completedRaces.length}`} />
				<MetricCard detail={`${highestVolatility.trackCondition} condition pressure`} icon="lineChart" label="Volatility" mechanic="trackCondition" tone="violet" value={`${highestVolatility.volatility}/100`} />
				<MetricCard detail={emerging[0]?.name ?? "Pending"} icon="zap" label="Emerging Pick" mechanic="podiumRate" tone="orange" value={formatPercent(emerging[0]?.podiumRate ?? 0)} />
			</div>

			<section className="mt-6 premium-panel rounded-lg p-5">
				<div className="relative z-10 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
					<div>
						<p className="text-xs font-bold uppercase tracking-[0.24em] text-orange-racing">Weekly Trend Summary</p>
						<h2 className="mt-3 text-3xl font-black text-white">{weeklySummary.title}</h2>
						<p className="mt-3 text-sm leading-6 text-white/58">{weeklySummary.description}</p>
						<div className="mt-5 flex flex-wrap gap-2">
							<FactionBadge faction={topFaction.faction} />
							<span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-bold text-white/62">{completedRaces.length} completed samples</span>
						</div>
					</div>
					<div className="grid gap-3 sm:grid-cols-3">
						{weeklySummary.bullets.map((bullet, index) => (
							<div key={bullet} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
								<span className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-racing/25 bg-cyan-racing/10 text-sm font-black text-cyan-racing">
									{index + 1}
								</span>
								<p className="mt-3 text-sm leading-6 text-white/58">{bullet}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="mt-6">
				<SectionHeader description="Live signals translated into cautious entry and stable-management decisions." title="What To Do Next" />
				<div className="grid gap-4 lg:grid-cols-3">
					{actionPlan.map((item, index) => (
						<article key={item.title} className="premium-panel rounded-lg p-5">
							<div className="relative z-10">
								<div className="flex items-start justify-between gap-3">
									<p className="text-lg font-black text-white">{item.title}</p>
									<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-cyan-racing/25 bg-cyan-racing/10 text-sm font-black text-cyan-racing">
										{index + 1}
									</span>
								</div>
								<p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-orange-racing">{item.signal}</p>
								<p className="mt-3 text-sm leading-6 text-white/60">{item.action}</p>
							</div>
						</article>
					))}
				</div>
			</section>

			<div className="mt-6">
				<MetaCharts distanceData={distanceData} factionData={factionData} rarityData={rarityData} trackData={trackData} conditionData={conditionData} />
			</div>

			<div className="mt-6 grid gap-5 grid-cols-1">
				<section>
					<SectionHeader description="Meta shift cards explain which signals are moving and why they matter." title="Meta Shift Cards" />
					<div className="grid gap-4 md:grid-cols-2">
						{metaData.insights.map((insight) => (
							<InsightCard key={insight.id} insight={insight} />
						))}
					</div>
				</section>

				<section className="premium-panel rounded-lg p-5">
					<div className="relative z-10">
						<SectionHeader description="Giglings gaining podium equity or streak momentum." title="Top Emerging Giglings" />
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{emerging.map((gigling, index) => (
								<div key={gigling.id} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
									<div className="flex items-start justify-between gap-3">
										<div>
											<p className="text-sm font-black text-white">{gigling.name}</p>
											<p className="mt-1 text-xs capitalize text-cyan-racing">
												{gigling.faction} / {gigling.rarity}
											</p>
										</div>
										<span className="flex h-8 w-8 items-center justify-center rounded-lg border border-orange-racing/24 bg-orange-racing/10 text-sm font-black text-orange-racing">
											{index + 1}
										</span>
									</div>
									<div className="mt-3 grid grid-cols-2 gap-2 text-sm">
										<div className="rounded-lg border border-white/10 bg-white/[0.035] p-2">
											<p className="text-white/38">Podium</p>
											<p className="font-bold text-white">{formatPercent(gigling.podiumRate)}</p>
										</div>
										<div className="rounded-lg border border-white/10 bg-white/[0.035] p-2">
											<p className="text-white/38">Streak</p>
											<p className="font-bold text-white">{gigling.currentStreak}</p>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
