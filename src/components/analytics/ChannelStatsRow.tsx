import { Eye, Heart, TrendingUp, Users } from "lucide-react";
import type { ChannelSummary } from "@/lib/types";
import { formatNumber, formatPercent } from "@/lib/metrics";
import { StatCard } from "@/components/dashboard/StatCard";

interface ChannelStatsRowProps {
  channel: ChannelSummary;
}

export function ChannelStatsRow({ channel }: ChannelStatsRowProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
      <StatCard
        label="Followers"
        value={formatNumber(channel.followers)}
        change={`+${formatNumber(channel.followerGrowth)} this month`}
        positive
        icon={Users}
        accent="indigo"
      />
      <StatCard
        label="Posts"
        value={String(channel.postCount)}
        icon={TrendingUp}
        accent="indigo"
      />
      <StatCard
        label="Avg. Engagement"
        value={formatPercent(channel.avgEngagementRate)}
        icon={Heart}
        accent="rose"
      />
      <StatCard
        label="Total Reach"
        value={formatNumber(channel.totalReach)}
        icon={Users}
        accent="emerald"
      />
      <StatCard
        label="Impressions"
        value={formatNumber(channel.totalImpressions)}
        icon={Eye}
        accent="amber"
      />
    </div>
  );
}
