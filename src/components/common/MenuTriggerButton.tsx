import type { MouseEvent, ReactNode } from "react";
import { ChevronDown16Regular } from "@/components/icons";
import { makeStyles, mergeClasses } from "@/components/ui";
import { theme } from "@/styles/theme";

const useMenuTriggerButtonStyles = makeStyles({
  button: {
    display: "inline-flex",
    alignItems: "center",
    columnGap: "4px",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontFamily: "inherit",
    fontWeight: theme.font.weightSemibold,
    color: theme.color.textPrimary,
    borderRadius: theme.radius.md,
    ":hover": { backgroundColor: theme.color.surfaceHover },
    ":focus-visible": { outline: `2px solid ${theme.color.borderBrand}`, outlineOffset: "1px" },
    ":disabled": { cursor: "not-allowed", opacity: 0.5 },
  },
  sm: { fontSize: "13px", padding: "4px 6px" },
  md: { fontSize: "14px", padding: "6px 8px" },
  outline: { border: `1px solid ${theme.color.border}` },
  chevron: { color: theme.color.textSecondary, display: "inline-flex" },
});

interface MenuTriggerButtonProps {
  children: ReactNode;
  size?: "sm" | "md";
  variant?: "subtle" | "outline";
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  disabled?: boolean;
  ariaLabel?: string;
}

export function MenuTriggerButton({
  children,
  size = "sm",
  variant = "subtle",
  onClick,
  disabled,
  ariaLabel,
}: MenuTriggerButtonProps) {
  const styles = useMenuTriggerButtonStyles();
  return (
    <button
      type="button"
      className={mergeClasses(
        styles.button,
        size === "sm" ? styles.sm : styles.md,
        variant === "outline" && styles.outline,
      )}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-haspopup="menu"
    >
      {children}
      <span className={styles.chevron}>
        <ChevronDown16Regular />
      </span>
    </button>
  );
}
