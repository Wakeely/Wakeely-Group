import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://group.legalwakeely.com";
  const now = new Date();

  return [
    {
      url: `${baseUrl}/ar`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/en`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
