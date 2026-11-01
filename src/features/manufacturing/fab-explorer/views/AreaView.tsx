import { useState } from "react";
import { useFabArea, useFabResources, useFabSteps, useFabUndispatchableMaterials } from "@/api";
import type { FabResourceState } from "@/api";
import { Card, FilterBar, FilterGroup, SidePanel, Grid, HStack, VStack  } from "@/components/common";
import { makeStyles, Text } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { containsIgnoreCase } from "@/lib/utils";
import { useSharedStyles, tileSurface } from "@/styles/shared";
import { theme } from "@/styles/theme";
import type { FabNavigation } from "../FabExplorerPage";

const useViewStyles = makeStyles({
  body: {
    minHeight: 0,
  },
  main: {
    minWidth: 0,
  },
  stepRow: {
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
    minHeight: "120px",
  },
  stepInfo: {
    width: "140px",
    padding: theme.spacing.md,
    borderRight: `1px solid ${theme.color.borderSubtle}`,
  },
  resourceGrid: {
    padding: theme.spacing.md,
  },
  resourceTile: {
    width: "110px",
    borderRadius: "4px",
    padding: theme.spacing.sm,
    cursor: "pointer",
    borderLeft: "4px solid",
    ": hover": { filter: "brightness(0.95)" },
  },
  resourceStats: {
    fontSize: "11px",
  },
  
  undispatchTable: { width: "100%", borderCollapse: "collapse", fontSize: "13px" },
  undispatchHeader: {
    textAlign: "left",
    padding: theme.spacing.sm,
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
    color: theme.color.textTertiary,
    fontSize: "12px",
  },
  undispatchCell: { padding: theme.spacing.sm, borderBottom: `1px solid ${theme.color.border}` },
  
  infoCard: { padding: theme.spacing.md, textAlign: "center" },
});

interface AreaViewProps {
  nav: FabNavigation;
  go: (patch: Partial<FabNavigation>) => void;
  onSelectStep: (stepName: string) => void;
  onSelectResource: (resourceName: string) => void;
}

const STATE_COLORS: Record<FabResourceState, string> = {
  Up: theme.color.successSubtle,
  Down: theme.color.dangerSubtle,
  Maintenance: theme.color.warningSubtle,
  NonScheduled: theme.color.surfaceQuaternary,
  Productive: theme.color.successSubtle,
  Standby: theme.color.warningSubtle,
  "Unscheduled Down": theme.color.dangerSubtle,
  "Scheduled Down": theme.color.dangerSubtle,
  Engineering: theme.color.infoSubtle,
};

