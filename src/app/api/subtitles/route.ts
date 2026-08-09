import { NextResponse } from "next/server";
import { env } from "@/utils/env";

const allowedLanguages = new Set(["id", "en", "ms", "es", "fr"]);

const toVtt = (subtitle: string) => {
  const normalized = subtitle.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").trim();
  if (normalized.startsWith("WEBVTT")) return normalized.endsWith("\n") ? normalized : `${normalized}\n`;

  const cues = normalized.replace(/^(?:\d+\n)?/, "").replace(/\n{3,}/g, "\n\n");
  return `WEBVTT\n\n${cues.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, "$1.$2")}\n`;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tmdbId = searchParams.get("tmdbId");
  const language = searchParams.get("lang") || "id";
  const season = searchParams.get("season");
  const episode = searchParams.get("episode");

  if (!env.WYZIE_API_KEY || !tmdbId || !/^\d+$/.test(tmdbId) || !allowedLanguages.has(language)) {
    return new NextResponse("Subtitle tidak tersedia", { status: 404 });
  }

  const params = new URLSearchParams({
    id: tmdbId,
    language,
    format: "srt,vtt",
    source: "all",
    key: env.WYZIE_API_KEY,
  });
  if (season && episode && /^\d+$/.test(season) && /^\d+$/.test(episode)) {
    params.set("season", season);
    params.set("episode", episode);
  }

  try {
    let response = await fetch(`https://sub.wyzie.io/search?${params}`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return new NextResponse("Subtitle tidak tersedia", { status: 404 });

    let results = (await response.json()) as Array<{ url?: string; language?: string }>;
    // AI translation is available for eligible Wyzie keys when no native
    // Indonesian track exists.
    if (results.length === 0) {
      params.set("source", "ai");
      response = await fetch(`https://sub.wyzie.io/search?${params}`, { next: { revalidate: 3600 } });
      if (response.ok) results = (await response.json()) as Array<{ url?: string; language?: string }>;
    }
    const match = results.find((item) => item.language === language) ?? results[0];
    if (!match?.url) return new NextResponse("Subtitle tidak tersedia", { status: 404 });

    const subtitleResponse = await fetch(match.url, { next: { revalidate: 3600 } });
    if (!subtitleResponse.ok) return new NextResponse("Subtitle tidak tersedia", { status: 404 });

    return new NextResponse(toVtt(await subtitleResponse.text()), {
      headers: {
        "Content-Type": "text/vtt; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return new NextResponse("Subtitle tidak tersedia", { status: 404 });
  }
}
