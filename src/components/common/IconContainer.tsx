import type { ReactNode } from "react";
import { makeStyles, mergeClasses } from "@/components/ui";
import { theme } from "@/styles/theme";
import { resolveLength } from "./spacing";

const TONE_MAP = {
  primary: theme.color.textPrimary,
  secondary: theme.color.textSecondary,
  tertiary: theme.color.textTertiary,
  quaternary: theme.color.textQuaternary,
  brand: theme.color.textBrand,
  danger: theme.color.textDanger,
} as const;

export type IconTone = keyof typeof TONE_MAP;

const useStyles = makeStyles({
  root: { display: "inline-flex", alignItems: "center", flexShrink: 0 },
});

export interface IconContainerProps {
  icon: ReactNode;
  size?: number | string;
  tone?: IconTone;
  className?: string;
}

export function IconContainer({ icon, size, tone, className }: IconContainerProps) {
  const styles = useStyles();
  return (
    <span
      className={mergeClasses(styles.root, className)}
      style={{
        ...(size !== undefined ? { fontSize: resolveLength(size) } : {}),
        ...(tone !== undefined ? { color: TONE_MAP[tone] } : {}),
      }}
    >
      {icon}
    </span>
  );
}
