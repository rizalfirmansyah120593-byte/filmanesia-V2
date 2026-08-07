"use client";

import { tmdb } from "@/api/tmdb";
import { DiscoverTvShowsFetchQueryType } from "@/types/movie";
import { TvShowDiscoverResult } from "tmdb-ts/dist/types/discover";

interface FetchDiscoverTvShows {
  page?: number;
  type?: DiscoverTvShowsFetchQueryType;
  genres?: string;
  years?: string;
  countries?: string;
  ratings?: string;
}

const useFetchDiscoverTvShows = ({
  page = 1,
  type = "discover",
  genres,
  years,
  countries,
  ratings,
}: FetchDiscoverTvShows): Promise<TvShowDiscoverResult> => {
  const selectedYears = years?.split(",").filter(Boolean).map(Number) ?? [];
  const selectedRatings = ratings?.split(",").filter(Boolean).map((value) => value.split("-").map(Number)) ?? [];
  const ratingOptions = selectedRatings.flat();
  const options = {
    page,
    with_genres: genres,
    with_origin_country: countries,
    ...(ratingOptions.length ? { "vote_average.gte": Math.min(...ratingOptions), "vote_average.lte": Math.max(...ratingOptions) } : {}),
  } as Parameters<typeof tmdb.discover.tvShow>[0] & { with_origin_country?: string };
  const discover = async () => {
    if (selectedYears.length <= 1) return tmdb.discover.tvShow({ ...options, first_air_date_year: selectedYears[0] });
    const pages = await Promise.all(selectedYears.map((year) => tmdb.discover.tvShow({ ...options, first_air_date_year: year })));
    const results = Array.from(new Map(pages.flatMap((result) => result.results).map((show) => [show.id, show])).values());
    return { page, results, total_results: results.length, total_pages: 1 };
  };
  const todayTrending = () => tmdb.trending.trending("tv", "day", { page: page });
  const thisWeekTrending = () => tmdb.trending.trending("tv", "week", { page: page });
  const popular = () => tmdb.tvShows.popular({ page: page });
  const onTheAir = () => tmdb.tvShows.onTheAir({ page: page });
  const topRated = () => tmdb.tvShows.topRated({ page: page });

  const queryData = {
    discover,
    todayTrending,
    thisWeekTrending,
    popular,
    onTheAir,
    topRated,
  }[type];

  // @ts-expect-error: Property 'adult' is missing in type 'PopularTvShowResult' but required in type 'TV'.
  return queryData();
};

export default useFetchDiscoverTvShows;
