"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AudienceSnapshot } from "@/lib/types";
import { format } from "date-fns";

interface AudienceGrowthChartProps {
  data: AudienceSnapshot[];
}

export function AudienceGrowthChart({ data }: AudienceGrowthChartProps) {
  const chartData = data.map((d) => ({
    month: format(new Date(d.date), "MMM"),
    followers: d.followers,
    growth: d.growth,
  }));

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">
        Audience Growth
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        Follower count over the past 12 months
      </p>

      <div className="mt-6 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="followerGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                fontSize: "13px",
              }}
              formatter={(value) => [
                Number(value).toLocaleString(),
                "Followers",
              ]}
            />
            <Area
              type="monotone"
              dataKey="followers"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#followerGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
