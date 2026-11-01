import { useState } from "react";
import { useFabAreas, useFabMaterialsToReceive } from "@/api";
import {
  Card,
  DetailTabs,
  EntityTile,
  SidePanel,
  SidebarNavItem,
  TileGrid, HStack, VStack 
} from "@/components/common";
import { Box24Regular, Grid24Regular } from "@/components/icons";
import { Button, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { theme } from "@/styles/theme";
import type { FabNavigation } from "../FabExplorerPage";
import { ChangeResourcesDialog } from "../dialogs/ChangeResourcesDialog";
import { ManageResourceEmployeesDialog } from "../dialogs/ManageResourceEmployeesDialog";
import { ManageResourceTraineesDialog } from "../dialogs/ManageResourceTraineesDialog";
import { FAB_LEVELS } from "../fabLevels";

const useViewStyles = makeStyles({
  body: {
    minHeight: 0,
  },
  main: {
    minWidth: 0,
  },
  
  stateCounts: {
    fontSize: "12px",
    color: theme.color.textSecondary,
    marginTop: "auto",
  },
  stateCount: { display: "flex", alignItems: "center", columnGap: "4px" },
  
  materialRow: {
    fontSize: "13px",
    padding: `${theme.spacing.sm} 0`,
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
  }
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
    <HStack gap="10px" className={styles.body}>
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
      <VStack gap="12px" className={styles.main}>
        <HStack gap="8px" align="center">
          <Button variant="primary" onClick={() => setChangeResourcesOpen(true)}>
            {t("fabExplorer.changeResources")}
          </Button>
          <Button variant="secondary" onClick={() => setManageEmployeesOpen(true)}>
            {t("fabExplorer.manageResourceEmployees")}
          </Button>
          <Button variant="secondary" onClick={() => setManageTraineesOpen(true)}>
            {t("fabExplorer.manageResourceTrainees")}
          </Button>
        </HStack>
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
                    <HStack gap="12px" className={styles.stateCounts}>
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
                    </HStack>
                  }
                />
              ))}
            </TileGrid>
          )}
          {tab === "materials" && (
            <VStack gap="16px">
              <Card title={t("fabExplorer.localMaterials")}>
                <VStack gap="8px">
                  {localMaterials.map((m) => (
                    <HStack justify="space-between" key={m.name} className={styles.materialRow}>
                      <span>{m.name}</span>
                      <span>
                        {m.quantity} - {m.step}
                      </span>
                    </HStack>
                  ))}
                </VStack>
              </Card>
              <Card title={t("fabExplorer.remoteMaterials")}>
                <VStack gap="8px">
                  {remoteMaterials.map((m) => (
                    <HStack justify="space-between" key={m.name} className={styles.materialRow}>
                      <span>{m.name}</span>
                      <span>
                        {m.quantity} - {m.step}
                      </span>
                    </HStack>
                  ))}
                </VStack>
              </Card>
            </VStack>
          )}
        </DetailTabs>
      </VStack>
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
    </HStack>
  );
}
