"use client";

import Image from "next/image";
import { useState } from "react";
import { PostInsightsAnalysis } from "@/components/dashboard/PostInsightsAnalysis";
import { StoryBeatBadge } from "@/components/narrative/StoryBeatBadge";
import { getPostImageSrc } from "@/lib/social/image-url";
import type { SocialPost } from "@/lib/types";
import {
  clickThroughRate,
  engagementRate,
  formatNumber,
  formatPercent,
} from "@/lib/metrics";
import { Heart, ImageIcon, MessageCircle, MousePointerClick, Share2 } from "lucide-react";
import clsx from "clsx";

interface PostPreviewProps {
  post: SocialPost;
  showBudget?: boolean;
  compact?: boolean;
}

const platformColors: Record<string, string> = {
  instagram: "bg-gradient-to-r from-purple-500 to-pink-500",
  facebook: "bg-blue-600",
  tiktok: "bg-slate-900",
  linkedin: "bg-blue-700",
  x: "bg-slate-800",
  youtube: "bg-red-600",
};

export function PostPreview({
  post,
  showBudget = false,
  compact = false,
}: PostPreviewProps) {
  const [imageError, setImageError] = useState(false);
  const er = engagementRate(post.metrics);
  const ctr = clickThroughRate(post.metrics);
  const imageSrc = getPostImageSrc(post.imageUrl, post.platform);
  const showImage = imageSrc && !imageError;

  return (
    <article
      className={clsx(
        "overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm",
        compact ? "" : "flex flex-col"
      )}
    >
      <div
        className={clsx(
          "relative bg-slate-100",
          compact ? "aspect-square" : "h-56"
        )}
      >
        {showImage ? (
          <Image
            src={imageSrc}
            alt="Post creative"
            fill
            unoptimized
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 300px"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
            <ImageIcon className="h-10 w-10" />
            <span className="text-xs">Preview unavailable</span>
          </div>
        )}
        <div className="absolute left-3 top-3 flex gap-2">
          <span
            className={clsx(
              "rounded-full px-2.5 py-1 text-xs font-semibold capitalize text-white",
              platformColors[post.platform]
            )}
          >
            {post.platform}
          </span>
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium capitalize text-slate-700">
            {post.type}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <StoryBeatBadge beat={post.storyBeat} />
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium capitalize text-slate-600">
              {post.category}
            </span>
          </div>
          <time className="text-xs text-slate-400">
            {new Date(post.publishedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </time>
        </div>

        <div className="mb-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
          <p className="line-clamp-3 text-sm leading-relaxed text-slate-700">
            {post.caption}
          </p>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2 text-xs">
          <Metric icon={Heart} label="Eng. Rate" value={formatPercent(er)} />
          <Metric icon={MousePointerClick} label="CTR" value={formatPercent(ctr)} />
          <Metric
            icon={MessageCircle}
            label="Reach"
            value={formatNumber(post.metrics.reach)}
          />
          <Metric
            icon={Share2}
            label="Impressions"
            value={formatNumber(post.metrics.impressions)}
          />
        </div>

        {post.insights && (
          <div className="mt-4 border-t border-[#e6e6e6] pt-4">
            <PostInsightsAnalysis
              insights={post.insights}
              layout={compact ? "stack" : "grid"}
            />
          </div>
        )}

        {showBudget && post.metrics.spend && (
          <p className="mt-3 text-xs text-slate-500">
            Spend: ${post.metrics.spend.toLocaleString()}
          </p>
        )}
      </div>
    </article>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-1.5 text-slate-600">
      <Icon className="h-3.5 w-3.5 text-slate-400" />
      <span className="text-slate-400">{label}</span>
      <span className="ml-auto font-semibold text-slate-800">{value}</span>
    </div>
  );
}

