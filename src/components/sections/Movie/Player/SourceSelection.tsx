import { PlayersProps } from "@/types";
import VaulDrawer from "@/components/ui/overlay/VaulDrawer";
import { HandlerType } from "@/types/component";
import SelectButton from "@/components/ui/input/SelectButton";
import { Ads, Captions, Clock, Rocket, Star } from "@/utils/icons";
import { SUBTITLE_OPTIONS, SubtitleLanguage } from "@/utils/players";

interface MoviePlayerSourceSelectionProps extends HandlerType {
  players: PlayersProps[];
  selectedSource: number;
  setSelectedSource: (source: number) => void;
  selectedSubtitle: SubtitleLanguage;
  setSelectedSubtitle: (subtitle: SubtitleLanguage) => void;
}

const MoviePlayerSourceSelection: React.FC<MoviePlayerSourceSelectionProps> = ({
  opened,
  onClose,
  players,
  selectedSource,
  setSelectedSource,
  selectedSubtitle,
  setSelectedSubtitle,
}) => {
  return (
    <VaulDrawer
      open={opened}
      onClose={onClose}
      backdrop="blur"
      title="Select Source"
      direction="right"
      hiddenHandler
      withCloseButton
      classNames={{ content: "space-y-0" }}
    >
      <div className="flex flex-col gap-4 p-5">
        <div className="space-y-2 px-1 py-2">
          <div className="flex items-center gap-2">
            <Star className="text-warning-500" />
            <span>Recommended</span>
          </div>
          <div className="flex items-center gap-2">
            <Rocket className="text-danger-500" />
            <span>Fast hosting</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="text-success-500" />
            <span>Watch Progress Support</span>
          </div>
          <div className="flex items-center gap-2">
            <Ads className="text-primary-500" />
            <span>May contain popup ads</span>
          </div>
        </div>
        <SelectButton
          label="Subtitle"
          description="Pilih bahasa subtitle yang tersedia. Server akan menyesuaikan otomatis."
          color="primary"
          groupType="list"
          value={selectedSubtitle}
          onChange={(value) => {
            setSelectedSubtitle(value || "off");
            onClose();
          }}
          data={SUBTITLE_OPTIONS.map(({ label, value }) => ({
            label,
            value,
            startContent: value !== "off" ? <Captions /> : undefined,
          }))}
        />
        <SelectButton
          color="primary"
          groupType="list"
          value={selectedSource.toString()}
          onChange={(value) => {
            setSelectedSource(Number(value || 0));
            onClose();
          }}
          data={players.map(
            ({ title, recommended, fast, ads, resumable, supportsSubtitles }, index) => {
              return {
                label: title,
                value: index.toString(),
                disabled: selectedSubtitle !== "off" && !supportsSubtitles,
                endContent: (
                  <div key={`info-${title}`} className="flex flex-wrap items-center gap-2">
                    {recommended && <Star className="text-warning" />}
                    {fast && <Rocket className="text-danger" />}
                    {resumable && <Clock className="text-success" />}
                    {ads && <Ads className="text-primary" />}
                  </div>
                ),
              };
            },
          )}
        />
      </div>
    </VaulDrawer>
  );
};

export default MoviePlayerSourceSelection;
