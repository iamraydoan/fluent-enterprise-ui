import {
  Add24Regular,
  Chat20Regular,
  ChevronDown20Regular,
  ChevronLeft20Regular,
  Dismiss16Regular,
  QrCode20Regular,
  Search20Regular,
  Warning12Filled,
} from "@/components/icons";
import { Avatar, Button, makeStyles, mergeClasses, Text, Tooltip } from "@/components/ui";
import { iconForRoute } from "@/data/navigation";
import type { PageTab } from "@/stores/tabs-store";
import { useSharedStyles } from "@/styles/shared";

const useStyles = makeStyles({
  tabList: {
    display: "flex",
    alignItems: "flex-end",
    columnGap: "4px",
    minWidth: 0,
    overflow: "hidden",
  },
  inactiveTab: {
    backgroundColor: "transparent",
    ":hover": { backgroundColor: "rgba(255,255,255,0.5)" },
    cursor: "pointer",
  },
  newTabButton: {
    width: "32px",
    height: "32px",
    minWidth: "32px",
    borderRadius: "8px",
    color: "#222",
    backgroundColor: "transparent",
    ":hover": { backgroundColor: "#f3f2f1", color: "#222" },
  },
});

interface PageTabsProps {
  tabs: PageTab[];
  active: string | null;
  onSelect: (id: string) => void;
  onBack: (tab: PageTab) => void;
  onClose: (id: string) => void;
  onNewTab: () => void;
}

export function PageTabs({ tabs, active, onSelect, onBack, onClose, onNewTab }: PageTabsProps) {
  const pageTabsStyles = useStyles();
  const sharedStyles = useSharedStyles();
  return (
    <div className={sharedStyles.pageTabsBar}>
      <div className={pageTabsStyles.tabList} role="tablist">
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          return (
            <div
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              className={mergeClasses(
                sharedStyles.pageTab,
                !isActive && pageTabsStyles.inactiveTab,
              )}
              style={{ width: 232 }}
              onClick={() => onSelect(tab.id)}
            >
              <Button
                appearance="subtle"
                size="small"
                icon={<ChevronLeft20Regular />}
                aria-label="Back"
                onClick={(e) => {
                  e.stopPropagation();
                  onBack(tab);
                }}
              />
              {iconForRoute(tab.route)}
              <Text size={300} truncate wrap={false} style={{ flexGrow: 1 }}>
                {tab.title}
              </Text>
              <Button
                appearance="subtle"
                size="small"
                icon={<Dismiss16Regular />}
                aria-label={`Close ${tab.title}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onClose(tab.id);
                }}
              />
            </div>
          );
        })}
        <Tooltip content="New tab" relationship="label">
          <Button
            appearance="subtle"
            icon={<Add24Regular />}
            aria-label="New tab"
            className={pageTabsStyles.newTabButton}
            onClick={onNewTab}
          />
        </Tooltip>
      </div>
      <div className={sharedStyles.pageTabsActions}>
        <Button appearance="subtle" icon={<ChevronDown20Regular />} aria-label="More" />
        <Button appearance="subtle" icon={<QrCode20Regular />} aria-label="Scan" />
        <Button appearance="subtle" icon={<Search20Regular />} aria-label="Search" />
        <span style={{ position: "relative", display: "inline-flex" }}>
          <Button appearance="subtle" icon={<Chat20Regular />} aria-label="Messages" />
          <span
            aria-label="5 unread"
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              minWidth: 14,
              height: 14,
              borderRadius: 7,
              backgroundColor: "#C50F1F",
              color: "#fff",
              fontSize: 9,
              display: "grid",
              placeItems: "center",
              padding: "0 3px",
            }}
          >
            5
          </span>
        </span>
        <span style={{ position: "relative", marginLeft: 12, display: "inline-flex" }}>
          <Avatar name="A" initials="A" color="brand" size={36} />
          <Warning12Filled
            style={{ position: "absolute", left: -2, bottom: -2, color: "#F5B800" }}
            aria-label="Warning"
          />
        </span>
      </div>
    </div>
  );
}
