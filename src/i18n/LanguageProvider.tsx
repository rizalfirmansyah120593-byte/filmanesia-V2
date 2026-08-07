"use client";

import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";

export type Language = "id" | "en" | "ms";

const translations: Record<Language, Record<string, string>> = {
  id: {
    home: "Home", filter: "Filter", search: "Pencarian", about: "Tentang", movies: "Film",
    tvSeries: "Serial TV", kDrama: "K-Drama", seeAll: "Lihat Semua", movie: "Film", tv: "TV",
    popular: "Populer", nowPlaying: "Sedang Tayang", upcoming: "Akan Tayang", topRated: "Rating Terbaik",
    todayTrending: "Film Trending Hari Ini", thisWeekTrending: "Film Trending Minggu Ini",
    action: "Aksi", adventure: "Petualangan", animation: "Animasi", comedy: "Komedi", crime: "Kriminal",
    documentary: "Dokumenter", drama: "Drama", horror: "Horor", romance: "Romantis", thriller: "Thriller",
    language: "Bahasa", indonesia: "Indonesia", english: "Inggris", malay: "Melayu", searchPlaceholder: "Cari film favoritmu...", synopsis: "Sinopsis",
  },
  en: {
    home: "Home", filter: "Filter", search: "Search", about: "About", movies: "Movies",
    tvSeries: "TV Series", kDrama: "K-Drama", seeAll: "See All", movie: "Movie", tv: "TV",
    popular: "Popular", nowPlaying: "Now Playing", upcoming: "Upcoming", topRated: "Top Rated",
    todayTrending: "Today's Trending Movies", thisWeekTrending: "This Week's Trending Movies",
    action: "Action", adventure: "Adventure", animation: "Animation", comedy: "Comedy", crime: "Crime",
    documentary: "Documentary", drama: "Drama", horror: "Horror", romance: "Romance", thriller: "Thriller",
    language: "Language", indonesia: "Indonesian", english: "English", malay: "Malay", searchPlaceholder: "Search your favorite movies...", synopsis: "Synopsis",
  },
  ms: {
    home: "Laman Utama", filter: "Tapis", search: "Carian", about: "Tentang", movies: "Filem",
    tvSeries: "Siri TV", kDrama: "K-Drama", seeAll: "Lihat Semua", movie: "Filem", tv: "TV",
    popular: "Popular", nowPlaying: "Sedang Ditayangkan", upcoming: "Akan Datang", topRated: "Penarafan Tertinggi",
    todayTrending: "Filem Trending Hari Ini", thisWeekTrending: "Filem Trending Minggu Ini",
    action: "Aksi", adventure: "Pengembaraan", animation: "Animasi", comedy: "Komedi", crime: "Jenayah",
    documentary: "Dokumentari", drama: "Drama", horror: "Seram", romance: "Romantik", thriller: "Thriller",
    language: "Bahasa", indonesia: "Indonesia", english: "Inggeris", malay: "Melayu", searchPlaceholder: "Cari filem kegemaran anda...", synopsis: "Sinopsis",
  },
};

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LanguageProvider = ({ children }: PropsWithChildren) => {
  const [language, setLanguageState] = useState<Language>("id");

  useEffect(() => {
    const saved = window.localStorage.getItem("filmanesia-language") as Language | null;
    if (saved && saved in translations) setLanguageState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage: (next: Language) => {
      setLanguageState(next);
      window.localStorage.setItem("filmanesia-language", next);
    },
    t: (key: string) => translations[language][key] ?? key,
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
};
