import { useState } from "react";
import { useFabDashboard, useFabFacilities, useFabMaterialsToReceive } from "@/api";
import { Card, SidePanel } from "@/components/common";
import { Grid24Regular } from "@/components/icons";
import { Button, makeStyles, Text, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import type { FabNavigation } from "../FabExplorerPage";
import { FAB_LEVELS } from "../fabLevels";

const useViewStyles = makeStyles({
  body: { display: "flex", columnGap: "10px", flexGrow: 1, minHeight: 0 },
  main: { flexGrow: 1, minWidth: 0, display: "flex", flexDirection: "column", rowGap: "12px" },
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
  dashboardBar: {
    display: "flex",
    columnGap: "8px",
    padding: "8px 0",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "12px",
  },
  kpiCard: { padding: "16px", textAlign: "center" },
  kpiValue: { fontSize: "32px", fontWeight: tokens.fontWeightSemibold },
  kpiTrend: { fontSize: "12px" },
  materialsList: { display: "flex", flexDirection: "column", rowGap: "8px" },
  materialRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "13px",
    padding: "8px 0",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
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
    <div className={styles.body}>
      <div className={styles.main}>
        <div className={styles.dashboardBar}>
          <Button
            appearance={dashboard === DASHBOARD_MANUFACTURING ? "primary" : "secondary"}
            onClick={() =>
              setDashboard(dashboard === DASHBOARD_MANUFACTURING ? null : DASHBOARD_MANUFACTURING)
            }
          >
            {t("fabExplorer.manufacturingDashboard")}
          </Button>
          <Button
            appearance={dashboard === DASHBOARD_QUALITY ? "primary" : "secondary"}
            onClick={() => setDashboard(dashboard === DASHBOARD_QUALITY ? null : DASHBOARD_QUALITY)}
          >
            {t("fabExplorer.qualityDashboard")}
          </Button>
          <Button
            appearance={dashboard === "maintenance" ? "primary" : "secondary"}
            onClick={() =>
              setDashboard(dashboard === DASHBOARD_MAINTENANCE ? null : DASHBOARD_MAINTENANCE)
            }
          >
            {t("fabExplorer.maintenanceDashboard")}
          </Button>
        </div>

        {dashboard && (
          <Card title={dashboardTitle}>
            <div className={styles.kpiGrid}>
              {kpis.map((kpi) => (
                <div key={kpi.label} className={`${sharedStyles.contentCard} ${styles.kpiCard}`}>
                  <Text size={300} style={{ color: tokens.colorNeutralForeground3 }}>
                    {kpi.label}
                  </Text>
                  <div className={styles.kpiValue}>
                    {kpi.value}
                    {kpi.unit}
                  </div>
                  <div
                    className={styles.kpiTrend}
                    style={{
                      color:
                        kpi.trend >= 0
                          ? tokens.colorPaletteGreenForeground1
                          : tokens.colorPaletteRedForeground1,
                    }}
                  >
                    {kpi.trend >= 0 ? "+" : ""}
                    {kpi.trend}%
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        <div className={styles.grid}>
          {facilities.map((f) => (
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
      <SidePanel title={t("fabExplorer.materialsToReceive")} collapsed={false} onToggle={() => {}}>
        <div className={styles.materialsList}>
          {materials.map((m) => (
            <div key={`${m.name}-${m.facility}`} className={styles.materialRow}>
              <span>{m.name}</span>
              <span>
                {m.quantity} ({m.facility})
              </span>
            </div>
          ))}
          {materials.length === 0 && (
            <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
              {t("fabExplorer.noResources")}
            </Text>
          )}
        </div>
      </SidePanel>
    </div>
  );
}
