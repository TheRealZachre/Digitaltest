"use client";

import { Download, FileSpreadsheet } from "lucide-react";
import type { SocialPost } from "@/lib/types";
import { exportToExcel, exportToPDF } from "@/lib/export";

interface ExportButtonsProps {
  posts: SocialPost[];
  reportTitle: string;
  filenameBase: string;
}

export function ExportButtons({
  posts,
  reportTitle,
  filenameBase,
}: ExportButtonsProps) {
  return (
    <div className="flex gap-2">
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
        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
      >
        <FileSpreadsheet className="h-4 w-4" />
        Export Excel
      </button>
    </div>
  );
}
