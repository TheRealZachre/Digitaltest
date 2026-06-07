import {
  DollarSign,
  Eye,
  Heart,
  MousePointerClick,
  TrendingUp,
  Users,
} from "lucide-react";
import type { ReportSummary } from "@/lib/types";
import {
  formatCurrency,
  formatNumber,
  formatPercent,
} from "@/lib/metrics";
import { StatCard } from "./StatCard";

interface ReportStatsProps {
  summary: ReportSummary;
}

export function ReportStats({ summary }: ReportStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <StatCard
        label="Total Posts"
        value={String(summary.totalPosts)}
        icon={TrendingUp}
        accent="indigo"
      />
      <StatCard
        label="Avg. Engagement Rate"
        value={formatPercent(summary.avgEngagementRate)}
        icon={Heart}
        accent="rose"
      />
      <StatCard
        label="Avg. CTR"
        value={formatPercent(summary.avgCTR)}
        icon={MousePointerClick}
        accent="emerald"
      />
      <StatCard
        label="Total Reach"
        value={formatNumber(summary.totalReach)}
        icon={Users}
        accent="indigo"
      />
      <StatCard
        label="Total Impressions"
        value={formatNumber(summary.totalImpressions)}
        icon={Eye}
        accent="amber"
      />
      <StatCard
        label="Total Spend"
        value={formatCurrency(summary.totalSpend)}
        change={`+${summary.audienceGrowth.toLocaleString()} followers`}
        positive
        icon={DollarSign}
        accent="emerald"
      />
    </div>
  );
}
