import pptxgen from "pptxgenjs";
import { resolvePostImageData } from "./export-pptx-images";
import type { BeatPerformance } from "./narrative/types";
import type {
  CategoryPerformance,
  CompetitorBrand,
  ReportSummary,
  SocialPost,
} from "./types";
import {
  clickThroughRate,
  engagementRate,
  formatCurrency,
  formatNumber,
  formatPercent,
  rankByEngagement,
} from "./metrics";

export type ReportTimeframeExport = "weekly" | "monthly" | "quarterly";

export interface WeekSummaryRow {
  label: string;
  postCount: number;
  avgEngagementScore: number;
}

export interface MonthSummaryRow {
  label: string;
  postCount: number;
  avgEngagementScore: number;
}

export interface ReportPptxPayload {
  timeframe: ReportTimeframeExport;
  title: string;
  subtitle: string;
  brandName: string;
  summary: ReportSummary;
  posts: SocialPost[];
  weeks?: WeekSummaryRow[];
  priorWeeks?: WeekSummaryRow[];
  currentMonth?: MonthSummaryRow;
  priorMonth?: MonthSummaryRow;
  quarterMonths?: MonthSummaryRow[];
  beats?: BeatPerformance[];
  categories?: CategoryPerformance[];
  whatWorked?: { worked: string[]; didNot: string[] };
  recommendations?: string[];
  competitors?: CompetitorBrand[];
}

const C = {
  stage: "141319",
  ink: "181820",
  indigo: "7C78FF",
  muted: "6F6E7A",
  white: "FFFFFF",
  paper: "FAF7F1",
  emerald: "059669",
  rose: "E11D48",
};

function tableCell(text: string, header = false): pptxgen.TableCell {
  return header
    ? { text, options: { bold: true, fill: { color: C.stage }, color: C.white } }
    : { text };
}

function tableRow(...cells: string[]): pptxgen.TableRow {
  return cells.map((text) => ({ text }));
}

function truncate(text: string, max = 120): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  return cleaned.length <= max ? cleaned : `${cleaned.slice(0, max - 1)}…`;
}

function addSlideHeader(slide: pptxgen.Slide, title: string) {
  slide.addShape("rect", {
    x: 0,
    y: 0,
    w: "100%",
    h: 0.65,
    fill: { color: C.stage },
  });
  slide.addText(title, {
    x: 0.5,
    y: 0.15,
    w: 12,
    h: 0.4,
    fontSize: 18,
    bold: true,
    color: C.white,
    fontFace: "Arial",
  });
}

function addTitleSlide(pptx: pptxgen, data: ReportPptxPayload) {
  const slide = pptx.addSlide();
  slide.background = { color: C.stage };

  slide.addText(data.brandName, {
    x: 0.75,
    y: 1.4,
    w: 11,
    h: 0.5,
    fontSize: 14,
    color: C.indigo,
    fontFace: "Arial",
    charSpacing: 3,
  });

  slide.addText(data.title, {
    x: 0.75,
    y: 2,
    w: 11,
    h: 1,
    fontSize: 36,
    bold: true,
    color: C.white,
    fontFace: "Arial",
  });

  slide.addText(data.subtitle, {
    x: 0.75,
    y: 3.1,
    w: 11,
    h: 0.6,
    fontSize: 16,
    color: C.muted,
    fontFace: "Arial",
  });

  slide.addText(`Generated ${new Date().toLocaleString()} · Vibe. Code. Flow.`, {
    x: 0.75,
    y: 6.8,
    w: 11,
    h: 0.4,
    fontSize: 10,
    color: C.muted,
    fontFace: "Arial",
  });
}

