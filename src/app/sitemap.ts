import type { MetadataRoute } from "next";
import { tmdb } from "@/api/tmdb";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://filmanesia.com";
  const routes = ["", "/discover", "/about", "/contact", "/privacy", "/terms"];
  const categoryRoutes = ["action", "adventure", "animation", "comedy", "crime", "drama", "horror", "romance", "thriller", "science-fiction"].map((slug) => `/genre/${slug}`)
    .concat(["indonesia", "korea", "jepang", "amerika"].map((country) => `/negara/${country}`))
    .concat(Array.from({ length: 15 }, (_, index) => `/tahun/${new Date().getUTCFullYear() - index}`));
  const staticUrls = [...routes, ...categoryRoutes].map((route) => ({ url: `${base}${route}`, changeFrequency: route === "" ? "daily" : "monthly", priority: route === "" ? 1 : 0.7 } as MetadataRoute.Sitemap[number]));
  const pages = Array.from({ length: 5 }, (_, i) => i + 1);
  const [moviePages, tvPages] = await Promise.all([Promise.all(pages.map((page) => tmdb.movies.popular({ page }).catch(() => null))), Promise.all(pages.map((page) => tmdb.tvShows.popular({ page }).catch(() => null)))]);
  const movies = moviePages.flatMap((result) => result?.results || []);
  const shows = tvPages.flatMap((result) => result?.results || []);
  const movieUrls = movies.map((item) => ({ url: `${base}/movie/${item.id}`, changeFrequency: "weekly" as const, priority: 0.8 }));
  const tvUrls = shows.map((item) => ({ url: `${base}/tv/${item.id}`, changeFrequency: "weekly" as const, priority: 0.8 }));
  return [...staticUrls, ...(movieUrls || []), ...(tvUrls || [])];
}
