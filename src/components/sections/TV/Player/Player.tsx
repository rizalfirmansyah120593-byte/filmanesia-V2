import { siteConfig } from "@/config/site";
import { IS_PRODUCTION } from "@/utils/constants";
import { cn } from "@/utils/helpers";
import { DEFAULT_SUBTITLE_LANGUAGE, getTvShowPlayers, SUBTITLE_OPTIONS, SubtitleLanguage } from "@/utils/players";
import { Card, Skeleton } from "@heroui/react";
import { useDisclosure, useDocumentTitle } from "@mantine/hooks";
import dynamic from "next/dynamic";
import { parseAsInteger, parseAsStringLiteral, useQueryState } from "nuqs";
import { memo, useEffect, useMemo, useState } from "react";
import { Episode, TvShowDetails } from "tmdb-ts";
import { SpacingClasses } from "@/utils/constants";
import { usePlayerEvents } from "@/hooks/usePlayerEvents";
import { AdsterraPlayerGate } from "@/components/ads/Adsterra";
const AdsWarning = dynamic(() => import("@/components/ui/overlay/AdsWarning"));
const TvShowPlayerHeader = dynamic(() => import("./Header"));
const TvShowPlayerSourceSelection = dynamic(() => import("./SourceSelection"));
const TvShowPlayerEpisodeSelection = dynamic(() => import("./EpisodeSelection"));

// Version the preference because the provider list is data, not a stable API;
// old numeric indexes can point at a different provider after an update.
const TV_SOURCE_STORAGE_KEY = "filmanesia-working-tv-source-v2";

export interface TvShowPlayerProps {
  tv: TvShowDetails;
  id: number;
  seriesName: string;
  seasonName: string;
  episode: Episode;
  episodes: Episode[];
  nextEpisodeNumber: number | null;
  prevEpisodeNumber: number | null;
  startAt?: number;
}

const TvShowPlayer: React.FC<TvShowPlayerProps> = ({
  tv,
  id,
  episode,
  episodes,
  startAt,
  ...props
}) => {
  const [iframeReady, setIframeReady] = useState(false);
  const [playerUnlocked, setPlayerUnlocked] = useState(() => !IS_PRODUCTION);
  const [sourceOpened, sourceHandlers] = useDisclosure(false);
  const [episodeOpened, episodeHandlers] = useDisclosure(false);
  const [selectedSource, setSelectedSource] = useQueryState<number>(
    "src",
    // VidLink documents this exact TV URL format and is the most stable
    // default. Users can still switch to the independent fallbacks below.
    parseAsInteger.withDefault(0),
  );
  const [selectedSubtitle, setSelectedSubtitle] = useQueryState<SubtitleLanguage>(
    "sub",
    parseAsStringLiteral(SUBTITLE_OPTIONS.map(({ value }) => value)).withDefault(DEFAULT_SUBTITLE_LANGUAGE),
  );

  const players = getTvShowPlayers(
    id,
    episode.season_number,
    episode.episode_number,
    startAt,
    selectedSubtitle,
  );

  const { lastEvent } = usePlayerEvents({
    saveHistory: false,
    metadata: { season: episode.season_number, episode: episode.episode_number },
  });
  useDocumentTitle(
    `Play ${props.seriesName} - ${props.seasonName} - ${episode.name} | ${siteConfig.name}`,
  );

  const PLAYER = useMemo(() => players[selectedSource] || players[0], [players, selectedSource]);

  useEffect(() => {
    const cachedSource = Number(window.localStorage.getItem(TV_SOURCE_STORAGE_KEY));
    if (selectedSource === 0 && Number.isInteger(cachedSource) && cachedSource > 0 && cachedSource < players.length) {
      setSelectedSource(cachedSource);
    }
  }, [players.length, selectedSource, setSelectedSource]);

  useEffect(() => {
    if (lastEvent === "play") {
      window.localStorage.setItem(TV_SOURCE_STORAGE_KEY, String(selectedSource));
    }
  }, [lastEvent, selectedSource]);

  const moveToNextSource = () => {
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
    // Keep the current provider; only its subtitle URL/query changes.
    setSelectedSubtitle(subtitle);
  };

  return (
    <>
      <AdsWarning />

      <div className={cn("relative", SpacingClasses.reset)}>
        <TvShowPlayerHeader
          id={id}
          episode={episode}
          selectedSource={selectedSource}
          onOpenSource={sourceHandlers.open}
          onOpenSubtitle={sourceHandlers.open}
          onOpenEpisode={episodeHandlers.open}
          selectedSubtitle={selectedSubtitle}
          {...props}
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

      <TvShowPlayerSourceSelection
        opened={sourceOpened}
        onClose={sourceHandlers.close}
        players={players}
        selectedSource={selectedSource}
        setSelectedSource={setSelectedSource}
        selectedSubtitle={selectedSubtitle}
        setSelectedSubtitle={handleSubtitleChange}
      />
      <TvShowPlayerEpisodeSelection
        id={id}
        opened={episodeOpened}
        onClose={episodeHandlers.close}
        episodes={episodes}
      />
    </>
  );
};

export default memo(TvShowPlayer);
