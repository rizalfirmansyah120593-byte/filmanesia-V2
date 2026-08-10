"use client";

import { tmdb } from "@/api/tmdb";
import MoviePlayer from "@/components/sections/Movie/Player/Player";
import { Params } from "@/types";
import { isEmpty } from "@/utils/helpers";
import { Spinner } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { NextPage } from "next";
import { notFound } from "next/navigation";
import { use } from "react";

const MoviePlayerPage: NextPage<Params<{ id: number }>> = ({ params }) => {
  const { id } = use(params);

  const {
    data: movie,
    isPending,
    error,
  } = useQuery({
    queryFn: () => tmdb.movies.details(id),
    queryKey: ["movie-player-detail", id],
  });

  if (isPending) {
    return <Spinner size="lg" className="absolute-center" variant="simple" />;
  }

  if (error || isEmpty(movie)) return notFound();

  return <MoviePlayer movie={movie} />;
};

export default MoviePlayerPage;
