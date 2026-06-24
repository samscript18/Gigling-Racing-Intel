"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { ChartCard } from "@/components/shared/chart-card";

type FactionDatum = {
  faction: string;
  winRate: number;
  podiumRate: number;
  averagePlacement: number;
  races: number;
};

type RaceTrendDatum = {
  raceLabel: string;
  conditionScore: number;
  itemPressure: number;
  prizePool: number;
  trackCondition: string;
  distance: string;
};

type DashboardChartsProps = {
  factionData: FactionDatum[];
  raceTrendData: RaceTrendDatum[];
};

type TooltipPayload = {
  name: string;
  value: number | string;
  color?: string;
  payload?: RaceTrendDatum & FactionDatum;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
};

function DashboardTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const source = payload[0]?.payload;

  return (
    <div className="rounded-lg border border-white/12 bg-[#07101d]/95 p-3 shadow-glow backdrop-blur-xl">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-racing">
        {label}
      </p>
      {source?.trackCondition ? (
        <p className="mt-1 text-xs capitalize text-white/46">
          {source.distance} / {source.trackCondition}
        </p>
      ) : null}
      <div className="mt-2 space-y-1">
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between gap-5 text-sm">
            <span className="text-white/58">{entry.name}</span>
            <span className="font-bold text-white">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardCharts({ factionData, raceTrendData }: DashboardChartsProps) {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <ChartCard
        description="Win and podium conversion by faction, calculated from indexed race placements."
        mechanic="faction"
        title="Faction Performance Chart"
      >
        <div className="h-[320px]">
          <ResponsiveContainer height="100%" width="100%">
            <BarChart data={factionData} margin={{ bottom: 4, left: -20, right: 10, top: 10 }}>
              <defs>
                <linearGradient id="winRateGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#20F7FF" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#A855F7" stopOpacity={0.55} />
                </linearGradient>
                <linearGradient id="podiumRateGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#FF8A1F" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#32FF9D" stopOpacity={0.45} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis
                axisLine={false}
                dataKey="faction"
                tick={{ fill: "rgba(255,255,255,0.55)", fontSize: 12 }}
                tickLine={false}
              />
              <YAxis
                axisLine={false}
                tick={{ fill: "rgba(255,255,255,0.42)", fontSize: 12 }}
                tickLine={false}
              />
              <Tooltip content={<DashboardTooltip />} cursor={{ fill: "rgba(32,247,255,0.06)" }} />
              <Bar
                animationDuration={900}
                dataKey="winRate"
                fill="url(#winRateGradient)"
                name="Win rate"
                radius={[7, 7, 0, 0]}
              />
              <Bar
                animationDuration={1100}
                dataKey="podiumRate"
                fill="url(#podiumRateGradient)"
                name="Podium rate"
                radius={[7, 7, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard
        description="Condition volatility rises when hot or cold track states and item pressure stack together."
        mechanic="trackCondition"
        title="Race Condition Trend"
      >
        <div className="h-[320px]">
          <ResponsiveContainer height="100%" width="100%">
            <AreaChart data={raceTrendData} margin={{ bottom: 4, left: -20, right: 10, top: 10 }}>
              <defs>
                <linearGradient id="conditionScoreGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#20F7FF" stopOpacity={0.55} />
                  <stop offset="55%" stopColor="#A855F7" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="#20F7FF" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis
                axisLine={false}
                dataKey="raceLabel"
                tick={{ fill: "rgba(255,255,255,0.48)", fontSize: 12 }}
                tickLine={false}
              />
              <YAxis
                axisLine={false}
                domain={[0, 100]}
                tick={{ fill: "rgba(255,255,255,0.42)", fontSize: 12 }}
                tickLine={false}
              />
              <Tooltip content={<DashboardTooltip />} />
              <Area
                animationDuration={1100}
                dataKey="conditionScore"
                fill="url(#conditionScoreGradient)"
                name="Condition score"
                stroke="#20F7FF"
                strokeWidth={3}
                type="monotone"
              />
              <Area
                animationDuration={1300}
                dataKey="itemPressure"
                fill="transparent"
                name="Item pressure"
                stroke="#FF8A1F"
                strokeDasharray="4 5"
                strokeWidth={2}
                type="monotone"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
}
