import { useState } from "react";
import { useFabAreas, useFabMaterialsToReceive } from "@/api";
import { Card, DetailTabs, SidePanel, SidebarNavItem } from "@/components/common";
import { Box24Regular, Grid24Regular } from "@/components/icons";
import { Button, makeStyles, Text, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { FabNavigation } from "../FabExplorerPage";
import { ChangeResourcesDialog } from "../dialogs/ChangeResourcesDialog";
import { ManageResourceEmployeesDialog } from "../dialogs/ManageResourceEmployeesDialog";
import { ManageResourceTraineesDialog } from "../dialogs/ManageResourceTraineesDialog";
import { FAB_LEVELS } from "../fabLevels";

const useViewStyles = makeStyles({
  body: { display: "flex", columnGap: "10px", flexGrow: 1, minHeight: 0 },
  main: { flexGrow: 1, minWidth: 0, display: "flex", flexDirection: "column", rowGap: "12px" },
  toolbar: { display: "flex", columnGap: "8px", alignItems: "center" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
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
    minHeight: "110px",
    ":hover": { backgroundColor: "#DCEBF5" },
  },
  stateCounts: {
    display: "flex",
    columnGap: "12px",
    fontSize: "12px",
    color: tokens.colorNeutralForeground2,
    marginTop: "auto",
  },
  stateCount: { display: "flex", alignItems: "center", columnGap: "4px" },
  materialsList: { display: "flex", flexDirection: "column", rowGap: "8px" },
  materialRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "13px",
    padding: "8px 0",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
});

interface FacilityViewProps {
  nav: FabNavigation;
  go: (patch: Partial<FabNavigation>) => void;
}

export function FacilityView({ nav, go }: FacilityViewProps) {
  const { t } = useAppTranslation();
  const styles = useViewStyles();
  const [tab, setTab] = useState("areas");
  const [changeResourcesOpen, setChangeResourcesOpen] = useState(false);
  const [manageEmployeesOpen, setManageEmployeesOpen] = useState(false);
  const [manageTraineesOpen, setManageTraineesOpen] = useState(false);

  const { data: areas = [] } = useFabAreas(nav.facility);
  const { data: localMaterials = [] } = useFabMaterialsToReceive(nav.facility, false);
  const { data: remoteMaterials = [] } = useFabMaterialsToReceive(nav.facility, true);

  const tabs = [
    { value: "areas", label: t("fabExplorer.areas") },
    { value: "materials", label: t("fabExplorer.materialsToReceive") },
  ];

  return (
    <div className={styles.body}>
      <SidePanel title={t("fabExplorer.facilityAreas")} collapsed={false} onToggle={() => {}}>
        <SidebarNavItem
          icon={<Grid24Regular />}
          label={t("fabExplorer.allAreas")}
          active={true}
          onClick={() => {}}
        />
        <div
          style={{
            fontSize: "11px",
            color: tokens.colorNeutralForeground3,
            padding: "12px 12px 4px",
          }}
        >
          {t("fabExplorer.areas")}
        </div>
        {areas.slice(0, 20).map((a) => (
          <SidebarNavItem
            key={a.name}
            icon={<Box24Regular />}
            label={a.name}
            active={false}
            onClick={() => go({ level: FAB_LEVELS.area, area: a.name })}
          />
        ))}
      </SidePanel>
      <div className={styles.main}>
        <div className={styles.toolbar}>
          <Button appearance="primary" onClick={() => setChangeResourcesOpen(true)}>
            {t("fabExplorer.changeResources")}
          </Button>
          <Button appearance="secondary" onClick={() => setManageEmployeesOpen(true)}>
            {t("fabExplorer.manageResourceEmployees")}
          </Button>
          <Button appearance="secondary" onClick={() => setManageTraineesOpen(true)}>
            {t("fabExplorer.manageResourceTrainees")}
          </Button>
        </div>
        <DetailTabs tabs={tabs} active={tab} onChange={setTab}>
          {tab === "areas" && (
            <div className={styles.grid}>
              {areas.map((a) => (
                <div
                  key={a.name}
                  className={styles.tile}
                  onClick={() => go({ level: FAB_LEVELS.area, area: a.name })}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") go({ level: FAB_LEVELS.area, area: a.name });
                  }}
                >
                  <Text weight="semibold" size={300}>
                    {a.name}
                  </Text>
                  <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
                    {a.description}
                  </Text>
                  <div className={styles.stateCounts}>
                    <span className={styles.stateCount} title={t("fabExplorer.up")}>
                      <span
                        style={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          backgroundColor: tokens.colorPaletteGreenBackground3,
                          display: "inline-block",
                        }}
                      />
                      {a.resources.up}
                    </span>
                    <span className={styles.stateCount} title={t("fabExplorer.down")}>
                      <span
                        style={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          backgroundColor: tokens.colorPaletteRedBackground3,
                          display: "inline-block",
                        }}
                      />
                      {a.resources.down}
                    </span>
                    <span className={styles.stateCount} title={t("fabExplorer.maintenance")}>
                      <span
                        style={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          backgroundColor: tokens.colorPaletteYellowBackground3,
                          display: "inline-block",
                        }}
                      />
                      {a.resources.maintenance}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {tab === "materials" && (
            <div style={{ display: "flex", flexDirection: "column", rowGap: "16px" }}>
              <Card title={t("fabExplorer.localMaterials")}>
                <div className={styles.materialsList}>
                  {localMaterials.map((m) => (
                    <div key={m.name} className={styles.materialRow}>
                      <span>{m.name}</span>
                      <span>
                        {m.quantity} - {m.step}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
              <Card title={t("fabExplorer.remoteMaterials")}>
                <div className={styles.materialsList}>
                  {remoteMaterials.map((m) => (
                    <div key={m.name} className={styles.materialRow}>
                      <span>{m.name}</span>
                      <span>
                        {m.quantity} - {m.step}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </DetailTabs>
      </div>
      <ChangeResourcesDialog
        open={changeResourcesOpen}
        facilityName={nav.facility}
        onClose={() => setChangeResourcesOpen(false)}
      />
      <ManageResourceEmployeesDialog
        open={manageEmployeesOpen}
        facilityName={nav.facility}
        onClose={() => setManageEmployeesOpen(false)}
      />
      <ManageResourceTraineesDialog
        open={manageTraineesOpen}
        facilityName={nav.facility}
        onClose={() => setManageTraineesOpen(false)}
      />
    </div>
  );
}
