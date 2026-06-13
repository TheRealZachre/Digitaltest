import { getPostImageCandidates } from "@/lib/social/image-url";
import type { SocialPost } from "@/lib/types";

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }

  return btoa(binary);
}

async function fetchImageAsDataUrl(url: string): Promise<string | null> {
  if (typeof window === "undefined") return null;

  try {
    const absolute = url.startsWith("/")
      ? `${window.location.origin}${url}`
      : url;

    const response = await fetch(absolute, { signal: AbortSignal.timeout(12_000) });
    if (!response.ok) return null;

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.startsWith("image/")) return null;

    const buffer = await response.arrayBuffer();
    if (buffer.byteLength === 0) return null;

    const mime = contentType.split(";")[0] || "image/jpeg";
    return `${mime};base64,${arrayBufferToBase64(buffer)}`;
  } catch {
    return null;
  }
}

export async function resolvePostImageData(
  post: SocialPost
): Promise<string | null> {
  const candidates = getPostImageCandidates(
    post.imageUrl,
    post.platform,
    post.id
  );

  for (const candidate of candidates) {
    const dataUrl = await fetchImageAsDataUrl(candidate);
    if (dataUrl) return dataUrl;
  }

  return null;
}
