import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

const TMP_DATA_DIR = path.join("/tmp", "digital-dashboard-data");

function getBundledDataDir(): string {
  return path.join(process.cwd(), "data");
}

function usesEphemeralCache(): boolean {
  const cwd = process.cwd();

  return (
    process.env.VERCEL === "1" ||
    process.env.VERCEL_ENV !== undefined ||
    process.env.AWS_LAMBDA_FUNCTION_NAME !== undefined ||
    process.env.LAMBDA_TASK_ROOT !== undefined ||
    cwd.startsWith("/var/task")
  );
}

function getWritableDataDir(): string {
  if (usesEphemeralCache()) {
    return TMP_DATA_DIR;
  }

  return getBundledDataDir();
}

export function getBundledDataPath(filename: string): string {
  return path.join(getBundledDataDir(), filename);
}

export function getRuntimeDataPath(filename: string): string {
  return path.join(getWritableDataDir(), filename);
}

export async function readJsonCache<T>(filename: string): Promise<T | null> {
  const readPaths = usesEphemeralCache()
    ? [path.join(TMP_DATA_DIR, filename), getBundledDataPath(filename)]
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

function isReadOnlyFilesystemError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  const code = (error as NodeJS.ErrnoException).code;
  return code === "EROFS" || code === "EPERM";
}

export async function writeJsonCache<T>(
  filename: string,
  data: T
): Promise<void> {
  const content = JSON.stringify(data, null, 2);
  const primaryPath = path.join(getWritableDataDir(), filename);

  try {
    await mkdir(path.dirname(primaryPath), { recursive: true });
    await writeFile(primaryPath, content, "utf8");
    return;
  } catch (error) {
    if (!isReadOnlyFilesystemError(error)) {
      throw error;
    }
  }

  const fallbackPath = path.join(TMP_DATA_DIR, filename);
  await mkdir(path.dirname(fallbackPath), { recursive: true });
  await writeFile(fallbackPath, content, "utf8");
}
