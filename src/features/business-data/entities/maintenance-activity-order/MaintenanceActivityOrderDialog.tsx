import { useState } from "react";
import { Button, Input, Textarea, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";


const L: Record<string, TranslationKey> = {
  editTitle: "businessData.maintenanceActivityOrder.dialog.editTitle",
  description: "businessData.maintenanceActivityOrder.dialog.description",
  dataGroup: "businessData.maintenanceActivityOrder.dialog.dataGroup",
  cancel: "businessData.maintenanceActivityOrder.dialog.cancel",
  save: "businessData.maintenanceActivityOrder.dialog.save",
};

const useDialogStyles = makeStyles({
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  surface: { width: "560px", maxWidth: "95vw", display: "flex", flexDirection: "column", maxHeight: "90vh" },
  head: {
    padding: "12px 16px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase400,
  },
  body: { padding: "16px", display: "flex", flexDirection: "column", gap: "12px", overflowY: "auto" },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
    padding: "12px 16px",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  field: { display: "grid", gridTemplateColumns: "160px 1fr", gap: "12px", alignItems: "center" },
});

export function MaintenanceActivityOrderDialog({ name, onClose }: { name: string; onClose: () => void }) {
  const { t } = useAppTranslation();
  const shared = useSharedStyles();
  const styles = useDialogStyles();
  const [description, setDescription] = useState("");
  const [dataGroup, setDataGroup] = useState("");

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div className={`${shared.contentCard} ${styles.surface}`} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className={styles.head}>
          {t(L.editTitle)} — {name}
        </div>
        <div className={styles.body}>
          <div className={styles.field}>
            <label>{t(L.description)}</label>
            <Textarea value={description} onChange={(_, d) => setDescription(d.value)} />
          </div>
          <div className={styles.field}>
            <label>{t(L.dataGroup)}</label>
            <Input value={dataGroup} onChange={(_, d) => setDataGroup(d.value)} />
          </div>
        </div>
        <div className={styles.footer}>
          <Button onClick={onClose}>{t(L.cancel)}</Button>
          <Button appearance="primary" onClick={onClose}>
            {t(L.save)}
          </Button>
        </div>
      </div>
    </div>
  );
}