export function AreaView({ nav, onSelectStep, onSelectResource }: AreaViewProps) {
  const { t } = useAppTranslation();
  const styles = useViewStyles();
  const sharedStyles = useSharedStyles();
  const [stateFilter, setStateFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const { data: area } = useFabArea(nav.area);
  const { data: steps = [] } = useFabSteps(nav.area);
  const { data: resources = [] } = useFabResources(nav.area);
  const { data: undispatchable = [] } = useFabUndispatchableMaterials(nav.area);

  const filteredResources = resources.filter((r) => {
    if (stateFilter !== "ALL" && r.state !== stateFilter) return false;
    if (search && !containsIgnoreCase(r.name, search)) return false;
    return true;
  });

  const processedMaterials = resources.reduce((sum, r) => sum + r.processedMaterials, 0);
  const inQueueMaterials = resources.reduce((sum, r) => sum + r.inQueueMaterials, 0);
  const inProcessMaterials = resources.reduce((sum, r) => sum + r.inProcessMaterials, 0);

  const getStepResources = (stepName: string) =>
    filteredResources.filter((r) => r.services.includes(stepName));

  return (
    <HStack gap="10px" className={styles.body}>
      <VStack gap="12px" className={styles.main}>
        <Grid columns="repeat(auto-fill, minmax(160px, 1fr))" gap="12px">
          <div className={`${sharedStyles.contentCard} ${styles.infoCard}`}>
            <Text size={200} style={{ color: theme.color.textTertiary }}>
              {t("fabExplorer.processedMaterials")}
            </Text>
            <Text size={500} weight="semibold">
              {processedMaterials}
            </Text>
          </div>
          <div className={`${sharedStyles.contentCard} ${styles.infoCard}`}>
            <Text size={200} style={{ color: theme.color.textTertiary }}>
              {t("fabExplorer.inQueueMaterials")}
            </Text>
            <Text size={500} weight="semibold">
              {inQueueMaterials}
            </Text>
          </div>
          <div className={`${sharedStyles.contentCard} ${styles.infoCard}`}>
            <Text size={200} style={{ color: theme.color.textTertiary }}>
              {t("fabExplorer.inProcessMaterials")}
            </Text>
            <Text size={500} weight="semibold">
              {inProcessMaterials}
            </Text>
          </div>
        </Grid>

        <FilterBar justifyEnd>
          <FilterGroup label={t("fabExplorer.resourceState")}>
            <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)}>
              <option value="ALL">{t("fabExplorer.all")}</option>
              <option value="Up">{t("fabExplorer.up")}</option>
              <option value="Down">{t("fabExplorer.down")}</option>
              <option value="Maintenance">{t("fabExplorer.maintenance")}</option>
              <option value="NonScheduled">{t("fabExplorer.nonScheduled")}</option>
            </select>
          </FilterGroup>
          <input
            placeholder={t("fabExplorer.resourceName")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: `6px ${theme.spacing.sm}`,
              borderRadius: "4px",
              border: `1px solid ${theme.color.border}`,
            }}
          />
        </FilterBar>

        <Card title={area?.name ?? nav.area}>
          {steps.map((step) => {
            const stepResources = getStepResources(step.name);
            return (
              <HStack gap="0" key={step.name} className={styles.stepRow}>
                <VStack gap="4px" className={styles.stepInfo}>
                  <Text
                    weight="semibold"
                    size={300}
                    style={{ cursor: "pointer", color: theme.color.textBrand }}
                    onClick={() => onSelectStep(step.name)}
                  >
                    {step.name}
                  </Text>
                  <Text size={200} style={{ color: theme.color.textTertiary }}>
                    {step.description}
                  </Text>
                  <HStack gap="8px" align="center" style={{marginTop: theme.spacing.sm}}>
                    <span
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        backgroundColor: theme.color.brandSubtle,
                        display: "inline-grid",
                        placeItems: "center",
                      }}
                    />
                    <Text size={300} weight="semibold">
                      {step.materialCount}
                    </Text>
                  </HStack>
                </VStack>
                <HStack gap="8px" wrap className={styles.resourceGrid}>
                  {stepResources.length === 0 && (
                    <Text size={200} style={{ color: theme.color.textTertiary }}>
                      {t("fabExplorer.noResources")}
                    </Text>
                  )}
                  {stepResources.map((r) => (
                    <VStack
                      gap="4px"
                      key={r.name}
                      style={{
                        backgroundColor: tileSurface.backgroundColor,
                        borderLeftColor: STATE_COLORS[r.state],
                      }}
                      onClick={() => onSelectResource(r.name)}
                      className={styles.resourceTile}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") onSelectResource(r.name);
                      }}
                    >
                      <Text size={200} weight="semibold">
                        {r.name}
                      </Text>
                      <Text size={100} style={{ color: theme.color.textTertiary }}>
                        {r.type}
                      </Text>
                      <VStack gap="2px" className={styles.resourceStats}>
                        <HStack justify="space-between">
                          <span>{t("fabExplorer.processedMaterials").split(" ")[0]}</span>
                          <span>{r.processedMaterials}</span>
                        </HStack>
                        <HStack justify="space-between">
                          <span>Q</span>
                          <span>{r.inQueueMaterials}</span>
                        </HStack>
                        <HStack justify="space-between">
                          <span>P</span>
                          <span>{r.inProcessMaterials}</span>
                        </HStack>
                      </VStack>
                    </VStack>
                  ))}
                </HStack>
              </HStack>
            );
          })}
        </Card>
      </VStack>
      <SidePanel title={t("fabExplorer.panels")} collapsed={false} onToggle={() => {}}>
        <Card title={t("fabExplorer.undispatchableMaterials")}>
          <table className={styles.undispatchTable}>
            <thead>
              <tr>
                <th className={styles.undispatchHeader}>{t("fabExplorer.material")}</th>
                <th className={styles.undispatchHeader}>{t("fabExplorer.qty")}</th>
                <th className={styles.undispatchHeader}>{t("fabExplorer.step")}</th>
                <th className={styles.undispatchHeader}>{t("fabExplorer.dueDate")}</th>
              </tr>
            </thead>
            <tbody>
              {undispatchable.map((m, i) => (
                <tr key={`${m.name}-${i}`}>
                  <td className={styles.undispatchCell} style={{ color: theme.color.textBrand }}>
                    {m.name}
                  </td>
                  <td className={styles.undispatchCell}>{m.quantity}</td>
                  <td className={styles.undispatchCell} style={{ color: theme.color.textBrand }}>
                    {m.step}
                  </td>
                  <td className={styles.undispatchCell}>{m.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Text size={200} style={{ color: theme.color.textTertiary }}>
            {t("fabExplorer.records", { count: undispatchable.length })}
          </Text>
        </Card>
      </SidePanel>
    </HStack>
  );
}
