import type { CSSProperties, ReactNode } from "react";
import { PanelLeftContract20Regular, PanelLeftExpand20Regular } from "@/components/icons";
import { Button, Text, makeStyles, mergeClasses } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import { theme } from "@/styles/theme";

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
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
  },
  headerText: {
    textTransform: "uppercase",
  },
  plainHeader: {
    padding: "12px 16px",
    margin: "4px 4px 6px",
    flexShrink: 0,
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
  },
  body: {
    flexGrow: 1,
    minHeight: 0,
    overflow: "auto",
    padding: "6px",
  },
});

interface SidePanelBaseProps {
  title: string;
  children: ReactNode;
  style?: CSSProperties;
}

interface CollapsibleSidePanelProps extends SidePanelBaseProps {
  collapsible?: true;
  collapsed: boolean;
  onToggle: () => void;
}

interface FixedSidePanelProps extends SidePanelBaseProps {
  collapsible: false;
  collapsed?: never;
  onToggle?: never;
}

type SidePanelProps = CollapsibleSidePanelProps | FixedSidePanelProps;

export function SidePanel(props: SidePanelProps) {
  const { t } = useAppTranslation();
  const styles = usePanelStyles();
  const sharedStyles = useSharedStyles();
  const { title, children, style } = props;
  if (props.collapsible === false) {
    return (
      <aside
        style={style}
        className={mergeClasses(sharedStyles.contentCard, styles.panel)}
        aria-label={title}
      >
        <div className={styles.plainHeader}>
          <Text weight="semibold" size={400}>
            {title}
          </Text>
        </div>
        <div className={styles.body}>{children}</div>
      </aside>
    );
  }
  const { collapsed, onToggle } = props;
  if (collapsed) {
    return (
      <div>
        <Button
          variant="subtle"
          icon={<PanelLeftExpand20Regular />}
          aria-label={t("common.expandPanel")}
          onClick={onToggle}
        />
      </div>
    );
  }
  return (
    <aside
      style={style}
      className={mergeClasses(sharedStyles.contentCard, styles.panel)}
      aria-label={title}
    >
      <div className={styles.header}>
        <Text weight="semibold" size={300} className={styles.headerText}>
          {title}
        </Text>
        <Button
          variant="subtle"
          icon={<PanelLeftContract20Regular />}
          aria-label={t("common.collapsePanel")}
          onClick={onToggle}
        />
      </div>
      <div className={styles.body}>{children}</div>
    </aside>
  );
}
