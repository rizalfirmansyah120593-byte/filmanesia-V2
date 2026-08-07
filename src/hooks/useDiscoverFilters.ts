import { queryClient as q } from "@/app/providers";
import { siteConfig } from "@/config/site";
import { DISCOVER_MOVIES_VALID_QUERY_TYPES, DISCOVER_TVS_VALID_QUERY_TYPES } from "@/types/movie";
import { parseAsSet } from "@/utils/parsers";
import { useQueryState, parseAsStringLiteral } from "nuqs";
import { useCallback, useMemo, useEffect } from "react";

const VALID_CONTENT_TYPES = ["movie", "tv"] as const;
const DEFAULT_QUERY_TYPE = "discover";

const useDiscoverFilters = () => {
  const { movies, tvShows } = siteConfig.queryLists;

  const [genres, setGenres] = useQueryState("genres", parseAsSet.withDefault(new Set([])));
  const [years, setYears] = useQueryState("years", parseAsSet.withDefault(new Set([])));
  const [countries, setCountries] = useQueryState("countries", parseAsSet.withDefault(new Set([])));
  const [ratings, setRatings] = useQueryState("ratings", parseAsSet.withDefault(new Set([])));
  const [queryType, setQueryType] = useQueryState(
    "type",
    parseAsStringLiteral([
      ...DISCOVER_MOVIES_VALID_QUERY_TYPES,
      ...DISCOVER_TVS_VALID_QUERY_TYPES,
    ]).withDefault(DEFAULT_QUERY_TYPE),
  );
  const [content, setContent] = useQueryState(
    "content",
    parseAsStringLiteral(VALID_CONTENT_TYPES).withDefault("movie"),
  );

  const types = useMemo(
    () => [
      { name: "Discover", key: DEFAULT_QUERY_TYPE },
      ...(content === "movie" ? movies : tvShows).map(({ name, param }) => ({
        name: name.replace(/(Movies|TV Shows)/g, "").trim(),
        key: param,
      })),
    ],
    [content, movies, tvShows],
  );

  const genresString = useMemo(
    () =>
      Array.from(genres)
        .filter((genre) => genre !== "")
        .join(","),
    [genres],
  );

  const yearsString = useMemo(() => Array.from(years).filter(Boolean).join(","), [years]);
  const countriesString = useMemo(() => Array.from(countries).filter(Boolean).join(","), [countries]);
  const ratingsString = useMemo(() => Array.from(ratings).filter(Boolean).join(","), [ratings]);

  const resetFilters = useCallback(() => {
    setGenres(null);
    setYears(null);
    setCountries(null);
    setRatings(null);
    setQueryType(DEFAULT_QUERY_TYPE);
  }, [setCountries, setGenres, setQueryType, setRatings, setYears]);

  const clearQueries = useCallback(() => {
    const queryKeys = ["discover-movies", "discover-tv-shows"];
    queryKeys.forEach((key) => {
      if (!q.isFetching({ queryKey: [key] })) {
        q.removeQueries({ queryKey: [key] });
      }
    });
  }, [q]);

  useEffect(() => {
    clearQueries();
  }, [content, queryType, genresString, yearsString, countriesString, ratingsString]);

  return {
    types,
    genres,
    queryType,
    content,
    genresString,
    years,
    yearsString,
    countries,
    countriesString,
    ratings,
    ratingsString,
    setGenres,
    setYears,
    setCountries,
    setRatings,
    setQueryType,
    setContent,
    resetFilters,
  };
};

export default useDiscoverFilters;
