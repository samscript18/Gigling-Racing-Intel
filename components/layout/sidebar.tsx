"use client";

import { motion } from "framer-motion";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { primaryNavItems } from "@/components/layout/nav-items";
import { cn } from "@/lib/utils/cn";
import { useAppStore } from "@/store/app-store";

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useAppStore();

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 88 : 286 }}
      className="fixed left-0 top-0 z-40 hidden h-screen border-r border-white/10 bg-[#060914]/86 px-4 py-5 backdrop-blur-2xl md:block"
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      <div className="flex h-full flex-col">
        <div className="mb-7 flex items-center justify-between gap-3">
          <Link href="/dashboard" className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-cyan-racing/30 bg-cyan-racing/10 shadow-glow">
              <span className="text-sm font-black tracking-[0.18em] text-cyan-racing">GRI</span>
            </div>
            {!sidebarCollapsed ? (
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-white">Gigling Racing Intel</p>
                <p className="truncate text-xs text-cyan-100/58">Race intelligence layer</p>
              </div>
            ) : null}
          </Link>
          <button
            aria-label="Toggle sidebar"
            className="rounded-lg border border-white/10 bg-white/5 p-2 text-white/72 transition hover:border-cyan-racing/50 hover:text-cyan-racing"
            type="button"
            onClick={toggleSidebar}
          >
            {sidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>

        <nav className="space-y-2">
          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg border px-3 py-3 transition",
                  active
                    ? "border-cyan-racing/45 bg-cyan-racing/12 text-white shadow-glow"
                    : "border-transparent text-white/64 hover:border-white/12 hover:bg-white/6 hover:text-white"
                )}
                href={item.href}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition",
                    active ? "text-cyan-racing" : "text-white/54 group-hover:text-orange-racing"
                  )}
                />
                {!sidebarCollapsed ? (
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{item.label}</span>
                    <span className="block truncate text-xs text-white/38">{item.description}</span>
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        {!sidebarCollapsed ? (
          <div className="premium-panel mt-auto rounded-lg p-4">
            <div className="relative z-10">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-racing">
                Meta Ping
              </p>
              <p className="mt-2 text-sm font-semibold text-white">Volt sprint pressure is live.</p>
              <p className="mt-1 text-xs leading-5 text-white/54">
                Watch windy sprint lobbies before committing lower-acceleration Giglings.
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </motion.aside>
  );
}
