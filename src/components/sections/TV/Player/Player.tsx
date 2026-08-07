import { siteConfig } from "@/config/site";
import { cn } from "@/utils/helpers";
import { getTvShowPlayers, SUBTITLE_OPTIONS, SubtitleLanguage } from "@/utils/players";
import { Card, Skeleton } from "@heroui/react";
import { useDisclosure, useDocumentTitle, useIdle } from "@mantine/hooks";
import dynamic from "next/dynamic";
import { parseAsInteger, parseAsStringLiteral, useQueryState } from "nuqs";
import { memo, useMemo } from "react";
import { Episode, TvShowDetails } from "tmdb-ts";
import useBreakpoints from "@/hooks/useBreakpoints";
import { SpacingClasses } from "@/utils/constants";
import { usePlayerEvents } from "@/hooks/usePlayerEvents";
const AdsWarning = dynamic(() => import("@/components/ui/overlay/AdsWarning"));
const TvShowPlayerHeader = dynamic(() => import("./Header"));
const TvShowPlayerSourceSelection = dynamic(() => import("./SourceSelection"));
const TvShowPlayerEpisodeSelection = dynamic(() => import("./EpisodeSelection"));

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
  const { mobile } = useBreakpoints();
  const idle = useIdle(3000);
  const [sourceOpened, sourceHandlers] = useDisclosure(false);
  const [episodeOpened, episodeHandlers] = useDisclosure(false);
  const [selectedSource, setSelectedSource] = useQueryState<number>(
    "src",
    parseAsInteger.withDefault(0),
  );
  const [selectedSubtitle, setSelectedSubtitle] = useQueryState<SubtitleLanguage>(
    "sub",
    parseAsStringLiteral(SUBTITLE_OPTIONS.map(({ value }) => value)).withDefault("id"),
  );

  const players = getTvShowPlayers(
    id,
    episode.season_number,
    episode.episode_number,
    startAt,
    selectedSubtitle,
  );

  usePlayerEvents({
    saveHistory: false,
    metadata: { season: episode.season_number, episode: episode.episode_number },
  });
  useDocumentTitle(
    `Play ${props.seriesName} - ${props.seasonName} - ${episode.name} | ${siteConfig.name}`,
  );

  const PLAYER = useMemo(() => players[selectedSource] || players[0], [players, selectedSource]);

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
        <TvShowPlayerHeader
          id={id}
          episode={episode}
          hidden={idle && !mobile}
          selectedSource={selectedSource}
          onOpenSource={sourceHandlers.open}
          onOpenEpisode={episodeHandlers.open}
          selectedSubtitle={selectedSubtitle}
          {...props}
        />

        <Card shadow="md" radius="none" className="relative h-screen">
          <Skeleton className="absolute h-full w-full" />
          <iframe
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            loading="eager"
            key={PLAYER.title}
            src={PLAYER.source}
            onError={moveToNextSource}
            className={cn("z-10 h-full", { "pointer-events-none": idle && !mobile })}
          />
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
