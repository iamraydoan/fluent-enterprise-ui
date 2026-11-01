import type { ReactNode } from "react";
import { makeStyles, mergeClasses } from "@/components/ui";
import { theme } from "@/styles/theme";

const useMenuTriggerButtonStyles = makeStyles({
  root: {
    display: "inline-flex",
    alignItems: "center",
    columnGap: theme.spacing.xs,
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontFamily: "inherit",
    fontWeight: theme.font.weightSemibold,
    color: theme.color.textPrimary,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.md,
    whiteSpace: "nowrap",
    ":hover": { backgroundColor: theme.color.surfaceHover },
    ":focus-visible": { outline: `2px solid ${theme.color.brand}`, outlineOffset: "1px" },
    ":disabled": { cursor: "default", opacity: 0.5 },
  },
  sm: { fontSize: "13px" },
  md: { fontSize: "15px" },
});

interface MenuTriggerButtonProps {
  size?: "sm" | "md";
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
  children: ReactNode;
}

export function MenuTriggerButton({
  size = "sm",
  disabled,
  ariaLabel,
  className,
  children,
}: MenuTriggerButtonProps) {
  const styles = useMenuTriggerButtonStyles();
  return (
    <button
      type="button"
      className={mergeClasses(styles.root, size === "md" ? styles.md : styles.sm, className)}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
