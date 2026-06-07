import { format, subDays } from "date-fns";
import { Header } from "@/components/layout/Header";
import { DataSyncPanel } from "@/components/dashboard/DataSyncPanel";
import { ReportDataBanner } from "@/components/dashboard/ReportDataBanner";
import { ExportButtons } from "@/components/dashboard/ExportButtons";
import { ReportStats } from "@/components/dashboard/ReportStats";
import { PostPreview } from "@/components/dashboard/PostPreview";
import { NarrativeSection } from "@/components/narrative/NarrativeSection";
import { WeeklyPerformancePanel } from "@/components/narrative/WeeklyPerformancePanel";
import { groupByWeek } from "@/lib/narrative/aggregate";
import { getSelectedAnalyticsChannels } from "@/lib/analytics/channel-selection.server";
import {
  buildReportSummary,
  getAllPosts,
  getBrand,
  getMultiChannelPosts,
  getPostsForTimeframe,
} from "@/lib/data";

export default async function WeeklyReportPage() {
  const [{ meta, channelSources }, selectedChannels] = await Promise.all([
    getMultiChannelPosts(),
    getSelectedAnalyticsChannels(),
  ]);
  const brand = await getBrand();
  const allPosts = await getAllPosts();
  const posts = await getPostsForTimeframe("weekly");
  const summary = buildReportSummary(posts);
  const start = subDays(new Date(), 7);

  const priorWeekPosts = allPosts.filter((p) => {
    const d = new Date(p.publishedAt);
    return d >= subDays(new Date(), 14) && d < start;
  });

  const currentWeeks = groupByWeek(posts);
  const priorWeeks = groupByWeek(priorWeekPosts);
  const comparisonPosts = [...posts, ...priorWeekPosts];

  return (
    <>
      <Header
        title="Weekly Report"
        subtitle={`${brand.name} · ${format(start, "MMM d")} – ${format(new Date(), "MMM d, yyyy")} · Rolling 7-day view`}
        actions={
          <ExportButtons
            posts={comparisonPosts}
            reportTitle="Weekly Social Media Report"
            filenameBase="weekly-report"
          />
        }
      />

      <div className="space-y-8 p-8" id="report-content">
        <DataSyncPanel
          initialMeta={meta ?? null}
          channelSources={channelSources}
        />

        <ReportDataBanner
          timeframe="Weekly"
          postCount={posts.length}
          companyName={brand.name}
          provider={meta?.channels?.linkedin?.provider}
          selectedChannels={selectedChannels}
        />

        <WeeklyPerformancePanel
          weeks={currentWeeks}
          title="This week's performance"
        />

        {priorWeeks.length > 0 && (
          <WeeklyPerformancePanel
            weeks={priorWeeks}
            title="Prior week comparison"
          />
        )}

        <NarrativeSection
          posts={comparisonPosts}
          maxDays={14}
          arcTitle={`${brand.name} narrative arc — this week vs prior week`}
          subtitle="Rolling two-week view. Hover any node to see the post, story beat, and engagement score."
        />

        <ReportStats summary={summary} />

        <section>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            This week&apos;s posts ({posts.length})
          </h2>
          {posts.length === 0 ? (
            <p className="text-sm text-slate-500">
              No posts in the last 7 days. Pull latest data to refresh.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {posts.map((post) => (
                <PostPreview key={post.id} post={post} />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
