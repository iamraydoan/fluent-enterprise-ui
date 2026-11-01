import type { ReactNode } from "react";
import { makeStyles, mergeClasses } from "@/components/ui";
import { theme } from "@/styles/theme";

const useOptionItemStyles = makeStyles({
  item: {
    display: "flex",
    alignItems: "center",
    columnGap: "10px",
    width: "100%",
    padding: "10px 12px",
    border: `1px solid ${theme.color.border}`,
    backgroundColor: theme.color.surface,
    borderRadius: theme.radius.md,
    cursor: "pointer",
    textAlign: "left",
    fontFamily: "inherit",
    fontSize: "13px",
    color: theme.color.textPrimary,
    ":hover": { backgroundColor: theme.color.surfaceHover },
    ":focus-visible": { outline: `2px solid ${theme.color.borderBrand}`, outlineOffset: "1px" },
    ":disabled": { cursor: "not-allowed", opacity: 0.6 },
  },
  selected: {
    backgroundColor: theme.color.surfaceSelected,
    border: `1px solid ${theme.color.borderBrand}`,
    fontWeight: theme.font.weightSemibold,
  },
  body: { display: "flex", flexDirection: "column", rowGap: "2px", minWidth: 0 },
  description: { fontSize: "12px", color: theme.color.textSecondary },
});

interface OptionItemProps {
  selected: boolean;
  onClick: () => void;
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  ariaLabel?: string;
}

export function OptionItem({
  selected,
  onClick,
  title,
  description,
  icon,
  disabled,
  ariaLabel,
}: OptionItemProps) {
  const styles = useOptionItemStyles();
  return (
    <button
      type="button"
      className={mergeClasses(styles.item, selected && styles.selected)}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      aria-label={ariaLabel}
    >
      {icon}
      <span className={styles.body}>
        <span>{title}</span>
        {description && <span className={styles.description}>{description}</span>}
      </span>
    </button>
  );
}
