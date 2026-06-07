import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import type { SocialPost } from "./types";
import {
  clickThroughRate,
  engagementRate,
  formatCurrency,
  formatPercent,
} from "./metrics";

function postRows(posts: SocialPost[]) {
  return posts.map((p) => [
    p.id,
    p.platform,
    p.category,
    p.storyBeat,
    p.type,
    new Date(p.publishedAt).toLocaleDateString(),
    p.metrics.impressions,
    p.metrics.reach,
    p.metrics.likes,
    p.metrics.comments,
    p.metrics.shares,
    p.metrics.clicks,
    formatPercent(engagementRate(p.metrics)),
    formatPercent(clickThroughRate(p.metrics)),
    p.metrics.spend ? formatCurrency(p.metrics.spend) : "—",
  ]);
}

const HEADERS = [
  "ID",
  "Platform",
  "Category",
  "Narrative Arc",
  "Type",
  "Published",
  "Impressions",
  "Reach",
  "Likes",
  "Comments",
  "Shares",
  "Clicks",
  "Eng. Rate",
  "CTR",
  "Spend",
];

export function exportToExcel(
  posts: SocialPost[],
  filename: string,
  sheetName = "Report"
) {
  const ws = XLSX.utils.aoa_to_sheet([HEADERS, ...postRows(posts)]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, filename);
}

export function exportToPDF(
  posts: SocialPost[],
  title: string,
  filename: string
) {
  const doc = new jsPDF({ orientation: "landscape" });
  doc.setFontSize(18);
  doc.text(title, 14, 20);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated ${new Date().toLocaleString()}`, 14, 28);

  autoTable(doc, {
    startY: 34,
    head: [HEADERS],
    body: postRows(posts),
    styles: { fontSize: 7, cellPadding: 2 },
    headStyles: { fillColor: [30, 41, 59] },
  });

  doc.save(filename);
}
