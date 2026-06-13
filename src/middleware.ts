import NextAuth from "next-auth";
import { getAuthSecret } from "@/lib/env";
import { authConfig } from "@/lib/auth/auth.config";

export const { auth: middleware } = NextAuth(async () => ({
  ...authConfig,
  secret: await getAuthSecret(),
}));

export default middleware;

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
