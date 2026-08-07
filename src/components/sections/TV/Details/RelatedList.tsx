import Carousel from "@/components/ui/wrapper/Carousel";
import { TV } from "tmdb-ts/dist/types";
import TvShowPosterCard from "../Cards/Poster";

interface TvShowRelatedListProps {
  tvs: TV[];
}

const TvShowRelatedList: React.FC<TvShowRelatedListProps> = ({ tvs }) => {
  return (
    <div className="z-3 flex flex-col gap-2">
      <Carousel>
        {tvs.map((tv, index) => {
          return (
            <div key={tv.id} className="flex min-h-fit max-w-fit items-center px-1 py-2">
              <TvShowPosterCard tv={tv} isPriority={index < 10} />
            </div>
          );
        })}
      </Carousel>
    </div>
  );
};

export default TvShowRelatedList;