function addKpiSlide(pptx: pptxgen, summary: ReportSummary) {
  const slide = pptx.addSlide();
  slide.background = { color: C.paper };
  addSlideHeader(slide, "Performance Summary");

  const rows: pptxgen.TableRow[] = [
    [tableCell("Metric", true), tableCell("Value", true)],
    tableRow("Total Posts", String(summary.totalPosts)),
    tableRow("Organic / Paid", `${summary.organicPosts} / ${summary.paidPosts}`),
    tableRow("Avg. Engagement Rate", formatPercent(summary.avgEngagementRate)),
    tableRow("Avg. CTR", formatPercent(summary.avgCTR)),
    tableRow("Total Reach", formatNumber(summary.totalReach)),
    tableRow("Total Impressions", formatNumber(summary.totalImpressions)),
    tableRow("Total Spend", formatCurrency(summary.totalSpend)),
    tableRow("Audience Growth", `+${formatNumber(summary.audienceGrowth)} followers`),
  ];

  slide.addTable(rows, {
    x: 0.75,
    y: 1.1,
    w: 11.5,
    colW: [4.5, 7],
    fontSize: 12,
    fontFace: "Arial",
    color: C.ink,
    border: { type: "solid", color: "E5E7EB", pt: 0.5 },
    autoPage: false,
  });
}

function addWeekTableSlide(
  pptx: pptxgen,
  title: string,
  weeks: WeekSummaryRow[]
) {
  if (weeks.length === 0) return;

  const slide = pptx.addSlide();
  slide.background = { color: C.paper };
  addSlideHeader(slide, title);

  const rows: pptxgen.TableRow[] = [
    [
      tableCell("Week", true),
      tableCell("Posts", true),
      tableCell("Avg. Engagement Score", true),
    ],
    ...weeks.map((w) =>
      tableRow(w.label, String(w.postCount), String(w.avgEngagementScore))
    ),
  ];

  slide.addTable(rows, {
    x: 0.75,
    y: 1.1,
    w: 11.5,
    colW: [5, 2, 4.5],
    fontSize: 11,
    fontFace: "Arial",
    color: C.ink,
    border: { type: "solid", color: "E5E7EB", pt: 0.5 },
  });
}

function addMonthComparisonSlide(
  pptx: pptxgen,
  current: MonthSummaryRow,
  prior: MonthSummaryRow
) {
  const slide = pptx.addSlide();
  slide.background = { color: C.paper };
  addSlideHeader(slide, "Month-over-Month Comparison");

  const delta = current.avgEngagementScore - prior.avgEngagementScore;
  const deltaLabel =
    delta === 0 ? "Flat" : delta > 0 ? `+${delta} pts` : `${delta} pts`;

  slide.addTable(
    [
      [
        tableCell("Period", true),
        tableCell("Posts", true),
        tableCell("Avg. Engagement Score", true),
      ],
      tableRow(
        current.label,
        String(current.postCount),
        String(current.avgEngagementScore)
      ),
      tableRow(
        prior.label,
        String(prior.postCount),
        String(prior.avgEngagementScore)
      ),
    ],
    {
      x: 0.75,
      y: 1.2,
      w: 11.5,
      colW: [4, 2.5, 5],
      fontSize: 12,
      fontFace: "Arial",
      color: C.ink,
      border: { type: "solid", color: "E5E7EB", pt: 0.5 },
    }
  );

  slide.addText(`Engagement score change: ${deltaLabel}`, {
    x: 0.75,
    y: 3.2,
    w: 11,
    h: 0.5,
    fontSize: 14,
    bold: true,
    color: delta >= 0 ? C.emerald : C.rose,
    fontFace: "Arial",
  });
}

function addBeatSlide(pptx: pptxgen, beats: BeatPerformance[]) {
  const slide = pptx.addSlide();
  slide.background = { color: C.paper };
  addSlideHeader(slide, "Story Beat Performance");

  const rows: pptxgen.TableRow[] = [
    [
      tableCell("Story Beat", true),
      tableCell("Posts", true),
      tableCell("Avg. ER", true),
      tableCell("Reach", true),
    ],
    ...beats.map((b) =>
      tableRow(
        b.beat,
        String(b.postCount),
        formatPercent(b.avgEngagementRate),
        formatNumber(b.totalReach)
      )
    ),
  ];

  slide.addTable(rows, {
    x: 0.75,
    y: 1.1,
    w: 11.5,
    colW: [4.5, 1.5, 2, 3.5],
    fontSize: 11,
    fontFace: "Arial",
    color: C.ink,
    border: { type: "solid", color: "E5E7EB", pt: 0.5 },
  });
}

