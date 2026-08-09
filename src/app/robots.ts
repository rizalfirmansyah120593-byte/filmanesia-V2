import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://filmanesia.com";
  return {
    rules: [{
      userAgent: "*",
      allow: ["/", "/movie/", "/tv/", "/discover", "/genre/", "/negara/", "/tahun/"],
      disallow: ["/api/", "/auth/", "/library", "/movie/*/player", "/tv/*/player", "/*?*"],
    }],
    sitemap: `${base}/sitemap.xml`,
  };
}
