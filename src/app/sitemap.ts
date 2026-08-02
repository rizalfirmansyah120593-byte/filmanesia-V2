import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://filmanesia.com";
  const routes = ["", "/discover", "/about", "/contact", "/privacy", "/terms"];
  return routes.map((route) => ({ url: `${base}${route}`, changeFrequency: route === "" ? "daily" : "monthly", priority: route === "" ? 1 : 0.6 }));
}
