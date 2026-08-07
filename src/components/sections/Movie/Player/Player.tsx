import { SpacingClasses } from "@/utils/constants";
import { siteConfig } from "@/config/site";
import useBreakpoints from "@/hooks/useBreakpoints";
import { cn } from "@/utils/helpers";
import { mutateMovieTitle } from "@/utils/movies";
import { getMoviePlayers, SUBTITLE_OPTIONS, SubtitleLanguage } from "@/utils/players";
import { Card, Skeleton } from "@heroui/react";
import { useDisclosure, useDocumentTitle, useIdle } from "@mantine/hooks";
import dynamic from "next/dynamic";
import { parseAsInteger, parseAsStringLiteral, useQueryState } from "nuqs";
import { useMemo } from "react";
import { MovieDetails } from "tmdb-ts/dist/types/movies";
import { usePlayerEvents } from "@/hooks/usePlayerEvents";
const AdsWarning = dynamic(() => import("@/components/ui/overlay/AdsWarning"));
const MoviePlayerHeader = dynamic(() => import("./Header"));
const MoviePlayerSourceSelection = dynamic(() => import("./SourceSelection"));

interface MoviePlayerProps {
  movie: MovieDetails;
  startAt?: number;
}

const MoviePlayer: React.FC<MoviePlayerProps> = ({ movie, startAt }) => {
  const title = mutateMovieTitle(movie);
  const idle = useIdle(3000);
  const { mobile } = useBreakpoints();
  const [opened, handlers] = useDisclosure(false);
  const [selectedSource, setSelectedSource] = useQueryState<number>(
    "src",
    parseAsInteger.withDefault(0),
  );
  const [selectedSubtitle, setSelectedSubtitle] = useQueryState<SubtitleLanguage>(
    "sub",
    parseAsStringLiteral(SUBTITLE_OPTIONS.map(({ value }) => value)).withDefault("id"),
  );

  const players = getMoviePlayers(movie.id, startAt, selectedSubtitle);

  usePlayerEvents({ saveHistory: false });
  useDocumentTitle(`Play ${title} | ${siteConfig.name}`);

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
        <MoviePlayerHeader
          id={movie.id}
          movieName={title}
          onOpenSource={handlers.open}
          hidden={idle && !mobile}
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
