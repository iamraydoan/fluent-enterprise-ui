import { useState } from "react";
import type { ReactElement, ReactNode } from "react";
import {
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
import type { TranslationKey } from "@/i18n";
import { useAppTranslation } from "@/i18n";
import { useSharedStyles, cardSurface } from "@/styles/shared";
import { ActionBar } from "./ActionBar";
import { PageHeader } from "./PageHeader";
import { RibbonButton } from "./RibbonButton";

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
    ...cardSurface,
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
    ...cardSurface,
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
    ...cardSurface,
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
          {`${label}:`}
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
  labelKey: TranslationKey;
}

export interface DetailShellMoreAction {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

interface DetailShellProps {
  title: string;
  icon: ReactNode;
  topTabs: DetailTab[];
  top: string;
  onTop: (value: string) => void;
  leftItems: TranslationKey[];
  left: string;
  onLeft: (value: TranslationKey) => void;
  onEdit: () => void;
  onAskAi: () => void;
  moreActions?: DetailShellMoreAction[];
  showState?: boolean;
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
  moreActions,
  showState = true,
  children,
}: DetailShellProps) {
  const { t } = useAppTranslation();
  const sharedStyles = useSharedStyles();
  const detailShellStyles = useDetailShellStyles();
  const [showLeft, setShowLeft] = useState(true);
  const [actionBarCollapsed, setActionBarCollapsed] = useState(false);
  const showPanel = top === "details";
  return (
    <>
      <div className={sharedStyles.headerBlock}>
        <div className={detailShellStyles.tabsRow}>
          <TabList size="small" selectedValue={top} onTabSelect={(_, d) => onTop(String(d.value))}>
            {topTabs.map((tab) => (
              <Tab key={tab.value} value={tab.value}>
                {t(tab.labelKey)}
              </Tab>
            ))}
          </TabList>
        </div>
        {!actionBarCollapsed && (
          <ActionBar style={{ paddingTop: 8 }}>
            <div className={sharedStyles.actionBarGroup}>
              <div className={sharedStyles.actionBarGroupButtons}>
                <RibbonButton
                  sharedStyles={sharedStyles}
                  icon={<ArrowSync24Regular />}
                  label={t("actionBar.refresh")}
                />
                <span onClick={onEdit}>
                  <RibbonButton
                    sharedStyles={sharedStyles}
                    icon={<Edit24Regular />}
                    label={t("actionBar.edit")}
                  />
                </span>
              </div>
              <div className={sharedStyles.actionBarGroupLabel}>
                {t("actionBar.groups.general")}
              </div>
            </div>
            <div className={sharedStyles.actionBarGroup}>
              <div className={sharedStyles.actionBarGroupButtons}>
                <span onClick={onAskAi}>
                  <RibbonButton
                    sharedStyles={sharedStyles}
                    icon={<Sparkle24Filled style={{ color: "#B24BF3" }} />}
                    label={t("actionBar.askAi")}
                  />
                </span>
              </div>
              <div className={sharedStyles.actionBarGroupLabel}>
                {t("actionBar.groups.mesCopilot")}
              </div>
            </div>
            <div className={sharedStyles.actionBarGroup}>
              <div className={sharedStyles.actionBarGroupButtons}>
                <RibbonButton
                  sharedStyles={sharedStyles}
                  icon={<MoreVertical24Regular />}
                  label={t("actionBar.more")}
                  menu={moreActions?.map((action) => ({
                    label: action.label,
                    onClick: action.onClick,
                  }))}
                />
              </div>
              <div className={sharedStyles.actionBarGroupLabel}>
                {t("actionBar.groups.actions")}
              </div>
            </div>
          </ActionBar>
        )}
        <PageHeader
          collapsed={actionBarCollapsed}
          onToggle={() => setActionBarCollapsed((v) => !v)}
        >
          <span
            style={{ display: "inline-flex", alignItems: "center", columnGap: 8, fontSize: 13 }}
          >
            {icon}
            <b style={{ fontWeight: 600 }}>{title}</b>
            {showState && <span style={{ fontSize: 12 }}>{t("common.activeState")}</span>}
          </span>
        </PageHeader>
      </div>

      <div className={detailShellStyles.body}>
        {showPanel && showLeft && (
          <aside className={detailShellStyles.left} aria-label={t("common.detailsView")}>
            <div className={detailShellStyles.leftHead}>
              <Body1Strong>{t("common.detailsView")}</Body1Strong>
              <Button
                size="small"
                appearance="subtle"
                icon={<PanelLeftContract20Regular />}
                aria-label={t("common.collapsePanel")}
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
                {t(item)}
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
                {t("common.detailsView")}
              </Button>
            </div>
          )}
          {children}
        </div>
      </div>
    </>
  );
}
