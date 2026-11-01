import { useState } from "react";
import { useFabDashboard, useFabFacilities, useFabMaterialsToReceive } from "@/api";
import { Card, EntityTile, SidePanel, TileGrid, Grid, HStack, VStack  } from "@/components/common";
import { Grid24Regular } from "@/components/icons";
import { Button, makeStyles, Text } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
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
  areaCount: {
    fontSize: "12px",
    color: theme.color.textSecondary,
  },
  dashboardBar: {
    padding: "8px 0",
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
  },
  
  kpiCard: { padding: theme.spacing.lg, textAlign: "center" },
  kpiValue: { fontSize: "32px", fontWeight: theme.font.weightSemibold },
  kpiTrend: { fontSize: "12px" },
  
  materialRow: {
    fontSize: "13px",
    padding: `${theme.spacing.sm} 0`,
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
  }
});

interface FacilitiesViewProps {
  nav: FabNavigation;
  go: (patch: Partial<FabNavigation>) => void;
}

type DashboardKind = "manufacturing" | "quality" | "maintenance" | null;

const DASHBOARD_MANUFACTURING = "manufacturing";
const DASHBOARD_QUALITY = "quality";
const DASHBOARD_MAINTENANCE = "maintenance";

export function FacilitiesView({ nav, go }: FacilitiesViewProps) {
  const { t } = useAppTranslation();
  const styles = useViewStyles();
  const sharedStyles = useSharedStyles();
  const [dashboard, setDashboard] = useState<DashboardKind>(null);

  const { data: facilities = [] } = useFabFacilities(nav.site || undefined, nav.enterprise);
  const { data: materials = [] } = useFabMaterialsToReceive();
  const { data: kpis = [] } = useFabDashboard("FrontEnd", dashboard ?? DASHBOARD_MANUFACTURING);

  const dashboardTitle =
    dashboard === DASHBOARD_MANUFACTURING
      ? t("fabExplorer.manufacturingDashboard")
      : dashboard === DASHBOARD_QUALITY
        ? t("fabExplorer.qualityDashboard")
        : t("fabExplorer.maintenanceDashboard");

  return (
    <HStack gap="10px" className={styles.body}>
      <VStack gap="12px" className={styles.main}>
        <HStack gap="8px" className={styles.dashboardBar}>
          <Button
            variant={dashboard === DASHBOARD_MANUFACTURING ? "primary" : "secondary"}
            onClick={() =>
              setDashboard(dashboard === DASHBOARD_MANUFACTURING ? null : DASHBOARD_MANUFACTURING)
            }
          >
            {t("fabExplorer.manufacturingDashboard")}
          </Button>
          <Button
            variant={dashboard === DASHBOARD_QUALITY ? "primary" : "secondary"}
            onClick={() => setDashboard(dashboard === DASHBOARD_QUALITY ? null : DASHBOARD_QUALITY)}
          >
            {t("fabExplorer.qualityDashboard")}
          </Button>
          <Button
            variant={dashboard === "maintenance" ? "primary" : "secondary"}
            onClick={() =>
              setDashboard(dashboard === DASHBOARD_MAINTENANCE ? null : DASHBOARD_MAINTENANCE)
            }
          >
            {t("fabExplorer.maintenanceDashboard")}
          </Button>
        </HStack>

        {dashboard && (
          <Card title={dashboardTitle}>
            <Grid columns="repeat(auto-fill, minmax(180px, 1fr))" gap="12px">
              {kpis.map((kpi) => (
                <div key={kpi.label} className={`${sharedStyles.contentCard} ${styles.kpiCard}`}>
                  <Text size={300} style={{ color: theme.color.textTertiary }}>
                    {kpi.label}
                  </Text>
                  <div className={styles.kpiValue}>
                    {kpi.value}
                    {kpi.unit}
                  </div>
                  <div
                    className={styles.kpiTrend}
                    style={{
                      color: kpi.trend >= 0 ? theme.color.textSuccess : theme.color.textDanger,
                    }}
                  >
                    {kpi.trend >= 0 ? "+" : ""}
                    {kpi.trend}%
                  </div>
                </div>
              ))}
            </Grid>
          </Card>
        )}

        <TileGrid>
          {facilities.map((f) => (
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
      <SidePanel title={t("fabExplorer.materialsToReceive")} collapsed={false} onToggle={() => {}}>
        <VStack gap="8px">
          {materials.map((m) => (
            <HStack justify="space-between" key={`${m.name}-${m.facility}`} className={styles.materialRow}>
              <span>{m.name}</span>
              <span>
                {m.quantity} ({m.facility})
              </span>
            </HStack>
          ))}
          {materials.length === 0 && (
            <Text size={200} style={{ color: theme.color.textTertiary }}>
              {t("fabExplorer.noResources")}
            </Text>
          )}
        </VStack>
      </SidePanel>
    </HStack>
  );
}
