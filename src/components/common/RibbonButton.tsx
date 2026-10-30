import type { ReactNode } from "react";
import { Menu, MenuItem, MenuList, MenuPopover, MenuTrigger } from "@/components/ui";
import type { SharedStyles } from "@/styles/shared";

export interface RibbonMenuItem {
  label: string;
  onClick: () => void;
}

interface RibbonButtonProps {
  sharedStyles: SharedStyles;
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  menu?: RibbonMenuItem[];
}

export function RibbonButton({ sharedStyles, icon, label, onClick, menu }: RibbonButtonProps) {
  const button = (
    <button className={sharedStyles.actionBarButton} onClick={onClick} aria-label={label}>
      {icon}
      <span>{label}</span>
    </button>
  );
  if (!menu || menu.length === 0) return button;
  return (
    <Menu>
      <MenuTrigger disableButtonEnhancement>{button}</MenuTrigger>
      <MenuPopover>
        <MenuList>
          {menu.map((item) => (
            <MenuItem key={item.label} onClick={item.onClick}>
              {item.label}
            </MenuItem>
          ))}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
}
