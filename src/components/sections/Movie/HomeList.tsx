"use client";

import MoviePosterCard from "@/components/sections/Movie/Cards/Poster";
import SectionTitle from "@/components/ui/other/SectionTitle";
import Carousel from "@/components/ui/wrapper/Carousel";
import { QueryList } from "@/types";
import { Link, Skeleton } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { kebabCase } from "string-ts";
import { Movie } from "tmdb-ts/dist/types";

const MovieHomeList: React.FC<QueryList<Movie>> = ({ query, name, param }) => {
  const key = kebabCase(name) + "-list";
  const { data, isLoading } = useQuery({
    queryFn: query,
    queryKey: [key],
    enabled: true,
    staleTime: 1000 * 60 * 10,
  });

  return (
    <section id={key} className="min-h-[250px] md:min-h-[300px]">
      {isLoading ? (
        <div className="flex w-full flex-col gap-5">
          <div className="flex grow items-center justify-between">
            <Skeleton className="h-7 w-40 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-[250px] rounded-lg md:h-[300px]" />
        </div>
      ) : (
        <div className="z-3 flex flex-col gap-2">
          <div className="flex grow items-center justify-between">
            <SectionTitle>{name}</SectionTitle>
            <Link size="sm" href={`/discover?type=${param}`} isBlock color="foreground" className="rounded-full">
              See All &gt;
            </Link>
          </div>
          {name === "Today's Trending Movies" ? (
            <div className="trending-marquee group" aria-label="Today's Trending Movies">
              <div className="trending-marquee-track group-hover:[animation-play-state:paused] motion-reduce:animate-none">
                {[...(data?.results ?? []), ...(data?.results ?? [])].map((movie, index) => (
                  <div key={`${movie.id}-${index}`} className="flex min-h-fit max-w-fit shrink-0 items-center py-2">
                    <MoviePosterCard movie={movie} isPriority={index < 8} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <Carousel>
              {data?.results?.map((movie, index) => (
                <div key={movie.id} className="embla__slide flex min-h-fit max-w-fit items-center px-1 py-2">
                  <MoviePosterCard movie={movie} isPriority={index < 4} />
                </div>
              ))}
            </Carousel>
          )}
        </div>
      )}
    </section>
  );
};

export default MovieHomeList;
