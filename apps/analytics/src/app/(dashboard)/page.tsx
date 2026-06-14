import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowRight,
  Calendar,
  CalendarDays,
  CalendarRange,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { DataSyncPanel } from "@/components/dashboard/DataSyncPanel";
import { ReportStats } from "@/components/dashboard/ReportStats";
import { AudienceGrowthChart } from "@/components/dashboard/AudienceGrowthChart";
import { SpendPerformanceChart } from "@/components/dashboard/SpendPerformanceChart";
import { PostPreview } from "@/components/dashboard/PostPreview";
import {
  buildReportSummary,
  getAllPosts,
  getAudienceGrowth,
  getBrand,
  getMultiChannelPosts,
} from "@/lib/data";
import { getMonthPosts } from "@/lib/narrative/aggregate";
import { rankByEngagement } from "@/lib/metrics";
import { BrandSignalAnimated } from "@/components/brand/BrandSignalAnimated";
import { PLATFORM_NAME, PLATFORM_TAGLINE } from "@/lib/company";

const reports = [
  {
    href: "/reports/weekly",
    title: "Weekly Report",
    description:
      "Rolling 7-day view with full creative previews for every post. Built for real-time community management.",
    icon: Calendar,
    color: "border-brand-indigo/20 bg-brand-indigo/5",
    iconColor: "text-brand-indigo",
  },
  {
    href: "/reports/monthly",
    title: "Monthly Report",
    description:
      "Full-month performance with category rankings, competitor benchmarking, and paid amplification recommendations.",
    icon: CalendarDays,
    color: "border-emerald-200 bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    href: "/reports/quarterly",
    title: "Quarterly One-Pager",
    description:
      "Executive summary for C-suite and board review — trends, ROI leaders, and strategic recommendations.",
    icon: CalendarRange,
    color: "border-amber-200 bg-amber-50",
    iconColor: "text-amber-600",
  },
];

export default async function HomePage() {
  const brand = await getBrand();
  const { meta, channelSources } = await getMultiChannelPosts();
  const allPosts = await getAllPosts();
  const currentMonth = getMonthPosts(allPosts, 0);
  const monthlyPosts = currentMonth.posts;
  const audienceGrowth = await getAudienceGrowth();
  const summary = {
    ...buildReportSummary(monthlyPosts),
    audienceGrowth:
      audienceGrowth.length >= 2
        ? audienceGrowth[audienceGrowth.length - 1].followers -
          audienceGrowth[audienceGrowth.length - 2].followers
        : 0,
  };
  const topPosts = rankByEngagement(monthlyPosts).slice(0, 3);

  return (
    <>
      <Header
        title={PLATFORM_TAGLINE}
        subtitle={`${brand.name} · ${format(new Date(), "MMMM yyyy")}`}
      />

      <div className="space-y-8 p-8">
        <section className="overflow-hidden rounded-xl border border-brand-ink/10 bg-brand-stage p-6 shadow-sm">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl shrink-0">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand-muted">
                {PLATFORM_NAME}
              </p>
              <h2 className="mt-2 text-xl font-semibold text-brand-off-white">
                {PLATFORM_TAGLINE}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-brand-muted">
                Unified reporting, intelligence, and orchestration across every
                channel you manage.
              </p>
            </div>
            <BrandSignalAnimated className="h-28 w-full min-w-0 flex-1 lg:ml-8 lg:h-36 lg:max-w-3xl lg:flex-none" />
          </div>
        </section>

        <DataSyncPanel
          initialMeta={meta ?? null}
          channelSources={channelSources}
        />

        <section>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Report Timeframes
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {reports.map(
              ({ href, title, description, icon: Icon, color, iconColor }) => (
                <Link
                  key={href}
                  href={href}
                  className={`group rounded-xl border p-6 transition hover:shadow-md ${color}`}
                >
                  <Icon className={`mb-3 h-6 w-6 ${iconColor}`} />
                  <h3 className="font-semibold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-indigo transition-all group-hover:gap-2">
                    View report
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              )
            )}
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Monthly Snapshot
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {currentMonth.label} · {currentMonth.dateRange}
            </p>
          </div>
          <ReportStats summary={summary} />
        </section>

        <section>
          <AudienceGrowthChart
            data={audienceGrowth}
            expanded
            showYearOverYear
          />
        </section>

        <section>
          <SpendPerformanceChart posts={monthlyPosts} />
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Top Performing Posts
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Highest engagement in the last month · {currentMonth.label} ·{" "}
              {currentMonth.dateRange}
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {topPosts.map((post) => (
              <PostPreview key={post.id} post={post} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
