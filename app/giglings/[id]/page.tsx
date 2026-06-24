import { notFound } from "next/navigation";

import { GiglingDetailCharts } from "@/components/giglings/gigling-detail-charts";
import { GiglingRaceHistoryTable } from "@/components/giglings/gigling-race-history-table";
import { FactionBadge } from "@/components/shared/faction-badge";
import { GiglingAvatar } from "@/components/shared/gigling-avatar";
import { GiglingCard } from "@/components/shared/gigling-card";
import { MetricCard } from "@/components/shared/metric-card";
import { PageHeader } from "@/components/shared/page-header";
import { RarityBadge } from "@/components/shared/rarity-badge";
import { SectionHeader } from "@/components/shared/section-header";
import { getGiglingIntelligenceSummary, getGiglingPerformanceByCondition, getGiglingPerformanceByDistance, getGiglingRaceHistory, getGiglingRiskWarnings, getGiglingStatRadarData, getRecommendedRaceConditions } from "@/lib/gigaverse/analytics";
import { fetchGiglingById, fetchGiglingRaceHistory, fetchGiglings, fetchRaces } from "@/lib/gigaverse/api-client";
import { formatConditionLabel, formatInteger, formatOptionalToken, formatPercent, shortenAddress } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

type GiglingDetailPageProps = {
	params: Promise<{
		id: string;
	}>;
};

