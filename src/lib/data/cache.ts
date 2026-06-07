import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import type { LinkedInPostCache } from "@/lib/linkedin/types";

const CACHE_PATH = path.join(
  process.cwd(),
  "data",
  "linkedin-posts.json"
);

export function getCachePath() {
  return CACHE_PATH;
}

export async function readPostCache(): Promise<LinkedInPostCache | null> {
  try {
    const raw = await readFile(CACHE_PATH, "utf8");
    return JSON.parse(raw) as LinkedInPostCache;
  } catch {
    return null;
  }
}

export async function writePostCache(cache: LinkedInPostCache): Promise<void> {
  await mkdir(path.dirname(CACHE_PATH), { recursive: true });
  await writeFile(CACHE_PATH, JSON.stringify(cache, null, 2), "utf8");
}
