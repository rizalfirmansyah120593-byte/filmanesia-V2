import type { Metadata } from "next";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { tmdb } from "@/api/tmdb";
import { Cast } from "tmdb-ts/dist/types/credits";
import { Image } from "tmdb-ts";

const PhotosSection = dynamic(() => import("@/components/ui/other/PhotosSection"));
const TvShowRelatedSection = dynamic(() => import("@/components/sections/TV/Details/Related"));
const TvShowCastsSection = dynamic(() => import("@/components/sections/TV/Details/Casts"));
const TvShowBackdropSection = dynamic(() => import("@/components/sections/TV/Details/Backdrop"));
const TvShowOverviewSection = dynamic(() => import("@/components/sections/TV/Details/Overview"));
const TvShowsSeasonsSelection = dynamic(() => import("@/components/sections/TV/Details/Seasons"));

type Props = { params: Promise<{ id: string }> };

async function getShow(id: number) {
  return tmdb.tvShows.details(id, ["images", "videos", "credits", "keywords", "recommendations", "similar", "reviews", "watch/providers"]);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const tv = await getShow(Number(id));
    return {
      title: `${tv.name} - Nonton Serial TV Sub Indo HD`,
      description: tv.overview?.slice(0, 160) || `Informasi, pemeran, episode, dan detail serial TV ${tv.name}.`,
      alternates: { canonical: `/tv/${id}` },
      openGraph: { type: "video.tv_show", title: tv.name, description: tv.overview || "", images: tv.poster_path ? [`https://image.tmdb.org/t/p/original${tv.poster_path}`] : [] },
    };
  } catch { return { title: "Serial TV Tidak Ditemukan", robots: { index: false, follow: false } }; }
}

export default async function TVShowDetailPage({ params }: Props) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isInteger(id)) notFound();
  const tv = await getShow(id).catch(() => null);
  if (!tv) notFound();
  const schema = { "@context": "https://schema.org", "@type": "TVSeries", name: tv.name, description: tv.overview, image: tv.poster_path ? `https://image.tmdb.org/t/p/w500${tv.poster_path}` : undefined, genre: tv.genres?.map((g) => g.name), dateCreated: tv.first_air_date };
  return <div className="mx-auto max-w-5xl">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <div className="flex flex-col gap-10">
      <TvShowBackdropSection tv={tv} /><TvShowOverviewSection tv={tv} onViewEpisodesClick={() => undefined} />
      <TvShowCastsSection casts={tv.credits.cast as Cast[]} /><PhotosSection images={tv.images.backdrops as Image[]} type="tv" />
      <TvShowsSeasonsSelection id={id} seasons={tv.seasons} /><TvShowRelatedSection tv={tv} />
    </div>
  </div>;
}
