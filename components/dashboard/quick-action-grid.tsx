import type { LucideIcon } from "lucide-react";
import { BookOpenCheck, Bot, Flag, Radar, Zap } from "lucide-react";
import Link from "next/link";

type QuickAction = {
	href: string;
	label: string;
	description: string;
	icon: LucideIcon;
};

const actions: QuickAction[] = [
	{
		href: "/predictor",
		label: "Run Race Intel",
		description: "Estimate win, podium, risk, and confidence.",
		icon: Radar,
	},
	{
		href: "/giglings",
		label: "Scout Giglings",
		description: "Compare traits, stats, factions, and form.",
		icon: Bot,
	},
	{
		href: "/races",
		label: "Inspect Races",
		description: "Review live, scheduled, and completed fields.",
		icon: Flag,
	},
	{
		href: "/stable",
		label: "Tune Stable",
		description: "Find opportunities and risk alerts.",
		icon: Zap,
	},
	{
		href: "/docs",
		label: "Open Academy",
		description: "Learn mechanics, strategy, and data signals.",
		icon: BookOpenCheck,
	},
];

export function QuickActionGrid() {
	return (
		<div className="grid gap-3 sm:grid-cols-3">
			{actions.map((item) => {
				const Icon = item.icon;

				return (
					<Link key={item.href} className="group rounded-lg border border-white/10 bg-white/[0.04] p-4 transition hover:border-cyan-racing/35 hover:bg-cyan-racing/8" href={item.href}>
						<div className="flex items-start gap-3">
							<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white/58 transition group-hover:border-cyan-racing/35 group-hover:text-cyan-racing">
								<Icon className="h-5 w-5" />
							</span>
							<span>
								<span className="block text-sm font-black text-white">{item.label}</span>
								<span className="mt-1 block text-xs leading-5 text-white/48">{item.description}</span>
							</span>
						</div>
					</Link>
				);
			})}
		</div>
	);
}
