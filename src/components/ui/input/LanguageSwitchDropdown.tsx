"use client";

import { Language, useLanguage } from "@/i18n/LanguageProvider";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import { MdLanguage } from "react-icons/md";

const languages: { key: Language; label: string; flag: string }[] = [
  { key: "id", label: "Indonesia", flag: "🇮🇩" },
  { key: "en", label: "English", flag: "🇬🇧" },
  { key: "ms", label: "Melayu", flag: "🇲🇾" },
];

const LanguageSwitchDropdown = () => {
  const { language, setLanguage, t } = useLanguage();
  const current = languages.find((item) => item.key === language) ?? languages[0];

  return (
    <Dropdown showArrow>
      <DropdownTrigger>
        <Button isIconOnly variant="light" title={t("language")} className="p-2">
          <span aria-hidden="true">{current.flag}</span>
          <MdLanguage className="hidden" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu selectedKeys={[language]} selectionMode="single" aria-label={t("language")}>
        {languages.map((item) => (
          <DropdownItem key={item.key} onPress={() => setLanguage(item.key)}>
            {item.flag} {item.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default LanguageSwitchDropdown;
