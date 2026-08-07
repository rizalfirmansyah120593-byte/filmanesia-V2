"use client";

import { tmdb } from "@/api/tmdb";
import { DiscoverMoviesFetchQueryType } from "@/types/movie";
import { MovieDiscoverResult } from "tmdb-ts/dist/types/discover";

interface FetchDiscoverMovies {
  page?: number;
  type?: DiscoverMoviesFetchQueryType;
  genres?: string;
  years?: string;
  countries?: string;
  ratings?: string;
}

const useFetchDiscoverMovies = ({
  page = 1,
  type = "discover",
  genres,
  years,
  countries,
  ratings,
}: FetchDiscoverMovies): Promise<MovieDiscoverResult> => {
  const selectedYears = years?.split(",").filter(Boolean).map(Number) ?? [];
  const selectedRatings = ratings?.split(",").filter(Boolean).map((value) => value.split("-").map(Number)) ?? [];
  const ratingOptions = selectedRatings.flat();
  const options = {
    page,
    with_genres: genres,
    with_origin_country: countries,
    ...(ratingOptions.length ? { "vote_average.gte": Math.min(...ratingOptions), "vote_average.lte": Math.max(...ratingOptions) } : {}),
  } as Parameters<typeof tmdb.discover.movie>[0] & { with_origin_country?: string };
  const discover = async () => {
    if (selectedYears.length <= 1) return tmdb.discover.movie({ ...options, primary_release_year: selectedYears[0] });
    const pages = await Promise.all(selectedYears.map((year) => tmdb.discover.movie({ ...options, primary_release_year: year })));
    const results = Array.from(new Map(pages.flatMap((result) => result.results).map((movie) => [movie.id, movie])).values());
    return { page, results, total_results: results.length, total_pages: 1 };
  };
  const todayTrending = () => tmdb.trending.trending("movie", "day", { page: page });
  const thisWeekTrending = () => tmdb.trending.trending("movie", "week", { page: page });
  const popular = () => tmdb.movies.popular({ page: page });
  const nowPlaying = () => tmdb.movies.nowPlaying({ page: page });
  const upcoming = () => tmdb.movies.upcoming({ page: page });
  const topRated = () => tmdb.movies.topRated({ page: page });

  const queryData = {
    discover,
    todayTrending,
    thisWeekTrending,
    popular,
    nowPlaying,
    upcoming,
    topRated,
  }[type];

  return queryData();
};

export default useFetchDiscoverMovies;
