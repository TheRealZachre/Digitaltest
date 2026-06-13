"use client";

import { useState } from "react";
import { Download, FileSpreadsheet, Loader2, Presentation } from "lucide-react";
import type { SocialPost } from "@/lib/types";
import { exportToExcel, exportToPDF } from "@/lib/export";
import {
  exportToPowerPoint,
  type ReportPptxPayload,
} from "@/lib/export-pptx";

interface ExportButtonsProps {
  posts: SocialPost[];
  reportTitle: string;
  filenameBase: string;
  pptxData?: ReportPptxPayload;
}

export function ExportButtons({
  posts,
  reportTitle,
  filenameBase,
  pptxData,
}: ExportButtonsProps) {
  const [exportingPptx, setExportingPptx] = useState(false);
  const [pptxStatus, setPptxStatus] = useState<string | null>(null);

  async function handlePowerPointExport() {
    if (!pptxData || exportingPptx) return;

    setExportingPptx(true);
    setPptxStatus("Preparing deck…");

    try {
      await exportToPowerPoint(
        pptxData,
        `${filenameBase}.pptx`,
        setPptxStatus
      );
    } catch (error) {
      console.error(error);
      setPptxStatus("Export failed. Try again.");
      setTimeout(() => setPptxStatus(null), 3000);
      return;
    } finally {
      setExportingPptx(false);
    }

    setPptxStatus(null);
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => exportToPDF(posts, reportTitle, `${filenameBase}.pdf`)}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <Download className="h-4 w-4" />
          Export PDF
        </button>
        <button
          type="button"
          onClick={() =>
            exportToExcel(posts, `${filenameBase}.xlsx`, reportTitle)
          }
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <FileSpreadsheet className="h-4 w-4" />
          Export Excel
        </button>
        {pptxData && (
          <button
            type="button"
            onClick={() => void handlePowerPointExport()}
            disabled={exportingPptx}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {exportingPptx ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Presentation className="h-4 w-4" />
            )}
            {exportingPptx ? "Exporting…" : "Export PowerPoint"}
          </button>
        )}
      </div>
      {pptxStatus && (
        <p className="text-xs text-slate-500">{pptxStatus}</p>
      )}
    </div>
  );
}
