"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { primaryNavItems } from "@/components/layout/nav-items";
import { cn } from "@/lib/utils/cn";

const mobileItems = primaryNavItems.slice(0, 5);

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary mobile navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#060914]/92 px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-2xl md:hidden"
    >
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {mobileItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-14 touch-manipulation flex-col items-center justify-center gap-1 rounded-lg px-1 text-[11px] font-semibold transition",
                active
                  ? "bg-cyan-racing/14 text-cyan-racing"
                  : "text-white/54 hover:bg-white/6 hover:text-white"
              )}
              href={item.href}
            >
              <Icon className="h-5 w-5" />
              <span className="max-w-full truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
