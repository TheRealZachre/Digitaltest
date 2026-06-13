import type { ReactNode } from "react";
import { UserWelcomeBar } from "@/components/auth/UserWelcomeBar";
import { AnalyticsSidebar } from "@analytics/components/layout/AnalyticsSidebar";

interface AnalyticsAppShellProps {
  children: ReactNode;
  showAdminNav?: boolean;
}

export function AnalyticsAppShell({
  children,
  showAdminNav = false,
}: AnalyticsAppShellProps) {
  return (
    <div className="flex min-h-screen bg-brand-paper">
      <AnalyticsSidebar showAdminNav={showAdminNav} />
      <main className="flex flex-1 flex-col overflow-auto">
        <UserWelcomeBar />
        {children}
      </main>
    </div>
  );
}
