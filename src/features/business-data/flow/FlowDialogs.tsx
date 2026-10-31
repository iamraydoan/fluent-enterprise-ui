import { useState } from "react";
import { BaseDialog, DialogFooter } from "@/components/common";
import { Button, Input, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";

const L: Record<string, TranslationKey> = {
  logicalNamesTitle: "businessData.flow.manageDialog.logicalNamesTitle",
  logicalName: "businessData.flow.manageDialog.logicalName",
  addLogicalName: "businessData.flow.manageDialog.addLogicalName",
  remove: "businessData.flow.manageDialog.remove",
  update: "businessData.flow.manageDialog.update",
  cancel: "businessData.flow.manageDialog.cancel",
  reworkPathsTitle: "businessData.flow.manageDialog.reworkPathsTitle",
  filterByStep: "businessData.flow.manageDialog.filterByStep",
  close: "businessData.flow.manageDialog.close",
};

const useStyles = makeStyles({
  row: { display: "flex", gap: "8px", alignItems: "center" },
  field: { display: "grid", gridTemplateColumns: "150px 1fr", gap: "12px", alignItems: "center" },
});

export function FlowLogicalNamesDialog({ onClose }: { onClose: () => void }) {
  const { t } = useAppTranslation();
  const styles = useStyles();
  const [names, setNames] = useState<string[]>([]);

  return (
    <BaseDialog
      open
      title={t(L.logicalNamesTitle)}
      width="600px"
      onClose={onClose}
      footer={<DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={t(L.update)} />}
    >
      <div className={styles.row}>
        <Button size="small" onClick={() => setNames([...names, ""])}>
          + {t(L.addLogicalName)}
        </Button>
      </div>
      {names.map((n, i) => (
        <div key={i} className={styles.row}>
          <Input
            placeholder={t(L.logicalName)}
            value={n}
            onChange={(_, d) => setNames(names.map((x, j) => (j === i ? d.value : x)))}
          />
          <Button size="small" onClick={() => setNames(names.filter((_, j) => j !== i))}>
            {t(L.remove)}
          </Button>
        </div>
      ))}
    </BaseDialog>
  );
}

export function FlowReworkPathsDialog({ onClose }: { onClose: () => void }) {
  const { t } = useAppTranslation();
  const styles = useStyles();
  const [filter, setFilter] = useState("");

  return (
    <BaseDialog
      open
      title={t(L.reworkPathsTitle)}
      width="600px"
      onClose={onClose}
      footer={
        <Button appearance="primary" onClick={onClose}>
          {t(L.close)}
        </Button>
      }
    >
      <div className={styles.field}>
        <label>{t(L.filterByStep)}</label>
        <Input value={filter} onChange={(_, d) => setFilter(d.value)} />
      </div>
    </BaseDialog>
  );
}
