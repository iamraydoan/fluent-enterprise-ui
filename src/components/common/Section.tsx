import { useState } from "react";
import type { ReactNode } from "react";
import { ChevronDown16Regular } from "@/components/icons";
import { makeStyles, mergeClasses, Text } from "@/components/ui";
import { theme } from "@/styles/theme";

const useSectionStyles = makeStyles({
  root: { display: "flex", flexDirection: "column", minWidth: 0 },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
    marginBottom: theme.spacing.md,
  },
  headerButton: {
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    padding: 0,
    fontFamily: "inherit",
    display: "inline-flex",
    alignItems: "center",
    columnGap: theme.spacing.sm,
    borderRadius: theme.radius.md,
    color: theme.color.textPrimary,
    ":focus-visible": { outline: `2px solid ${theme.color.brand}`, outlineOffset: "2px" },
  },
  chevron: {
    display: "inline-flex",
    transition: "transform 0.12s ease-in-out",
    color: theme.color.textSecondary,
  },
  chevronCollapsed: { transform: "rotate(-90deg)" },
  body: { display: "flex", flexDirection: "column", minWidth: 0 },
});

interface SectionProps {
  title?: ReactNode;
  actions?: ReactNode;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  children: ReactNode;
  className?: string;
}

export function Section({
  title,
  actions,
  collapsible,
  defaultExpanded = true,
  expanded: controlledExpanded,
  onExpandedChange,
  children,
  className,
}: SectionProps) {
  const styles = useSectionStyles();
  const [uncontrolledExpanded, setUncontrolledExpanded] = useState(defaultExpanded);
  const expanded = controlledExpanded ?? uncontrolledExpanded;

  const toggle = () => {
    const next = !expanded;
    setUncontrolledExpanded(next);
    onExpandedChange?.(next);
  };

  const titleNode =
    typeof title === "string" ? (
      <Text weight="semibold" size={400}>
        {title}
      </Text>
    ) : (
      title
    );

  return (
    <section className={mergeClasses(styles.root, className)}>
      {(titleNode !== undefined || actions !== undefined || collapsible) && (
        <div className={styles.header}>
          {collapsible ? (
            <button
              type="button"
              className={styles.headerButton}
              onClick={toggle}
              aria-expanded={expanded}
            >
              <span
                className={mergeClasses(styles.chevron, !expanded && styles.chevronCollapsed)}
              >
                <ChevronDown16Regular />
              </span>
              {titleNode}
            </button>
          ) : (
            titleNode
          )}
          {actions}
        </div>
      )}
      {expanded && <div className={styles.body}>{children}</div>}
    </section>
  );
}

interface SectionHeaderProps {
  title: ReactNode;
  actions?: ReactNode;
  collapsible?: boolean;
  expanded?: boolean;
  onToggle?: () => void;
}

export function SectionHeader({ title, actions, collapsible, expanded, onToggle }: SectionHeaderProps) {
  const styles = useSectionStyles();
  const titleNode =
    typeof title === "string" ? (
      <Text weight="semibold" size={400}>
        {title}
      </Text>
    ) : (
      title
    );
  return (
    <div className={styles.header}>
      {collapsible ? (
        <button type="button" className={styles.headerButton} onClick={onToggle} aria-expanded={expanded}>
          <span className={mergeClasses(styles.chevron, !expanded && styles.chevronCollapsed)}>
            <ChevronDown16Regular />
          </span>
          {titleNode}
        </button>
      ) : (
        titleNode
      )}
      {actions}
    </div>
  );
}
