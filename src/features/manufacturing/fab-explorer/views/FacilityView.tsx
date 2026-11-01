import { useState } from "react";
import { useFabAreas, useFabMaterialsToReceive } from "@/api";
import {
  Card,
  DetailTabs,
  EntityTile,
  SidePanel,
  SidebarNavItem,
  TileGrid,
} from "@/components/common";
import { Box24Regular, Grid24Regular } from "@/components/icons";
import { Button, makeStyles} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { theme } from "@/styles/theme";
import type { FabNavigation } from "../FabExplorerPage";
import { ChangeResourcesDialog } from "../dialogs/ChangeResourcesDialog";
import { ManageResourceEmployeesDialog } from "../dialogs/ManageResourceEmployeesDialog";
import { ManageResourceTraineesDialog } from "../dialogs/ManageResourceTraineesDialog";
import { FAB_LEVELS } from "../fabLevels";

const useViewStyles = makeStyles({
  body: { display: "flex", columnGap: "10px", flexGrow: 1, minHeight: 0 },
  main: { flexGrow: 1, minWidth: 0, display: "flex", flexDirection: "column", rowGap: theme.spacing.md },
  toolbar: { display: "flex", columnGap: theme.spacing.sm, alignItems: "center" },
  stateCounts: {
    display: "flex",
    columnGap: theme.spacing.md,
    fontSize: "12px",
    color: theme.color.textSecondary,
    marginTop: "auto",
  },
  stateCount: { display: "flex", alignItems: "center", columnGap: theme.spacing.xs },
  materialsList: { display: "flex", flexDirection: "column", rowGap: theme.spacing.sm },
  materialRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "13px",
    padding: `${theme.spacing.sm} 0`,
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
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
            color: theme.color.textTertiary,
            padding: `${theme.spacing.md} ${theme.spacing.md} ${theme.spacing.xs}`,
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
          <Button variant="primary" onClick={() => setChangeResourcesOpen(true)}>
            {t("fabExplorer.changeResources")}
          </Button>
          <Button variant="secondary" onClick={() => setManageEmployeesOpen(true)}>
            {t("fabExplorer.manageResourceEmployees")}
          </Button>
          <Button variant="secondary" onClick={() => setManageTraineesOpen(true)}>
            {t("fabExplorer.manageResourceTrainees")}
          </Button>
        </div>
        <DetailTabs tabs={tabs} active={tab} onChange={setTab}>
          {tab === "areas" && (
            <TileGrid>
              {areas.map((a) => (
                <EntityTile
                  key={a.name}
                  title={a.name}
                  description={a.description}
                  onClick={() => go({ level: FAB_LEVELS.area, area: a.name })}
                  ariaLabel={a.name}
                  footer={
                    <div className={styles.stateCounts}>
                      <span className={styles.stateCount} title={t("fabExplorer.up")}>
                        <span
                          style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            backgroundColor: theme.color.successSubtle,
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
                            backgroundColor: theme.color.dangerSubtle,
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
                            backgroundColor: theme.color.warningSubtle,
                            display: "inline-block",
                          }}
                        />
                        {a.resources.maintenance}
                      </span>
                    </div>
                  }
                />
              ))}
            </TileGrid>
          )}
          {tab === "materials" && (
            <div style={{ display: "flex", flexDirection: "column", rowGap: theme.spacing.lg }}>
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
