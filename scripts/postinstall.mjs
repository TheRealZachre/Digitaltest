import { execSync } from "node:child_process";

// Skip analytics install on Cloudflare CI — only the main app is deployed there.
if (process.env.CF_PAGES || process.env.WORKERS_CI || process.env.CI === "true") {
  process.exit(0);
}

execSync("npm install --prefix apps/analytics", { stdio: "inherit" });
