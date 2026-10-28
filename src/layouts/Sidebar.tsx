import { makeStyles, mergeClasses, Navigation24Regular, Tooltip } from "@/components/ui";
import type { NavigationItem } from "@/data/navigation";

const useStyles = makeStyles({
  sidebar: {
    backgroundColor: "#F5F6F8",
    borderRight: "1px solid #D5D9E0",
    display: "flex",
    flexDirection: "column",
    paddingTop: "8px",
    rowGap: "4px",
    minHeight: 0,
    overflow: "hidden",
    padding: "8px 4px",
  },
  sidebarButton: {
    height: "40px",
    display: "flex",
    alignItems: "center",
    columnGap: "14px",
    padding: "0 12px",
    position: "relative",
    border: "none",
    background: "transparent",
    color: "#1E2330",
    cursor: "pointer",
    borderRadius: "8px",
    fontFamily: "inherit",
    fontSize: "13px",
    whiteSpace: "nowrap",
    textAlign: "left",
    width: "100%",
    boxSizing: "border-box",
    ":hover": { backgroundColor: "#E9ECF1" },
  },
  sidebarActive: {
    backgroundColor: "#E3EAF8",
    color: "#2D5BC4",
    fontWeight: 600,
    ":hover": { backgroundColor: "#E3EAF8" },
  },
});

interface SidebarProps {
  expanded: boolean;
  onToggleExpanded: () => void;
  items: NavigationItem[];
  currentNav: string | undefined;
  onNavigate: (navigationId: string) => void;
}

export function Sidebar({
  expanded,
  onToggleExpanded,
  items,
  currentNav,
  onNavigate,
}: SidebarProps) {
  const sidebarStyles = useStyles();
  return (
    <nav className={sidebarStyles.sidebar} aria-label="Global navigation">
      <button
        className={sidebarStyles.sidebarButton}
        aria-label={expanded ? "Collapse menu" : "Expand menu"}
        aria-expanded={expanded}
        onClick={onToggleExpanded}
      >
        <Navigation24Regular />
      </button>
      {items.map((item) => (
        <Tooltip
          key={item.id}
          content={item.label}
          relationship="label"
          positioning="after"
          visible={expanded ? false : undefined}
        >
          <button
            className={mergeClasses(
              sidebarStyles.sidebarButton,
              currentNav === item.id && sidebarStyles.sidebarActive,
            )}
            aria-current={currentNav === item.id ? "page" : undefined}
            aria-label={item.label}
            onClick={() => onNavigate(item.id)}
          >
            {item.icon}
            {expanded && <span>{item.label}</span>}
          </button>
        </Tooltip>
      ))}
    </nav>
  );
}
