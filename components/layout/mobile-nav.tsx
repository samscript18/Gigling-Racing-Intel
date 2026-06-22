"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { primaryNavItems } from "@/components/layout/nav-items";
import { cn } from "@/lib/utils/cn";

const mobileItems = primaryNavItems.slice(0, 4);
const moreItems = primaryNavItems.slice(4);

export function MobileNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);

  function closeMoreMenu({ restoreFocus = true } = {}) {
    setMoreOpen(false);

    if (restoreFocus) {
      window.requestAnimationFrame(() => moreButtonRef.current?.focus());
    }
  }

  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!moreOpen) {
      return;
    }

    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMoreMenu();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [moreOpen]);

  const moreActive = moreItems.some(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
  );

  return (
    <>
      <AnimatePresence>
        {moreOpen ? (
          <>
            <motion.button
              aria-label="Close more navigation"
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-40 bg-black/70 md:hidden"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              type="button"
              onClick={() => closeMoreMenu()}
            />
            <motion.div
              aria-labelledby="more-navigation-title"
              aria-modal="true"
              className="fixed inset-x-3 bottom-24 z-50 rounded-lg border border-white/12 bg-[#07101d] p-3 shadow-2xl md:hidden"
              exit={{ opacity: 0, y: 18 }}
              initial={{ opacity: 0, y: 18 }}
              role="dialog"
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="mb-2 flex items-center justify-between px-2 py-1">
                <p
                  className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-racing"
                  id="more-navigation-title"
                >
                  More Intel
                </p>
                <button
                  ref={closeButtonRef}
                  aria-label="Close more navigation"
                  className="rounded-lg p-2 text-white/58 transition hover:bg-white/[0.06] hover:text-white"
                  type="button"
                  onClick={() => closeMoreMenu()}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {moreItems.map((item) => {
                  const Icon = item.icon;
                  const active =
                    pathname === item.href || pathname.startsWith(`${item.href}/`);

                  return (
                    <Link
                      key={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex min-h-16 items-center gap-3 rounded-lg border px-3 py-2 transition",
                        active
                          ? "border-cyan-racing/35 bg-cyan-racing/12 text-cyan-racing"
                          : "border-white/10 bg-white/[0.035] text-white/64 hover:border-white/20 hover:text-white"
                      )}
                      href={item.href}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-bold">{item.label}</span>
                        <span className="block truncate text-xs text-white/38">
                          {item.description}
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>

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
          <button
            ref={moreButtonRef}
            aria-expanded={moreOpen}
            aria-label="More navigation"
            className={cn(
              "flex min-h-14 touch-manipulation flex-col items-center justify-center gap-1 rounded-lg px-1 text-[11px] font-semibold transition",
              moreActive || moreOpen
                ? "bg-cyan-racing/14 text-cyan-racing"
                : "text-white/54 hover:bg-white/6 hover:text-white"
            )}
            type="button"
            onClick={() => (moreOpen ? closeMoreMenu() : setMoreOpen(true))}
          >
            <Menu className="h-5 w-5" />
            <span>More</span>
          </button>
        </div>
      </nav>
    </>
  );
}