function addCategorySlide(pptx: pptxgen, categories: CategoryPerformance[]) {
  const slide = pptx.addSlide();
  slide.background = { color: C.paper };
  addSlideHeader(slide, "Content Category Performance");

  const rows: pptxgen.TableRow[] = [
    [
      tableCell("Category", true),
      tableCell("Posts", true),
      tableCell("Avg. ER", true),
      tableCell("Reach", true),
    ],
    ...categories.map((c) =>
      tableRow(
        c.category,
        String(c.postCount),
        formatPercent(c.avgEngagementRate),
        formatNumber(c.totalReach)
      )
    ),
  ];

  slide.addTable(rows, {
    x: 0.75,
    y: 1.1,
    w: 11.5,
    colW: [4, 1.5, 2, 4],
    fontSize: 11,
    fontFace: "Arial",
    color: C.ink,
    border: { type: "solid", color: "E5E7EB", pt: 0.5 },
  });
}

function addInsightsSlide(
  pptx: pptxgen,
  insights: { worked: string[]; didNot: string[] }
) {
  const slide = pptx.addSlide();
  slide.background = { color: C.paper };
  addSlideHeader(slide, "What Worked / What Didn't");

  const workedBullets = insights.worked.map((item) => ({
    text: item,
    options: { bullet: true, breakLine: true },
  }));
  const didNotBullets = insights.didNot.map((item) => ({
    text: item,
    options: { bullet: true, breakLine: true },
  }));

  slide.addText("What worked", {
    x: 0.75,
    y: 1,
    w: 5.5,
    h: 0.4,
    fontSize: 14,
    bold: true,
    color: C.emerald,
    fontFace: "Arial",
  });
  slide.addText(workedBullets.length ? workedBullets : [{ text: "—" }], {
    x: 0.75,
    y: 1.45,
    w: 5.5,
    h: 5,
    fontSize: 11,
    color: C.ink,
    fontFace: "Arial",
    valign: "top",
  });

  slide.addText("What didn't", {
    x: 6.75,
    y: 1,
    w: 5.5,
    h: 0.4,
    fontSize: 14,
    bold: true,
    color: C.rose,
    fontFace: "Arial",
  });
  slide.addText(didNotBullets.length ? didNotBullets : [{ text: "—" }], {
    x: 6.75,
    y: 1.45,
    w: 5.5,
    h: 5,
    fontSize: 11,
    color: C.ink,
    fontFace: "Arial",
    valign: "top",
  });
}

function addRecommendationsSlide(pptx: pptxgen, recommendations: string[]) {
  const slide = pptx.addSlide();
  slide.background = { color: C.paper };
  addSlideHeader(slide, "Strategic Recommendations");

  slide.addText(
    recommendations.map((rec, i) => ({
      text: `${i + 1}. ${rec}`,
      options: { bullet: false, breakLine: true, paraSpaceAfter: 8 },
    })),
    {
      x: 0.75,
      y: 1.2,
      w: 11.5,
      h: 5.5,
      fontSize: 12,
      color: C.ink,
      fontFace: "Arial",
      valign: "top",
    }
  );
}

