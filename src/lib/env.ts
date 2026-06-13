export async function getAuthUrl(): Promise<string | undefined> {
  return process.env.AUTH_URL ?? process.env.NEXTAUTH_URL;
}

export function isAuthSecretConfigured(): boolean {
  return Boolean(process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET);
}
