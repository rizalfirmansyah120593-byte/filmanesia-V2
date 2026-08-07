"use client";

import BackButton from "@/components/ui/button/BackButton";
import { siteConfig } from "@/config/site";
import { cn } from "@/utils/helpers";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";
import { useWindowScroll } from "@mantine/hooks";
import Link from "next/link";
import { usePathname } from "next/navigation";
import FullscreenToggleButton from "../button/FullscreenToggleButton";
import SearchInput from "../input/SearchInput";
import ThemeSwitchDropdown from "../input/ThemeSwitchDropdown";
import LanguageSwitchDropdown from "../input/LanguageSwitchDropdown";
import BrandLogo from "../other/BrandLogo";
import { useLanguage } from "@/i18n/LanguageProvider";

const TopNavbar = () => {
  const pathName = usePathname();
  const { t } = useLanguage();
  const [{ y }] = useWindowScroll();
  const opacity = Math.min((y / 1000) * 5, 1);
  const hrefs = siteConfig.navItems.map((item) => item.href);
  const show = hrefs.includes(pathName);
  const tv = pathName.includes("/tv/");
  const player = pathName.includes("/player");
  const auth = pathName.includes("/auth");

  if (auth || player) return null;

  return (
    <Navbar
      disableScrollHandler
      isBlurred={false}
      position="sticky"
      maxWidth="full"
      classNames={{ wrapper: "px-2 md:px-4" }}
      className={cn("inset-0 h-min bg-transparent", {
        "bg-background": show,
      })}
    >
      {!show && (
        <div
          className="border-background bg-background absolute inset-0 h-full w-full border-b"
          style={{ opacity: opacity }}
        />
      )}
      <NavbarBrand>
        {show ? <BrandLogo /> : <BackButton href={tv ? "/?content=tv" : "/"} />}
      </NavbarBrand>
      {show && !pathName.startsWith("/search") && (
        <NavbarContent className="hidden w-full max-w-lg gap-2 md:flex" justify="center">
          <NavbarItem className="w-full">
            <Link href="/search" className="w-full">
              <SearchInput
                className="pointer-events-none"
                placeholder={t("searchPlaceholder")}
              />
            </Link>
          </NavbarItem>
        </NavbarContent>
      )}
      <NavbarContent justify="end">
        <NavbarItem className="flex gap-1">
          <ThemeSwitchDropdown />
          <LanguageSwitchDropdown />
          <FullscreenToggleButton />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default TopNavbar;
