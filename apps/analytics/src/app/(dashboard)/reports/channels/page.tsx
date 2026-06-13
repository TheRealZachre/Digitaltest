import { format } from "date-fns";
import { Header } from "@/components/layout/Header";
import { ChannelSubnav } from "@/components/analytics/ChannelSubnav";
import { ChannelComparisonChart } from "@/components/analytics/ChannelComparisonChart";
import { ChannelOverviewGrid } from "@/components/analytics/ChannelOverviewGrid";
import { ChannelStatsRow } from "@/components/analytics/ChannelStatsRow";
import { DataSyncPanel } from "@/components/dashboard/DataSyncPanel";
import { ReportPostsGrid } from "@/components/dashboard/ReportPostsGrid";
import { buildCrossChannelTotals } from "@/lib/analytics/summaries";
import { formatChannelList } from "@/lib/analytics/channel-selection";
import {
  getBrand,
  getChannelSummaries,
  getAllPosts,
} from "@/lib/data";
import type { ChannelSummary } from "@/lib/types";

function crossChannelAsSummary(
  totals: ReturnType<typeof buildCrossChannelTotals>
): ChannelSummary {
  return {
    platform: "linkedin",
    label: totals.label,
    handle: totals.handle,
    followers: totals.followers,
    followerGrowth: totals.followerGrowth,
    postCount: totals.postCount,
    avgEngagementRate: totals.avgEngagementRate,
    avgCTR: totals.avgCTR,
    totalReach: totals.totalReach,
    totalImpressions: totals.totalImpressions,
    totalSpend: totals.totalSpend,
    dataSource: "live",
  };
}

export default async function AllChannelsPage() {
  const brand = await getBrand();
  const { channels, channelSources, meta, selectedChannels } =
    await getChannelSummaries();
  const posts = await getAllPosts();
  const liveChannelCount = channels.filter((c) => c.dataSource === "live").length;
  const totals = buildCrossChannelTotals(channels);

  return (
    <>
      <Header
        title="All Channels"
        subtitle={`${brand.name} · ${format(new Date(), "MMMM yyyy")} · Cross-platform social performance`}
      />
      <ChannelSubnav />

      <div className="space-y-8 p-8">
        <DataSyncPanel
          initialMeta={meta ?? null}
          channelSources={channelSources}
        />

        <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Full social picture
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
            Unified view across {formatChannelList(selectedChannels)}.
            {liveChannelCount === channels.length
              ? " All selected channels are connected via live Apify sync."
              : ` ${liveChannelCount} of ${channels.length} selected channels are live — use Pull Latest Data to refresh.`}
          </p>
        </section>

        <ChannelStatsRow channel={crossChannelAsSummary(totals)} />

        <ChannelComparisonChart channels={channels} />

        <section>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Channel breakdown
          </h2>
          <ChannelOverviewGrid channels={channels} />
        </section>

        <ReportPostsGrid
          posts={posts}
          title="Posts across all channels"
          emptyMessage="No posts loaded yet. Pull latest data to refresh."
          defaultSort="date-desc"
        />
      </div>
    </>
  );
}
