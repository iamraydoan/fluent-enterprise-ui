import { useState } from "react";
import { Dismiss16Regular } from "@/components/icons";
import { Button, Input, Text, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { cardSurface } from "@/styles/shared";

const useManageDialogStyles = makeStyles({
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    display: "grid",
    placeItems: "center",
    padding: "24px",
    boxSizing: "border-box",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  surface: {
    width: "min(720px, calc(100vw - 48px))",
    maxHeight: "min(640px, calc(100vh - 48px))",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    ...cardSurface,
  },
  head: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: "52px",
    padding: "0 16px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    flexShrink: 0,
  },
  closeButton: {
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    padding: "6px",
    borderRadius: tokens.borderRadiusMedium,
    display: "flex",
    ":hover": { backgroundColor: tokens.colorNeutralBackground1Hover },
  },
  body: { flexGrow: 1, minHeight: 0, overflowY: "auto", padding: "16px 24px" },
  row: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr) auto",
    columnGap: "12px",
    alignItems: "center",
    marginBottom: "8px",
  },
  foot: {
    display: "flex",
    justifyContent: "flex-end",
    columnGap: "8px",
    padding: "12px 24px",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  empty: { padding: "24px", textAlign: "center", color: tokens.colorNeutralForeground3 },
  dashboardItem: {
    display: "flex",
    alignItems: "center",
    columnGap: "12px",
    padding: "12px",
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    marginBottom: "8px",
    cursor: "pointer",
    width: "100%",
    backgroundColor: "transparent",
    fontFamily: "inherit",
    fontSize: "13px",
    textAlign: "left",
    ":hover": { backgroundColor: tokens.colorNeutralBackground1Hover },
  },
});

interface SupplyAreaRow {
  id: number;
  name: string;
  area: string;
}

export function ManageSupplyAreasDialog({
  open,
  areaName,
  onClose,
}: {
  open: boolean;
  areaName: string;
  onClose: () => void;
}) {
  const { t } = useAppTranslation();
  const styles = useManageDialogStyles();
  const [rows, setRows] = useState<SupplyAreaRow[]>([]);
  const [nextId, setNextId] = useState(1);

  if (!open) return null;

  const addRow = () => {
    setRows([...rows, { id: nextId, name: "", area: "" }]);
    setNextId(nextId + 1);
  };

  const removeRow = (id: number) => setRows(rows.filter((row) => row.id !== id));

  const updateRow = (id: number, patch: Partial<SupplyAreaRow>) =>
    setRows(rows.map((row) => (row.id === id ? { ...row, ...patch } : row)));

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.surface} onClick={(event) => event.stopPropagation()}>
        <div className={styles.head}>
          <Text weight="semibold">{t("businessData.area.operations.manageSupplyAreas")}</Text>
          <button className={styles.closeButton} onClick={onClose} aria-label={t("common.close")}>
            <Dismiss16Regular />
          </button>
        </div>
        <div className={styles.body}>
          <Text>{t("businessData.area.operations.manageSupplyAreasHint", { name: areaName })}</Text>
          <div style={{ marginTop: "12px" }}>
            {rows.length === 0 && (
              <div className={styles.empty}>{t("businessData.area.operations.noSupplyAreas")}</div>
            )}
            {rows.map((row) => (
              <div key={row.id} className={styles.row}>
                <Input
                  placeholder={t("businessData.area.operations.supplyAreaName")}
                  value={row.name}
                  onChange={(_, data) => updateRow(row.id, { name: data.value })}
                />
                <Input
                  placeholder={t("businessData.area.operations.supplyArea")}
                  value={row.area}
                  onChange={(_, data) => updateRow(row.id, { area: data.value })}
                />
                <Button appearance="secondary" onClick={() => removeRow(row.id)}>
                  {t("common.remove")}
                </Button>
              </div>
            ))}
            <Button appearance="secondary" onClick={addRow}>
              {t("common.add")}
            </Button>
          </div>
        </div>
        <div className={styles.foot}>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button appearance="primary" onClick={onClose}>
            {t("common.update")}
          </Button>
        </div>
      </div>
    </div>
  );
}

const TRANSFER_TYPE_OPTIONS = [
  { value: "Material", label: "Material" },
  { value: "Container", label: "Container" },
];

interface TransferTypeRow {
  id: number;
  type: string;
  sourceLocation: string;
  autoApprove: boolean;
}

export function ManageTransferRequirementTypesDialog({
  open,
  areaName,
  onClose,
}: {
  open: boolean;
  areaName: string;
  onClose: () => void;
}) {
  const { t } = useAppTranslation();
  const styles = useManageDialogStyles();
  const [rows, setRows] = useState<TransferTypeRow[]>([]);
  const [nextId, setNextId] = useState(1);

  if (!open) return null;

  const addRow = () => {
    setRows([...rows, { id: nextId, type: "", sourceLocation: "", autoApprove: false }]);
    setNextId(nextId + 1);
  };

  const removeRow = (id: number) => setRows(rows.filter((row) => row.id !== id));

  const updateRow = (id: number, patch: Partial<TransferTypeRow>) =>
    setRows(rows.map((row) => (row.id === id ? { ...row, ...patch } : row)));

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.surface} onClick={(event) => event.stopPropagation()}>
        <div className={styles.head}>
          <Text weight="semibold">{t("businessData.area.operations.manageTransferTypes")}</Text>
          <button className={styles.closeButton} onClick={onClose} aria-label={t("common.close")}>
            <Dismiss16Regular />
          </button>
        </div>
        <div className={styles.body}>
          <Text>
            {t("businessData.area.operations.manageTransferTypesHint", { name: areaName })}
          </Text>
          <div style={{ marginTop: "12px" }}>
            {rows.length === 0 && (
              <div className={styles.empty}>{t("businessData.area.operations.noTransferTypes")}</div>
            )}
            {rows.map((row) => (
              <div key={row.id} className={styles.row}>
                <Input
                  placeholder={TRANSFER_TYPE_OPTIONS[0].label}
                  value={row.type}
                  onChange={(_, data) => updateRow(row.id, { type: data.value })}
                />
                <Input
                  placeholder={t("businessData.area.operations.sourceLocation")}
                  value={row.sourceLocation}
                  onChange={(_, data) => updateRow(row.id, { sourceLocation: data.value })}
                />
                <Button appearance="secondary" onClick={() => removeRow(row.id)}>
                  {t("common.remove")}
                </Button>
              </div>
            ))}
            <Button appearance="secondary" onClick={addRow}>
              {t("common.add")}
            </Button>
          </div>
        </div>
        <div className={styles.foot}>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button appearance="primary" onClick={onClose}>
            {t("common.update")}
          </Button>
        </div>
      </div>
    </div>
  );
}

const DASHBOARDS = ["maintenanceKpi", "oee", "production"] as const;

export function ViewAreaDashboardsDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useAppTranslation();
  const styles = useManageDialogStyles();

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.surface} onClick={(event) => event.stopPropagation()}>
        <div className={styles.head}>
          <Text weight="semibold">{t("businessData.area.operations.viewDashboards")}</Text>
          <button className={styles.closeButton} onClick={onClose} aria-label={t("common.close")}>
            <Dismiss16Regular />
          </button>
        </div>
        <div className={styles.body}>
          {DASHBOARDS.map((dashboard) => (
            <button
              key={dashboard}
              className={styles.dashboardItem}
              onClick={onClose}
            >
              {t(`businessData.area.operations.dashboards.${dashboard}`)}
            </button>
          ))}
        </div>
        <div className={styles.foot}>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.close")}
          </Button>
        </div>
      </div>
    </div>
  );
}

