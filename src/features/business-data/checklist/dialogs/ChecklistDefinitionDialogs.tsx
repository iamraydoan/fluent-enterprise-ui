import { useState } from "react";
import type { ChecklistItem } from "@/api";
import { Button, Input } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { joinMeta } from "../checklistLookups";
import { DialogShell, Field } from "./dialogShared";
import { useDialogStyles } from "./dialogStyles";

export function PreviewChecklistDialog({
  open,
  checklistName,
  items,
  onClose,
}: {
  open: boolean;
  checklistName: string;
  items: ChecklistItem[];
  onClose: () => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [date, setDate] = useState("");
  const [material, setMaterial] = useState("");
  const [product, setProduct] = useState("");
  return (
    <DialogShell
      open={open}
      wide
      title={t("businessData.checklist.operations.previewTitle")}
      onClose={onClose}
      footer={
        <Button appearance="secondary" onClick={onClose}>
          {t("common.close")}
        </Button>
      }
    >
      <div className={styles.hint}>
        {t("businessData.checklist.operations.previewHint", { name: checklistName })}
      </div>
      <div className={styles.toolbar}>
        <Field label={t("businessData.checklist.operations.conditionDate")}>
          <Input type="date" value={date} onChange={(_, d) => setDate(d.value)} />
        </Field>
        <Field label={t("businessData.checklist.operations.conditionMaterial")}>
          <Input value={material} onChange={(_, d) => setMaterial(d.value)} />
        </Field>
        <Field label={t("businessData.checklist.operations.conditionProduct")}>
          <Input value={product} onChange={(_, d) => setProduct(d.value)} />
        </Field>
      </div>
      {items.length === 0 ? (
        <div className={styles.empty}>{t("businessData.checklist.operations.noItems")}</div>
      ) : (
        items.map((item, i) => (
          <div key={i} className={styles.performRow}>
            <div>
              <div style={{ fontWeight: 600 }}>{item.name}</div>
              <div className={styles.hint} style={{ margin: 0 }}>
                {joinMeta([
                  item.activityType,
                  item.trackingType,
                  item.optional ? t("businessData.checklist.operations.optional") : false,
                  item.floating ? t("businessData.checklist.operations.floating") : false,
                ])}
              </div>
            </div>
            <span className={styles.stateBadge}>{item.conditionType}</span>
            <span />
          </div>
        ))
      )}
    </DialogShell>
  );
}

export interface CloneChecklistRow {
  id: number;
  name: string;
  revision: string;
  comment: string;
}

export interface CloneChecklistRow {
  id: number;
  name: string;
  revision: string;
  comment: string;
}

export function CloneChecklistDialog({
  open,
  checklistName,
  onClose,
  onClone,
}: {
  open: boolean;
  checklistName: string;
  onClose: () => void;
  onClone: (rows: CloneChecklistRow[]) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [rows, setRows] = useState<CloneChecklistRow[]>([]);
  const addRow = () =>
    setRows([
      ...rows,
      { id: Date.now() + rows.length, name: `${checklistName} - Clone`, revision: "", comment: "" },
    ]);
  const removeRow = (id: number) => setRows(rows.filter((r) => r.id !== id));
  const update = (id: number, patch: Partial<CloneChecklistRow>) =>
    setRows(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  return (
    <DialogShell
      open={open}
      wide
      title={t("businessData.checklist.operations.cloneTitle")}
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
            {t("businessData.checklist.operations.clone")}
          </Button>
        </>
      }
    >
      <div className={styles.hint}>
        {t("businessData.checklist.operations.cloneHint", { name: checklistName })}
      </div>
      {rows.length === 0 && (
        <div className={styles.empty}>{t("businessData.checklist.operations.noCloneRows")}</div>
      )}
      {rows.map((row) => (
        <div key={row.id} className={styles.paramRow}>
          <div className={styles.paramNameWrap}>
            <Input
              placeholder={t("businessData.checklist.detail.name")}
              value={row.name}
              onChange={(_, d) => update(row.id, { name: d.value })}
            />
          </div>
          <div className={styles.paramNameWrap}>
            <Input
              placeholder={t("businessData.checklist.operations.revision")}
              value={row.revision}
              onChange={(_, d) => update(row.id, { revision: d.value })}
            />
          </div>
          <div className={styles.paramNameWrap}>
            <Input
              placeholder={t("businessData.checklist.operations.comment")}
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
    </DialogShell>
  );
}
