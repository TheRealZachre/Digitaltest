import { rankByEngagement } from "@/lib/metrics";
import type { SocialPost } from "@/lib/types";

export type DeepDivePerformance = "top" | "under" | null;

export function postHeadline(caption: string): string {
  const trimmed = caption.trim();
  if (!trimmed) return "Untitled post";

  const firstLine = trimmed.split(/\n/)[0]?.trim() ?? trimmed;
  const sentenceEnd = firstLine.search(/[.!?](?:\s|$)/);
  if (sentenceEnd > 0 && sentenceEnd <= 120) {
    return firstLine.slice(0, sentenceEnd + 1);
  }

  if (firstLine.length <= 100) return firstLine;
  return `${firstLine.slice(0, 97).trimEnd()}…`;
}

export function postSnippet(caption: string, headline: string): string {
  const trimmed = caption.trim();
  if (!trimmed) return "";
  if (trimmed === headline) return trimmed;
  if (trimmed.startsWith(headline)) {
    const rest = trimmed.slice(headline.length).trim();
    return rest || trimmed;
  }
  return trimmed.length > 220 ? `${trimmed.slice(0, 217).trimEnd()}…` : trimmed;
}

export function deepDivePerformance(
  post: SocialPost,
  rankedPosts: SocialPost[]
): DeepDivePerformance {
  const index = rankedPosts.findIndex((item) => item.id === post.id);
  if (index < 0 || rankedPosts.length < 4) return null;
  if (index <= 1) return "top";
  if (index >= rankedPosts.length - 2) return "under";
  return null;
}

export function selectDeepDivePosts(
  posts: SocialPost[],
  max = 6
): SocialPost[] {
  if (posts.length === 0) return [];

  const ranked = rankByEngagement(posts);
  const selected: SocialPost[] = [];
  const seen = new Set<string>();

  const add = (post?: SocialPost) => {
    if (!post || seen.has(post.id) || selected.length >= max) return;
    seen.add(post.id);
    selected.push(post);
  };

  add(ranked[0]);
  add(ranked[1]);
  add(ranked[ranked.length - 1]);

  const midIndices = [
    Math.floor(ranked.length * 0.25),
    Math.floor(ranked.length * 0.5),
    Math.floor(ranked.length * 0.75),
  ];

  for (const index of midIndices) {
    add(ranked[index]);
  }

  for (const post of ranked) {
    add(post);
  }

  return selected.slice(0, max);
}
