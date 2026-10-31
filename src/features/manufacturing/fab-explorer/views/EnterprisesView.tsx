import { useState } from "react";
import { useFabEnterprises, useFabFacilities, useFabSites } from "@/api";
import { SidePanel, SidebarNavItem } from "@/components/common";
import { Globe24Regular, Grid24Regular, Organization24Regular } from "@/components/icons";
import { Input, makeStyles, Text, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { FabNavigation } from "../FabExplorerPage";
import { FAB_LEVELS } from "../fabLevels";

const useViewStyles = makeStyles({
  body: { display: "flex", columnGap: "10px", flexGrow: 1, minHeight: 0 },
  main: { flexGrow: 1, minWidth: 0, display: "flex", flexDirection: "column", rowGap: "12px" },
  sectionLabel: {
    fontSize: "11px",
    color: tokens.colorNeutralForeground3,
    textTransform: "uppercase",
    padding: "12px 12px 4px",
    letterSpacing: "0.5px",
  },
  filterBar: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    columnGap: "12px",
  },
  typeFilter: {
    display: "flex",
    alignItems: "center",
    columnGap: "6px",
    fontSize: "13px",
    color: tokens.colorNeutralForeground2,
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

interface EnterprisesViewProps {
  nav: FabNavigation;
  go: (patch: Partial<FabNavigation>) => void;
}

export function EnterprisesView({ nav, go }: EnterprisesViewProps) {
  const { t } = useAppTranslation();
  const styles = useViewStyles();
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const { data: enterprises = [] } = useFabEnterprises();
  const { data: sites = [] } = useFabSites();
  const { data: facilities = [] } = useFabFacilities();

  const remoteSites = sites.filter((s) => s.isRemote);

  const filteredFacilities = facilities.filter((f) => {
    if (typeFilter !== "ALL" && f.type !== typeFilter) return false;
    if (search && !f.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const types = ["ALL", ...Array.from(new Set(facilities.map((f) => f.type)))];

  return (
    <div className={styles.body}>
      <SidePanel
        title={t("fabExplorer.facilities")}
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
      >
        <SidebarNavItem
          icon={<Grid24Regular />}
          label={t("fabExplorer.allFacilities")}
          active={!nav.enterprise}
          onClick={() => go({ level: FAB_LEVELS.enterprises, enterprise: "", site: "" })}
        />
        <div className={styles.sectionLabel}>{t("fabExplorer.fabExplorerNav")}</div>
        {enterprises.map((e) => (
          <SidebarNavItem
            key={e.name}
            icon={<Organization24Regular />}
            label={e.name}
            active={nav.enterprise === e.name}
            onClick={() => go({ level: FAB_LEVELS.sites, enterprise: e.name, site: "" })}
          />
        ))}
        {remoteSites.length > 0 && (
          <>
            <div className={styles.sectionLabel}>{t("fabExplorer.remoteSites")}</div>
            {remoteSites.map((s) => (
              <SidebarNavItem
                key={s.name}
                icon={<Globe24Regular />}
                label={s.name}
                active={nav.site === s.name}
                onClick={() =>
                  go({ level: FAB_LEVELS.facilities, enterprise: s.enterprise, site: s.name })
                }
              />
            ))}
          </>
        )}
      </SidePanel>
      <div className={styles.main}>
        <div className={styles.filterBar}>
          <div className={styles.typeFilter}>
            <span>{t("fabExplorer.type")}: </span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              aria-label={t("fabExplorer.type")}
            >
              {types.map((type) => (
                <option key={type} value={type}>
                  {type === "ALL" ? t("fabExplorer.all") : type}
                </option>
              ))}
            </select>
          </div>
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
