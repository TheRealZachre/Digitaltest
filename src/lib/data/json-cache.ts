import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

const BUNDLED_DATA_DIR = path.join(process.cwd(), "data");

function isServerlessRuntime(): boolean {
  return (
    process.env.VERCEL === "1" ||
    process.env.AWS_LAMBDA_FUNCTION_NAME !== undefined
  );
}

function getRuntimeDataDir(): string {
  if (isServerlessRuntime()) {
    return path.join("/tmp", "digital-dashboard-data");
  }

  return BUNDLED_DATA_DIR;
}

export function getBundledDataPath(filename: string): string {
  return path.join(BUNDLED_DATA_DIR, filename);
}

export function getRuntimeDataPath(filename: string): string {
  return path.join(getRuntimeDataDir(), filename);
}

export async function readJsonCache<T>(filename: string): Promise<T | null> {
  const readPaths = isServerlessRuntime()
    ? [getRuntimeDataPath(filename), getBundledDataPath(filename)]
    : [getBundledDataPath(filename)];

  for (const cachePath of readPaths) {
    try {
      const raw = await readFile(cachePath, "utf8");
      return JSON.parse(raw) as T;
    } catch {
      // Try the next location.
    }
  }

  return null;
}

export async function writeJsonCache<T>(
  filename: string,
  data: T
): Promise<void> {
  const cachePath = getRuntimeDataPath(filename);
  await mkdir(path.dirname(cachePath), { recursive: true });
  await writeFile(cachePath, JSON.stringify(data, null, 2), "utf8");
}
