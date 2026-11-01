import type { ReactNode } from "react";
import { makeStyles, mergeClasses } from "@/components/ui";
import { theme } from "@/styles/theme";

const useOptionItemStyles = makeStyles({
  root: {
    display: "flex",
    alignItems: "center",
    columnGap: theme.spacing.sm,
    width: "100%",
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    textAlign: "left",
    fontFamily: "inherit",
    fontSize: "14px",
    color: theme.color.textPrimary,
    borderRadius: theme.radius.md,
    ":hover": { backgroundColor: theme.color.surfaceHover },
    ":focus-visible": { outline: `2px solid ${theme.color.brand}`, outlineOffset: "1px" },
    ":disabled": { cursor: "default", opacity: 0.5 },
  },
  selected: {
    backgroundColor: theme.color.surfaceSelected,
    fontWeight: theme.font.weightSemibold,
  },
});

interface OptionItemProps {
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
  className?: string;
  children: ReactNode;
}

export function OptionItem({
  selected,
  disabled,
  onClick,
  ariaLabel,
  className,
  children,
}: OptionItemProps) {
  const styles = useOptionItemStyles();
  return (
    <button
      type="button"
      className={mergeClasses(styles.root, selected && styles.selected, className)}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={selected}
    >
      {children}
    </button>
  );
}
