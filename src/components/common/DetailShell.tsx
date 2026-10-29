import { useState } from "react";
import type { ReactElement, ReactNode } from "react";
import {
  ArrowMaximize16Regular,
  ArrowSync24Regular,
  Edit24Regular,
  MoreVertical24Regular,
  PanelLeftContract20Regular,
  PanelLeftExpand20Regular,
  Sparkle24Filled,
} from "@/components/icons";
import {
  Body1Strong,
  Button,
  makeStyles,
  mergeClasses,
  Tab,
  TabList,
  tokens,
} from "@/components/ui";
import { useSharedStyles } from "@/styles/shared";

const useDetailShellStyles = makeStyles({
  tabsRow: {
    padding: "0 12px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    display: "flex",
  },
  body: { display: "flex", columnGap: "10px", marginTop: "10px", flexGrow: 1, minHeight: 0 },
  left: {
    width: "256px",
    flexShrink: 0,
    backgroundColor: "#FAFAFA",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  leftHead: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 12px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    margin: "4px 4px 8px",
  },
  leftItem: {
    display: "flex",
    alignItems: "center",
    height: "40px",
    padding: "0 12px",
    margin: "0 4px",
    borderRadius: "4px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: "13px",
    color: "#222",
    textAlign: "left",
    ":hover": { backgroundColor: "#EEF1F5" },
  },
  leftActive: { backgroundColor: "#E3EAF3", fontWeight: 600 },
  area: {
    flexGrow: 1,
    minWidth: 0,
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
    overflow: "auto",
  },
  panel: {
    flexGrow: 1,
    minWidth: 0,
    minHeight: 0,
    backgroundColor: "#FAFAFA",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    padding: "10px 14px 0",
    overflow: "hidden",
  },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
    gap: "10px",
    alignItems: "start",
  },
  card: {
    backgroundColor: "#FAFAFA",
    borderRadius: "10px",
    padding: "16px 18px 20px",
    minWidth: 0,
  },
  cardTitle: {
    fontSize: "14px",
    color: "#333",
    paddingBottom: "6px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    marginBottom: "14px",
  },
  kv: {
    display: "grid",
    gridTemplateColumns: "max-content minmax(0,1fr)",
    columnGap: "8px",
    rowGap: "8px",
    fontSize: "13px",
    lineHeight: "24px",
  },
  kvLabel: { textAlign: "right", color: "#444", minWidth: "110px" },
  kvVal: { wordBreak: "break-word", minWidth: 0, minHeight: "24px" },
  miniBar: {
    display: "flex",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    flexShrink: 0,
  },
  miniGroup: {
    display: "flex",
    flexDirection: "column",
    paddingRight: "10px",
    marginRight: "8px",
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  miniLabel: {
    textAlign: "center",
    fontSize: "9px",
    color: tokens.colorNeutralForeground3,
    padding: "2px 0 6px",
    minHeight: "10px",
  },
  empty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    rowGap: "6px",
    flexGrow: 1,
    color: tokens.colorNeutralForeground3,
  },
});

export function Card({ title, children }: { title?: string; children: ReactNode }) {
  const detailShellStyles = useDetailShellStyles();
  return (
    <section className={detailShellStyles.card}>
      {title && <div className={detailShellStyles.cardTitle}>{title}</div>}
      {children}
    </section>
  );
}

export function KV({ rows }: { rows: [string, ReactNode][] }) {
  const detailShellStyles = useDetailShellStyles();
  return (
    <div className={detailShellStyles.kv}>
      {rows.map(([label, value], index) => [
        <div key={`${label}-${index}-label`} className={detailShellStyles.kvLabel}>
          {label}:
        </div>,
        <div key={`${label}-${index}-value`} className={detailShellStyles.kvVal}>
          {value}
        </div>,
      ])}
    </div>
  );
}

export function CardGrid({ children }: { children: ReactNode }) {
  const detailShellStyles = useDetailShellStyles();
  return <div className={detailShellStyles.cards}>{children}</div>;
}

export function Panel({ children }: { children: ReactNode }) {
  const detailShellStyles = useDetailShellStyles();
  return <section className={detailShellStyles.panel}>{children}</section>;
}

export function Empty({ children }: { children: ReactNode }) {
  const detailShellStyles = useDetailShellStyles();
  return <div className={detailShellStyles.empty}>{children}</div>;
}

