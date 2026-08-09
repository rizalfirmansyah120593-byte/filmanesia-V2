"use client";

import { Chip } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";

export default function OmdbRating({ imdbId }: { imdbId?: string }) {
  const { data } = useQuery({
    queryKey: ["omdb-rating", imdbId],
    queryFn: async () => {
      const response = await fetch(`/api/omdb?imdbId=${encodeURIComponent(imdbId!)}`);
      return response.json() as Promise<{ available: boolean; imdbRating?: string; imdbVotes?: string }>;
    },
    enabled: Boolean(imdbId),
    staleTime: 86_400_000,
    retry: false,
  });

  if (!data?.available || !data.imdbRating) return null;

  return (
    <Chip size="sm" variant="flat" color="warning" className="w-fit">
      IMDb {data.imdbRating}{data.imdbVotes ? ` (${data.imdbVotes})` : ""}
    </Chip>
  );
}
