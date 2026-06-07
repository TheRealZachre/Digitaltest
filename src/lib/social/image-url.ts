import type { Platform } from "@/lib/types";

const PROXY_HOSTS = [
  "cdninstagram.com",
  "fbcdn.net",
  "twimg.com",
  "pbs.twimg.com",
  "licdn.com",
  "ytimg.com",
  "ggpht.com",
  "googleusercontent.com",
];

export function extractFacebookImageUrl(
  record: Record<string, unknown>
): string {
  const media = record.media as Record<string, unknown>[] | undefined;

  for (const item of media ?? []) {
    const thumbnail = String(item.thumbnail ?? "");
    if (thumbnail.startsWith("http")) return thumbnail;

    const thumbnailImage = item.thumbnailImage as { uri?: string } | undefined;
    if (thumbnailImage?.uri) return thumbnailImage.uri;

    const photoImage = item.photo_image as { uri?: string } | undefined;
    if (photoImage?.uri) return photoImage.uri;

    const image = item.image as { uri?: string } | undefined;
    if (image?.uri) return image.uri;

    const uri = String(item.uri ?? "");
    if (uri.startsWith("http")) return uri;
  }

  const fallback = String(record.image ?? record.thumbnail ?? "");
  return fallback.startsWith("http") ? fallback : "";
}

export function normalizeTwitterImageUrl(url: string): string {
  if (!url.includes("twimg.com")) return url;

  const base = url.split("?")[0];
  if (base.endsWith(".jpg") || base.endsWith(".png")) {
    return `${base}?format=jpg&name=medium`;
  }

  return `${base}?format=jpg&name=medium`;
}

export function normalizeSocialImageUrl(
  platform: Platform,
  url: string
): string {
  if (!url || url.includes("picsum.photos")) return url;

  if (platform === "x") {
    return normalizeTwitterImageUrl(url);
  }

  return url;
}

export function shouldProxyImageUrl(url: string): boolean {
  if (!url.startsWith("http")) return false;
  try {
    const hostname = new URL(url).hostname;
    return PROXY_HOSTS.some(
      (host) => hostname === host || hostname.endsWith(`.${host}`)
    );
  } catch {
    return false;
  }
}

export function getPostImageSrc(url: string, platform?: Platform): string {
  const normalized = platform
    ? normalizeSocialImageUrl(platform, url)
    : url;

  if (!normalized || normalized.includes("picsum.photos")) {
    return normalized;
  }

  if (shouldProxyImageUrl(normalized)) {
    return `/api/media?url=${encodeURIComponent(normalized)}`;
  }

  return normalized;
}
