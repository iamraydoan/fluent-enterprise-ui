import type { ReactNode } from "react";
import type { SharedStyles } from "@/styles/shared";

interface RibbonButtonProps {
  sharedStyles: SharedStyles;
  icon: ReactNode;
  label: string;
}

export function RibbonButton({ sharedStyles, icon, label }: RibbonButtonProps) {
  return (
    <button className={sharedStyles.actionBarButton}>
      {icon}
      <span>{label}</span>
    </button>
  );
}
