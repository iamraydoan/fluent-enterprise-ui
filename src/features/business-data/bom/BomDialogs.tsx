import { useState } from "react";
import { BaseDialog, DialogFooter } from "@/components/common";
import { Button, Checkbox, Input, Text, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { OperationValues } from "../components/operationTypes";

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
    columnGap: "8px",
    alignItems: "center",
    marginBottom: "8px",
  },
  empty: { padding: "16px", textAlign: "center", color: tokens.colorNeutralForeground3 },
  hint: { fontSize: "13px", color: tokens.colorNeutralForeground2, marginBottom: "12px" },
});

function BomItemListEditor({
  values,
  onChange,
}: {
  values: OperationValues;
  onChange: (key: string, value: string | number | boolean) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useListStyles();
  const rows = (values.items as unknown as BomItemRow[] | undefined) ?? [];

  const setRows = (next: BomItemRow[]) => onChange("items", next as unknown as boolean);

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
        <div className={styles.empty}>{t("businessData.bom.operations.noItems")}</div>
      )}
      {rows.map((row) => (
        <div key={row.id} className={styles.row}>
          <Input
            placeholder={t("businessData.bom.operations.product")}
            value={row.product}
            onChange={(_, data) => updateRow(row.id, { product: data.value })}
          />
          <Input
            placeholder={t("businessData.bom.operations.quantity")}
            value={row.quantity}
            onChange={(_, data) => updateRow(row.id, { quantity: data.value })}
          />
          <Input
            placeholder={t("businessData.bom.operations.units")}
            value={row.units}
            onChange={(_, data) => updateRow(row.id, { units: data.value })}
          />
          <Input
            placeholder={t("businessData.bom.operations.position")}
            value={row.position}
            onChange={(_, data) => updateRow(row.id, { position: data.value })}
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
  );
}

const useManageDialogStyles = makeStyles({
  checkRow: { display: "flex", alignItems: "center", columnGap: "8px", marginTop: "12px" },
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
      <div style={{ marginTop: "12px" }}>
        <BomItemListEditor
          values={values}
          onChange={(key, value) => setValues((prev) => ({ ...prev, [key]: value }))}
        />
      </div>
      <div className={styles.checkRow}>
        <Checkbox
          label={t("businessData.bom.operations.makeEffective")}
          checked={effective}
          onChange={(_, data) => setEffective(data.checked === true)}
        />
      </div>
    </BaseDialog>
  );
}
