"use client";

import { motion } from "framer-motion";
import { Check, Copy, Download, LoaderCircle, Share2, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { RefObject } from "react";

import { FactionBadge } from "@/components/shared/faction-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { GiglingAvatar } from "@/components/shared/gigling-avatar";
import { MetricCard } from "@/components/shared/metric-card";
import { RarityBadge } from "@/components/shared/rarity-badge";
import { SectionHeader } from "@/components/shared/section-header";
import { formatConditionLabel, formatGiglingRaceFit, formatOptionalToken, formatPercent, formatToken } from "@/lib/utils/format";
import type { Gigling, MetaInsight, Race } from "@/types";

type ReportStudioProps = {
	giglings: Gigling[];
	races: Race[];
	insights: MetaInsight[];
};

type ShareAction = "copy" | "share" | "download";
const REPORT_IMAGE_HEIGHT = 630;
const REPORT_IMAGE_WIDTH = 1200;

function winnerName(race: Race) {
	return race.participants.find((participant) => participant.giglingId === race.winnerGiglingId)?.giglingName ?? "Pending";
}

function roundedPath(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
	const r = Math.min(radius, width / 2, height / 2);

	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.lineTo(x + width - r, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + r);
	ctx.lineTo(x + width, y + height - r);
	ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
	ctx.lineTo(x + r, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - r);
	ctx.lineTo(x, y + r);
	ctx.quadraticCurveTo(x, y, x + r, y);
	ctx.closePath();
}

function drawPanel(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, accent: string) {
	roundedPath(ctx, x, y, width, height, 18);
	ctx.fillStyle = "rgba(255, 255, 255, 0.045)";
	ctx.fill();
	ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
	ctx.lineWidth = 1.5;
	ctx.stroke();

	const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
	gradient.addColorStop(0, accent);
	gradient.addColorStop(0.45, "rgba(255, 255, 255, 0)");
	gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
	roundedPath(ctx, x, y, width, height, 18);
	ctx.fillStyle = gradient;
	ctx.globalAlpha = 0.18;
	ctx.fill();
	ctx.globalAlpha = 1;
}

function setReportFont(ctx: CanvasRenderingContext2D, weight: number, size: number) {
	ctx.font = `${weight} ${size}px "Space Grotesk", Inter, system-ui, sans-serif`;
}

function fitCanvasText(ctx: CanvasRenderingContext2D, value: string, maxWidth: number) {
	if (ctx.measureText(value).width <= maxWidth) {
		return value;
	}

	let output = value;
	while (output.length > 3 && ctx.measureText(`${output}...`).width > maxWidth) {
		output = output.slice(0, -1);
	}

	return `${output}...`;
}

function drawText(ctx: CanvasRenderingContext2D, value: string, x: number, y: number, maxWidth: number, color: string) {
	ctx.fillStyle = color;
	ctx.fillText(fitCanvasText(ctx, value, maxWidth), x, y);
}

function drawWrappedText(ctx: CanvasRenderingContext2D, value: string, x: number, y: number, maxWidth: number, lineHeight: number, maxLines: number, color: string) {
	const words = value.split(/\s+/);
	const lines: string[] = [];
	let current = "";

	for (const word of words) {
		const next = current ? `${current} ${word}` : word;

		if (ctx.measureText(next).width <= maxWidth) {
			current = next;
			continue;
		}

		if (current) {
			lines.push(current);
		}
		current = word;

		if (lines.length === maxLines) {
			break;
		}
	}

	if (lines.length < maxLines && current) {
		lines.push(current);
	}

	ctx.fillStyle = color;
	lines.slice(0, maxLines).forEach((line, index) => {
		const output = index === maxLines - 1 ? fitCanvasText(ctx, line, maxWidth) : line;
		ctx.fillText(output, x, y + index * lineHeight);
	});
}

async function loadReportImage(imageUrl: string) {
	if (!imageUrl) {
		return null;
	}

	return new Promise<HTMLImageElement | null>((resolve) => {
		const image = new Image();
		image.crossOrigin = "anonymous";
		image.decoding = "async";
		image.referrerPolicy = "no-referrer";
		image.onload = () => resolve(image);
		image.onerror = () => resolve(null);
		image.src = imageUrl;
	});
}

function drawAvatar(ctx: CanvasRenderingContext2D, image: HTMLImageElement | null, name: string, x: number, y: number, size: number) {
	ctx.save();
	roundedPath(ctx, x, y, size, size, 26);
	ctx.clip();

	if (image) {
		ctx.drawImage(image, x, y, size, size);
	} else {
		const gradient = ctx.createLinearGradient(x, y, x + size, y + size);
		gradient.addColorStop(0, "rgba(32, 247, 255, 0.34)");
		gradient.addColorStop(0.55, "rgba(135, 84, 255, 0.28)");
		gradient.addColorStop(1, "rgba(255, 138, 37, 0.24)");
		ctx.fillStyle = gradient;
		ctx.fillRect(x, y, size, size);
		setReportFont(ctx, 900, 58);
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
		ctx.fillText(name.slice(0, 2).toUpperCase(), x + size / 2, y + size / 2);
		ctx.textAlign = "left";
		ctx.textBaseline = "alphabetic";
	}

	ctx.restore();

	roundedPath(ctx, x, y, size, size, 26);
	ctx.strokeStyle = "rgba(32, 247, 255, 0.48)";
	ctx.lineWidth = 3;
	ctx.stroke();
}

function drawMetric(ctx: CanvasRenderingContext2D, label: string, value: string, x: number, y: number, width: number, accent: string) {
	drawPanel(ctx, x, y, width, 108, accent);
	setReportFont(ctx, 800, 18);
	drawText(ctx, label.toUpperCase(), x + 22, y + 34, width - 44, accent);
	setReportFont(ctx, 900, 34);
	drawText(ctx, value, x + 22, y + 78, width - 44, "#f8fbff");
}

function drawReportCanvas({ gigling, insight, race }: { gigling: Gigling; insight: MetaInsight; race: Race }, image: HTMLImageElement | null) {
	const canvas = document.createElement("canvas");
	canvas.width = REPORT_IMAGE_WIDTH;
	canvas.height = REPORT_IMAGE_HEIGHT;
	const ctx = canvas.getContext("2d");

	if (!ctx) {
		throw new Error("The browser could not prepare the report canvas.");
	}

	ctx.imageSmoothingEnabled = true;
	ctx.imageSmoothingQuality = "high";
	ctx.fillStyle = "#05070d";
	ctx.fillRect(0, 0, REPORT_IMAGE_WIDTH, REPORT_IMAGE_HEIGHT);

	const glow = ctx.createRadialGradient(260, 170, 20, 260, 170, 560);
	glow.addColorStop(0, "rgba(32, 247, 255, 0.24)");
	glow.addColorStop(0.45, "rgba(135, 84, 255, 0.12)");
	glow.addColorStop(1, "rgba(5, 7, 13, 0)");
	ctx.fillStyle = glow;
	ctx.fillRect(0, 0, REPORT_IMAGE_WIDTH, REPORT_IMAGE_HEIGHT);

	ctx.strokeStyle = "rgba(32, 247, 255, 0.12)";
	ctx.lineWidth = 1;
	for (let x = 0; x <= REPORT_IMAGE_WIDTH; x += 44) {
		ctx.beginPath();
		ctx.moveTo(x, 0);
		ctx.lineTo(x, REPORT_IMAGE_HEIGHT);
		ctx.stroke();
	}
	for (let y = 0; y <= REPORT_IMAGE_HEIGHT; y += 44) {
		ctx.beginPath();
		ctx.moveTo(0, y);
		ctx.lineTo(REPORT_IMAGE_WIDTH, y);
		ctx.stroke();
	}

	const topBar = ctx.createLinearGradient(0, 0, REPORT_IMAGE_WIDTH, 0);
	topBar.addColorStop(0, "#20f7ff");
	topBar.addColorStop(0.45, "#ff8a25");
	topBar.addColorStop(1, "#8754ff");
	ctx.fillStyle = topBar;
	ctx.fillRect(0, 0, REPORT_IMAGE_WIDTH, 9);

	setReportFont(ctx, 900, 20);
	drawText(ctx, "GIGLING RACING INTEL", 56, 66, 390, "#20f7ff");
	setReportFont(ctx, 900, 54);
	drawWrappedText(ctx, "Share the signal.", 56, 128, 520, 58, 2, "#f8fbff");
	setReportFont(ctx, 500, 22);
	drawWrappedText(ctx, "A live racing report built from selected Gigling, race, and meta intelligence.", 58, 226, 540, 30, 2, "rgba(248, 251, 255, 0.66)");

	drawAvatar(ctx, image, gigling.name, 64, 320, 188);

	setReportFont(ctx, 900, 34);
	drawText(ctx, gigling.name, 284, 360, 350, "#f8fbff");
	setReportFont(ctx, 700, 19);
	drawText(ctx, gigling.tokenId, 286, 392, 300, "rgba(248, 251, 255, 0.52)");
	drawText(ctx, `${formatConditionLabel(gigling.faction)} / ${formatConditionLabel(gigling.rarity)}`, 286, 430, 360, "#20f7ff");
	setReportFont(ctx, 700, 17);
	drawText(ctx, `Best fit: ${formatGiglingRaceFit(gigling.bestDistance, gigling.bestWeather)}`, 286, 466, 360, "rgba(248, 251, 255, 0.70)");

	drawMetric(ctx, "Win rate", formatPercent(gigling.winRate), 668, 78, 218, "rgba(32, 247, 255, 0.96)");
	drawMetric(ctx, "Podium", formatPercent(gigling.podiumRate), 914, 78, 218, "rgba(255, 138, 37, 0.96)");
	drawMetric(ctx, "Earnings", formatOptionalToken(gigling.earnings), 668, 214, 218, "rgba(52, 255, 157, 0.96)");
	drawMetric(ctx, `Race #${race.raceNumber}`, winnerName(race), 914, 214, 218, "rgba(135, 84, 255, 0.96)");

	drawPanel(ctx, 668, 356, 464, 190, "rgba(52, 255, 157, 0.9)");
	setReportFont(ctx, 900, 20);
	drawText(ctx, "META SIGNAL", 696, 398, 400, "#34ff9d");
	setReportFont(ctx, 900, 39);
	drawText(ctx, insight.metricValue, 696, 448, 400, "#f8fbff");
	setReportFont(ctx, 700, 21);
	drawWrappedText(ctx, insight.title, 696, 488, 390, 28, 2, "rgba(248, 251, 255, 0.76)");

	drawPanel(ctx, 56, 548, 1076, 52, "rgba(32, 247, 255, 0.7)");
	setReportFont(ctx, 800, 18);
	drawText(ctx, `Race: ${formatConditionLabel(race.distance)} / ${formatConditionLabel(race.weather)} / ${formatConditionLabel(race.trackCondition)}`, 86, 581, 390, "rgba(248, 251, 255, 0.78)");
	drawText(ctx, `Entry: ${formatToken(race.entryFee)}   Prize: ${formatToken(race.prizePool)}`, 516, 581, 350, "rgba(248, 251, 255, 0.78)");
	drawText(ctx, `Items: ${race.participants.flatMap((entry) => entry.itemsUsed).length}`, 924, 581, 150, "rgba(248, 251, 255, 0.78)");

	return canvas;
}

function canvasToBlob(canvas: HTMLCanvasElement) {
	return new Promise<Blob>((resolve, reject) => {
		try {
			canvas.toBlob((blob) => {
				if (blob) {
					resolve(blob);
					return;
				}

				reject(new Error("The browser could not render the report image."));
			}, "image/png");
		} catch (error) {
			reject(error);
		}
	});
}

async function renderReportCanvas(payload: { gigling: Gigling; insight: MetaInsight; race: Race }) {
	const image = await loadReportImage(payload.gigling.imageUrl);
	const canvas = drawReportCanvas(payload, image);

	try {
		return await canvasToBlob(canvas);
	} catch (error) {
		if (!image) {
			throw error;
		}

		return canvasToBlob(drawReportCanvas(payload, null));
	}
}

async function copyText(value: string) {
	if (navigator.clipboard) {
		await navigator.clipboard.writeText(value);
		return;
	}

	const textarea = document.createElement("textarea");
	textarea.value = value;
	textarea.style.position = "fixed";
	textarea.style.opacity = "0";
	document.body.appendChild(textarea);
	textarea.select();
	document.execCommand("copy");
	textarea.remove();
}

function ActionButton({ action, activeAction, pendingAction, onAction }: { action: ShareAction; activeAction?: ShareAction; pendingAction?: ShareAction; onAction: (action: ShareAction) => void }) {
	const icons = {
		copy: Copy,
		share: Share2,
		download: Download,
	};
	const Icon = icons[action];
	const active = activeAction === action;
	const pending = pendingAction === action;
	const activeLabels: Record<ShareAction, string> = {
		copy: "Copied",
		share: "Shared",
		download: "Downloaded",
	};

	return (
		<button
			aria-label={`${action} report`}
			className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-bold capitalize transition ${
				active ? "border-emerald-racing/35 bg-emerald-racing/10 text-emerald-racing" : "border-white/10 bg-white/[0.04] text-white/62 hover:border-cyan-racing/35 hover:text-cyan-racing"
			}`}
			disabled={Boolean(pendingAction)}
			type="button"
			onClick={() => onAction(action)}
		>
			{pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : active ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
			{pending ? "Preparing" : active ? activeLabels[action] : action}
		</button>
	);
}

function ReportShell({ eyebrow, title, children, accent = "cyan" }: { eyebrow: string; title: string; children: React.ReactNode; accent?: "cyan" | "orange" | "emerald" }) {
	const accentClass =
		accent === "orange"
			? "text-orange-racing border-orange-racing/24 bg-orange-racing/8"
			: accent === "emerald"
				? "text-emerald-racing border-emerald-racing/24 bg-emerald-racing/8"
				: "text-cyan-racing border-cyan-racing/24 bg-cyan-racing/8";

	return (
		<motion.article className="premium-panel min-h-[360px] rounded-lg p-5" whileHover={{ y: -4 }}>
			<div className="relative z-10">
				<div className={`mb-5 inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] ${accentClass}`}>{eyebrow}</div>
				<h3 className="text-2xl font-black text-white">{title}</h3>
				{children}
			</div>
		</motion.article>
	);
}

function ShareExportArtifact({ artifactRef, gigling, insight, race, scale = 1 }: { artifactRef: RefObject<HTMLDivElement | null>; gigling: Gigling; insight: MetaInsight; race: Race; scale?: number }) {
	return (
		<div
			ref={artifactRef}
			className="relative h-[630px] w-[1200px] origin-top-left overflow-hidden bg-[#05070d] p-8 text-white"
			style={{ transform: `scale(${scale})` }}
		>
			<div className="absolute inset-0 bg-racing-grid opacity-35" />
			<div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-cyan-racing via-orange-racing to-violet-racing" />
			<div className="relative z-10 grid h-full grid-cols-[0.92fr_1.08fr] items-center gap-7">
				<div className="flex min-w-0 items-center gap-6">
					<GiglingAvatar className="h-40 w-40 shrink-0 rounded-lg" imageUrl={gigling.imageUrl} name={gigling.name} priority />
					<div className="min-w-0">
						<p className="text-sm font-black uppercase tracking-[0.24em] text-cyan-racing">Gigling Report</p>
						<h3 className="mt-3 line-clamp-2 text-5xl font-black leading-tight text-white">{gigling.name}</h3>
						<p className="mt-3 text-base text-white/48">{gigling.tokenId}</p>
						<div className="mt-5 flex flex-wrap gap-2">
							<FactionBadge faction={gigling.faction} />
							<RarityBadge rarity={gigling.rarity} />
						</div>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="min-w-0 rounded-lg border border-cyan-racing/22 bg-cyan-racing/[0.07] p-5">
						<p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-racing">Win rate</p>
						<p className="mt-3 text-5xl font-black text-white">{formatPercent(gigling.winRate)}</p>
					</div>
					<div className="min-w-0 rounded-lg border border-orange-racing/22 bg-orange-racing/[0.07] p-5">
						<p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-racing">Race #{race.raceNumber}</p>
						<p className="mt-3 line-clamp-2 text-3xl font-black leading-tight text-white">{winnerName(race)}</p>
					</div>
					<div className="col-span-2 min-w-0 rounded-lg border border-emerald-racing/22 bg-emerald-racing/[0.07] p-5">
						<p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-racing">Meta signal</p>
						<p className="mt-3 line-clamp-2 text-4xl font-black leading-tight text-white">{insight.metricValue}</p>
						<p className="mt-2 line-clamp-2 text-base leading-7 text-white/58">{insight.title}</p>
					</div>
				</div>
			</div>
		</div>
	);
}

function SharePreview({ artifactRef, gigling, insight, race }: { artifactRef: RefObject<HTMLDivElement | null>; gigling: Gigling; insight: MetaInsight; race: Race }) {
	const previewFrameRef = useRef<HTMLDivElement>(null);
	const [previewScale, setPreviewScale] = useState(1);

	useEffect(() => {
		const frame = previewFrameRef.current;

		if (!frame) {
			return;
		}

		const resizePreview = () => {
			setPreviewScale(Math.min(1, frame.clientWidth / REPORT_IMAGE_WIDTH));
		};

		resizePreview();

		const observer = new ResizeObserver(resizePreview);
		observer.observe(frame);

		return () => observer.disconnect();
	}, []);

	return (
		<section className="premium-panel rounded-lg p-5">
			<div className="relative z-10">
				<SectionHeader description="A social-format preview of the PNG report generated from the selected live inputs." title="Social Preview" />
				<div className="w-full overflow-hidden rounded-lg border border-white/10 bg-[#05070d] shadow-glow">
					<div ref={previewFrameRef} className="relative w-full overflow-hidden bg-[#05070d]" style={{ height: REPORT_IMAGE_HEIGHT * previewScale }}>
						<ShareExportArtifact artifactRef={artifactRef} gigling={gigling} insight={insight} race={race} scale={previewScale} />
					</div>
				</div>
			</div>
		</section>
	);
}

export function ReportStudio({ giglings, races, insights }: ReportStudioProps) {
	const [selectedGiglingId, setSelectedGiglingId] = useState(giglings[0]?.id ?? "");
	const [selectedRaceId, setSelectedRaceId] = useState(races[0]?.id ?? "");
	const [selectedInsightId, setSelectedInsightId] = useState(insights[0]?.id ?? "");
	const [activeAction, setActiveAction] = useState<ShareAction | undefined>();
	const [pendingAction, setPendingAction] = useState<ShareAction | undefined>();
	const [actionMessage, setActionMessage] = useState("");
	const exportRef = useRef<HTMLDivElement>(null);

	const gigling = useMemo(() => giglings.find((entry) => entry.id === selectedGiglingId) ?? giglings[0], [giglings, selectedGiglingId]);
	const race = useMemo(() => races.find((entry) => entry.id === selectedRaceId) ?? races[0], [races, selectedRaceId]);
	const insight = useMemo(() => insights.find((entry) => entry.id === selectedInsightId) ?? insights[0], [insights, selectedInsightId]);

	if (!gigling || !race || !insight) {
		return <EmptyState description="Reports require a live Gigling, a completed live race, and a live meta signal. Gigaverse has not returned all three inputs yet." title="Not enough live data for a report" />;
	}

	const socialCopy = `${gigling.name} watchlist: ${formatPercent(gigling.winRate)} win rate, ${formatPercent(gigling.podiumRate)} podium rate, best fit ${formatGiglingRaceFit(gigling.bestDistance, gigling.bestWeather).toLowerCase()}. Race #${race.raceNumber} winner: ${winnerName(race)}. Meta signal: ${insight.title} (${insight.metricValue}). Powered by Gigling Racing Intel.`;

	async function renderReportImage() {
		await document.fonts.ready;
		return renderReportCanvas({ gigling, insight, race });
	}

	async function handleAction(action: ShareAction) {
		setPendingAction(action);
		setActionMessage("");

		try {
			if (action === "copy") {
				await copyText(socialCopy);
				setActionMessage("Social copy added to your clipboard.");
			}

			if (action === "share") {
				const blob = await renderReportImage();
				const file = new File([blob], `gigling-racing-intel-${gigling.id}.png`, {
					type: "image/png",
				});

				if (navigator.share && navigator.canShare?.({ files: [file] })) {
					await navigator.share({
						files: [file],
						title: "Gigling Racing Intel Report",
						text: socialCopy,
					});
					setActionMessage("Visual report shared from your device.");
				} else if (navigator.share) {
					await navigator.share({
						title: "Gigling Racing Intel Report",
						text: socialCopy,
						url: window.location.href,
					});
					setActionMessage("This browser shared the report text; use Download for the PNG.");
				} else {
					await copyText(socialCopy);
					setActionMessage("Native sharing is unavailable, so the report text was copied.");
				}
			}

			if (action === "download") {
				const blob = await renderReportImage();
				const url = URL.createObjectURL(blob);
				const link = document.createElement("a");
				link.href = url;
				link.download = `gigling-racing-intel-${gigling.id}-race-${race.raceNumber}.png`;
				document.body.appendChild(link);
				link.click();
				link.remove();
				URL.revokeObjectURL(url);
				setActionMessage(`${REPORT_IMAGE_WIDTH} x ${REPORT_IMAGE_HEIGHT} PNG report saved.`);
			}

			setActiveAction(action);
			window.setTimeout(() => setActiveAction(undefined), 2200);
		} catch (error) {
			setActiveAction(undefined);
			setActionMessage(error instanceof Error ? error.message : "The report action could not be completed in this browser.");
		} finally {
			setPendingAction(undefined);
		}
	}

	return (
		<div className="space-y-6">
			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<MetricCard detail="Gigling, race, meta" icon="fileStack" label="Report Types" value="3" />
				<MetricCard detail="Copy/share/download actions" icon="share" label="Share Actions" tone="violet" value="Ready" />
				<MetricCard detail={gigling.name} icon="trophy" label="Feature Gigling" mechanic="winRate" tone="orange" value={formatPercent(gigling.winRate)} />
				<MetricCard detail={insight.title} icon="sparkles" label="Meta Alert" mechanic="faction" tone="emerald" value={insight.metricValue} />
			</div>

			<section className="premium-panel rounded-lg p-5">
				<div className="relative z-10 grid gap-4 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
					<label className="block">
						<span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-white/42">Gigling Card</span>
						<select
							className="h-11 w-full rounded-lg border border-white/10 bg-[#0b1220] px-3 text-sm font-semibold text-white outline-none transition focus:border-cyan-racing/50"
							value={selectedGiglingId}
							onChange={(event) => setSelectedGiglingId(event.target.value)}
						>
							{giglings.map((entry) => (
								<option key={entry.id} value={entry.id}>
									{entry.name}
								</option>
							))}
						</select>
					</label>
					<label className="block">
						<span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-white/42">Race Card</span>
						<select
							className="h-11 w-full rounded-lg border border-white/10 bg-[#0b1220] px-3 text-sm font-semibold text-white outline-none transition focus:border-cyan-racing/50"
							value={selectedRaceId}
							onChange={(event) => setSelectedRaceId(event.target.value)}
						>
							{races.map((entry) => (
								<option key={entry.id} value={entry.id}>
									Race #{entry.raceNumber}
								</option>
							))}
						</select>
					</label>
					<label className="block">
						<span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-white/42">Meta Card</span>
						<select
							className="h-11 w-full rounded-lg border border-white/10 bg-[#0b1220] px-3 text-sm font-semibold text-white outline-none transition focus:border-cyan-racing/50"
							value={selectedInsightId}
							onChange={(event) => setSelectedInsightId(event.target.value)}
						>
							{insights.map((entry) => (
								<option key={entry.id} value={entry.id}>
									{entry.title}
								</option>
							))}
						</select>
					</label>
					<div className="flex flex-wrap gap-2">
						<ActionButton action="copy" activeAction={activeAction} pendingAction={pendingAction} onAction={handleAction} />
						<ActionButton action="share" activeAction={activeAction} pendingAction={pendingAction} onAction={handleAction} />
						<ActionButton action="download" activeAction={activeAction} pendingAction={pendingAction} onAction={handleAction} />
					</div>
				</div>
				<p aria-live="polite" className="relative z-10 mt-3 text-sm text-white/52">
					{actionMessage}
				</p>
			</section>

			<SharePreview artifactRef={exportRef} gigling={gigling} insight={insight} race={race} />

			<section>
				<SectionHeader description="Shareable cards for community posts, match recaps, and meta alerts." title="Report Cards" />
				<div className="mobile-card-rail grid gap-5 xl:grid-cols-3">
					<ReportShell accent="cyan" eyebrow="Gigling Report" title={gigling.name}>
						<GiglingAvatar className="mt-5 aspect-square max-h-56 rounded-lg" imageUrl={gigling.imageUrl} name={gigling.name} />
						<div className="mt-4 flex flex-wrap gap-2">
							<FactionBadge faction={gigling.faction} />
							<RarityBadge rarity={gigling.rarity} />
						</div>
						<div className="mt-5 grid grid-cols-2 gap-3">
							<div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
								<p className="text-xs text-white/38">Win</p>
								<p className="mt-1 text-xl font-black text-cyan-racing">{formatPercent(gigling.winRate)}</p>
							</div>
							<div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
								<p className="text-xs text-white/38">Podium</p>
								<p className="mt-1 text-xl font-black text-orange-racing">{formatPercent(gigling.podiumRate)}</p>
							</div>
							<div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
								<p className="text-xs text-white/38">Best Fit</p>
								<p className="mt-1 font-black capitalize text-white">{formatGiglingRaceFit(gigling.bestDistance, gigling.bestWeather)}</p>
							</div>
							<div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
								<p className="text-xs text-white/38">Earnings</p>
								<p className="mt-1 font-black text-white">{formatOptionalToken(gigling.earnings)}</p>
							</div>
						</div>
						<p className="mt-5 text-sm leading-6 text-white/58">
							{gigling.bestWeather === "unknown"
								? `${gigling.name} has no live weather-fit signal yet and is currently carrying a ${gigling.currentStreak} race streak.`
								: `${gigling.name} is strongest in ${formatConditionLabel(gigling.bestWeather)} weather and is currently carrying a ${gigling.currentStreak} race streak.`}
						</p>
					</ReportShell>

					<ReportShell accent="orange" eyebrow="Race Report" title={`Race #${race.raceNumber}`}>
						<div className="mt-5 grid grid-cols-2 gap-3">
							<div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
								<p className="text-xs text-white/38">Winner</p>
								<p className="mt-1 font-black text-white">{winnerName(race)}</p>
							</div>
							<div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
								<p className="text-xs text-white/38">Prize</p>
								<p className="mt-1 font-black text-orange-racing">{formatToken(race.prizePool)}</p>
							</div>
							<div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
								<p className="text-xs text-white/38">Entry</p>
								<p className="mt-1 font-black text-emerald-racing">{formatToken(race.entryFee)}</p>
							</div>
							<div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
								<p className="text-xs text-white/38">Conditions</p>
								<p className="mt-1 font-black capitalize text-white">
									{formatConditionLabel(race.weather)} / {formatConditionLabel(race.trackCondition)}
								</p>
							</div>
							<div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
								<p className="text-xs text-white/38">Entrants</p>
								<p className="mt-1 font-black text-white">{race.participants.length}</p>
							</div>
						</div>
						<p className="mt-5 text-sm leading-6 text-white/58">
							{race.distance} race with {race.participants.flatMap((entry) => entry.itemsUsed).length} recorded item actions.
						</p>
					</ReportShell>

					<ReportShell accent="emerald" eyebrow="Meta Alert" title={insight.title}>
						<div className="mt-5 rounded-lg border border-emerald-racing/24 bg-emerald-racing/8 p-4">
							<p className="text-xs uppercase tracking-[0.2em] text-emerald-racing">{insight.metricLabel}</p>
							<p className="mt-2 text-3xl font-black text-white">{insight.metricValue}</p>
						</div>
						<p className="mt-5 text-sm leading-6 text-white/58">{insight.description}</p>
						<div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold capitalize text-white/62">
							<Sparkles className="h-3.5 w-3.5 text-cyan-racing" />
							{insight.severity} / {insight.trendDirection}
						</div>
					</ReportShell>
				</div>
			</section>

			<section className="premium-panel rounded-lg p-5">
				<div className="relative z-10">
					<SectionHeader description="Social-ready copy generated from the selected report cards." title="Social Sharing Copy" />
					<div className="rounded-lg border border-white/10 bg-white/[0.035] p-4 text-sm leading-6 text-white/64">{socialCopy}</div>
				</div>
			</section>
		</div>
	);
}
