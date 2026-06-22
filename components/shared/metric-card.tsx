"use client";

import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bot,
  Coins,
  FileStack,
  Flag,
  Gauge,
  LineChart,
  Medal,
  Radar,
  Share2,
  Shield,
  ShieldCheck,
  Skull,
  Sparkles,
  Swords,
  Timer,
  Trophy,
  Users,
  WalletCards,
  Zap
} from "lucide-react";

import { cn } from "@/lib/utils/cn";

const metricIcons = {
  activity: Activity,
  alert: AlertTriangle,
  barChart: BarChart3,
  bot: Bot,
  coins: Coins,
  fileStack: FileStack,
  flag: Flag,
  gauge: Gauge,
  lineChart: LineChart,
  medal: Medal,
  radar: Radar,
  share: Share2,
  shield: Shield,
  shieldCheck: ShieldCheck,
  skull: Skull,
  sparkles: Sparkles,
  swords: Swords,
  timer: Timer,
  trophy: Trophy,
  users: Users,
  wallet: WalletCards,
  zap: Zap
} as const;

export type MetricIconName = keyof typeof metricIcons;

type MetricCardProps = {
  label: string;
  value: string;
  detail?: string;
  icon?: MetricIconName;
  tone?: "cyan" | "orange" | "violet" | "emerald";
  className?: string;
};

const toneStyles = {
  cyan: "from-cyan-racing/18 to-cyan-racing/4 text-cyan-racing",
  orange: "from-orange-racing/20 to-orange-racing/4 text-orange-racing",
  violet: "from-violet-racing/20 to-violet-racing/4 text-violet-200",
  emerald: "from-emerald-racing/18 to-emerald-racing/4 text-emerald-racing"
};

export function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = "cyan",
  className
}: MetricCardProps) {
  const IconComponent = Icon ? metricIcons[Icon] : undefined;

  return (
    <motion.div
      className={cn("premium-panel rounded-lg p-4", className)}
      initial={{ opacity: 0, y: 10 }}
      whileHover={{ y: -3, scale: 1.01 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
    >
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/42">{label}</p>
          <p className="mt-3 text-2xl font-black text-white sm:text-3xl">{value}</p>
          {detail ? <p className="mt-2 text-sm text-white/52">{detail}</p> : null}
        </div>
        {IconComponent ? (
          <div
            className={cn(
              "rounded-lg border border-white/10 bg-gradient-to-br p-3",
              toneStyles[tone]
            )}
          >
            <IconComponent className="h-5 w-5" />
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
