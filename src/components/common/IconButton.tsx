import type { MouseEvent, ReactElement } from "react";
import { makeStyles, mergeClasses } from "@/components/ui";
import { theme } from "@/styles/theme";

const useIconButtonStyles = makeStyles({
  button: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    borderRadius: theme.radius.md,
    color: theme.color.textSecondary,
    ":hover": { backgroundColor: theme.color.surfaceHover, color: theme.color.textPrimary },
    ":focus-visible": { outline: `2px solid ${theme.color.borderBrand}`, outlineOffset: "1px" },
    ":disabled": { cursor: "not-allowed", opacity: 0.5, backgroundColor: "transparent" },
  },
  sm: { width: "28px", height: "28px" },
  md: { width: "32px", height: "32px" },
  primary: {
    backgroundColor: theme.color.brand,
    color: theme.color.textOnBrand,
    ":hover": {
      backgroundColor: theme.color.brand,
      color: theme.color.textOnBrand,
      filter: "brightness(0.92)",
    },
  },
  active: { backgroundColor: theme.color.surfaceSelected, color: theme.color.textPrimary },
});

interface IconButtonProps {
  icon: ReactElement;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  variant?: "subtle" | "primary";
  size?: "sm" | "md";
  active?: boolean;
  disabled?: boolean;
  title?: string;
  "aria-label": string;
}

export function IconButton({
  icon,
  onClick,
  variant = "subtle",
  size = "md",
  active,
  disabled,
  title,
  "aria-label": ariaLabel,
}: IconButtonProps) {
  const styles = useIconButtonStyles();
  return (
    <button
      type="button"
      className={mergeClasses(
        styles.button,
        size === "sm" ? styles.sm : styles.md,
        variant === "primary" && styles.primary,
        active && styles.active,
      )}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={ariaLabel}
      aria-pressed={active}
    >
      {icon}
    </button>
  );
}
