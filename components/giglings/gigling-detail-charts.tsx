"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { ChartCard } from "@/components/shared/chart-card";

type StatDatum = {
  stat: string;
  value: number;
};

type WeatherDatum = {
  label: string;
  races: number;
  winRate: number;
  podiumRate: number;
  averageScore: number;
};

type DistanceDatum = {
  label: string;
  races: number;
  winRate: number;
  podiumRate: number;
  averagePlacement: number;
};

type GiglingDetailChartsProps = {
  statData: StatDatum[];
  weatherData: WeatherDatum[];
  distanceData: DistanceDatum[];
};

type TooltipPayload = {
  name: string;
  value: number | string;
  color?: string;
};

type DetailTooltipProps = {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
};

function DetailTooltip({ active, payload, label }: DetailTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-lg border border-white/12 bg-[#07101d]/95 p-3 shadow-glow backdrop-blur-xl">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-racing">
        {label}
      </p>
      <div className="mt-2 space-y-1">
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between gap-5 text-sm">
            <span className="flex items-center gap-2 text-white/58">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: entry.color ?? "#20F7FF" }}
              />
              {entry.name}
            </span>
            <span className="font-bold text-white">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function GiglingDetailCharts({
  statData,
  weatherData,
  distanceData
}: GiglingDetailChartsProps) {
  return (
    <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <ChartCard
        description="Radar profile for speed, stamina, handling, acceleration, luck, and consistency."
        title="Stat Radar"
      >
        <div className="h-[330px]">
          <ResponsiveContainer height="100%" width="100%">
            <RadarChart data={statData} outerRadius="76%">
              <defs>
                <radialGradient id="giglingRadarFill" cx="50%" cy="50%" r="70%">
                  <stop offset="0%" stopColor="#20F7FF" stopOpacity={0.34} />
                  <stop offset="55%" stopColor="#A855F7" stopOpacity={0.22} />
                  <stop offset="100%" stopColor="#20F7FF" stopOpacity={0.05} />
                </radialGradient>
                <filter id="giglingRadarGlow">
                  <feGaussianBlur result="coloredBlur" stdDeviation="3" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <PolarGrid gridType="polygon" stroke="rgba(255,255,255,0.12)" />
              <PolarAngleAxis
                dataKey="stat"
                tick={{ fill: "rgba(255,255,255,0.62)", fontSize: 11 }}
              />
              <Tooltip content={<DetailTooltip />} />
              <Radar
                animationEasing="ease-out"
                animationDuration={1000}
                dataKey="value"
                fill="url(#giglingRadarFill)"
                fillOpacity={1}
                filter="url(#giglingRadarGlow)"
                name="Stat"
                stroke="#20F7FF"
                strokeWidth={3}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <div className="grid gap-5">
        <ChartCard
          description="Win and podium conversion by weather from indexed race history."
          title="Performance By Weather"
        >
          <div className="h-[230px]">
            <ResponsiveContainer height="100%" width="100%">
              <BarChart data={weatherData} margin={{ left: -24, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="giglingWeatherWin" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#20F7FF" stopOpacity={0.96} />
                    <stop offset="100%" stopColor="#A855F7" stopOpacity={0.48} />
                  </linearGradient>
                  <linearGradient id="giglingWeatherPodium" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#FF8A1F" stopOpacity={0.96} />
                    <stop offset="100%" stopColor="#32FF9D" stopOpacity={0.42} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis
                  axisLine={false}
                  dataKey="label"
                  tick={{ fill: "rgba(255,255,255,0.52)", fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis
                  axisLine={false}
                  tick={{ fill: "rgba(255,255,255,0.42)", fontSize: 12 }}
                  tickLine={false}
                />
                <Tooltip content={<DetailTooltip />} cursor={{ fill: "rgba(32,247,255,0.06)" }} />
                <Bar
                  animationEasing="ease-out"
                  animationDuration={900}
                  barSize={18}
                  dataKey="winRate"
                  fill="url(#giglingWeatherWin)"
                  name="Win rate"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  animationEasing="ease-out"
                  animationDuration={1050}
                  barSize={18}
                  dataKey="podiumRate"
                  fill="url(#giglingWeatherPodium)"
                  name="Podium rate"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          description="Distance fit, podium equity, and average placement by race length."
          title="Performance By Distance"
        >
          <div className="h-[230px]">
            <ResponsiveContainer height="100%" width="100%">
              <BarChart data={distanceData} margin={{ left: -24, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="giglingDistancePodium" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#A855F7" stopOpacity={0.96} />
                    <stop offset="100%" stopColor="#20F7FF" stopOpacity={0.46} />
                  </linearGradient>
                  <linearGradient id="giglingDistanceWin" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#32FF9D" stopOpacity={0.96} />
                    <stop offset="100%" stopColor="#FF8A1F" stopOpacity={0.42} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis
                  axisLine={false}
                  dataKey="label"
                  tick={{ fill: "rgba(255,255,255,0.52)", fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis
                  axisLine={false}
                  tick={{ fill: "rgba(255,255,255,0.42)", fontSize: 12 }}
                  tickLine={false}
                />
                <Tooltip content={<DetailTooltip />} cursor={{ fill: "rgba(255,138,31,0.06)" }} />
                <Bar
                  animationEasing="ease-out"
                  animationDuration={900}
                  barSize={18}
                  dataKey="podiumRate"
                  fill="url(#giglingDistancePodium)"
                  name="Podium rate"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  animationEasing="ease-out"
                  animationDuration={1050}
                  barSize={18}
                  dataKey="winRate"
                  fill="url(#giglingDistanceWin)"
                  name="Win rate"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
