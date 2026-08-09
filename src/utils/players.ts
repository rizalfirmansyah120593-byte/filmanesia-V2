import { PlayersProps } from "@/types";

export const SUBTITLE_OPTIONS = [
  { label: "Nonaktif", value: "off" },
  { label: "Indonesia", value: "id" },
  { label: "English", value: "en" },
  { label: "Malay", value: "ms" },
  { label: "Español", value: "es" },
  { label: "Français", value: "fr" },
] as const;

export type SubtitleLanguage = (typeof SUBTITLE_OPTIONS)[number]["value"];
export const DEFAULT_SUBTITLE_LANGUAGE: SubtitleLanguage = "id";

const addSubtitleLanguage = (source: string, subtitleLanguage: SubtitleLanguage): string => {
  if (subtitleLanguage === "off") return source;

  const separator = source.includes("?") ? "&" : "?";
  return `${source}${separator}ds_lang=${subtitleLanguage}`;
};

const addWyzieSubtitle = (
  source: string,
  tmdbId: string | number,
  subtitleLanguage: SubtitleLanguage,
  episode?: { season: number; episode: number },
) => {
  if (subtitleLanguage === "off") return source;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const params = new URLSearchParams({ tmdbId: String(tmdbId), lang: subtitleLanguage });
  if (episode) {
    params.set("season", String(episode.season));
    params.set("episode", String(episode.episode));
  }
  const subtitleUrl = `${baseUrl}/api/subtitles?${params.toString()}`;
  return `${source}${source.includes("?") ? "&" : "?"}sub_file=${encodeURIComponent(subtitleUrl)}&sub_label=${encodeURIComponent(subtitleLanguage === "id" ? "Indonesia" : subtitleLanguage === "en" ? "English" : subtitleLanguage)}`;
};

/** Requests a lightweight default stream for providers that support quality query parameters. */
const addDefaultQuality = (source: string): string =>
  `${source}${source.includes("?") ? "&" : "?"}quality=480&max_quality=480`;

/**
 * Generates a list of movie players with their respective titles and source URLs.
 * Each player is constructed using the provided movie ID.
 *
 * @param {string | number} id - The ID of the movie to be embedded in the player URLs.
 * @param {number} [startAt] - The start position in seconds to be embedded in the player URLs. Optional.
 * @returns {PlayersProps[]} - An array of objects, each containing
 * the title of the player and the corresponding source URL.
 */
export const getMoviePlayers = (
  id: string | number,
  startAt?: number,
  subtitleLanguage: SubtitleLanguage = DEFAULT_SUBTITLE_LANGUAGE,
): PlayersProps[] => {
  return [
    {
      title: "VidLink",
      source: addWyzieSubtitle(addSubtitleLanguage(`https://vidlink.pro/movie/${id}?player=jw&primaryColor=006fee&secondaryColor=a2a2a2&iconColor=eefdec&autoplay=true&startAt=${startAt || ""}`, subtitleLanguage), id, subtitleLanguage),
      recommended: true,
      fast: true,
      ads: true,
      resumable: true,
      supportsSubtitles: true,
    },
    {
      title: "VidLink 2",
      source: addWyzieSubtitle(addSubtitleLanguage(`https://vidlink.pro/movie/${id}?primaryColor=006fee&autoplay=true&startAt=${startAt}`, subtitleLanguage), id, subtitleLanguage),
      recommended: true,
      fast: true,
      ads: true,
      resumable: true,
      supportsSubtitles: true,
    },
    {
      title: "VidKing",
      // NOTE: VidKing has a known issue with the `progress` query parameter where it stuck at that timestamp.
      // Currently, this player can save playback progress but cannot resume from a specific timestamp.
      // The `progress` parameter is commented out in the source URL until this is resolved.
      source: `https://www.vidking.net/embed/movie/${id}?color=006fee&autoplay=false`, //&progress=${startAt || ""}`,
      recommended: true,
      fast: true,
      resumable: true,
    },
    {
      title: "<Embed>",
      source: `https://embed.su/embed/movie/${id}`,
      ads: true,
    },
    {
      title: "SuperEmbed",
      source: `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1`,
      fast: true,
      ads: true,
    },
    {
      title: "FilmKu",
      source: `https://filmku.stream/embed/${id}`,
      ads: true,
    },
    {
      title: "NontonGo",
      source: `https://www.nontongo.win/embed/movie/${id}`,
      ads: true,
    },
    {
      title: "AutoEmbed 1",
      source: `https://autoembed.co/movie/tmdb/${id}`,
      fast: true,
      ads: true,
    },
    {
      title: "AutoEmbed 2",
      source: `https://player.autoembed.cc/embed/movie/${id}`,
      ads: true,
    },
    {
      title: "2Embed",
      source: `https://www.2embed.cc/embed/${id}`,
      ads: true,
    },
    {
      title: "VidSrc 1",
      source: addSubtitleLanguage(`https://vidsrc.xyz/embed/movie/${id}`, subtitleLanguage),
      ads: true,
      supportsSubtitles: true,
    },
    {
      title: "VidSrc 2",
      source: addSubtitleLanguage(`https://vidsrc.to/embed/movie/${id}`, subtitleLanguage),
      ads: true,
      supportsSubtitles: true,
    },
    {
      title: "VidSrc 3",
      source: addSubtitleLanguage(`https://vidsrc.icu/embed/movie/${id}`, subtitleLanguage),
      ads: true,
      supportsSubtitles: true,
    },
    {
      title: "VidSrc 4",
      source: addSubtitleLanguage(
        `https://vidsrc.cc/v2/embed/movie/${id}?autoPlay=false`,
        subtitleLanguage,
      ),
      ads: true,
      supportsSubtitles: true,
    },
    {
      title: "VidSrc 5",
      source: addSubtitleLanguage(
        `https://vidsrc.cc/v3/embed/movie/${id}?autoPlay=false`,
        subtitleLanguage,
      ),
      recommended: true,
      fast: true,
      ads: true,
      supportsSubtitles: true,
    },
    {
      title: "MoviesAPI",
      source: `https://moviesapi.club/movie/${id}`,
      ads: true,
    },
  ].map((player) => ({
    ...player,
    source: addDefaultQuality(player.source),
  }));
};

