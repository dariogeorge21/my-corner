import type { MetadataRoute } from "next";

const BASE_URL = "https://dariogeorge.in";

/**
 * Generates /robots.txt via the Next.js App Router convention.
 *
 * Rules:
 *  - All crawlers can index everything public.
 *  - API routes and private infra are explicitly disallowed.
 *  - Points bots to the XML sitemap for efficient crawling.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/private/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
