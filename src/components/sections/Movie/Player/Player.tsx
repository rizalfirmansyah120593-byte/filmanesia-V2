import { IS_PRODUCTION, SpacingClasses } from "@/utils/constants";
import { siteConfig } from "@/config/site";
import { cn } from "@/utils/helpers";
import { mutateMovieTitle } from "@/utils/movies";
import { DEFAULT_SUBTITLE_LANGUAGE, getMoviePlayers, SUBTITLE_OPTIONS, SubtitleLanguage } from "@/utils/players";
import { Card, Skeleton } from "@heroui/react";
import { useDisclosure, useDocumentTitle } from "@mantine/hooks";
import dynamic from "next/dynamic";
import { parseAsInteger, parseAsStringLiteral, useQueryState } from "nuqs";
import { useEffect, useMemo, useState } from "react";
import { MovieDetails } from "tmdb-ts/dist/types/movies";
import { usePlayerEvents } from "@/hooks/usePlayerEvents";
import { AdsterraPlayerGate } from "@/components/ads/Adsterra";
const AdsWarning = dynamic(() => import("@/components/ui/overlay/AdsWarning"));
const MoviePlayerHeader = dynamic(() => import("./Header"));
const MoviePlayerSourceSelection = dynamic(() => import("./SourceSelection"));

interface MoviePlayerProps {
  movie: MovieDetails;
  startAt?: number;
}

const MoviePlayer: React.FC<MoviePlayerProps> = ({ movie, startAt }) => {
  const title = mutateMovieTitle(movie);
  const [iframeReady, setIframeReady] = useState(false);
  const [playerUnlocked, setPlayerUnlocked] = useState(() => !IS_PRODUCTION);
  const [opened, handlers] = useDisclosure(false);
  const [selectedSource, setSelectedSource] = useQueryState<number>(
    "src",
    parseAsInteger.withDefault(0),
  );
  const [selectedSubtitle, setSelectedSubtitle] = useQueryState<SubtitleLanguage>(
    "sub",
    parseAsStringLiteral(SUBTITLE_OPTIONS.map(({ value }) => value)).withDefault(DEFAULT_SUBTITLE_LANGUAGE),
  );

  const players = getMoviePlayers(movie.id, startAt, selectedSubtitle);

  const { lastEvent } = usePlayerEvents({ saveHistory: false });
  useDocumentTitle(`Play ${title} | ${siteConfig.name}`);

  const PLAYER = useMemo(() => players[selectedSource] || players[0], [players, selectedSource]);

  useEffect(() => {
    if (selectedSubtitle === "off" || PLAYER.supportsSubtitles) return;

    const subtitleSource = players.findIndex((player) => player.title === "VidSrc 5");
    const fallbackSource = players.findIndex((player) => player.supportsSubtitles);
    const nextSource = subtitleSource >= 0 ? subtitleSource : fallbackSource;

    if (nextSource >= 0 && nextSource !== selectedSource) {
      setSelectedSource(nextSource);
    }
  }, [PLAYER.supportsSubtitles, players, selectedSource, selectedSubtitle, setSelectedSource]);

  useEffect(() => {
    const cachedSource = Number(window.localStorage.getItem("filmanesia-working-movie-source"));
    if (selectedSource === 0 && Number.isInteger(cachedSource) && cachedSource > 0 && cachedSource < players.length) {
      setSelectedSource(cachedSource);
    }
  }, [players.length, selectedSource, setSelectedSource]);

  useEffect(() => {
    if (lastEvent === "play") {
      window.localStorage.setItem("filmanesia-working-movie-source", String(selectedSource));
    }
  }, [lastEvent, selectedSource]);

  const moveToNextSource = () => {
    if (selectedSubtitle !== "off" && selectedSource >= 10) {
      setSelectedSubtitle("off");
      setSelectedSource(2);
      return;
    }
    const nextIndex = players.findIndex(
      (player, index) => index > selectedSource && (selectedSubtitle === "off" || player.supportsSubtitles),
    );
    const firstValidIndex = players.findIndex(
      (player) => selectedSubtitle === "off" || player.supportsSubtitles,
    );
    setSelectedSource(nextIndex >= 0 ? nextIndex : firstValidIndex >= 0 ? firstValidIndex : 2);
  };

  useEffect(() => {
    if (!playerUnlocked || iframeReady || lastEvent === "play") return;
    const fallbackTimer = window.setTimeout(() => {
      if (!iframeReady) moveToNextSource();
    }, 8000);

    return () => window.clearTimeout(fallbackTimer);
  }, [iframeReady, lastEvent, playerUnlocked, selectedSource, selectedSubtitle]);

  useEffect(() => {
    setIframeReady(false);
  }, [PLAYER.source]);

  const handleSubtitleChange = (subtitle: SubtitleLanguage) => {
    if (subtitle !== "off" && !PLAYER.supportsSubtitles) {
      const subtitleSource = players.findIndex((player) => player.title === "VidSrc 5") >= 0
        ? players.findIndex((player) => player.title === "VidSrc 5")
        : players.findIndex((player) => player.supportsSubtitles);
      if (subtitleSource >= 0) setSelectedSource(subtitleSource);
    }

    setSelectedSubtitle(subtitle);
  };

  return (
    <>
      <AdsWarning />

      <div className={cn("relative", SpacingClasses.reset)}>
        <MoviePlayerHeader
          id={movie.id}
          movieName={title}
          onOpenSource={handlers.open}
          onOpenSubtitle={handlers.open}
          selectedSubtitle={selectedSubtitle}
        />
        <Card shadow="md" radius="none" className="relative aspect-video h-auto w-full">
          <Skeleton className="absolute h-full w-full" />
          {playerUnlocked && <iframe
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              loading="eager"
              key={`${PLAYER.title}-${selectedSubtitle}`}
              src={PLAYER.source}
              onLoad={() => setIframeReady(true)}
              onError={moveToNextSource}
              className="z-10 h-full w-full"
            />}
          {!playerUnlocked && <AdsterraPlayerGate onContinue={() => setPlayerUnlocked(true)} />}
        </Card>
      </div>

      <MoviePlayerSourceSelection
        opened={opened}
        onClose={handlers.close}
        players={players}
        selectedSource={selectedSource}
        setSelectedSource={setSelectedSource}
        selectedSubtitle={selectedSubtitle}
        setSelectedSubtitle={handleSubtitleChange}
      />
    </>
  );
};

MoviePlayer.displayName = "MoviePlayer";

export default MoviePlayer;
