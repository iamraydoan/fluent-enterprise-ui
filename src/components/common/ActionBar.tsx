import type { CSSProperties, ReactNode } from "react";
import { useSharedStyles } from "@/styles/shared";

interface ActionBarProps {
  children: ReactNode;
  style?: CSSProperties;
}

export function ActionBar({ children, style }: ActionBarProps) {
  const sharedStyles = useSharedStyles();
  return (
    <div className={sharedStyles.actionBarButtons} style={style}>
      {children}
    </div>
  );
}
