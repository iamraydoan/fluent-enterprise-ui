import type { MouseEvent, ReactNode } from "react";
import { makeStyles, mergeClasses } from "@/components/ui";
import { theme } from "@/styles/theme";

const useIconButtonStyles = makeStyles({
  root: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "28px",
    height: "28px",
    flexShrink: 0,
    border: "none",
    cursor: "pointer",
    fontFamily: "inherit",
    ":focus-visible": { outline: `2px solid ${theme.color.brand}`, outlineOffset: "1px" },
    ":disabled": { cursor: "default", opacity: 0.4 },
  },
  rounded: { borderRadius: theme.radius.md },
  circular: { borderRadius: "50%" },
  subtle: {
    backgroundColor: "transparent",
    color: theme.color.textSecondary,
    ":hover": { backgroundColor: theme.color.surfaceHover, color: theme.color.textPrimary },
  },
  primary: {
    backgroundColor: theme.color.brand,
    color: theme.color.textOnBrand,
    ":hover": { filter: "brightness(0.92)" },
  },
  active: { backgroundColor: theme.color.surfaceSelected, color: theme.color.textPrimary },
});

interface IconButtonProps {
  icon: ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  variant?: "subtle" | "primary";
  shape?: "rounded" | "circular";
  active?: boolean;
  disabled?: boolean;
  ariaLabel: string;
  title?: string;
  className?: string;
}

export function IconButton({
  icon,
  onClick,
  variant = "subtle",
  shape = "rounded",
  active,
  disabled,
  ariaLabel,
  title,
  className,
}: IconButtonProps) {
  const styles = useIconButtonStyles();
  return (
    <button
      type="button"
      className={mergeClasses(
        styles.root,
        shape === "circular" ? styles.circular : styles.rounded,
        variant === "primary" ? styles.primary : styles.subtle,
        active && styles.active,
        className,
      )}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      title={title}
    >
      {icon}
    </button>
  );
}
