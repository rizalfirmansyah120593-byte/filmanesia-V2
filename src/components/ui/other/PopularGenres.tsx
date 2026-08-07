"use client";

import { tmdb } from "@/api/tmdb";
import Genres from "@/components/ui/other/Genres";
import useDiscoverFilters from "@/hooks/useDiscoverFilters";
import { useQuery } from "@tanstack/react-query";

const POPULAR_GENRE_NAMES = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Horror",
  "Romance",
  "Thriller",
];

const PopularGenres = () => {
  const { content } = useDiscoverFilters();
  const { data, isPending } = useQuery({
    queryKey: ["popular-home-genres", content],
    queryFn: () => (content === "movie" ? tmdb.genres.movies() : tmdb.genres.tvShows()),
    staleTime: 1000 * 60 * 60,
  });

  const genres = POPULAR_GENRE_NAMES.map((name) =>
    data?.genres.find((genre) => genre.name === name),
  ).filter((genre): genre is NonNullable<typeof genre> => Boolean(genre));

  return (
    <div className="flex min-h-8 w-full flex-wrap justify-center gap-2">
      {isPending ? (
        <span className="text-muted-foreground text-sm">Memuat genre...</span>
      ) : (
        <Genres
          genres={genres}
          type={content}
          chipProps={{
            size: "sm",
            variant: "flat",
            radius: "full",
            color: content === "movie" ? "primary" : "warning",
          }}
        />
      )}
    </div>
  );
};

export default PopularGenres;
