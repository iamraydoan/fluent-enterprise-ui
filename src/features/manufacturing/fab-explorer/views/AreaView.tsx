import { useState } from "react";
import { useFabArea, useFabResources, useFabSteps, useFabUndispatchableMaterials } from "@/api";
import type { FabResourceState } from "@/api";
import { Card, SidePanel } from "@/components/common";
import { makeStyles, Text, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import type { FabNavigation } from "../FabExplorerPage";

const useViewStyles = makeStyles({
  body: { display: "flex", columnGap: "10px", flexGrow: 1, minHeight: 0 },
  main: { flexGrow: 1, minWidth: 0, display: "flex", flexDirection: "column", rowGap: "12px" },
  filterBar: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    columnGap: "12px",
    fontSize: "13px",
  },
  stepRow: {
    display: "flex",
    columnGap: "0",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    minHeight: "120px",
  },
  stepInfo: {
    width: "140px",
    flexShrink: 0,
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    rowGap: "4px",
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  resourceGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    padding: "12px",
    flexGrow: 1,
  },
  resourceTile: {
    width: "110px",
    borderRadius: "4px",
    padding: "8px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    rowGap: "4px",
    borderLeft: "4px solid",
    ":hover": { filter: "brightness(0.95)" },
  },
  resourceStats: { display: "flex", flexDirection: "column", fontSize: "11px", rowGap: "2px" },
  statRow: { display: "flex", justifyContent: "space-between" },
  undispatchTable: { width: "100%", borderCollapse: "collapse", fontSize: "13px" },
  undispatchHeader: {
    textAlign: "left",
    padding: "8px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    color: tokens.colorNeutralForeground3,
    fontSize: "12px",
  },
  undispatchCell: { padding: "8px", borderBottom: `1px solid ${tokens.colorNeutralStroke1}` },
  infoCards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: "12px",
  },
  infoCard: { padding: "12px", textAlign: "center" },
});

interface AreaViewProps {
  nav: FabNavigation;
  go: (patch: Partial<FabNavigation>) => void;
  onSelectStep: (stepName: string) => void;
  onSelectResource: (resourceName: string) => void;
}

const STATE_COLORS: Record<FabResourceState, string> = {
  Up: tokens.colorPaletteGreenBackground3,
  Down: tokens.colorPaletteRedBackground3,
  Maintenance: tokens.colorPaletteYellowBackground3,
  NonScheduled: tokens.colorNeutralBackground4,
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
    if (search && !r.name.toLowerCase().includes(search.toLowerCase())) return false;
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
        <div className={styles.infoCards}>
          <div className={`${sharedStyles.contentCard} ${styles.infoCard}`}>
            <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
              {t("fabExplorer.processedMaterials")}
            </Text>
            <Text size={500} weight="semibold">
              {processedMaterials}
            </Text>
          </div>
          <div className={`${sharedStyles.contentCard} ${styles.infoCard}`}>
            <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
              {t("fabExplorer.inQueueMaterials")}
            </Text>
            <Text size={500} weight="semibold">
              {inQueueMaterials}
            </Text>
          </div>
          <div className={`${sharedStyles.contentCard} ${styles.infoCard}`}>
            <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
              {t("fabExplorer.inProcessMaterials")}
            </Text>
            <Text size={500} weight="semibold">
              {inProcessMaterials}
            </Text>
          </div>
        </div>

        <div className={styles.filterBar}>
          <span>
            {t("fabExplorer.resourceState")}:{" "}
            <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)}>
              <option value="ALL">{t("fabExplorer.all")}</option>
              <option value="Up">{t("fabExplorer.up")}</option>
              <option value="Down">{t("fabExplorer.down")}</option>
              <option value="Maintenance">{t("fabExplorer.maintenance")}</option>
              <option value="NonScheduled">{t("fabExplorer.nonScheduled")}</option>
            </select>
          </span>
          <input
            placeholder={t("fabExplorer.resourceName")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "6px 8px",
              borderRadius: "4px",
              border: `1px solid ${tokens.colorNeutralStroke1}`,
            }}
          />
        </div>

        <Card title={area?.name ?? nav.area}>
          {steps.map((step) => {
            const stepResources = getStepResources(step.name);
            return (
              <div key={step.name} className={styles.stepRow}>
                <div className={styles.stepInfo}>
                  <Text
                    weight="semibold"
                    size={300}
                    style={{ cursor: "pointer", color: tokens.colorBrandForeground1 }}
                    onClick={() => onSelectStep(step.name)}
                  >
                    {step.name}
                  </Text>
                  <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
                    {step.description}
                  </Text>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      columnGap: "8px",
                      marginTop: "8px",
                    }}
                  >
                    <span
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        backgroundColor: tokens.colorBrandBackground2,
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
                    <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
                      {t("fabExplorer.noResources")}
                    </Text>
                  )}
                  {stepResources.map((r) => (
                    <div
                      key={r.name}
                      className={styles.resourceTile}
                      style={{
                        backgroundColor: "#EAF3F9",
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
                      <Text size={100} style={{ color: tokens.colorNeutralForeground3 }}>
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
                    style={{ color: tokens.colorBrandForeground1 }}
                  >
                    {m.name}
                  </td>
                  <td className={styles.undispatchCell}>{m.quantity}</td>
                  <td
                    className={styles.undispatchCell}
                    style={{ color: tokens.colorBrandForeground1 }}
                  >
                    {m.step}
                  </td>
                  <td className={styles.undispatchCell}>{m.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
            {t("fabExplorer.records", { count: undispatchable.length })}
          </Text>
        </Card>
      </SidePanel>
    </div>
  );
}
