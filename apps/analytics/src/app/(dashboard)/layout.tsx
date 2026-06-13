import { AnalyticsAppShell } from "@analytics/components/layout/AnalyticsAppShell";
import { auth } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const showAdminNav = session?.user?.role === "admin";

  return (
    <AnalyticsAppShell showAdminNav={showAdminNav}>{children}</AnalyticsAppShell>
  );
}
