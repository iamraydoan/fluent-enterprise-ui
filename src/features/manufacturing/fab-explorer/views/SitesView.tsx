import { useState } from "react";
import { useFabFacilities, useFabSites } from "@/api";
import { EntityTile, FilterBar, SidePanel, SidebarNavItem, TileGrid } from "@/components/common";
import {
  ChevronLeft20Regular,
  Globe24Regular,
  Grid24Regular,
  Organization24Regular,
} from "@/components/icons";
import { Input, makeStyles} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { containsIgnoreCase } from "@/lib/utils";
import { theme } from "@/styles/theme";
import type { FabNavigation } from "../FabExplorerPage";
import { FAB_LEVELS } from "../fabLevels";

const useViewStyles = makeStyles({
  body: { display: "flex", columnGap: "10px", flexGrow: 1, minHeight: 0 },
  main: { flexGrow: 1, minWidth: 0, display: "flex", flexDirection: "column", rowGap: theme.spacing.md },
  breadcrumb: {
    display: "flex",
    alignItems: "center",
    columnGap: theme.spacing.sm,
    fontSize: "13px",
    color: theme.color.textBrand,
  },
  breadcrumbLink: {
    cursor: "pointer",
    ":hover": { textDecoration: "underline" },
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
    columnGap: theme.spacing.xs,
    fontSize: "12px",
    color: theme.color.textSecondary,
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
    (f) => !search || containsIgnoreCase(f.name, search),
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
        <FilterBar justifyEnd>
          <Input
            placeholder={t("fabExplorer.search")}
            value={search}
            onChange={setSearch}
            style={{ width: "200px" }}
          />
        </FilterBar>
        <TileGrid>
          {filteredFacilities.map((f) => (
            <EntityTile
              key={f.name}
              title={f.name}
              description={f.description}
              onClick={() => go({ level: FAB_LEVELS.facility, facility: f.name })}
              ariaLabel={f.name}
              footer={
                <>
                  <Grid24Regular />
                  <span className={styles.areaCount}>
                    {f.areaCount} <Grid24Regular />
                  </span>
                </>
              }
            />
          ))}
        </TileGrid>
      </div>
    </div>
  );
}