function addCompetitorSlide(
  pptx: pptxgen,
  competitors: CompetitorBrand[],
  brandEr: number,
  brandName: string
) {
  const slide = pptx.addSlide();
  slide.background = { color: C.paper };
  addSlideHeader(slide, "Competitor Benchmark");

  const rows: pptxgen.TableRow[] = [
    [
      tableCell("Brand", true),
      tableCell("Followers", true),
      tableCell("Avg. ER", true),
      tableCell("Posts / Week", true),
    ],
    [
      { text: brandName, options: { bold: true, fill: { color: "EEF2FF" } } },
      { text: "—" },
      { text: formatPercent(brandEr) },
      { text: "—" },
    ],
    ...competitors.map((c) =>
      tableRow(
        c.name,
        formatNumber(c.followers),
        formatPercent(c.avgEngagementRate),
        String(c.avgPostsPerWeek)
      )
    ),
  ];

  slide.addTable(rows, {
    x: 0.75,
    y: 1.1,
    w: 11.5,
    colW: [3.5, 2.5, 2.5, 3],
    fontSize: 11,
    fontFace: "Arial",
    color: C.ink,
    border: { type: "solid", color: "E5E7EB", pt: 0.5 },
  });
}

function addPostGalleryIntroSlide(pptx: pptxgen, postCount: number) {
  const slide = pptx.addSlide();
  slide.background = { color: C.paper };
  addSlideHeader(slide, "Post Gallery");

  slide.addText(`${postCount} posts`, {
    x: 0.75,
    y: 2.2,
    w: 11.5,
    h: 0.8,
    fontSize: 32,
    bold: true,
    color: C.ink,
    fontFace: "Arial",
  });

  slide.addText(
    "Each post includes its creative and full performance analytics — engagement rate, CTR, reach, impressions, and interactions.",
    {
      x: 0.75,
      y: 3.1,
      w: 11,
      h: 1.2,
      fontSize: 14,
      color: C.muted,
      fontFace: "Arial",
      valign: "top",
    }
  );
}

