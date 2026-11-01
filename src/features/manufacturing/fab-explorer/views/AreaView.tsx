import { useState } from "react";
import { useFabArea, useFabResources, useFabSteps, useFabUndispatchableMaterials } from "@/api";
import type { FabResourceState } from "@/api";
import { Card, FilterBar, FilterGroup, SidePanel, TileGrid } from "@/components/common";
import { makeStyles, Text} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { containsIgnoreCase } from "@/lib/utils";
import { useSharedStyles, tileSurface } from "@/styles/shared";
import { theme } from "@/styles/theme";
import type { FabNavigation } from "../FabExplorerPage";

const useViewStyles = makeStyles({
  body: { display: "flex", columnGap: "10px", flexGrow: 1, minHeight: 0 },
  main: { flexGrow: 1, minWidth: 0, display: "flex", flexDirection: "column", rowGap: theme.spacing.md },
  stepRow: {
    display: "flex",
    columnGap: "0",
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
    minHeight: "120px",
  },
  stepInfo: {
    width: "140px",
    flexShrink: 0,
    padding: theme.spacing.md,
    display: "flex",
    flexDirection: "column",
    rowGap: theme.spacing.xs,
    borderRight: `1px solid ${theme.color.borderSubtle}`,
  },
  resourceGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    flexGrow: 1,
  },
  resourceTile: {
    width: "110px",
    borderRadius: "4px",
    padding: theme.spacing.sm,
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    rowGap: theme.spacing.xs,
    borderLeft: "4px solid",
    ":hover": { filter: "brightness(0.95)" },
  },
  resourceStats: { display: "flex", flexDirection: "column", fontSize: "11px", rowGap: "2px" },
  statRow: { display: "flex", justifyContent: "space-between" },
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
    <div className={styles.body}>
      <div className={styles.main}>
        <TileGrid minWidth="160px">
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
        </TileGrid>

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
              <div key={step.name} className={styles.stepRow}>
                <div className={styles.stepInfo}>
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
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      columnGap: theme.spacing.sm,
                      marginTop: theme.spacing.sm,
                    }}
                  >
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
                  </div>
                </div>
                <div className={styles.resourceGrid}>
                  {stepResources.length === 0 && (
                    <Text size={200} style={{ color: theme.color.textTertiary }}>
                      {t("fabExplorer.noResources")}
                    </Text>
                  )}
                  {stepResources.map((r) => (
                    <div
                      key={r.name}
                      className={styles.resourceTile}
                      style={{
                        backgroundColor: tileSurface.backgroundColor,
                        borderLeftColor: STATE_COLORS[r.state],
                      }}
                      onClick={() => onSelectResource(r.name)}
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
                      <div className={styles.resourceStats}>
                        <div className={styles.statRow}>
                          <span>{t("fabExplorer.processedMaterials").split(" ")[0]}</span>
                          <span>{r.processedMaterials}</span>
                        </div>
                        <div className={styles.statRow}>
                          <span>Q</span>
                          <span>{r.inQueueMaterials}</span>
                        </div>
                        <div className={styles.statRow}>
                          <span>P</span>
                          <span>{r.inProcessMaterials}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </Card>
      </div>
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
                  <td
                    className={styles.undispatchCell}
                    style={{ color: theme.color.textBrand }}
                  >
                    {m.name}
                  </td>
                  <td className={styles.undispatchCell}>{m.quantity}</td>
                  <td
                    className={styles.undispatchCell}
                    style={{ color: theme.color.textBrand }}
                  >
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
    </div>
  );
}
