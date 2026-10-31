import { useState } from "react";
import { BaseDialog } from "@/components/common";
import { Button, Input } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { useDialogStyles } from "./dialogStyles";

export interface CloneDataCollectionRow {
  id: number;
  name: string;
  revision: string;
  comment: string;
}

export function CloneDataCollectionDialog({
  open,
  dataCollectionName,
  onClose,
  onClone,
}: {
  open: boolean;
  dataCollectionName: string;
  onClose: () => void;
  onClone: (rows: CloneDataCollectionRow[]) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [rows, setRows] = useState<CloneDataCollectionRow[]>([]);
  const addRow = () =>
    setRows([
      ...rows,
      {
        id: Date.now() + rows.length,
        name: `${dataCollectionName} - Clone`,
        revision: "",
        comment: "",
      },
    ]);
  const removeRow = (id: number) => setRows(rows.filter((r) => r.id !== id));
  const update = (id: number, patch: Partial<CloneDataCollectionRow>) =>
    setRows(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  return (
    <BaseDialog
      open={open}
      size="xl"
      title={t("businessData.dataCollection.operations.cloneTitle")}
      onClose={onClose}
      footer={
        <>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            appearance="primary"
            disabled={rows.length === 0 || rows.some((r) => r.name.trim() === "")}
            onClick={() => onClone(rows)}
          >
            {t("businessData.dataCollection.operations.clone")}
          </Button>
        </>
      }
    >
      <div className={styles.hint}>
        {t("businessData.dataCollection.operations.cloneHint", { name: dataCollectionName })}
      </div>
      {rows.length === 0 && (
        <div className={styles.empty}>
          {t("businessData.dataCollection.operations.noCloneRows")}
        </div>
      )}
      {rows.map((row) => (
        <div key={row.id} className={styles.paramRow}>
          <div className={styles.grow}>
            <Input
              placeholder={t("businessData.dataCollection.detail.name")}
              value={row.name}
              onChange={(_, d) => update(row.id, { name: d.value })}
            />
          </div>
          <div className={styles.grow}>
            <Input
              placeholder={t("businessData.dataCollection.operations.revision")}
              value={row.revision}
              onChange={(_, d) => update(row.id, { revision: d.value })}
            />
          </div>
          <div className={styles.grow}>
            <Input
              placeholder={t("businessData.dataCollection.operations.comment")}
              value={row.comment}
              onChange={(_, d) => update(row.id, { comment: d.value })}
            />
          </div>
          <Button appearance="secondary" onClick={() => removeRow(row.id)}>
            {t("common.remove")}
          </Button>
        </div>
      ))}
      <Button appearance="secondary" onClick={addRow}>
        {t("common.add")}
      </Button>
    </BaseDialog>
  );
}
