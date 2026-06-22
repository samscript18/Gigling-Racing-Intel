"use client";

import { motion } from "framer-motion";
import { Bell, Search, Wallet } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { MobileNav } from "@/components/layout/mobile-nav";
import { primaryNavItems } from "@/components/layout/nav-items";
import { Sidebar } from "@/components/layout/sidebar";
import { cn } from "@/lib/utils/cn";
import { shortenAddress } from "@/lib/utils/format";
import { useAppStore } from "@/store/app-store";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const { sidebarCollapsed, selectedOwnerAddress } = useAppStore();

  if (pathname === "/") {
    return <>{children}</>;
  }

  const currentItem =
    primaryNavItems.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`)) ??
    primaryNavItems[0];

  return (
    <div className="min-h-screen bg-transparent">
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:border focus:border-cyan-racing/40 focus:bg-[#07111f] focus:px-4 focus:py-2 focus:text-sm focus:font-black focus:text-cyan-racing"
        href="#main-content"
      >
        Skip to race intel
      </a>
      <Sidebar />
      <div
        className={cn(
          "min-h-screen pb-24 transition-[padding] duration-200 md:pb-0",
          sidebarCollapsed ? "md:pl-[88px]" : "md:pl-[286px]"
        )}
      >
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#05070d]/78 px-4 py-3 backdrop-blur-2xl sm:px-6">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
            <Link href="/dashboard" className="flex items-center gap-3 md:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-racing/30 bg-cyan-racing/10">
                <span className="text-xs font-black tracking-[0.18em] text-cyan-racing">GRI</span>
              </div>
              <div>
                <p className="text-sm font-bold text-white">Gigling Racing Intel</p>
                <p className="text-xs text-white/45">{currentItem.label}</p>
              </div>
            </Link>

            <div className="hidden min-w-0 md:block">
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-racing/72">
                {currentItem.label}
              </p>
              <p className="truncate text-sm text-white/52">{currentItem.description}</p>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <div className="hidden h-10 min-w-[260px] items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-white/44 lg:flex">
                <Search className="h-4 w-4" />
                <span className="text-sm">Search Giglings, races, rivals</span>
              </div>
              <button
                aria-label="Notifications"
                className="rounded-lg border border-white/10 bg-white/[0.04] p-2.5 text-white/62 transition hover:border-orange-racing/40 hover:text-orange-racing"
                type="button"
              >
                <Bell className="h-5 w-5" />
              </button>
              <button
                className="hidden items-center gap-2 rounded-lg border border-emerald-racing/25 bg-emerald-racing/10 px-3 py-2 text-sm font-semibold text-emerald-racing sm:flex"
                type="button"
              >
                <Wallet className="h-4 w-4" />
                {shortenAddress(selectedOwnerAddress)}
              </button>
            </div>
          </div>
        </header>

        <motion.main
          key={pathname}
          animate={{ opacity: 1, y: 0 }}
          className="content-grid mx-auto max-w-7xl bg-racing-grid px-4 py-6 sm:px-6 lg:py-8"
          id="main-content"
          initial={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.26, ease: "easeOut" }}
        >
          {children}
        </motion.main>
      </div>
      <MobileNav />
    </div>
  );
}
