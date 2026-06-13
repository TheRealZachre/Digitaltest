import { execSync } from "node:child_process";

// Skip analytics install on Cloudflare CI — only the main app is deployed there.
const isCi =
  process.env.CI && process.env.CI !== "false" && process.env.CI !== "0";

if (process.env.CF_PAGES || process.env.WORKERS_CI || isCi) {
  process.exit(0);
}

execSync("npm install --prefix apps/analytics", { stdio: "inherit" });
