import { Metadata } from "next";
import { notFound } from "next/navigation";
import { tmdb } from "@/api/tmdb";
import { Cast } from "tmdb-ts/dist/types/credits";
import { Image } from "tmdb-ts";
import dynamic from "next/dynamic";

// Dynamic imports untuk komponen client-side
const PhotosSection = dynamic(() => import("@/components/ui/other/PhotosSection"));
const BackdropSection = dynamic(() => import("@/components/sections/Movie/Detail/Backdrop"));
const OverviewSection = dynamic(() => import("@/components/sections/Movie/Detail/Overview"));
const CastsSection = dynamic(() => import("@/components/sections/Movie/Detail/Casts"));
const RelatedSection = dynamic(() => import("@/components/sections/Movie/Detail/Related"));

// 1. Generate Metadata untuk SEO per Halaman
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const movieId = Number(id);
  if (!Number.isInteger(movieId) || movieId <= 0) {
    return {
      title: "Film Tidak Ditemukan",
      robots: { index: false, follow: false },
    };
  }
  try {
    const movie = await tmdb.movies.details(movieId);
    return {
      title: `${movie.title} - Nonton Film Sub Indo HD`,
      description: movie.overview?.substring(0, 160) || "Nonton film terbaru dengan kualitas HD.",
      alternates: { canonical: `/movie/${movieId}` },
      openGraph: {
        title: movie.title,
        description: movie.overview || "",
        images: [`https://image.tmdb.org/t/p/original${movie.poster_path}`],
      },
    };
  } catch {
    return {
      title: "Film Tidak Ditemukan",
      robots: { index: false, follow: false },
    };
  }
}

// 2. Halaman Utama (Server Component)
export default async function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const movieId = Number(id);
  if (!Number.isInteger(movieId) || movieId <= 0) notFound();

  // Fetch data di server
  const movie = await tmdb.movies.details(movieId, [
    "images",
    "videos",
    "credits",
    "keywords",
    "recommendations",
    "similar",
    "reviews",
    "external_ids",
  ]).catch(() => null);

  if (!movie) {
    notFound();
  }

  // 3. Structured Data (JSON-LD) agar muncul di Google Rich Results
  const movieSchema = {
    "@context": "https://schema.org",
    "@type": "Movie",
    "name": movie.title,
    "description": movie.overview,
    "image": `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
    "genre": movie.genres?.map((g) => g.name),
    "datePublished": movie.release_date,
  };

  return (
    <div className="mx-auto max-w-5xl">
      {/* Script untuk Google SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(movieSchema) }}
      />

      <div className="flex flex-col gap-10">
        <BackdropSection movie={movie} />
        <OverviewSection movie={movie} imdbId={movie.external_ids?.imdb_id} />
        <CastsSection casts={movie.credits.cast as Cast[]} />
        <PhotosSection images={movie.images.backdrops as Image[]} />
        <RelatedSection movie={movie} />
      </div>
    </div>
  );
}
