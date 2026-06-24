"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { StatusBadge } from "@/components/shared/status-badge";
import { cn } from "@/lib/utils/cn";
import { formatConditionLabel, formatDateTime } from "@/lib/utils/format";
import type { Race, RaceParticipant } from "@/types";

type GiglingRaceHistoryRow = {
	participant: RaceParticipant;
	race: Race;
};

type GiglingRaceHistoryTableProps = {
	rows: GiglingRaceHistoryRow[];
	pageSize?: number;
};

function placementLabel(participant: RaceParticipant) {
	return typeof participant.finalPosition === "number" ? `P${participant.finalPosition}` : "Pending";
}

function scoreLabel(participant: RaceParticipant) {
	return typeof participant.performanceScore === "number" ? `${participant.performanceScore}` : "N/A";
}

function conditionsLabel(race: Race) {
	return [formatConditionLabel(race.distance), formatConditionLabel(race.trackCondition), formatConditionLabel(race.trackCondition)].join(" / ");
}

export function GiglingRaceHistoryTable({ rows, pageSize = 10 }: GiglingRaceHistoryTableProps) {
	const [page, setPage] = useState(1);
	const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
	const currentPage = Math.min(page, pageCount);
	const pageStart = (currentPage - 1) * pageSize;
	const pageEnd = Math.min(pageStart + pageSize, rows.length);
	const visibleRows = useMemo(() => rows.slice(pageStart, pageEnd), [pageEnd, pageStart, rows]);

	if (rows.length === 0) {
		return <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5 text-sm text-white/54">No races match this Gigling yet.</div>;
	}

	function goToPage(nextPage: number) {
		setPage(Math.min(pageCount, Math.max(1, nextPage)));
	}

	return (
		<div className="space-y-4">
			<div className="grid gap-3 md:hidden">
				{visibleRows.map(({ participant, race }) => (
					<article key={race.id} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
						<div className="flex items-start justify-between gap-3">
							<div>
								<Link className="text-lg font-black text-cyan-racing transition hover:text-white" href={`/races/${race.id}`}>
									#{race.raceNumber}
								</Link>
								<p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-white/38">{formatDateTime(race.startedAt)}</p>
							</div>
							<StatusBadge status={race.status} />
						</div>
						<div className="mt-4 grid grid-cols-2 gap-2 text-sm">
							<div className="rounded-lg border border-white/10 bg-black/16 p-3">
								<p className="text-xs uppercase tracking-[0.14em] text-white/36">Conditions</p>
								<p className="mt-1 font-bold capitalize text-white">{conditionsLabel(race)}</p>
							</div>
							<div className="rounded-lg border border-white/10 bg-black/16 p-3">
								<p className="text-xs uppercase tracking-[0.14em] text-white/36">Placement</p>
								<p className="mt-1 font-bold text-white">{placementLabel(participant)}</p>
							</div>
							<div className="rounded-lg border border-white/10 bg-black/16 p-3">
								<p className="text-xs uppercase tracking-[0.14em] text-white/36">Score</p>
								<p className="mt-1 font-bold text-white">{scoreLabel(participant)}</p>
							</div>
							<div className="rounded-lg border border-white/10 bg-black/16 p-3">
								<p className="text-xs uppercase tracking-[0.14em] text-white/36">Items</p>
								<p className="mt-1 font-bold text-white">{participant.itemsUsed.length}</p>
							</div>
						</div>
					</article>
				))}
			</div>

			<div className="hidden overflow-x-auto overscroll-x-contain rounded-lg border border-white/10 md:block">
				<table className="w-full divide-y divide-white/10 text-sm">
					<thead className="bg-white/[0.04] text-left text-xs uppercase tracking-[0.18em] text-white/38">
						<tr>
							{["Race", "Status", "Conditions", "Placement", "Score", "Items", "Date"].map((header) => (
								<th key={header} className="px-4 py-3 font-bold">
									{header}
								</th>
							))}
						</tr>
					</thead>
					<tbody className="divide-y divide-white/8">
						{visibleRows.map(({ participant, race }) => (
							<tr key={race.id} className="transition hover:bg-white/[0.035]">
								<td className="px-4 py-3">
									<Link className="font-bold text-cyan-racing transition hover:text-white" href={`/races/${race.id}`}>
										#{race.raceNumber}
									</Link>
								</td>
								<td className="px-4 py-3">
									<StatusBadge status={race.status} />
								</td>
								<td className="px-4 py-3 capitalize text-white/72">{conditionsLabel(race)}</td>
								<td className="px-4 py-3 text-white/72">{placementLabel(participant)}</td>
								<td className="px-4 py-3 text-white/72">{scoreLabel(participant)}</td>
								<td className="px-4 py-3 text-white/72">{participant.itemsUsed.length}</td>
								<td className="px-4 py-3 text-white/72">{formatDateTime(race.startedAt)}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<div className="flex flex-col gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3 sm:flex-row sm:items-center sm:justify-between">
				<p className="text-sm font-semibold text-white/58">
					Showing {pageStart + 1}-{pageEnd} of {rows.length} races
				</p>
				<div className="flex items-center gap-2">
					<button
						className={cn(
							"inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-black transition",
							currentPage === 1 ? "cursor-not-allowed border-white/8 text-white/28" : "border-white/12 text-white/70 hover:border-cyan-racing/35 hover:text-cyan-racing",
						)}
						disabled={currentPage === 1}
						type="button"
						onClick={() => goToPage(currentPage - 1)}
					>
						<ChevronLeft className="h-4 w-4" />
						Prev
					</button>
					<span className="rounded-lg border border-cyan-racing/20 bg-cyan-racing/10 px-3 py-2 text-sm font-black text-cyan-racing">
						{currentPage} / {pageCount}
					</span>
					<button
						className={cn(
							"inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-black transition",
							currentPage === pageCount ? "cursor-not-allowed border-white/8 text-white/28" : "border-white/12 text-white/70 hover:border-cyan-racing/35 hover:text-cyan-racing",
						)}
						disabled={currentPage === pageCount}
						type="button"
						onClick={() => goToPage(currentPage + 1)}
					>
						Next
						<ChevronRight className="h-4 w-4" />
					</button>
				</div>
			</div>
		</div>
	);
}
