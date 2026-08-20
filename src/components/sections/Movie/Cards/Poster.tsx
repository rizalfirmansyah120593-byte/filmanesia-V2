"use client";

import Rating from "@/components/ui/other/Rating";
import VaulDrawer from "@/components/ui/overlay/VaulDrawer";
import useBreakpoints from "@/hooks/useBreakpoints";
import useDeviceVibration from "@/hooks/useDeviceVibration";
import { getPosterThumbnailUrl, mutateMovieTitle } from "@/utils/movies";
import { Card, CardBody, CardFooter, CardHeader, Chip, Image, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useDisclosure, useHover } from "@mantine/hooks";
import Link from "next/link";
import { useCallback } from "react";
import { Movie } from "tmdb-ts/dist/types";
import { useLongPress } from "use-long-press";
import HoverPosterCard from "./Hover";

interface MoviePosterCardProps {
  movie: Movie;
  variant?: "full" | "bordered";
  isPriority?: boolean; // Tambahkan prop ini
}

const MoviePosterCard: React.FC<MoviePosterCardProps> = ({
  movie,
  variant = "full",
  isPriority = false,
}) => {
  const { hovered, ref } = useHover();
  const [opened, handlers] = useDisclosure(false);
  const releaseYear = new Date(movie.release_date).getFullYear();
  const posterImage = getPosterThumbnailUrl(movie.poster_path);
  const title = mutateMovieTitle(movie);
  const { mobile } = useBreakpoints();
  const { startVibration } = useDeviceVibration();

  const callback = useCallback(() => {
    handlers.open();
    setTimeout(() => startVibration([100]), 300);
  }, []);

  const longPress = useLongPress(mobile ? callback : null, {
    cancelOnMovement: true,
    threshold: 300,
  });

  return (
    <>
      <Tooltip
        isDisabled={mobile}
        showArrow
        className="bg-secondary-background p-0"
        shadow="lg"
        delay={1000}
        placement="right-start"
        content={<HoverPosterCard id={movie.id} />}
      >
        <Link href={`/movie/${movie.id}`} ref={ref} {...longPress()}>
          {variant === "full" && (
            <div className="group motion-preset-focus hover:border-primary relative aspect-2/3 h-[270px] w-full overflow-hidden rounded-lg border-[3px] border-transparent text-white transition-colors md:h-[300px]">
              {hovered && (
                <Icon
                  icon="line-md:play-filled"
                  width="64"
                  height="64"
                  className="absolute-center z-20 text-white"
                />
              )}
              {movie.adult && (
                <Chip
                  color="danger"
                  size="sm"
                  variant="flat"
                  className="absolute top-2 left-2 z-20"
                >
                  18+
                </Chip>
              )}
              <div className="absolute bottom-0 z-2 h-1/2 w-full bg-linear-to-t from-black from-1%"></div>
              <div className="absolute bottom-0 z-3 flex w-full flex-col gap-1 px-4 py-3">
                <h6 className="truncate text-sm font-semibold">{title}</h6>
                <div className="flex justify-between text-xs">
                  <p>{releaseYear}</p>
                  <Rating rate={movie?.vote_average} />
                </div>
              </div>
              <Image
                alt={title}
                src={posterImage}
                radius="none"
                // OPTIMASI: Tambahan untuk mempercepat LCP
                fetchPriority={isPriority ? "high" : "auto"}
                loading={isPriority ? "eager" : "lazy"}
                decoding="async"
                // ----------------------------------------
                className="z-0 h-full w-full object-cover object-center transition group-hover:scale-110"
                classNames={{
                  img: "group-hover:opacity-70",
                }}
              />
            </div>
          )}

          {variant === "bordered" && (
            <Card
              isHoverable
              fullWidth
              shadow="md"
              className="group bg-secondary-background h-full"
            >
              <CardHeader className="flex items-center justify-center pb-0">
                <div className="relative size-full">
                  {hovered && (
                    <Icon
                      icon="line-md:play-filled"
                      width="64"
                      height="64"
                      className="absolute-center z-20 text-white"
                    />
                  )}
                  {movie.adult && (
                    <Chip
                      color="danger"
                      size="sm"
                      variant="shadow"
                      className="absolute top-2 left-2 z-20"
                    >
                      18+
                    </Chip>
                  )}
                  <div className="rounded-large relative overflow-hidden">
                    <Image
                      alt={title}
                      className="aspect-2/3 h-[270px] rounded-lg object-cover object-center group-hover:scale-110 md:h-[300px]"
                      src={posterImage}
                      // OPTIMASI: Tambahan untuk mempercepat LCP
                      fetchPriority={isPriority ? "high" : "auto"}
                      loading={isPriority ? "eager" : "lazy"}
                      decoding="async"
                      // ----------------------------------------
                    />
                  </div>
                </div>
              </CardHeader>
              <CardBody className="justify-end pb-1">
                <p className="text-md truncate font-bold">{title}</p>
              </CardBody>
              <CardFooter className="justify-between pt-0 text-xs">
                <p>{releaseYear}</p>
                <Rating rate={movie.vote_average} />
              </CardFooter>
            </Card>
          )}
        </Link>
      </Tooltip>

      {mobile && (
        <VaulDrawer
          backdrop="blur"
          open={opened}
          onOpenChange={handlers.toggle}
          title={title}
          hiddenTitle
        >
          <HoverPosterCard id={movie.id} fullWidth />
        </VaulDrawer>
      )}
    </>
  );
};
export default MoviePosterCard;
