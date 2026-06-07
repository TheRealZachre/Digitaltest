import { engagementRate } from "@/lib/metrics";
import {
  ANALYTICS_CHANNEL_PLATFORMS,
  ANALYTICS_CHANNELS,
  getChannelConfigByPlatform,
} from "./channels";
import type { ChannelSummary, Platform, SocialPost } from "@/lib/types";

export function filterPostsByPlatform(
  posts: SocialPost[],
  platform: Platform
): SocialPost[] {
  return posts.filter((p) => p.platform === platform);
}

export function buildChannelSummary(
  platform: Platform,
  posts: SocialPost[],
  dataSource: "live" | "seed",
  followersOverride?: number
): ChannelSummary {
  const config = getChannelConfigByPlatform(platform);
  const platformPosts = filterPostsByPlatform(posts, platform);
  const paid = platformPosts.filter(
    (p) => p.type === "paid" || p.type === "boosted"
  );
  const avgEngagementRate =
    platformPosts.reduce((sum, p) => sum + engagementRate(p.metrics), 0) /
    (platformPosts.length || 1);

  const growthRates: Record<Platform, number> = {
    linkedin: 4200,
    instagram: 1800,
    facebook: 950,
    x: 620,
    youtube: 1100,
    tiktok: 0,
  };

  return {
    platform,
    label: config?.label ?? platform,
    handle: config?.handle ?? "",
    followers: followersOverride ?? config?.followers ?? 0,
    followerGrowth: growthRates[platform] ?? 0,
    postCount: platformPosts.length,
    avgEngagementRate: Math.round(avgEngagementRate * 10) / 10,
    totalReach: platformPosts.reduce((s, p) => s + p.metrics.reach, 0),
    totalImpressions: platformPosts.reduce(
      (s, p) => s + p.metrics.impressions,
      0
    ),
    totalSpend: paid.reduce((s, p) => s + (p.metrics.spend ?? 0), 0),
    dataSource,
  };
}

export function buildAllChannelSummaries(
  posts: SocialPost[],
  channelSources: Partial<Record<Platform, "live" | "seed">>,
  channelFollowers?: Partial<Record<Platform, number>>
): ChannelSummary[] {
  return ANALYTICS_CHANNEL_PLATFORMS.map((platform) =>
    buildChannelSummary(
      platform,
      posts,
      channelSources[platform] ?? "seed",
      channelFollowers?.[platform]
    )
  );
}

export function buildCrossChannelTotals(summaries: ChannelSummary[]) {
  const allChannel = ANALYTICS_CHANNELS[0];
  return {
    label: allChannel.label,
    handle: allChannel.handle,
    followers: summaries.reduce((s, c) => s + c.followers, 0),
    followerGrowth: summaries.reduce((s, c) => s + c.followerGrowth, 0),
    postCount: summaries.reduce((s, c) => s + c.postCount, 0),
    avgEngagementRate:
      Math.round(
        (summaries.reduce((s, c) => s + c.avgEngagementRate, 0) /
          (summaries.length || 1)) *
          10
      ) / 10,
    totalReach: summaries.reduce((s, c) => s + c.totalReach, 0),
    totalImpressions: summaries.reduce((s, c) => s + c.totalImpressions, 0),
    totalSpend: summaries.reduce((s, c) => s + c.totalSpend, 0),
    channelCount: summaries.length,
  };
}
