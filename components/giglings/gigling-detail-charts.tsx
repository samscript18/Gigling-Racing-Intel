"use client";

import {
  Bar,
  BarChart,
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
            <span className="text-white/58">{entry.name}</span>
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
              <PolarGrid gridType="polygon" stroke="rgba(255,255,255,0.12)" />
              <PolarAngleAxis
                dataKey="stat"
                tick={{ fill: "rgba(255,255,255,0.62)", fontSize: 11 }}
              />
              <Tooltip content={<DetailTooltip />} />
              <Radar
                animationDuration={1000}
                dataKey="value"
                fill="#20F7FF"
                fillOpacity={0.24}
                name="Stat"
                stroke="#20F7FF"
                strokeWidth={2}
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
                  animationDuration={900}
                  dataKey="winRate"
                  fill="#20F7FF"
                  name="Win rate"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  animationDuration={1050}
                  dataKey="podiumRate"
                  fill="#FF8A1F"
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
                  animationDuration={900}
                  dataKey="podiumRate"
                  fill="#A855F7"
                  name="Podium rate"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  animationDuration={1050}
                  dataKey="winRate"
                  fill="#32FF9D"
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
