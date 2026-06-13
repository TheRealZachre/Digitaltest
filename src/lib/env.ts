type EnvWithAuth = {
  AUTH_SECRET?: string;
  NEXTAUTH_SECRET?: string;
  AUTH_URL?: string;
  NEXTAUTH_URL?: string;
};

function readProcessAuthEnv(): EnvWithAuth {
  return {
    AUTH_SECRET: process.env.AUTH_SECRET,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    AUTH_URL: process.env.AUTH_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  };
}

async function readCloudflareEnv(): Promise<EnvWithAuth | undefined> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    return getCloudflareContext().env as EnvWithAuth;
  } catch {
    return undefined;
  }
}

export async function getAuthSecret(): Promise<string | undefined> {
  const processEnv = readProcessAuthEnv();
  if (processEnv.AUTH_SECRET) return processEnv.AUTH_SECRET;
  if (processEnv.NEXTAUTH_SECRET) return processEnv.NEXTAUTH_SECRET;

  const cloudflareEnv = await readCloudflareEnv();
  if (cloudflareEnv?.AUTH_SECRET) return cloudflareEnv.AUTH_SECRET;
  if (cloudflareEnv?.NEXTAUTH_SECRET) return cloudflareEnv.NEXTAUTH_SECRET;

  if (process.env.NODE_ENV === "development") {
    return "dev-auth-secret";
  }

  return undefined;
}

export async function getAuthUrl(): Promise<string | undefined> {
  const processEnv = readProcessAuthEnv();
  if (processEnv.AUTH_URL) return processEnv.AUTH_URL;
  if (processEnv.NEXTAUTH_URL) return processEnv.NEXTAUTH_URL;

  const cloudflareEnv = await readCloudflareEnv();
  return cloudflareEnv?.AUTH_URL ?? cloudflareEnv?.NEXTAUTH_URL;
}
