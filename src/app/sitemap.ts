import type { MetadataRoute } from "next";
import { tmdb } from "@/api/tmdb";

export const revalidate = 86400;

const supportedLanguages = {
  "id-ID": "id",
  "en-US": "en",
  "ms-MY": "ms",
};

const languageAlternates = (url: string) => ({
  languages: Object.fromEntries(
    Object.entries(supportedLanguages).map(([locale, language]) => [locale, `${url}?lang=${language}`]),
  ),
});

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://filmanesia.com";
  const lastModified = new Date();
  const routes = [
    "",
    "/discover",
    "/search",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
  ];
  const genres = [
    "action", "adventure", "animation", "comedy", "crime", "drama", "horror", "romance",
    "thriller", "science-fiction",
  ];
  const countries = ["indonesia", "korea", "jepang", "amerika"];
  const years = Array.from({ length: 15 }, (_, index) => new Date().getUTCFullYear() - index);
  const categoryRoutes = [
    ...genres.map((slug) => `/genre/${slug}`),
    ...countries.map((country) => `/negara/${country}`),
    ...years.map((year) => `/tahun/${year}`),
  ];

  const staticUrls = [...routes, ...categoryRoutes].map((route) => {
    const url = `${base}${route}`;
    return {
      url,
      lastModified,
      changeFrequency: route === "" ? "daily" : "monthly",
      priority: route === "" ? 1 : 0.7,
      alternates: languageAlternates(url),
    } as MetadataRoute.Sitemap[number];
  });

  const pages = Array.from({ length: 20 }, (_, index) => index + 1);
  const [moviePages, tvPages] = await Promise.all([
    Promise.all(pages.map((page) => tmdb.movies.popular({ page }).catch(() => null))),
    Promise.all(pages.map((page) => tmdb.tvShows.popular({ page }).catch(() => null))),
  ]);

  const movies = moviePages.flatMap((result) => result?.results ?? []);
  const shows = tvPages.flatMap((result) => result?.results ?? []);
  const movieUrls = movies.map((movie) => {
    const url = `${base}/movie/${movie.id}`;
    return {
      url,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: movie.poster_path ? [`https://image.tmdb.org/t/p/w500${movie.poster_path}`] : undefined,
      alternates: languageAlternates(url),
    };
  });
  const tvUrls = shows.map((show) => {
    const url = `${base}/tv/${show.id}`;
    return {
      url,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: show.poster_path ? [`https://image.tmdb.org/t/p/w500${show.poster_path}`] : undefined,
      alternates: languageAlternates(url),
    };
  });

  return [...staticUrls, ...movieUrls, ...tvUrls];
}
