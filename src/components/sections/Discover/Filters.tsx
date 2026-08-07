import GenresSelect from "@/components/ui/input/GenresSelect";
import ContentTypeSelection from "@/components/ui/other/ContentTypeSelection";
import useDiscoverFilters from "@/hooks/useDiscoverFilters";
import { DiscoverMoviesFetchQueryType } from "@/types/movie";
import { Select, SelectItem, Button } from "@heroui/react";

const DiscoverFilters = () => {
  const { types, content, genres, years, countries, ratings, queryType, setQueryType, setGenres, setYears, setCountries, setRatings, resetFilters } =
    useDiscoverFilters();

  const yearsList = Array.from({ length: 16 }, (_, index) => String(new Date().getFullYear() - index));
  const countryList = [
    ["US", "Amerika Serikat"], ["ID", "Indonesia"], ["GB", "Inggris"], ["JP", "Jepang"],
    ["KR", "Korea Selatan"], ["IN", "India"], ["FR", "Prancis"], ["DE", "Jerman"], ["CN", "Tiongkok"],
  ];
  const ratingList = [["0-5", "0–5"], ["5-7", "5–7"], ["7-8", "7–8"], ["8-9", "8–9"], ["9-10", "9–10"]];

  const multiSelect = (label: string, values: Set<string>, options: string[][], onChange: (value: Set<string> | null) => void) => (
    <Select
      size="sm"
      selectionMode="multiple"
      label={label}
      placeholder={`Pilih ${label.toLowerCase()}`}
      className="min-w-40 max-w-xs"
      selectedKeys={values}
      onChange={({ target }) => onChange(target.value ? new Set(target.value.split(",")) : null)}
    >
      {options.map(([value, name]) => <SelectItem key={value}>{name}</SelectItem>)}
    </Select>
  );

  return (
    <div className="flex w-full flex-wrap justify-center gap-3">
      <ContentTypeSelection className="mb-5 justify-center" />
      <div className="flex w-full flex-wrap justify-center gap-3">
        <Select
          disallowEmptySelection
          selectionMode="single"
          size="sm"
          label="Type"
          placeholder="Select type"
          className="max-w-xs"
          selectedKeys={[queryType]}
          onChange={({ target }) => {
            setQueryType(target.value as DiscoverMoviesFetchQueryType);
            setGenres(null);
          }}
          value={queryType}
        >
          {types.map(({ name, key }) => {
            return <SelectItem key={key}>{name}</SelectItem>;
          })}
        </Select>
        <GenresSelect
          type={content}
          selectedKeys={genres}
          onGenreChange={(genres) => {
            setGenres(genres);
            setQueryType("discover");
          }}
        />
        {multiSelect("Tahun", years, yearsList.map((year) => [year, year]), setYears)}
        {multiSelect("Negara", countries, countryList, setCountries)}
        {multiSelect("Rating", ratings, ratingList, setRatings)}
      </div>
      <Button size="sm" onPress={resetFilters}>
        Reset Filters
      </Button>
    </div>
  );
};

export default DiscoverFilters;
