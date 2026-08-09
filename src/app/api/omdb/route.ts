import { NextResponse } from "next/server";
import { env } from "@/utils/env";

export async function GET(request: Request) {
  const imdbId = new URL(request.url).searchParams.get("imdbId");

  if (!env.OMDB_API_KEY || !imdbId || !/^tt\d+$/.test(imdbId)) {
    return NextResponse.json({ available: false }, { status: 200 });
  }

  try {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=${encodeURIComponent(env.OMDB_API_KEY)}&i=${imdbId}&plot=short`,
      { next: { revalidate: 86400 } },
    );
    const data = await response.json();

    if (!response.ok || data.Response === "False") {
      return NextResponse.json({ available: false }, { status: 200 });
    }

    return NextResponse.json({
      available: true,
      imdbRating: data.imdbRating !== "N/A" ? data.imdbRating : null,
      metascore: data.Metascore !== "N/A" ? data.Metascore : null,
      imdbVotes: data.imdbVotes !== "N/A" ? data.imdbVotes : null,
      rated: data.Rated !== "N/A" ? data.Rated : null,
    });
  } catch {
    return NextResponse.json({ available: false }, { status: 200 });
  }
}
