import { useState } from "react";
import { BaseDialog, DialogFooter, Empty } from "@/components/common";
import { Button, Input, Text, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { theme } from "@/styles/theme";

const useManageDialogStyles = makeStyles({
  row: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr) auto",
    columnGap: theme.spacing.md,
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  dashboardItem: {
    display: "flex",
    alignItems: "center",
    columnGap: theme.spacing.md,
    padding: theme.spacing.md,
    border: `1px solid ${theme.color.borderSubtle}`,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.sm,
    cursor: "pointer",
    width: "100%",
    backgroundColor: "transparent",
    fontFamily: "inherit",
    fontSize: "13px",
    textAlign: "left",
    ":hover": { backgroundColor: theme.color.surfaceHover },
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

  const addRow = () => {
    setRows([...rows, { id: nextId, name: "", area: "" }]);
    setNextId(nextId + 1);
  };

  const removeRow = (id: number) => setRows(rows.filter((row) => row.id !== id));

  const updateRow = (id: number, patch: Partial<SupplyAreaRow>) =>
    setRows(rows.map((row) => (row.id === id ? { ...row, ...patch } : row)));

  return (
    <BaseDialog
      open={open}
      title={t("businessData.area.operations.manageSupplyAreas")}
      onClose={onClose}
      size="lg"
      footer={
        <DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={t("common.update")} />
      }
    >
      <Text>{t("businessData.area.operations.manageSupplyAreasHint", { name: areaName })}</Text>
      <div style={{ marginTop: theme.spacing.md }}>
        {rows.length === 0 && (
          <Empty>{t("businessData.area.operations.noSupplyAreas")}</Empty>
        )}
        {rows.map((row) => (
          <div key={row.id} className={styles.row}>
            <Input
              placeholder={t("businessData.area.operations.supplyAreaName")}
              value={row.name}
              onChange={(value) => updateRow(row.id, { name: value })}
            />
            <Input
              placeholder={t("businessData.area.operations.supplyArea")}
              value={row.area}
              onChange={(value) => updateRow(row.id, { area: value })}
            />
            <Button variant="secondary" onClick={() => removeRow(row.id)}>
              {t("common.remove")}
            </Button>
          </div>
        ))}
        <Button variant="secondary" onClick={addRow}>
          {t("common.add")}
        </Button>
      </div>
    </BaseDialog>
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

  const addRow = () => {
    setRows([...rows, { id: nextId, type: "", sourceLocation: "", autoApprove: false }]);
    setNextId(nextId + 1);
  };

  const removeRow = (id: number) => setRows(rows.filter((row) => row.id !== id));

  const updateRow = (id: number, patch: Partial<TransferTypeRow>) =>
    setRows(rows.map((row) => (row.id === id ? { ...row, ...patch } : row)));

  return (
    <BaseDialog
      open={open}
      title={t("businessData.area.operations.manageTransferTypes")}
      onClose={onClose}
      size="lg"
      footer={
        <DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={t("common.update")} />
      }
    >
      <Text>{t("businessData.area.operations.manageTransferTypesHint", { name: areaName })}</Text>
      <div style={{ marginTop: theme.spacing.md }}>
        {rows.length === 0 && (
          <Empty>{t("businessData.area.operations.noTransferTypes")}</Empty>
        )}
        {rows.map((row) => (
          <div key={row.id} className={styles.row}>
            <Input
              placeholder={TRANSFER_TYPE_OPTIONS[0].label}
              value={row.type}
              onChange={(value) => updateRow(row.id, { type: value })}
            />
            <Input
              placeholder={t("businessData.area.operations.sourceLocation")}
              value={row.sourceLocation}
              onChange={(value) => updateRow(row.id, { sourceLocation: value })}
            />
            <Button variant="secondary" onClick={() => removeRow(row.id)}>
              {t("common.remove")}
            </Button>
          </div>
        ))}
        <Button variant="secondary" onClick={addRow}>
          {t("common.add")}
        </Button>
      </div>
    </BaseDialog>
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

  return (
    <BaseDialog
      open={open}
      title={t("businessData.area.operations.viewDashboards")}
      onClose={onClose}
      size="lg"
      footer={
        <Button variant="secondary" onClick={onClose}>
          {t("common.close")}
        </Button>
      }
    >
      {DASHBOARDS.map((dashboard) => (
        <button key={dashboard} className={styles.dashboardItem} onClick={onClose}>
          {t(`businessData.area.operations.dashboards.${dashboard}`)}
        </button>
      ))}
    </BaseDialog>
  );
}
