"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { MechanicTooltip } from "@/components/shared/mechanic-tooltip";
import type { RacingMechanic } from "@/lib/gigaverse/mechanics";
import { cn } from "@/lib/utils/cn";

type ChartCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  mechanic?: RacingMechanic;
};

export function ChartCard({ title, description, children, className, mechanic }: ChartCardProps) {
  return (
    <motion.section
      className={cn("premium-panel rounded-lg p-5", className)}
      initial={{ opacity: 0, y: 14 }}
      whileHover={{ y: -2 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
    >
      <div className="relative z-10">
        <div className="mb-5 flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <h2 className="text-base font-bold text-white">{title}</h2>
            {mechanic ? <MechanicTooltip mechanic={mechanic} /> : null}
          </div>
          {description ? <p className="text-sm text-white/52">{description}</p> : null}
        </div>
        {children}
      </div>
    </motion.section>
  );
}
