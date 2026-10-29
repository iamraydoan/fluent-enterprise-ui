import {
  Avatar,
  Bot20Regular,
  Button,
  Chat20Regular,
  ChevronDown20Regular,
  ChevronLeft20Regular,
  Dismiss16Regular,
  makeStyles,
  mergeClasses,
  QrCode20Regular,
  Search20Regular,
  Text,
  Warning12Filled,
} from "@/components/ui";
import type { NavigationItem } from "@/data/navigation";
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
});

interface PageTabsProps {
  tabs: PageTab[];
  active: string | null;
  navigation: NavigationItem[];
  onSelect: (id: string) => void;
  onBack: (tab: PageTab) => void;
  onClose: (id: string) => void;
}

export function PageTabs({ tabs, active, navigation, onSelect, onBack, onClose }: PageTabsProps) {
  const pageTabsStyles = useStyles();
  const sharedStyles = useSharedStyles();
  const getNavigationItem = (navigationId: string) =>
    navigation.find((item) => item.id === navigationId);
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
              {tab.type === "detail" ? <Bot20Regular /> : getNavigationItem(tab.nav)?.icon}
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
      </div>
      <div className={sharedStyles.pageTabsActions}>
        <Button appearance="subtle" icon={<ChevronDown20Regular />} aria-label="More" />
        <Button appearance="subtle" icon={<QrCode20Regular />} aria-label="Scan" />
        <Button appearance="subtle" icon={<Search20Regular />} aria-label="Search" />
        <Button appearance="subtle" icon={<Chat20Regular />} aria-label="Messages" />
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
