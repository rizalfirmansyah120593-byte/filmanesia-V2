import type { MetadataRoute } from "next";
import { tmdb } from "@/api/tmdb";

export const revalidate = 86400;

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
    } as MetadataRoute.Sitemap[number];
  });

  // Refresh the first pages of high-intent lists so new and trending titles are
  // discovered without creating an unbounded sitemap.
  const pages = Array.from({ length: 10 }, (_, index) => index + 1);
  const [movieSources, tvSources] = await Promise.all([
    Promise.all([
      tmdb.trending.trending("movie", "day").catch(() => null),
      tmdb.trending.trending("movie", "week").catch(() => null),
      tmdb.movies.nowPlaying({ page: 1 }).catch(() => null),
      tmdb.movies.popular({ page: 1 }).catch(() => null),
      tmdb.movies.topRated({ page: 1 }).catch(() => null),
      tmdb.movies.upcoming({ page: 1 }).catch(() => null),
      ...pages.slice(1).map((page) => tmdb.movies.popular({ page }).catch(() => null)),
    ]),
    Promise.all([
      tmdb.trending.trending("tv", "day").catch(() => null),
      tmdb.trending.trending("tv", "week").catch(() => null),
      tmdb.tvShows.popular({ page: 1 }).catch(() => null),
      tmdb.tvShows.topRated({ page: 1 }).catch(() => null),
      ...pages.slice(1).map((page) => tmdb.tvShows.popular({ page }).catch(() => null)),
    ]),
  ]);

  const movies = Array.from(new Map(movieSources.flatMap((result) => result?.results ?? []).map((movie) => [movie.id, movie])).values());
  const shows = Array.from(new Map(tvSources.flatMap((result) => result?.results ?? []).map((show) => [show.id, show])).values());
  const movieUrls = movies.map((movie) => {
    const url = `${base}/movie/${movie.id}`;
    return {
      url,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: movie.poster_path ? [`https://image.tmdb.org/t/p/w500${movie.poster_path}`] : undefined,
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
    };
  });

  return [...staticUrls, ...movieUrls, ...tvUrls];
}
