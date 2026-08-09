"use client";

import { siteConfig } from "@/config/site";
import clsx from "clsx";
import { Link } from "@heroui/link";
import { usePathname } from "next/navigation";
import { Chip } from "@heroui/chip";
import { useLanguage } from "@/i18n/LanguageProvider";

const BottomNavbar = () => {
  const pathName = usePathname();
  const hrefs = siteConfig.navItems.map((item) => item.href);
  const show = hrefs.includes(pathName);
  const { t } = useLanguage();

  return (
    show && (
      <>
        <div className="pt-20 md:hidden" />
        <div className="fixed bottom-0 left-0 z-50 block h-fit w-full translate-y-px border-t border-secondary-background bg-background py-2 md:hidden">
          <div className="mx-auto grid h-full w-full max-w-sm grid-cols-4">
            {siteConfig.navItems.map((item) => {
              const isActive = pathName === item.href;
              return (
                <Link
                  href={item.href}
                  key={item.href}
                  className="flex w-full items-center justify-center text-foreground"
                >
                  <div className="flex w-full max-h-[50px] flex-col items-center justify-center">
                    <Chip
                      size="lg"
                      variant={isActive ? "solid" : "light"}
                      classNames={{
                        base: "min-w-10 justify-center py-[2px] transition-all",
                        content: "size-full",
                      }}
                    >
                      {isActive ? item.activeIcon : item.icon}
                    </Chip>
                    <p className={clsx("text-[10px]", { "font-bold": isActive })}>{t(item.label.toLowerCase())}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </>
    )
  );
};

export default BottomNavbar;
