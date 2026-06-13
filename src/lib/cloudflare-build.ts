/**
 * Detect Cloudflare/OpenNext production builds where native Node addons
 * must be stubbed out (onnxruntime-node, ffmpeg-static, etc.).
 */
export function isCloudflareBuild(): boolean {
  if (
    process.env.OPENNEXT_CLOUDFLARE === "1" ||
    process.env.CF_PAGES === "1" ||
    process.env.WORKERS_CI === "1"
  ) {
    return true;
  }

  // Cloudflare Workers Builds sets CI=true without CF_PAGES.
  if (
    process.env.CI === "true" &&
    !process.env.VERCEL &&
    !process.env.NETLIFY
  ) {
    return true;
  }

  return false;
}
