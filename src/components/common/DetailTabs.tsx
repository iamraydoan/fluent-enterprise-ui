import { makeStyles, mergeClasses, tokens } from "@/components/ui";

const useTabsStyles = makeStyles({
  tabs: { display: "flex", columnGap: "4px", padding: "0 16px" },
  tab: {
    padding: "10px 16px",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: "13px",
    borderBottom: "2px solid transparent",
    ":hover": { backgroundColor: tokens.colorNeutralBackground1Hover },
  },
  tabActive: {
    fontWeight: tokens.fontWeightSemibold,
    borderBottom: `2px solid ${tokens.colorBrandStroke1}`,
  },
  tabContent: { padding: "16px", flexGrow: 1, minHeight: 0, overflowY: "auto" },
});

interface DetailTabsProps {
  tabs: Array<{ value: string; label: string }>;
  active: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}

export function DetailTabs({ tabs, active, onChange, children }: DetailTabsProps) {
  const styles = useTabsStyles();
  return (
    <>
      <div className={styles.tabs} role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            role="tab"
            aria-selected={active === tab.value}
            className={mergeClasses(styles.tab, active === tab.value && styles.tabActive)}
            onClick={() => onChange(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={styles.tabContent}>{children}</div>
    </>
  );
}