/**
 * Generates a list of TV show players with their respective titles and source URLs.
 * Each player is constructed using the provided TV show ID, season, and episode.
 *
 * @param {string | number} id - The ID of the TV show to be embedded in the player URLs.
 * @param {string | number} [season] - The season number of the TV show episode to be embedded.
 * @param {string | number} [episode] - The episode number of the TV show episode to be embedded.
 * @param {number} [startAt] - The start position in seconds to be embedded in the player URLs. Optional.
 * @returns {PlayersProps[]} - An array of objects, each containing
 * the title of the player and the corresponding source URL.
 */
export const getTvShowPlayers = (
  id: string | number,
  season: number,
  episode: number,
  startAt?: number,
  subtitleLanguage: SubtitleLanguage = DEFAULT_SUBTITLE_LANGUAGE,
): PlayersProps[] => {
  return [
    {
      title: "VidLink",
      source: addWyzieSubtitle(addSubtitleLanguage(`https://vidlink.pro/tv/${id}/${season}/${episode}?player=jw&primaryColor=f5a524&secondaryColor=a2a2a2&iconColor=eefdec&autoplay=true&startAt=${startAt || ""}`, subtitleLanguage), id, subtitleLanguage, { season, episode }),
      recommended: true,
      fast: true,
      ads: true,
      resumable: true,
      supportsSubtitles: true,
    },
    {
      title: "VidLink 2",
      source: addWyzieSubtitle(addSubtitleLanguage(`https://vidlink.pro/tv/${id}/${season}/${episode}?primaryColor=f5a524&autoplay=true&startAt=${startAt}`, subtitleLanguage), id, subtitleLanguage, { season, episode }),
      recommended: true,
      fast: true,
      ads: true,
      resumable: true,
      supportsSubtitles: true,
    },
    {
      title: "VidKing",
      // NOTE: VidKing has a known issue with the `progress` query parameter where it stuck at that timestamp.
      // Currently, this player can save playback progress but cannot resume from a specific timestamp.
      // The `progress` parameter is commented out in the source URL until this is resolved.
      source: `https://www.vidking.net/embed/tv/${id}/${season}/${episode}?color=f5a524&autoplay=false`, //&progress=${startAt || ""}`,
      recommended: true,
      fast: true,
      resumable: true,
    },
    {
      title: "<Embed>",
      source: `https://embed.su/embed/tv/${id}/${season}/${episode}`,
      ads: true,
    },
    {
      title: "SuperEmbed",
      source: `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1&s=${season}&e=${episode}`,
      fast: true,
      ads: true,
    },
    {
      title: "FilmKu",
      source: `https://filmku.stream/embed/series?tmdb=${id}&sea=${season}&epi=${episode}`,
      ads: true,
    },
    {
      title: "NontonGo",
      source: `https://www.NontonGo.win/embed/tv/${id}/${season}/${episode}`,
      ads: true,
    },
    {
      title: "AutoEmbed 1",
      source: `https://autoembed.co/tv/tmdb/${id}-${season}-${episode}`,
      fast: true,
      ads: true,
    },
    {
      title: "AutoEmbed 2",
      source: `https://player.autoembed.cc/embed/tv/${id}/${season}/${episode}`,
      ads: true,
    },
    {
      title: "2Embed",
      source: `https://www.2embed.cc/embedtv/${id}&s=${season}&e=${episode}`,
      ads: true,
    },
    {
      title: "VidSrc 1",
      source: addSubtitleLanguage(
        `https://vidsrc.xyz/embed/tv/${id}/${season}/${episode}`,
        subtitleLanguage,
      ),
      ads: true,
      supportsSubtitles: true,
    },
    {
      title: "VidSrc 2",
      source: addSubtitleLanguage(
        `https://vidsrc.to/embed/tv/${id}/${season}/${episode}`,
        subtitleLanguage,
      ),
      ads: true,
      supportsSubtitles: true,
    },
    {
      title: "VidSrc 3",
      source: addSubtitleLanguage(
        `https://vidsrc.icu/embed/tv/${id}/${season}/${episode}`,
        subtitleLanguage,
      ),
      ads: true,
      supportsSubtitles: true,
    },
    {
      title: "VidSrc 4",
      source: addSubtitleLanguage(
        `https://vidsrc.cc/v2/embed/tv/${id}/${season}/${episode}?autoPlay=false`,
        subtitleLanguage,
      ),
      ads: true,
      supportsSubtitles: true,
    },
    {
      title: "VidSrc 5",
      source: addSubtitleLanguage(
        `https://vidsrc.cc/v3/embed/tv/${id}/${season}/${episode}?autoPlay=false`,
        subtitleLanguage,
      ),
      recommended: true,
      fast: true,
      ads: true,
      supportsSubtitles: true,
    },
    {
      title: "MoviesAPI",
      source: `https://moviesapi.club/tv/${id}-${season}-${episode}`,
      ads: true,
    },
  ].map((player) => ({
    ...player,
    source: addDefaultQuality(player.source),
  }));
};
