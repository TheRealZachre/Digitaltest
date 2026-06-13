import { Eye, Heart, MousePointerClick, TrendingUp, Users } from "lucide-react";
import type { ChannelSummary } from "@/lib/types";
import { formatNumber, formatPercent } from "@/lib/metrics";
import { metricDefinition } from "@/lib/metric-definitions";
import { StatCard } from "@/components/dashboard/StatCard";

interface ChannelStatsRowProps {
  channel: ChannelSummary;
}

export function ChannelStatsRow({ channel }: ChannelStatsRowProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <StatCard
        label="Followers"
        value={formatNumber(channel.followers)}
        change={`+${formatNumber(channel.followerGrowth)} this month`}
        positive
        icon={Users}
        accent="indigo"
        definition={metricDefinition("followers")}
      />
      <StatCard
        label="Posts"
        value={String(channel.postCount)}
        icon={TrendingUp}
        accent="indigo"
        definition={metricDefinition("postCount")}
      />
      <StatCard
        label="Avg. Engagement"
        value={formatPercent(channel.avgEngagementRate)}
        definition={metricDefinition("avgEngagement")}
        icon={Heart}
        accent="rose"
      />
      <StatCard
        label="Avg. CTR"
        value={formatPercent(channel.avgCTR)}
        definition={metricDefinition("avgCTR")}
        icon={MousePointerClick}
        accent="emerald"
      />
      <StatCard
        label="Total Reach"
        value={formatNumber(channel.totalReach)}
        definition={metricDefinition("totalReach")}
        icon={Users}
        accent="emerald"
      />
      <StatCard
        label="Impressions"
        value={formatNumber(channel.totalImpressions)}
        definition={metricDefinition("impressions")}
        icon={Eye}
        accent="amber"
      />
    </div>
  );
}
