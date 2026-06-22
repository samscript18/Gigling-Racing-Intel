"use client";

import { Copy, Download, Share2 } from "lucide-react";

import { cn } from "@/lib/utils/cn";

type ShareCardProps = {
  title: string;
  eyebrow: string;
  body: string;
  metric: string;
  className?: string;
};

export function ShareCard({ title, eyebrow, body, metric, className }: ShareCardProps) {
  return (
    <article className={cn("premium-panel rounded-lg p-5", className)}>
      <div className="relative z-10">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-orange-racing">
          {eyebrow}
        </p>
        <h3 className="mt-3 text-2xl font-black text-white">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-white/56">{body}</p>
        <div className="mt-5 rounded-lg border border-cyan-racing/24 bg-cyan-racing/8 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-white/38">Signal</p>
          <p className="mt-1 text-xl font-black text-cyan-racing">{metric}</p>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          {[
            { label: "Copy", icon: Copy },
            { label: "Share", icon: Share2 },
            { label: "Save", icon: Download }
          ].map((action) => {
            const Icon = action.icon;

            return (
              <button
                key={action.label}
                className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-bold text-white/66 transition hover:border-cyan-racing/38 hover:text-cyan-racing"
                type="button"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </article>
  );
}
