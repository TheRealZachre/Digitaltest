"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ChannelSummary } from "@/lib/types";
import { formatNumber } from "@/lib/metrics";
import { getChannelConfigByPlatform } from "@/lib/analytics/channels";

interface ChannelComparisonChartProps {
  channels: ChannelSummary[];
}

export function ChannelComparisonChart({
  channels,
}: ChannelComparisonChartProps) {
  const chartData = channels.map((channel) => ({
    name: channel.label,
    reach: channel.totalReach,
    impressions: channel.totalImpressions,
    posts: channel.postCount,
    color: getChannelConfigByPlatform(channel.platform)?.color ?? "#6366f1",
  }));

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">
        Cross-channel reach & impressions
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        Compare performance across all connected social platforms
      </p>

      <div className="mt-6 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => formatNumber(v)}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                fontSize: "13px",
              }}
              formatter={(value, name) => [
                formatNumber(Number(value)),
                name === "reach" ? "Reach" : "Impressions",
              ]}
            />
            <Legend />
            <Bar dataKey="reach" fill="#6366f1" name="Reach" radius={[4, 4, 0, 0]} />
            <Bar
              dataKey="impressions"
              fill="#a5b4fc"
              name="Impressions"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
