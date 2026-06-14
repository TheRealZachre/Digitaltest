/** Base URL for the analytics-only app (separate deployment). */
export function getAnalyticsAppUrl(): string | undefined {
  const raw =
    process.env.NEXT_PUBLIC_ANALYTICS_URL ??
    process.env.ANALYTICS_APP_URL ??
    process.env.NEXT_PUBLIC_ANALYTICS_APP_URL;

  if (!raw) return undefined;
  return raw.replace(/\/$/, "");
}

export function analyticsHref(path: string, baseUrl?: string): string {
  const root = baseUrl ?? getAnalyticsAppUrl();
  if (!root) return path;
  if (path === "/") return root;
  return `${root}${path.startsWith("/") ? path : `/${path}`}`;
}

export function isExternalAnalyticsUrl(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}
