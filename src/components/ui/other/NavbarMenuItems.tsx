import { siteConfig } from "@/config/site";
import { Link, Tab, Tabs, TabsProps } from "@heroui/react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/i18n/LanguageProvider";

interface NavbarMenuItemsProps extends TabsProps {
  withIcon?: boolean;
  menuArray?: {
    href: string;
    label: string;
    icon?: React.ReactNode;
    activeIcon?: React.ReactNode;
  }[];
}

const NavbarMenuItems: React.FC<NavbarMenuItemsProps> = ({
  menuArray = siteConfig.navItems,
  isVertical,
  withIcon,
  variant = "underlined",
  size = "lg",
}) => {
  const pathName = usePathname();
  const { t } = useLanguage();

  return (
    <Tabs
      size={size}
      variant={variant}
      selectedKey={pathName}
      isVertical={isVertical}
      classNames={{
        tabList: isVertical && "gap-5",
        tab: "h-full w-full",
      }}
    >
      {menuArray.map((item) => {
        const isActive = pathName === item.href;
        const labelKey = item.label.toLowerCase();
        let title: React.ReactNode = t(labelKey);

        if (withIcon) {
          title = (
            <div className="flex max-h-[45px] flex-col items-center gap-1">
              {isActive ? item.activeIcon : item.icon}
              <p>{t(labelKey)}</p>
            </div>
          );
        }

        return (
          <Tab as={Link} href={item.href} key={item.href} className="text-start" title={title} />
        );
      })}
    </Tabs>
  );
};

export default NavbarMenuItems;
