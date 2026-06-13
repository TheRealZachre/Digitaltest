import { defineCloudflareConfig } from "@opennextjs/cloudflare";
export default defineCloudflareConfig({
  serverExternalPackages: ["onnxruntime-node"],
});
