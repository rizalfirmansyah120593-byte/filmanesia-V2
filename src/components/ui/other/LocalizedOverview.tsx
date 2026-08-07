"use client";

import { env } from "@/utils/env";
import { useLanguage } from "@/i18n/LanguageProvider";
import { useEffect, useState } from "react";

interface LocalizedOverviewProps {
  id: number;
  type: "movie" | "tv";
  fallback?: string;
}

const LocalizedOverview = ({ id, type, fallback = "" }: LocalizedOverviewProps) => {
  const { language } = useLanguage();
  const [overview, setOverview] = useState(fallback);

  useEffect(() => {
    const controller = new AbortController();
    const languageCode = language === "ms" ? "ms-MY" : language === "id" ? "id-ID" : "en-US";
    fetch(`https://api.themoviedb.org/3/${type}/${id}?language=${languageCode}`, {
      headers: { Authorization: `Bearer ${env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}` },
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => data?.overview && setOverview(data.overview))
      .catch(() => undefined);
    return () => controller.abort();
  }, [id, language, type]);

  return <>{overview || (language === "id" ? "Sinopsis belum tersedia." : language === "ms" ? "Sinopsis belum tersedia." : "Synopsis unavailable.")}</>;
};

export default LocalizedOverview;
