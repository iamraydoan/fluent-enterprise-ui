import { useState } from "react";
import { Dismiss16Regular } from "@/components/icons";
import { Button, Checkbox, Input, Text, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { cardSurface } from "@/styles/shared";
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
    width: "min(860px, calc(100vw - 48px))",
    maxHeight: "min(680px, calc(100vh - 48px))",
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
  foot: {
    display: "flex",
    justifyContent: "flex-end",
    columnGap: "8px",
    padding: "12px 24px",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
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

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.surface} onClick={(event) => event.stopPropagation()}>
        <div className={styles.head}>
          <Text weight="semibold">{t("businessData.bom.operations.manageItems")}</Text>
          <button className={styles.closeButton} onClick={onClose} aria-label={t("common.close")}>
            <Dismiss16Regular />
          </button>
        </div>
        <div className={styles.body}>
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