export default async function GiglingDetailPage({ params }: GiglingDetailPageProps) {
	const { id } = await params;
	const [gigling, raceHistoryResult, races, giglings] = await Promise.all([
		fetchGiglingById(id),
		fetchGiglingRaceHistory(id).catch(() => []),
		fetchRaces(),
		fetchGiglings()
	]);

	if (!gigling) {
		notFound();
	}

	const profileRaces = raceHistoryResult.length > 0 ? raceHistoryResult : races;
	const raceHistory = getGiglingRaceHistory(gigling.id, profileRaces);
	const completedHistory = raceHistory.filter(({ participant }) => typeof participant.finalPosition === "number");
	const statData = getGiglingStatRadarData(gigling);
	const conditionData = getGiglingPerformanceByCondition(gigling.id, profileRaces);
	const distanceData = getGiglingPerformanceByDistance(gigling.id, profileRaces);
	const intelligence = getGiglingIntelligenceSummary(gigling, profileRaces);
	const recommendations = getRecommendedRaceConditions(gigling);
	const warnings = getGiglingRiskWarnings(gigling);
	const similarGiglings = giglings
		.filter((entry) => entry.id !== gigling.id && entry.faction === gigling.faction)
		.sort((first, second) => second.winRate - first.winRate)
		.slice(0, 3);
	const averagePlacement = completedHistory.reduce((total, { participant }) => total + (participant.finalPosition ?? 0), 0) / Math.max(completedHistory.length, 1);

	return (
		<div>
			<PageHeader
				description={`Token ${gigling.tokenId} owned by ${gigling.ownerName ?? shortenAddress(gigling.ownerAddress)}, with live career data linked to indexed race history.`}
				eyebrow="Gigling Detail"
				title={gigling.name}
			/>

			<section className="premium-panel rounded-lg p-5">
				<div className="relative z-10 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
					<div className="relative min-h-72 overflow-hidden rounded-lg border border-white/10 bg-track-radial">
						<GiglingAvatar className="absolute inset-0 h-full w-full border-0" imageUrl={gigling.imageUrl} name={gigling.name} priority />
						<div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-transparent to-transparent" />
						<div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
							<FactionBadge faction={gigling.faction} />
							<RarityBadge rarity={gigling.rarity} />
						</div>
					</div>

					<div>
						<div className="flex flex-wrap gap-2">
							<FactionBadge faction={gigling.faction} />
							<RarityBadge rarity={gigling.rarity} />
						</div>
						<h2 className="mt-5 text-4xl font-black text-white">{gigling.name}</h2>
						<p className="mt-3 max-w-2xl text-sm leading-6 text-white/58">{intelligence.headline}</p>
						<div className="mt-5 grid gap-3 sm:grid-cols-2">
							<div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
								<p className="text-xs uppercase tracking-[0.2em] text-white/38">Owner</p>
								<p className="mt-2 font-black text-white">{gigling.ownerName}</p>
								<p className="mt-1 text-sm text-white/46">{shortenAddress(gigling.ownerAddress)}</p>
							</div>
							<div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
								<p className="text-xs uppercase tracking-[0.2em] text-white/38">Token</p>
								<p className="mt-2 font-black text-white">{gigling.tokenId}</p>
								<p className="mt-1 text-sm text-white/46">ELO {formatInteger(gigling.elo)}</p>
							</div>
							<div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
								<p className="text-xs uppercase tracking-[0.2em] text-white/38">Best Distance</p>
								<p className="mt-2 font-black capitalize text-cyan-racing">{formatConditionLabel(gigling.bestDistance)}</p>
							</div>
							<div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
								<p className="text-xs uppercase tracking-[0.2em] text-white/38">Best Condition</p>
								<p className="mt-2 font-black capitalize text-orange-racing">{formatConditionLabel(gigling.bestTrackCondition)}</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			<div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
				<MetricCard icon="flag" label="Total Races" value={`${gigling.totalRaces}`} />
				<MetricCard icon="trophy" label="Win Rate" mechanic="winRate" tone="orange" value={formatPercent(gigling.winRate)} />
				<MetricCard icon="medal" label="Podium Rate" mechanic="podiumRate" tone="emerald" value={formatPercent(gigling.podiumRate)} />
				<MetricCard icon="coins" label="Earnings" tone="violet" value={formatOptionalToken(gigling.earnings)} />
				<MetricCard detail={`${completedHistory.length} indexed races`} icon="barChart" label="Avg Placement" value={`P${averagePlacement.toFixed(2)}`} />
			</div>

			<div className="mt-6">
				<GiglingDetailCharts conditionData={conditionData} distanceData={distanceData} statData={statData} />
			</div>

			<div className="mt-6 grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
				<section className="premium-panel rounded-lg p-5">
					<div className="relative z-10">
						<SectionHeader description="What the current indexed data says about entry decisions." title="Intelligence Summary" />
						<div className="space-y-3">
							{intelligence.bullets.map((bullet) => (
								<p key={bullet} className="rounded-lg border border-cyan-racing/18 bg-cyan-racing/8 p-3 text-sm leading-6 text-white/64">
									{bullet}
								</p>
							))}
						</div>
					</div>
				</section>
				<section className="premium-panel rounded-lg p-5">
					<div className="relative z-10">
						<SectionHeader description="Entry patterns that should favor this Gigling." mechanic="distance" title="Recommended Race Conditions" />
						<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
							{recommendations.map((recommendation) => (
								<div key={recommendation.label} className="rounded-lg border border-emerald-racing/18 bg-emerald-racing/8 p-3">
									<p className="text-sm font-black text-white">{recommendation.label}</p>
									<p className="mt-2 text-sm leading-6 text-white/54">{recommendation.description}</p>
								</div>
							))}
						</div>
					</div>
				</section>
				<section className="premium-panel rounded-lg p-5">
					<div className="relative z-10">
						<SectionHeader description="Risk notes are intentionally cautious and never claim guaranteed outcomes." title="Risk Warnings" />
						<div className="space-y-3">
							{warnings.map((warning) => (
								<p key={warning} className="rounded-lg border border-orange-racing/22 bg-orange-racing/8 p-3 text-sm leading-6 text-white/64">
									{warning}
								</p>
							))}
						</div>
					</div>
				</section>
			</div>
			<section className="premium-panel rounded-lg p-5 my-6">
				<div className="relative z-10">
					<SectionHeader description="Same-faction comparison targets for scouting nearby profiles." title="Comparable Giglings" />
					<div className="grid gap-4 md:grid-cols-3">
						{similarGiglings.map((entry) => (
							<GiglingCard key={entry.id} compact gigling={entry} />
						))}
					</div>
				</div>
			</section>
			<section className="premium-panel rounded-lg p-5">
				<div className="relative z-10">
					<SectionHeader
						description={`${raceHistory.length} recent indexed race${raceHistory.length === 1 ? "" : "s"} returned by Gigaverse stats, out of ${gigling.totalRaces} career race${gigling.totalRaces === 1 ? "" : "s"} reported for this Gigling.`}
						title="Recent Indexed Race History"
					/>
					<GiglingRaceHistoryTable rows={raceHistory} />
				</div>
			</section>
		</div>
	);
}
