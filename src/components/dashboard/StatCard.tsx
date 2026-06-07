import type { LucideIcon } from "lucide-react";
import clsx from "clsx";

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
  icon: LucideIcon;
  accent?: "indigo" | "emerald" | "amber" | "rose";
}

const accents = {
  indigo: "bg-indigo-50 text-indigo-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  rose: "bg-rose-50 text-rose-600",
};

export function StatCard({
  label,
  value,
  change,
  positive,
  icon: Icon,
  accent = "indigo",
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
            {value}
          </p>
          {change && (
            <p
              className={clsx(
                "mt-1 text-xs font-medium",
                positive ? "text-emerald-600" : "text-rose-600"
              )}
            >
              {change}
            </p>
          )}
        </div>
        <div
          className={clsx(
            "flex h-10 w-10 items-center justify-center rounded-lg",
            accents[accent]
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
