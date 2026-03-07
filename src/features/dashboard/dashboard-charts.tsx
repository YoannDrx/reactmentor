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
  YAxis,
} from "recharts";

const tooltipStyle = {
  borderRadius: 18,
  border: "1px solid rgba(15, 23, 32, 0.08)",
  backgroundColor: "rgba(255,255,255,0.96)",
  boxShadow: "0 22px 60px -28px rgba(15,23,32,0.35)",
};

export function WeeklyMomentumChart({
  data,
}: {
  data: Array<{ day: string; score: number }>;
}) {

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="momentumFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.04} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(15,23,32,0.08)" strokeDasharray="4 4" />
        <XAxis
          axisLine={false}
          dataKey="day"
          tickLine={false}
          tick={{ fill: "#64748b", fontSize: 12 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#64748b", fontSize: 12 }}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          cursor={{ stroke: "rgba(14,165,233,0.25)", strokeWidth: 2 }}
        />
        <Area
          dataKey="score"
          stroke="#0ea5e9"
          strokeWidth={3}
          fill="url(#momentumFill)"
          type="monotone"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function SkillRadarChart({
  data,
}: {
  data: Array<{ skill: string; score: number }>;
}) {

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 0, right: 12, left: 8, bottom: 0 }}
      >
        <CartesianGrid stroke="rgba(15,23,32,0.08)" strokeDasharray="4 4" />
        <XAxis
          type="number"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#64748b", fontSize: 12 }}
        />
        <YAxis
          dataKey="skill"
          type="category"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#475569", fontSize: 12 }}
          width={90}
        />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="score" fill="#0ea5e9" radius={[0, 10, 10, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function MasteryBreakdownChart({
  data,
}: {
  data: Array<{ band: string; value: number }>;
}) {

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid stroke="rgba(15,23,32,0.08)" strokeDasharray="4 4" />
        <XAxis
          dataKey="band"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#64748b", fontSize: 12 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#64748b", fontSize: 12 }}
        />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar
          dataKey="value"
          fill="#22c55e"
          radius={[12, 12, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
