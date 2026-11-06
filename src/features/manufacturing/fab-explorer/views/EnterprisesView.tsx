import { useState } from "react";
import { useFabEnterprises, useFabFacilities, useFabSites } from "@/api";
import {
  EntityTile,
  FilterBar,
  FilterGroup,
  SidePanel,
  SidebarNavItem,
  TileGrid,
  HStack,
  VStack,
} from "@/components/common";
import { Globe24Regular, Grid24Regular, Organization24Regular } from "@/components/icons";
import { Input, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { containsIgnoreCase } from "@/lib/utils";
import { theme } from "@/styles/theme";
import type { FabNavigation } from "../FabExplorerPage";
import { FAB_LEVELS } from "../fabLevels";

const useViewStyles = makeStyles({
  body: {
    minHeight: 0,
  },
  main: {
    minWidth: 0,
  },
  sectionLabel: {
    fontSize: "11px",
    color: theme.color.textTertiary,
    textTransform: "uppercase",
    padding: `${theme.spacing.md} ${theme.spacing.md} ${theme.spacing.xs}`,
    letterSpacing: "0.5px",
  },
  areaCount: {
    fontSize: "12px",
    color: theme.color.textSecondary,
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
    if (search && !containsIgnoreCase(f.name, search)) return false;
    return true;
  });

  const types = ["ALL", ...Array.from(new Set(facilities.map((f) => f.type)))];

  return (
    <HStack gap="10px" className={styles.body}>
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
      <VStack gap="12px" className={styles.main}>
        <FilterBar justifyEnd>
          <FilterGroup label={t("fabExplorer.type")}>
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
          </FilterGroup>
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
                  <HStack align="center" gap="xs" className={styles.areaCount}>
                    {f.areaCount} <Grid24Regular />
                  </HStack>
                </>
              }
            />
          ))}
        </TileGrid>
      </VStack>
    </HStack>
  );
}
