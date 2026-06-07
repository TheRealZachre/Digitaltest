import type { BeatPerformance } from "./narrative/types";
import type {
  BudgetRecommendation,
  CategoryPerformance,
  PostMetrics,
  SocialPost,
} from "./types";

export function engagementRate(metrics: PostMetrics): number {
  if (metrics.reach === 0) return 0;
  const engagements =
    metrics.likes + metrics.comments + metrics.shares + metrics.saves;
  return (engagements / metrics.reach) * 100;
}

export function clickThroughRate(metrics: PostMetrics): number {
  if (metrics.impressions === 0) return 0;
  return (metrics.clicks / metrics.impressions) * 100;
}

export function costPerEngagement(metrics: PostMetrics): number | null {
  if (!metrics.spend || metrics.spend === 0) return null;
  const engagements =
    metrics.likes + metrics.comments + metrics.shares + metrics.saves;
  if (engagements === 0) return null;
  return metrics.spend / engagements;
}

export function rankByEngagement(posts: SocialPost[]): SocialPost[] {
  return [...posts].sort(
    (a, b) => engagementRate(b.metrics) - engagementRate(a.metrics)
  );
}

export function beatPerformance(posts: SocialPost[]): BeatPerformance[] {
  const map = new Map<
    string,
    { posts: SocialPost[]; reach: number; impressions: number }
  >();

  for (const post of posts) {
    const existing = map.get(post.storyBeat) ?? {
      posts: [],
      reach: 0,
      impressions: 0,
    };
    existing.posts.push(post);
    existing.reach += post.metrics.reach;
    existing.impressions += post.metrics.impressions;
    map.set(post.storyBeat, existing);
  }

  return Array.from(map.entries())
    .map(([beat, data]) => ({
      beat: beat as BeatPerformance["beat"],
      postCount: data.posts.length,
      avgEngagementRate:
        data.posts.reduce((sum, p) => sum + engagementRate(p.metrics), 0) /
        data.posts.length,
      totalReach: data.reach,
      totalImpressions: data.impressions,
    }))
    .sort((a, b) => b.avgEngagementRate - a.avgEngagementRate);
}

export function categoryPerformance(
  posts: SocialPost[]
): CategoryPerformance[] {
  const map = new Map<
    string,
    { posts: SocialPost[]; reach: number; impressions: number }
  >();

  for (const post of posts) {
    const existing = map.get(post.category) ?? {
      posts: [],
      reach: 0,
      impressions: 0,
    };
    existing.posts.push(post);
    existing.reach += post.metrics.reach;
    existing.impressions += post.metrics.impressions;
    map.set(post.category, existing);
  }

  return Array.from(map.entries())
    .map(([category, data]) => ({
      category: category as CategoryPerformance["category"],
      postCount: data.posts.length,
      avgEngagementRate:
        data.posts.reduce((sum, p) => sum + engagementRate(p.metrics), 0) /
        data.posts.length,
      totalReach: data.reach,
      totalImpressions: data.impressions,
    }))
    .sort((a, b) => b.avgEngagementRate - a.avgEngagementRate);
}

const AMPLIFICATION_THRESHOLD = 3.5;
const BASE_BUDGET = 150;
const BUDGET_MULTIPLIER = 45;

export function budgetRecommendation(post: SocialPost): BudgetRecommendation {
  const rate = engagementRate(post.metrics);
  const eligible =
    post.type === "organic" && rate >= AMPLIFICATION_THRESHOLD;

  if (!eligible) {
    return {
      postId: post.id,
      eligible: false,
      recommendedBudget: 0,
      projectedEngagementRate: rate,
      projectedReach: post.metrics.reach,
      rationale:
        rate < AMPLIFICATION_THRESHOLD
          ? "Engagement rate below amplification threshold (3.5%). Focus on organic optimization."
          : "Already running as paid content.",
    };
  }

  const recommendedBudget = Math.round(
    BASE_BUDGET + rate * BUDGET_MULTIPLIER
  );
  const projectedReach = Math.round(
    post.metrics.reach * (1 + recommendedBudget / 500)
  );
  const projectedEngagementRate = rate * (1 + recommendedBudget / 800);

  return {
    postId: post.id,
    eligible: true,
    recommendedBudget,
    projectedEngagementRate,
    projectedReach,
    rationale: `Strong organic performance (${rate.toFixed(1)}% ER). Projected ${projectedEngagementRate.toFixed(1)}% ER with $${recommendedBudget} boost.`,
  };
}

function formatPostDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function uniqueInsights(items: string[]): string[] {
  return [...new Set(items)];
}

export function whatWorkedAnalysis(posts: SocialPost[]): {
  worked: string[];
  didNot: string[];
} {
  const ranked = rankByEngagement(posts);
  const top = ranked.slice(0, 3);
  const bottom = ranked.slice(-3).reverse();
  const beats = beatPerformance(posts);

  const worked = uniqueInsights([
    ...top.map(
      (p) =>
        `${p.storyBeat} on ${p.platform} (${engagementRate(p.metrics).toFixed(1)}% ER) — ${formatPostDate(p.publishedAt)}`
    ),
    beats[0]
      ? `${beats[0].beat} was the top-performing story beat overall`
      : "",
  ].filter(Boolean));

  const didNot = uniqueInsights([
    ...bottom.map(
      (p) =>
        `${p.storyBeat} on ${p.platform} underperformed (${engagementRate(p.metrics).toFixed(1)}% ER) — ${formatPostDate(p.publishedAt)}`
    ),
    beats[beats.length - 1]
      ? `${beats[beats.length - 1].beat} had the lowest story beat engagement`
      : "",
  ].filter(Boolean));

  return { worked, didNot };
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

export function formatPercent(n: number, decimals = 1): string {
  return `${n.toFixed(decimals)}%`;
}

export function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}
