import type { MetadataRoute } from "next";

const BASE_URL = "https://dariogeorge.in";

/**
 * Generates the XML sitemap served at /sitemap.xml.
 *
 * This is a single-page portfolio site — every visible section is anchored on
 * the homepage.  We list the root URL with `priority: 1` and include
 * hash-anchored variants so crawlers and search engines understand the page
 * structure.  Deep-link anchors are optional hints and don't break the standard.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-07-08");

  return [
    {
      url: BASE_URL,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/#services`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/#work`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/#contact`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.75,
    },
  ];
}
