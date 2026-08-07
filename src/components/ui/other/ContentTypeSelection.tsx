"use client";

import useDiscoverFilters from "@/hooks/useDiscoverFilters";
import { ContentType } from "@/types";
import { Movie, TV } from "@/utils/icons";
import { Tabs, Tab, TabsProps } from "@heroui/react";
import { useLanguage } from "@/i18n/LanguageProvider";

interface ContentTypeSelectionProps extends TabsProps {
  onTypeChange?: (type: ContentType) => void;
  showKDrama?: boolean;
}

const ContentTypeSelection: React.FC<ContentTypeSelectionProps> = ({ onTypeChange, showKDrama = false, ...props }) => {
  const { content, countries, genres, setContent, setCountries, setGenres, resetFilters } = useDiscoverFilters();
  const { t } = useLanguage();
  const isKDrama = content === "tv" && countries.has("KR") && genres.has("18");

  const handleTabChange = (key: ContentType | "kdrama") => {
    resetFilters();
    if (key === "kdrama") {
      setContent("tv");
      setCountries(new Set(["KR"]));
      setGenres(new Set(["18"]));
      onTypeChange?.("tv");
    } else {
      setContent(key);
      onTypeChange?.(key);
    }
  };

  return (
    <Tabs
      size="lg"
      variant="underlined"
      selectedKey={showKDrama && isKDrama ? "kdrama" : content}
      aria-label="Content Type Selection"
      color={content === "movie" ? "primary" : "warning"}
      onSelectionChange={(value) => handleTabChange(value as ContentType)}
      classNames={{
        tabContent: "pb-2",
        cursor: "h-1 rounded-full",
      }}
      {...props}
    >
      <Tab
        key="movie"
        title={
          <div className="flex items-center space-x-2">
            <Movie />
            <span>{t("movies")}</span>
          </div>
        }
      />
      {showKDrama && (
        <Tab
          key="kdrama"
          title={
            <div className="flex items-center space-x-2">
              <span aria-hidden="true">🇰🇷</span>
              <span>{t("kDrama")}</span>
            </div>
          }
        />
      )}
      <Tab
        key="tv"
        title={
          <div className="flex items-center space-x-2">
            <TV />
            <span>{t("tvSeries")}</span>
          </div>
        }
      />
    </Tabs>
  );
};

export default ContentTypeSelection;
