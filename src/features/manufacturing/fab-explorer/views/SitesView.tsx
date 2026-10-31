import { useState } from "react";
import { useFabFacilities, useFabSites } from "@/api";
import { SidePanel, SidebarNavItem } from "@/components/common";
import {
  ChevronLeft20Regular,
  Globe24Regular,
  Grid24Regular,
  Organization24Regular,
} from "@/components/icons";
import { Input, makeStyles, Text, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { FabNavigation } from "../FabExplorerPage";
import { FAB_LEVELS } from "../fabLevels";

const useViewStyles = makeStyles({
  body: { display: "flex", columnGap: "10px", flexGrow: 1, minHeight: 0 },
  main: { flexGrow: 1, minWidth: 0, display: "flex", flexDirection: "column", rowGap: "12px" },
  breadcrumb: {
    display: "flex",
    alignItems: "center",
    columnGap: "8px",
    fontSize: "13px",
    color: tokens.colorBrandForeground1,
  },
  breadcrumbLink: {
    cursor: "pointer",
    ":hover": { textDecoration: "underline" },
  },
  filterBar: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    columnGap: "12px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "12px",
  },
  tile: {
    backgroundColor: "#EAF3F9",
    borderRadius: "4px",
    padding: "12px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    rowGap: "8px",
    minHeight: "100px",
    ":hover": { backgroundColor: "#DCEBF5" },
  },
  tileFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: "auto",
  },
  areaCount: {
    display: "flex",
    alignItems: "center",
    columnGap: "4px",
    fontSize: "12px",
    color: tokens.colorNeutralForeground2,
  },
});

interface SitesViewProps {
  nav: FabNavigation;
  go: (patch: Partial<FabNavigation>) => void;
}

export function SitesView({ nav, go }: SitesViewProps) {
  const { t } = useAppTranslation();
  const styles = useViewStyles();
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");

  const { data: sites = [] } = useFabSites(nav.enterprise);
  const { data: facilities = [] } = useFabFacilities(nav.site || undefined, nav.enterprise);

  const filteredFacilities = facilities.filter(
    (f) => !search || f.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className={styles.body}>
      <SidePanel
        title={t("fabExplorer.facilities")}
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
      >
        <SidebarNavItem
          icon={<ChevronLeft20Regular />}
          label={t("fabExplorer.fabExplorerNav")}
          active={false}
          onClick={() => go({ level: FAB_LEVELS.enterprises, enterprise: "", site: "" })}
        />
        <SidebarNavItem
          icon={<Organization24Regular />}
          label={nav.enterprise}
          active={true}
          onClick={() => go({ level: FAB_LEVELS.sites, enterprise: nav.enterprise })}
        />
        {sites.map((s) => (
          <SidebarNavItem
            key={s.name}
            icon={<Globe24Regular />}
            label={s.name}
            active={nav.site === s.name}
            onClick={() => go({ level: FAB_LEVELS.facilities, site: s.name })}
          />
        ))}
      </SidePanel>
      <div className={styles.main}>
        <div className={styles.breadcrumb}>
          <span
            className={styles.breadcrumbLink}
            onClick={() => go({ level: FAB_LEVELS.enterprises, enterprise: "", site: "" })}
          >
            {t("fabExplorer.fabExplorerNav")}
          </span>
          <span>&gt;</span>
          <span>{nav.enterprise.toUpperCase()}</span>
        </div>
        <div className={styles.filterBar}>
          <Input
            placeholder={t("fabExplorer.search")}
            value={search}
            onChange={(_, data) => setSearch(data.value)}
            style={{ width: "200px" }}
          />
        </div>
        <div className={styles.grid}>
          {filteredFacilities.map((f) => (
            <div
              key={f.name}
              className={styles.tile}
              onClick={() => go({ level: FAB_LEVELS.facility, facility: f.name })}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") go({ level: FAB_LEVELS.facility, facility: f.name });
              }}
            >
              <Text weight="semibold" size={300}>
                {f.name}
              </Text>
              <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
                {f.description}
              </Text>
              <div className={styles.tileFooter}>
                <Grid24Regular />
                <span className={styles.areaCount}>
                  {f.areaCount} <Grid24Regular />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
