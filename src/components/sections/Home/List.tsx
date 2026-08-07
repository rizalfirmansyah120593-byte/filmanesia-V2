"use client";

import ContentTypeSelection from "@/components/ui/other/ContentTypeSelection";
import PopularGenres from "@/components/ui/other/PopularGenres";
import { siteConfig } from "@/config/site";
import { Spinner } from "@heroui/react";
import dynamic from "next/dynamic";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { Suspense } from "react";
import { tmdb } from "@/api/tmdb";
import useDiscoverFilters from "@/hooks/useDiscoverFilters";
const MovieHomeList = dynamic(() => import("@/components/sections/Movie/HomeList"));
const TvShowHomeList = dynamic(() => import("@/components/sections/TV/HomeList"));

const HomePageList: React.FC = () => {
  const { movies, tvShows } = siteConfig.queryLists;
  const [content] = useQueryState(
    "content",
    parseAsStringLiteral(["movie", "tv"]).withDefault("movie"),
  );
  const { countries, genres } = useDiscoverFilters();
  const isKDrama = content === "tv" && countries.has("KR") && genres.has("18");

  return (
    <div className="flex flex-col gap-12">
      <ContentTypeSelection className="justify-center" showKDrama />
      <PopularGenres />
      <div className="relative flex min-h-32 flex-col gap-12">
        <Suspense
          fallback={
            <Spinner
              size="lg"
              variant="simple"
              className="absolute-center"
              color={content === "movie" ? "primary" : "warning"}
            />
          }
        >
          {content === "movie" && !isKDrama &&
            movies.map((movie) => <MovieHomeList key={movie.name} {...movie} />)}
          {content === "tv" && isKDrama && (
            <TvShowHomeList
              name="Drama Korea"
              param="popular"
              layout="grid"
              query={() =>
                tmdb.discover.tvShow({
                  page: 1,
                  with_genres: "18",
                  with_origin_country: "KR",
                } as Parameters<typeof tmdb.discover.tvShow>[0] & { with_origin_country: string })
              }
            />
          )}
          {content === "tv" && !isKDrama && tvShows.map((tv) => <TvShowHomeList key={tv.name} {...tv} />)}
        </Suspense>
      </div>
    </div>
  );
};

export default HomePageList;
