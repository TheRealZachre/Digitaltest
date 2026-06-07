import { PostPreview } from "@/components/dashboard/PostPreview";
import type { MonthBucket } from "@/lib/narrative/types";

interface MonthComparisonPanelProps {
  current: MonthBucket;
  prior: MonthBucket;
}

export function MonthComparisonPanel({
  current,
  prior,
}: MonthComparisonPanelProps) {
  const scoreDelta =
    prior.avgEngagementScore > 0
      ? current.avgEngagementScore - prior.avgEngagementScore
      : 0;
  const positive = scoreDelta >= 0;

  return (
    <section className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
            Current month
          </p>
          <h3 className="mt-1 text-xl font-semibold text-slate-900">
            {current.label}
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            {current.postCount} posts · avg engagement score{" "}
            {current.avgEngagementScore}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Prior month
          </p>
          <h3 className="mt-1 text-xl font-semibold text-slate-900">
            {prior.label}
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            {prior.postCount} posts · avg engagement score{" "}
            {prior.avgEngagementScore}
          </p>
          {prior.postCount > 0 && current.postCount > 0 && (
            <p
              className={`mt-2 text-sm font-medium ${positive ? "text-emerald-600" : "text-rose-600"}`}
            >
              {positive ? "+" : ""}
              {scoreDelta} engagement score vs prior month
            </p>
          )}
        </div>
      </div>

      {prior.posts.length > 0 && (
        <div>
          <h3 className="mb-4 text-lg font-semibold text-slate-900">
            Prior month posts ({prior.label})
          </h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {prior.posts.map((post) => (
              <PostPreview key={post.id} post={post} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
