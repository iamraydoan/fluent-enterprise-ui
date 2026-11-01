import type { ReactNode } from "react";
import { ChevronDown20Regular, ChevronRight20Regular } from "@/components/icons";
import { makeStyles, mergeClasses, Text } from "@/components/ui";
import { theme } from "@/styles/theme";

const useSectionStyles = makeStyles({
  section: { display: "flex", flexDirection: "column", rowGap: "8px" },
  header: {
    display: "flex",
    alignItems: "center",
    columnGap: "8px",
    paddingBottom: "8px",
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
  },
  headerButton: {
    display: "flex",
    alignItems: "center",
    columnGap: "8px",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontFamily: "inherit",
    padding: "4px 0",
    borderRadius: theme.radius.sm,
    ":hover": { backgroundColor: theme.color.surfaceHover },
    ":focus-visible": { outline: `2px solid ${theme.color.borderBrand}`, outlineOffset: "1px" },
  },
  title: {
    fontSize: "13px",
    fontWeight: theme.font.weightSemibold,
    color: theme.color.textPrimary,
  },
  actions: { marginLeft: "auto", display: "flex", alignItems: "center", columnGap: "8px" },
  chevron: { color: theme.color.textSecondary, display: "inline-flex", flexShrink: 0 },
});

interface SectionHeaderProps {
  title: ReactNode;
  actions?: ReactNode;
  collapsible?: boolean;
  expanded?: boolean;
  onToggle?: () => void;
}

export function SectionHeader({
  title,
  actions,
  collapsible,
  expanded,
  onToggle,
}: SectionHeaderProps) {
  const styles = useSectionStyles();
  const titleNode =
    typeof title === "string" ? (
      <Text weight="semibold" size={300}>
        {title}
      </Text>
    ) : (
      title
    );
  return (
    <div className={styles.header}>
      {collapsible ? (
        <button
          type="button"
          className={mergeClasses(styles.headerButton)}
          onClick={onToggle}
          aria-expanded={expanded}
        >
          <span className={styles.chevron}>
            {expanded ? <ChevronDown20Regular /> : <ChevronRight20Regular />}
          </span>
          <span className={styles.title}>{titleNode}</span>
        </button>
      ) : (
        <span className={styles.title}>{titleNode}</span>
      )}
      {actions && <span className={styles.actions}>{actions}</span>}
    </div>
  );
}

interface SectionProps extends SectionHeaderProps {
  children: ReactNode;
}

export function Section({
  title,
  actions,
  collapsible,
  expanded,
  onToggle,
  children,
}: SectionProps) {
  const styles = useSectionStyles();
  const showBody = !collapsible || expanded;
  return (
    <div className={styles.section}>
      <SectionHeader
        title={title}
        actions={actions}
        collapsible={collapsible}
        expanded={expanded}
        onToggle={onToggle}
      />
      {showBody && children}
    </div>
  );
}
