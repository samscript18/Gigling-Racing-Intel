"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { MobileNav } from "@/components/layout/mobile-nav";
import { primaryNavItems } from "@/components/layout/nav-items";
import { RacingMotionLayer } from "@/components/layout/racing-motion-layer";
import { Sidebar } from "@/components/layout/sidebar";
import { WalletConnectButton } from "@/components/shared/wallet-connect-button";
import { cn } from "@/lib/utils/cn";
import { useAppStore } from "@/store/app-store";

type AppShellProps = {
	children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
	const pathname = usePathname();
	const { sidebarCollapsed } = useAppStore();

	if (pathname === "/") {
		return <>{children}</>;
	}

	const currentItem = primaryNavItems.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`)) ?? primaryNavItems[0];

	return (
		<div className="racing-page-shell relative isolate min-h-screen bg-transparent">
			<RacingMotionLayer />
			<a
				className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:border focus:border-cyan-racing/40 focus:bg-[#07111f] focus:px-4 focus:py-2 focus:text-sm focus:font-black focus:text-cyan-racing"
				href="#main-content"
			>
				Skip to race intel
			</a>
			<Sidebar />
			<div className={cn("relative z-10 min-h-screen pb-24 transition-[padding] duration-200 md:pb-0", sidebarCollapsed ? "md:pl-[88px]" : "md:pl-[286px]")}>
				<header className="sticky top-0 z-30 border-b border-white/10 bg-[#05070d]/82 px-4 py-3 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl sm:px-6">
					<div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-racing/60 to-transparent" />
					<div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
						<Link href="/dashboard" className="flex items-center gap-3 md:hidden">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-racing/30 bg-cyan-racing/10">
								<span className="text-xs font-black tracking-[0.18em] text-cyan-racing">GRI</span>
							</div>
							<div className="hidden min-[480px]:block">
								<p className="text-sm font-bold text-white">Gigling Racing Intel</p>
								<p className="text-xs text-white/45">{currentItem.label}</p>
							</div>
						</Link>

						<div className="hidden min-w-0 md:block">
							<p className="text-xs uppercase tracking-[0.28em] text-cyan-racing/72">{currentItem.label}</p>
							<p className="truncate text-sm text-white/52">{currentItem.description}</p>
						</div>

						<div className="ml-auto flex items-center gap-2">
							<div>
								<WalletConnectButton />
							</div>
						</div>
					</div>
				</header>

				<motion.main
					key={pathname}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					className="content-grid mx-auto max-w-7xl bg-racing-grid px-4 py-6 sm:px-6 lg:py-8"
					id="main-content"
					initial={{ opacity: 0, scale: 0.992, y: 14 }}
					transition={{ duration: 0.32, ease: "easeOut" }}
				>
					{children}
				</motion.main>
			</div>
			<MobileNav />
		</div>
	);
}
