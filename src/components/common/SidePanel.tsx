import type { ReactNode } from "react";
import { PanelLeftContract20Regular, PanelLeftExpand20Regular } from "@/components/icons";
import { Button, Text, makeStyles, mergeClasses, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";

const usePanelStyles = makeStyles({
  panel: {
    width: "300px",
    flexShrink: 0,
    overflow: "hidden",
    padding: 0,
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "44px",
    paddingLeft: "12px",
    paddingRight: "6px",
    flexShrink: 0,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  headerText: {
    textTransform: "uppercase",
  },
  body: {
    flexGrow: 1,
    minHeight: 0,
    overflow: "auto",
    padding: "6px",
  },
});

interface SidePanelProps {
  title: string;
  collapsed: boolean;
  onToggle: () => void;
  children: ReactNode;
}

export function SidePanel({ title, collapsed, onToggle, children }: SidePanelProps) {
  const { t } = useAppTranslation();
  const styles = usePanelStyles();
  const sharedStyles = useSharedStyles();
  if (collapsed) {
    return (
      <div>
        <Button
          appearance="subtle"
          icon={<PanelLeftExpand20Regular />}
          aria-label={t("common.expandPanel")}
          onClick={onToggle}
        />
      </div>
    );
  }
  return (
    <aside className={mergeClasses(sharedStyles.contentCard, styles.panel)} aria-label={title}>
      <div className={styles.header}>
        <Text weight="semibold" size={300} className={styles.headerText}>
          {title}
        </Text>
        <Button
          appearance="subtle"
          icon={<PanelLeftContract20Regular />}
          aria-label={t("common.collapsePanel")}
          onClick={onToggle}
        />
      </div>
      <div className={styles.body}>{children}</div>
    </aside>
  );
}