export interface MiniBarButton {
  icon: ReactElement;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

export interface MiniBarGroup {
  label?: string;
  buttons: MiniBarButton[];
}

export function MiniBar({ groups }: { groups: MiniBarGroup[] }) {
  const detailShellStyles = useDetailShellStyles();
  return (
    <div className={detailShellStyles.miniBar}>
      {groups.map((group, index) => (
        <div key={group.label ?? `group-${index}`} className={detailShellStyles.miniGroup}>
          <div style={{ display: "flex" }}>
            {group.buttons.map((button) => (
              <Button
                key={button.label}
                appearance="subtle"
                icon={button.icon}
                onClick={button.onClick}
                disabled={button.disabled}
              >
                {button.label}
              </Button>
            ))}
          </div>
          <div className={detailShellStyles.miniLabel}>{group.label}</div>
        </div>
      ))}
    </div>
  );
}

export interface DetailTab {
  value: string;
  label: string;
}

interface DetailShellProps {
  title: string;
  icon: ReactNode;
  topTabs: DetailTab[];
  top: string;
  onTop: (value: string) => void;
  leftItems: string[];
  left: string;
  onLeft: (value: string) => void;
  onEdit: () => void;
  onAskAi: () => void;
  children: ReactNode;
}

export function DetailShell({
  title,
  icon,
  topTabs,
  top,
  onTop,
  leftItems,
  left,
  onLeft,
  onEdit,
  onAskAi,
  children,
}: DetailShellProps) {
  const sharedStyles = useSharedStyles();
  const detailShellStyles = useDetailShellStyles();
  const [showLeft, setShowLeft] = useState(true);
  const showPanel = top === "details";
  return (
    <>
      <div className={sharedStyles.headerBlock}>
        <div className={detailShellStyles.tabsRow}>
          <TabList size="small" selectedValue={top} onTabSelect={(_, d) => onTop(String(d.value))}>
            {topTabs.map((tab) => (
              <Tab key={tab.value} value={tab.value}>
                {tab.label}
              </Tab>
            ))}
          </TabList>
        </div>
        <div className={sharedStyles.actionBarButtons} style={{ paddingTop: 8 }}>
          <div className={sharedStyles.actionBarGroup}>
            <div className={sharedStyles.actionBarGroupButtons}>
              <button className={sharedStyles.actionBarButton}>
                <ArrowSync24Regular />
                <span>Refresh</span>
              </button>
              <span onClick={onEdit}>
                <button className={sharedStyles.actionBarButton}>
                  <Edit24Regular />
                  <span>Edit</span>
                </button>
              </span>
            </div>
            <div className={sharedStyles.actionBarGroupLabel}>General</div>
          </div>
          <div className={sharedStyles.actionBarGroup}>
            <div className={sharedStyles.actionBarGroupButtons}>
              <span onClick={onAskAi}>
                <button className={sharedStyles.actionBarButton}>
                  <Sparkle24Filled style={{ color: "#B24BF3" }} />
                  <span>Ask AI</span>
                </button>
              </span>
            </div>
            <div className={sharedStyles.actionBarGroupLabel}>MES Copilot</div>
          </div>
          <div className={sharedStyles.actionBarGroup}>
            <div className={sharedStyles.actionBarGroupButtons}>
              <button className={sharedStyles.actionBarButton}>
                <MoreVertical24Regular />
                <span>More</span>
              </button>
            </div>
            <div className={sharedStyles.actionBarGroupLabel}>Actions</div>
          </div>
        </div>
        <div className={sharedStyles.pageHeader}>
          <span
            style={{ display: "inline-flex", alignItems: "center", columnGap: 8, fontSize: 13 }}
          >
            {icon}
            <b style={{ fontWeight: 600 }}>{title}</b>
            <span style={{ fontSize: 12 }}>(Active)</span>
          </span>
          <Button
            appearance="subtle"
            size="small"
            icon={<ArrowMaximize16Regular />}
            aria-label="Expand"
          />
        </div>
      </div>

      <div className={detailShellStyles.body}>
        {showPanel && showLeft && (
          <aside className={detailShellStyles.left} aria-label="Details View">
            <div className={detailShellStyles.leftHead}>
              <Body1Strong>Details View</Body1Strong>
              <Button
                size="small"
                appearance="subtle"
                icon={<PanelLeftContract20Regular />}
                aria-label="Collapse panel"
                onClick={() => setShowLeft(false)}
              />
            </div>
            {leftItems.map((item) => (
              <button
                key={item}
                className={mergeClasses(
                  detailShellStyles.leftItem,
                  left === item && detailShellStyles.leftActive,
                )}
                aria-current={left === item ? "page" : undefined}
                onClick={() => onLeft(item)}
              >
                {item}
              </button>
            ))}
          </aside>
        )}
        <div className={detailShellStyles.area}>
          {showPanel && !showLeft && (
            <div style={{ marginBottom: 6 }}>
              <Button
                size="small"
                appearance="subtle"
                icon={<PanelLeftExpand20Regular />}
                onClick={() => setShowLeft(true)}
              >
                Details View
              </Button>
            </div>
          )}
          {children}
        </div>
      </div>
    </>
  );
}