function addSinglePostSlide(
  pptx: pptxgen,
  post: SocialPost,
  index: number,
  total: number,
  imageData: string | null
) {
  const er = engagementRate(post.metrics);
  const ctr = clickThroughRate(post.metrics);
  const engagements =
    post.metrics.likes +
    post.metrics.comments +
    post.metrics.shares +
    post.metrics.saves;
  const dateLabel = new Date(post.publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const slide = pptx.addSlide();
  slide.background = { color: C.paper };
  addSlideHeader(slide, `Post ${index} of ${total}`);

  slide.addShape("rect", {
    x: 0.5,
    y: 0.85,
    w: 5.6,
    h: 6.15,
    fill: { color: "FFFFFF" },
    line: { color: "E5E7EB", pt: 1 },
  });

  if (imageData) {
    slide.addImage({
      data: imageData,
      x: 0.55,
      y: 0.9,
      w: 5.5,
      h: 6.05,
      sizing: { type: "contain", w: 5.5, h: 6.05 },
      altText: truncate(post.caption, 80),
    });
  } else {
    slide.addText("Image unavailable", {
      x: 0.55,
      y: 3.4,
      w: 5.5,
      h: 0.5,
      fontSize: 12,
      color: C.muted,
      fontFace: "Arial",
      align: "center",
    });
  }

  const metaX = 6.35;
  slide.addText(
    `${post.platform.toUpperCase()} · ${post.type} · ${dateLabel}`,
    {
      x: metaX,
      y: 0.95,
      w: 6.4,
      h: 0.35,
      fontSize: 11,
      bold: true,
      color: C.indigo,
      fontFace: "Arial",
      charSpacing: 0.5,
    }
  );

  slide.addText(`${post.storyBeat} · ${post.category}`, {
    x: metaX,
    y: 1.35,
    w: 6.4,
    h: 0.35,
    fontSize: 12,
    color: C.ink,
    fontFace: "Arial",
  });

  slide.addText(truncate(post.caption, 220), {
    x: metaX,
    y: 1.85,
    w: 6.4,
    h: 1.35,
    fontSize: 11,
    color: C.muted,
    fontFace: "Arial",
    valign: "top",
  });

  const metricRows: pptxgen.TableRow[] = [
    [tableCell("Metric", true), tableCell("Value", true)],
    tableRow("Engagement Rate", formatPercent(er)),
    tableRow("CTR", formatPercent(ctr)),
    tableRow("Reach", formatNumber(post.metrics.reach)),
    tableRow("Impressions", formatNumber(post.metrics.impressions)),
    tableRow("Total Interactions", formatNumber(engagements)),
    tableRow(
      "Likes / Comments",
      `${formatNumber(post.metrics.likes)} / ${formatNumber(post.metrics.comments)}`
    ),
    tableRow(
      "Shares / Saves",
      `${formatNumber(post.metrics.shares)} / ${formatNumber(post.metrics.saves)}`
    ),
    tableRow("Clicks", formatNumber(post.metrics.clicks)),
  ];

  if (post.metrics.spend && post.metrics.spend > 0) {
    metricRows.push(tableRow("Spend", formatCurrency(post.metrics.spend)));
  }

  slide.addTable(metricRows, {
    x: metaX,
    y: 3.35,
    w: 6.4,
    colW: [3.2, 3.2],
    fontSize: 11,
    fontFace: "Arial",
    color: C.ink,
    border: { type: "solid", color: "E5E7EB", pt: 0.5 },
    autoPage: false,
  });
}

export async function exportToPowerPoint(
  data: ReportPptxPayload,
  filename: string,
  onProgress?: (message: string) => void
): Promise<void> {
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "Vibe. Code. Flow.";
  pptx.title = data.title;
  pptx.subject = data.subtitle;

  addTitleSlide(pptx, data);
  addKpiSlide(pptx, data.summary);

  if (data.currentMonth && data.priorMonth) {
    addMonthComparisonSlide(pptx, data.currentMonth, data.priorMonth);
  }

  if (data.quarterMonths?.length) {
    addWeekTableSlide(pptx, "Quarterly Month Trend", data.quarterMonths);
  }

  if (data.weeks?.length) {
    addWeekTableSlide(pptx, "Weekly Performance", data.weeks);
  }

  if (data.priorWeeks?.length) {
    addWeekTableSlide(pptx, "Prior Period — Weekly", data.priorWeeks);
  }

  if (data.beats?.length) {
    addBeatSlide(pptx, data.beats);
  }

  if (data.categories?.length) {
    addCategorySlide(pptx, data.categories);
  }

  if (data.competitors?.length) {
    addCompetitorSlide(
      pptx,
      data.competitors,
      data.summary.avgEngagementRate,
      data.brandName
    );
  }

  if (data.whatWorked) {
    addInsightsSlide(pptx, data.whatWorked);
  }

  if (data.recommendations?.length) {
    addRecommendationsSlide(pptx, data.recommendations);
  }

  if (data.posts.length > 0) {
    onProgress?.(`Loading post images (0/${data.posts.length})…`);
    const ranked = rankByEngagement(data.posts);
    addPostGalleryIntroSlide(pptx, ranked.length);

    for (let i = 0; i < ranked.length; i++) {
      onProgress?.(`Building slides (${i + 1}/${ranked.length})…`);
      const imageData = await resolvePostImageData(ranked[i]);
      addSinglePostSlide(pptx, ranked[i], i + 1, ranked.length, imageData);
    }
  }

  onProgress?.("Saving file…");
  await pptx.writeFile({ fileName: filename });
}

export function weekRowsFromBuckets(
  weeks: { label: string; postCount: number; avgEngagementScore: number }[]
): WeekSummaryRow[] {
  return weeks.map((w) => ({
    label: w.label,
    postCount: w.postCount,
    avgEngagementScore: w.avgEngagementScore,
  }));
}

export function monthRowFromBucket(bucket: {
  label: string;
  postCount: number;
  avgEngagementScore: number;
}): MonthSummaryRow {
  return {
    label: bucket.label,
    postCount: bucket.postCount,
    avgEngagementScore: bucket.avgEngagementScore,
  };
}
