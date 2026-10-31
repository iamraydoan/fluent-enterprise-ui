import { useState } from "react";
import { Button, Input, Textarea, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import { MODE_CREATE, MODE_EDIT } from "../components/wizardMode";
import type { WizardMode } from "../components/wizardMode";

const L: Record<string, TranslationKey> = {
  createTitle: "businessData.enterprise.dialog.createTitle",
  editTitle: "businessData.enterprise.dialog.editTitle",
  cloneTitle: "businessData.enterprise.dialog.cloneTitle",
  name: "businessData.enterprise.dialog.name",
  description: "businessData.enterprise.dialog.description",
  cancel: "businessData.enterprise.dialog.cancel",
  create: "businessData.enterprise.dialog.create",
  save: "businessData.enterprise.dialog.save",
  clone: "businessData.enterprise.dialog.clone",
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
  surface: { width: "600px", maxWidth: "95vw", display: "flex", flexDirection: "column" },
  head: {
    padding: "12px 16px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase400,
  },
  body: { padding: "16px", display: "flex", flexDirection: "column", gap: "12px" },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
    padding: "12px 16px",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  field: { display: "grid", gridTemplateColumns: "150px 1fr", gap: "12px", alignItems: "center" },
});

interface DialogProps {
  mode: WizardMode;
  initialName?: string;
  initialDescription?: string;
  onClose: () => void;
}

export function EnterpriseDialog({ mode, initialName, initialDescription, onClose }: DialogProps) {
  const { t } = useAppTranslation();
  const shared = useSharedStyles();
  const styles = useDialogStyles();
  const [name, setName] = useState(initialName ?? "");
  const [description, setDescription] = useState(initialDescription ?? "");

  const title =
    mode === MODE_CREATE ? L.createTitle : mode === MODE_EDIT ? L.editTitle : L.cloneTitle;
  const canSubmit = name.trim().length > 0;

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={`${shared.contentCard} ${styles.surface}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.head}>{t(title)}</div>
        <div className={styles.body}>
          <div className={styles.field}>
            <label>
              <span style={{ color: tokens.colorPaletteRedForeground1 }}>* </span>
              {t(L.name)}
            </label>
            <Input
              value={name}
              onChange={(_, d) => setName(d.value)}
              disabled={mode === MODE_EDIT}
            />
          </div>
          <div className={styles.field}>
            <label>{t(L.description)}</label>
            <Textarea value={description} onChange={(_, d) => setDescription(d.value)} />
          </div>
        </div>
        <div className={styles.footer}>
          <Button onClick={onClose}>{t(L.cancel)}</Button>
          <Button appearance="primary" onClick={onClose} disabled={!canSubmit}>
            {t(mode === MODE_CREATE ? L.create : mode === MODE_EDIT ? L.save : L.clone)}
          </Button>
        </div>
      </div>
    </div>
  );
}
