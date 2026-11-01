import { useState } from "react";
import { BaseDialog, DialogFooter, Empty } from "@/components/common";
import { Button, Checkbox, Input, Text, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { theme } from "@/styles/theme";
import type { OperationOnChange, OperationValues } from "../components/operationTypes";

interface BomItemRow {
  id: number;
  product: string;
  quantity: string;
  units: string;
  position: string;
}

const useListStyles = makeStyles({
  row: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) auto",
    columnGap: theme.spacing.sm,
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  hint: { fontSize: "13px", color: theme.color.textSecondary, marginBottom: theme.spacing.md },
});

function BomItemListEditor({
  values,
  onChange,
}: {
  values: OperationValues;
  onChange: OperationOnChange;
}) {
  const { t } = useAppTranslation();
  const styles = useListStyles();
  const rows = (values.items as unknown as BomItemRow[] | undefined) ?? [];

  const setRows = (next: BomItemRow[]) => onChange("items", next);

  const addRow = () =>
    setRows([
      ...rows,
      { id: Date.now() + rows.length, product: "", quantity: "1", units: "", position: "" },
    ]);

  const removeRow = (id: number) => setRows(rows.filter((row) => row.id !== id));

  const updateRow = (id: number, patch: Partial<BomItemRow>) =>
    setRows(rows.map((row) => (row.id === id ? { ...row, ...patch } : row)));

  return (
    <div>
      <div className={styles.hint}>{t("businessData.bom.operations.itemsHint")}</div>
      {rows.length === 0 && (
        <Empty>{t("businessData.bom.operations.noItems")}</Empty>
      )}
      {rows.map((row) => (
        <div key={row.id} className={styles.row}>
          <Input
            placeholder={t("businessData.bom.operations.product")}
            value={row.product}
            onChange={(value) => updateRow(row.id, { product: value })}
          />
          <Input
            placeholder={t("businessData.bom.operations.quantity")}
            value={row.quantity}
            onChange={(value) => updateRow(row.id, { quantity: value })}
          />
          <Input
            placeholder={t("businessData.bom.operations.units")}
            value={row.units}
            onChange={(value) => updateRow(row.id, { units: value })}
          />
          <Input
            placeholder={t("businessData.bom.operations.position")}
            value={row.position}
            onChange={(value) => updateRow(row.id, { position: value })}
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
  );
}

const useManageDialogStyles = makeStyles({
  checkRow: { display: "flex", alignItems: "center", columnGap: theme.spacing.sm, marginTop: theme.spacing.md },
});

export function ManageBomItemsDialog({
  open,
  bomName,
  onClose,
}: {
  open: boolean;
  bomName: string;
  onClose: () => void;
}) {
  const { t } = useAppTranslation();
  const styles = useManageDialogStyles();
  const [values, setValues] = useState<OperationValues>({});
  const [effective, setEffective] = useState(false);

  return (
    <BaseDialog
      open={open}
      title={t("businessData.bom.operations.manageItems")}
      onClose={onClose}
      size="xl"
      footer={
        <DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={t("common.update")} />
      }
    >
      <Text>{t("businessData.bom.operations.manageItemsHint", { name: bomName })}</Text>
      <div style={{ marginTop: theme.spacing.md }}>
        <BomItemListEditor
          values={values}
          onChange={(key, value) => setValues((prev) => ({ ...prev, [key]: value }))}
        />
      </div>
      <div className={styles.checkRow}>
        <Checkbox
          label={t("businessData.bom.operations.makeEffective")}
          checked={effective}
          onChange={setEffective}
        />
      </div>
    </BaseDialog>
  );
}
