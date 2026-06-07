import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import type { SocialPostCache } from "@/lib/social/types";

const CACHE_PATH = path.join(process.cwd(), "data", "social-posts.json");

export function getSocialCachePath() {
  return CACHE_PATH;
}

export async function readSocialCache(): Promise<SocialPostCache | null> {
  try {
    const raw = await readFile(CACHE_PATH, "utf8");
    return JSON.parse(raw) as SocialPostCache;
  } catch {
    return null;
  }
}

export async function writeSocialCache(cache: SocialPostCache): Promise<void> {
  await mkdir(path.dirname(CACHE_PATH), { recursive: true });
  await writeFile(CACHE_PATH, JSON.stringify(cache, null, 2), "utf8");
}
