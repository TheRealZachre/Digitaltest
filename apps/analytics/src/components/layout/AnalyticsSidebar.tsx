"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Calendar,
  CalendarDays,
  CalendarRange,
  AtSign,
  Image,
  Layers,
  LayoutDashboard,
  Play,
  Share2,
  Shield,
  Users,
  type LucideIcon,
} from "lucide-react";
import clsx from "clsx";
import { UserMenu } from "@/components/auth/UserMenu";
import { ClientBrandStack } from "@analytics/components/brand/ClientBrandStack";
import { PLATFORM_NAME } from "@/lib/company";

interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

const navLinks: NavLink[] = [
  {
    href: "/",
    label: "Overview",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/reports/channels",
    label: "All Channels",
    icon: Layers,
    exact: true,
  },
  { href: "/reports/channels/linkedin", label: "LinkedIn", icon: Share2 },
  { href: "/reports/channels/instagram", label: "Instagram", icon: Image },
  { href: "/reports/channels/facebook", label: "Facebook", icon: Users },
  { href: "/reports/channels/x", label: "X", icon: AtSign },
  { href: "/reports/channels/youtube", label: "YouTube", icon: Play },
  { href: "/reports/weekly", label: "Weekly Report", icon: Calendar },
  { href: "/reports/monthly", label: "Monthly Report", icon: CalendarDays },
  {
    href: "/reports/quarterly",
    label: "Quarterly One-Pager",
    icon: CalendarRange,
  },
  { href: "/methodology", label: "Scoring Methodology", icon: BookOpen },
];

function linkIsActive(pathname: string, href: string, exact?: boolean) {
  return exact ? pathname === href : pathname.startsWith(href);
}

export function AnalyticsSidebar({
  showAdminNav = false,
}: {
  showAdminNav?: boolean;
}) {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-brand-border bg-brand-stage text-brand-off-white">
      <div className="border-b border-brand-border px-5 py-5">
        <ClientBrandStack />
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-4">
        {showAdminNav && (
          <Link
            href="/admin"
            className={clsx(
              "mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              pathname.startsWith("/admin")
                ? "bg-brand-indigo/15 text-brand-indigo-bright"
                : "text-brand-muted hover:bg-white/5 hover:text-brand-off-white"
            )}
          >
            <Shield className="h-4 w-4 shrink-0" />
            Admin Console
          </Link>
        )}

        {navLinks.map(({ href, label, icon: Icon, exact }) => {
          const active = linkIsActive(pathname, href, exact);

          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-brand-indigo/15 text-brand-indigo-bright"
                  : "text-brand-muted hover:bg-white/5 hover:text-brand-off-white"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-4 border-t border-brand-border p-4">
        <UserMenu />
        <div>
          <p className="text-xs text-brand-muted">Powered by</p>
          <p className="text-sm text-brand-off-white">{PLATFORM_NAME}</p>
        </div>
      </div>
    </aside>
  );
}
