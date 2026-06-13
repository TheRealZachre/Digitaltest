import { getCloudflareContext } from "@opennextjs/cloudflare";

type EnvWithAuth = {
  AUTH_SECRET?: string;
  NEXTAUTH_SECRET?: string;
  AUTH_URL?: string;
  NEXTAUTH_URL?: string;
};

function readCloudflareEnv(): EnvWithAuth | undefined {
  try {
    return getCloudflareContext().env as EnvWithAuth;
  } catch {
    return undefined;
  }
}

export function getAuthSecret(): string | undefined {
  const cloudflareEnv = readCloudflareEnv();

  return (
    process.env.AUTH_SECRET ??
    process.env.NEXTAUTH_SECRET ??
    cloudflareEnv?.AUTH_SECRET ??
    cloudflareEnv?.NEXTAUTH_SECRET ??
    (process.env.NODE_ENV === "development" ? "dev-auth-secret" : undefined)
  );
}

export function getAuthUrl(): string | undefined {
  const cloudflareEnv = readCloudflareEnv();

  return (
    process.env.AUTH_URL ??
    process.env.NEXTAUTH_URL ??
    cloudflareEnv?.AUTH_URL ??
    cloudflareEnv?.NEXTAUTH_URL
  );
}
