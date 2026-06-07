import { writePostCache } from "@/lib/data/cache";
import { getLinkedInConfig } from "./config";
import { normalizeLinkedInPost } from "./normalize";
import { fetchPostsFromApify } from "./providers/apify";
import { fetchPostsFromLinkedInApi } from "./providers/linkedin-api";
import { fetchPostsFromSeed } from "./providers/seed";
import type { LinkedInDataProvider, LinkedInPostCache } from "./types";

async function fetchRawPosts(provider: LinkedInDataProvider) {
  const config = getLinkedInConfig();

  switch (provider) {
    case "apify": {
      if (!config.apifyToken) {
        throw new Error(
          "APIFY_TOKEN is required for live public LinkedIn sync. Get one at https://console.apify.com — or set LINKEDIN_DATA_PROVIDER=seed to use curated research data."
        );
      }
      return fetchPostsFromApify(
        config.companySlug,
        config.apifyToken,
        config.maxPosts
      );
    }
    case "linkedin": {
      if (!config.linkedinAccessToken || !config.linkedinOrganizationId) {
        throw new Error(
          "LINKEDIN_ACCESS_TOKEN and LINKEDIN_ORGANIZATION_ID are required for the official LinkedIn API."
        );
      }
      return fetchPostsFromLinkedInApi(
        config.linkedinOrganizationId,
        config.linkedinAccessToken,
        config.maxPosts
      );
    }
    case "seed":
      return fetchPostsFromSeed();
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

export async function syncLinkedInPosts(
  providerOverride?: LinkedInDataProvider
): Promise<LinkedInPostCache> {
  const config = getLinkedInConfig();
  const provider = providerOverride ?? config.provider;
  const rawPosts = await fetchRawPosts(provider);
  const posts = rawPosts.map(normalizeLinkedInPost);

  const cache: LinkedInPostCache = {
    meta: {
      syncedAt: new Date().toISOString(),
      provider,
      companySlug: config.companySlug,
      postCount: posts.length,
      note:
        provider === "seed"
          ? "Curated from public LinkedIn research (CGA-style). Set APIFY_TOKEN to pull live data."
          : undefined,
    },
    posts,
  };

  await writePostCache(cache);
  return cache;
}
