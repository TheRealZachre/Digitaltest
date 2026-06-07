import { execFile } from "child_process";
import { access } from "fs/promises";
import ffmpegStatic from "ffmpeg-static";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

let cachedPath: string | null | undefined;

export async function getFfmpegPath(): Promise<string | null> {
  if (cachedPath !== undefined) return cachedPath;

  if (ffmpegStatic) {
    try {
      await access(ffmpegStatic);
      await execFileAsync(ffmpegStatic, ["-version"]);
      cachedPath = ffmpegStatic;
      return cachedPath;
    } catch {
      // fall through to system ffmpeg
    }
  }

  try {
    await execFileAsync("ffmpeg", ["-version"]);
    cachedPath = "ffmpeg";
    return cachedPath;
  } catch {
    cachedPath = null;
    return null;
  }
}

export async function isFfmpegAvailable(): Promise<boolean> {
  return (await getFfmpegPath()) !== null;
}
