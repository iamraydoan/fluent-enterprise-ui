import { useState } from "react";
import { BaseDialog, FormField } from "@/components/common";
import { Button, Input, Textarea, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
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

interface DialogProps {
  mode: WizardMode;
  initialName?: string;
  initialDescription?: string;
  onClose: () => void;
}

export function EnterpriseDialog({ mode, initialName, initialDescription, onClose }: DialogProps) {
  const { t } = useAppTranslation();
  const [name, setName] = useState(initialName ?? "");
  const [description, setDescription] = useState(initialDescription ?? "");

  const title =
    mode === MODE_CREATE ? L.createTitle : mode === MODE_EDIT ? L.editTitle : L.cloneTitle;
  const canSubmit = name.trim().length > 0;

  return (
    <BaseDialog
      open
      title={t(title)}
      onClose={onClose}
      size="md"
      footer={
        <>
          <Button onClick={onClose}>{t(L.cancel)}</Button>
          <Button appearance="primary" onClick={onClose} disabled={!canSubmit}>
            {t(mode === MODE_CREATE ? L.create : mode === MODE_EDIT ? L.save : L.clone)}
          </Button>
        </>
      }
    >
      <FormField
        label={
          <>
            <span style={{ color: tokens.colorPaletteRedForeground1 }}>* </span>
            {t(L.name)}
          </>
        }
        labelWidth="150px"
      >
        <Input value={name} onChange={(_, d) => setName(d.value)} disabled={mode === MODE_EDIT} />
      </FormField>
      <FormField label={<>{t(L.description)}</>} labelWidth="150px">
        <Textarea value={description} onChange={(_, d) => setDescription(d.value)} />
      </FormField>
    </BaseDialog>
  );
}
