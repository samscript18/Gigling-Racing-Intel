"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { ChartCard } from "@/components/shared/chart-card";

type FactionMetaDatum = {
  faction: string;
  winRate: number;
  podiumRate: number;
  races: number;
};

type RarityMetaDatum = {
  rarity: string;
  races: number;
  winRate: number;
  podiumRate: number;
  averageScore: number;
};

type WeatherMetaDatum = {
  weather: string;
  races: number;
  averageScore: number;
  itemPressure: number;
  volatility: number;
};

type DistanceMetaDatum = {
  distance: string;
  races: number;
  averageScore: number;
  averagePrize: number;
  winnerScore: number;
};

type TrackMetaDatum = {
  trackCondition: string;
  races: number;
  podiumScores: number;
  upsetRate: number;
  technicalLoad: number;
};

type MetaChartsProps = {
  factionData: FactionMetaDatum[];
  rarityData: RarityMetaDatum[];
  weatherData: WeatherMetaDatum[];
  distanceData: DistanceMetaDatum[];
  trackData: TrackMetaDatum[];
};

type TooltipPayload = {
  name: string;
  value: number | string;
  color?: string;
};

type MetaTooltipProps = {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
};

function MetaTooltip({ active, payload, label }: MetaTooltipProps) {
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

const axisTick = { fill: "rgba(255,255,255,0.52)", fontSize: 12 };
const yAxisTick = { fill: "rgba(255,255,255,0.42)", fontSize: 12 };

export function MetaCharts({
  factionData,
  rarityData,
  weatherData,
  distanceData,
  trackData
}: MetaChartsProps) {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <ChartCard
        description="Win and podium conversion by faction, calculated from completed race placements."
        title="Faction Win-Rate Chart"
      >
        <div className="h-[300px]">
          <ResponsiveContainer height="100%" width="100%">
            <BarChart data={factionData} margin={{ left: -22, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="metaFactionWin" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#20F7FF" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#A855F7" stopOpacity={0.5} />
                </linearGradient>
                <linearGradient id="metaFactionPodium" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#FF8A1F" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#32FF9D" stopOpacity={0.45} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis axisLine={false} dataKey="faction" tick={axisTick} tickLine={false} />
              <YAxis axisLine={false} tick={yAxisTick} tickLine={false} />
              <Tooltip content={<MetaTooltip />} cursor={{ fill: "rgba(32,247,255,0.06)" }} />
              <Bar dataKey="winRate" fill="url(#metaFactionWin)" name="Win rate" radius={[7, 7, 0, 0]} />
              <Bar dataKey="podiumRate" fill="url(#metaFactionPodium)" name="Podium rate" radius={[7, 7, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard
        description="Rarity performance reveals whether scarce Giglings are actually converting."
        title="Rarity Performance Chart"
      >
        <div className="h-[300px]">
          <ResponsiveContainer height="100%" width="100%">
            <BarChart data={rarityData} margin={{ left: -22, right: 8, top: 8 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis axisLine={false} dataKey="rarity" tick={axisTick} tickLine={false} />
              <YAxis axisLine={false} tick={yAxisTick} tickLine={false} />
              <Tooltip content={<MetaTooltip />} cursor={{ fill: "rgba(168,85,247,0.06)" }} />
              <Bar dataKey="podiumRate" fill="#A855F7" name="Podium rate" radius={[7, 7, 0, 0]} />
              <Bar dataKey="averageScore" fill="#20F7FF" name="Avg score" radius={[7, 7, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard
        description="Weather volatility combines harsh weather weight and observed item pressure."
        title="Weather Impact Chart"
      >
        <div className="h-[300px]">
          <ResponsiveContainer height="100%" width="100%">
            <AreaChart data={weatherData} margin={{ left: -22, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="metaWeatherVolatility" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#FF8A1F" stopOpacity={0.48} />
                  <stop offset="100%" stopColor="#FF8A1F" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis axisLine={false} dataKey="weather" tick={axisTick} tickLine={false} />
              <YAxis axisLine={false} tick={yAxisTick} tickLine={false} />
              <Tooltip content={<MetaTooltip />} />
              <Area
                dataKey="volatility"
                fill="url(#metaWeatherVolatility)"
                name="Volatility"
                stroke="#FF8A1F"
                strokeWidth={3}
                type="monotone"
              />
              <Line
                dataKey="averageScore"
                dot={{ r: 3 }}
                name="Avg score"
                stroke="#20F7FF"
                strokeWidth={2}
                type="monotone"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard
        description="Distance impact compares winning performance with prize pressure by race length."
        title="Distance Impact Chart"
      >
        <div className="h-[300px]">
          <ResponsiveContainer height="100%" width="100%">
            <LineChart data={distanceData} margin={{ left: -22, right: 8, top: 8 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis axisLine={false} dataKey="distance" tick={axisTick} tickLine={false} />
              <YAxis axisLine={false} tick={yAxisTick} tickLine={false} />
              <Tooltip content={<MetaTooltip />} />
              <Line
                dataKey="winnerScore"
                dot={{ fill: "#32FF9D", r: 4 }}
                name="Winner score"
                stroke="#32FF9D"
                strokeWidth={3}
                type="monotone"
              />
              <Line
                dataKey="averageScore"
                dot={{ fill: "#A855F7", r: 4 }}
                name="Avg score"
                stroke="#A855F7"
                strokeWidth={3}
                type="monotone"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard
        className="xl:col-span-2"
        description="Track condition trends show technical pressure and upset rates for route planning."
        title="Track Condition Trends"
      >
        <div className="h-[320px]">
          <ResponsiveContainer height="100%" width="100%">
            <BarChart data={trackData} margin={{ left: -22, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="metaTrackLoad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#20F7FF" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#20F7FF" stopOpacity={0.35} />
                </linearGradient>
                <linearGradient id="metaTrackUpset" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#FF8A1F" stopOpacity={0.92} />
                  <stop offset="100%" stopColor="#A855F7" stopOpacity={0.42} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis axisLine={false} dataKey="trackCondition" tick={axisTick} tickLine={false} />
              <YAxis axisLine={false} tick={yAxisTick} tickLine={false} />
              <Tooltip content={<MetaTooltip />} cursor={{ fill: "rgba(255,138,31,0.06)" }} />
              <Bar dataKey="technicalLoad" fill="url(#metaTrackLoad)" name="Technical load" radius={[7, 7, 0, 0]} />
              <Bar dataKey="upsetRate" fill="url(#metaTrackUpset)" name="Upset rate" radius={[7, 7, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
}
