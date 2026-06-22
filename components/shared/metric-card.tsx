"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform
} from "framer-motion";
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
import { useEffect, useMemo } from "react";

import { MechanicTooltip } from "@/components/shared/mechanic-tooltip";
import type { RacingMechanic } from "@/lib/gigaverse/mechanics";
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
  mechanic?: RacingMechanic;
};

const toneStyles = {
  cyan: "from-cyan-racing/18 to-cyan-racing/4 text-cyan-racing",
  orange: "from-orange-racing/20 to-orange-racing/4 text-orange-racing",
  violet: "from-violet-racing/20 to-violet-racing/4 text-violet-200",
  emerald: "from-emerald-racing/18 to-emerald-racing/4 text-emerald-racing"
};

function AnimatedMetricValue({ value }: { value: string }) {
  const reduceMotion = useReducedMotion();
  const parsed = useMemo(() => {
    const match = value.match(/^([^0-9-]{0,3})(-?\d[\d,]*(?:\.\d+)?)(\/100|[^0-9]{0,10})$/);

    if (!match) {
      return undefined;
    }

    const numericText = match[2].replaceAll(",", "");
    const numericValue = Number(numericText);

    if (!Number.isFinite(numericValue)) {
      return undefined;
    }

    return {
      decimals: numericText.includes(".") ? numericText.split(".")[1].length : 0,
      prefix: match[1],
      suffix: match[3],
      value: numericValue
    };
  }, [value]);
  const target = parsed?.value ?? 0;
  const counter = useMotionValue(reduceMotion ? target : 0);
  const spring = useSpring(counter, { damping: 28, stiffness: 110 });
  const display = useTransform(spring, (current) => {
    if (!parsed) {
      return value;
    }

    const formatted = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: parsed.decimals,
      minimumFractionDigits: parsed.decimals
    }).format(current);

    return `${parsed.prefix}${formatted}${parsed.suffix}`;
  });

  useEffect(() => {
    counter.set(target);
  }, [counter, target]);

  if (!parsed) {
    return value;
  }

  return (
    <span aria-label={value}>
      <motion.span aria-hidden="true">{display}</motion.span>
    </span>
  );
}

export function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = "cyan",
  className,
  mechanic
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
          <div className="flex items-center gap-1">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/42">{label}</p>
            {mechanic ? <MechanicTooltip mechanic={mechanic} /> : null}
          </div>
          <p className="mt-3 text-2xl font-black text-white sm:text-3xl">
            <AnimatedMetricValue value={value} />
          </p>
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
