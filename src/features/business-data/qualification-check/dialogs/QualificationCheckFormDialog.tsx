import { useState } from "react";
import type { QualificationCheckDetail } from "@/api";
import { BaseDialog, DialogFooter } from "@/components/common";
import { Body1Strong, Field, Input } from "@/components/ui";
import { useAppTranslation } from "@/i18n";

interface QualificationCheckFormDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  initial?: Partial<QualificationCheckDetail>;
  nameReadOnly?: boolean;
  submitLabel: string;
}

export function QualificationCheckFormDialog({
  open,
  onClose,
  title,
  initial,
  nameReadOnly,
  submitLabel,
}: QualificationCheckFormDialogProps) {
  const { t } = useAppTranslation();
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [dataGroup, setDataGroup] = useState(initial?.dataGroup ?? "");
  const [instanceType, setInstanceType] = useState(initial?.instanceType ?? "Single");
  const [comments, setComments] = useState("");

  const k = "businessData.qualificationCheck.dialogs.form";

  return (
    <BaseDialog
      open={open}
      title={title}
      onClose={onClose}
      width="min(900px, 90vw)"
      footer={<DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={submitLabel} />}
    >
      <div style={{ display: "flex", flexDirection: "column", rowGap: 16 }}>
        <Body1Strong>{t(`${k}.generalData`)}</Body1Strong>
        <Field label={t(`${k}.name`)} required>
          <Input value={name} readOnly={nameReadOnly} onChange={(_, d) => setName(d.value)} />
        </Field>
        <Field label={t(`${k}.description`)}>
          <Input value={description} onChange={(_, d) => setDescription(d.value)} />
        </Field>
        <Field label={t(`${k}.dataGroup`)}>
          <Input value={dataGroup} onChange={(_, d) => setDataGroup(d.value)} />
        </Field>
        <Field label={t(`${k}.instanceType`)} required>
          <div style={{ display: "flex", columnGap: 16 }}>
            <label style={{ display: "flex", alignItems: "center", columnGap: 6 }}>
              <input
                type="radio"
                name="instanceType"
                checked={instanceType === "Single"}
                onChange={() => setInstanceType("Single")}
              />
              {t(`${k}.single`)}
            </label>
            <label style={{ display: "flex", alignItems: "center", columnGap: 6 }}>
              <input
                type="radio"
                name="instanceType"
                checked={instanceType === "Multiple"}
                onChange={() => setInstanceType("Multiple")}
              />
              {t(`${k}.multiple`)}
            </label>
          </div>
        </Field>
        <Field label={t(`${k}.comments`)}>
          <Input value={comments} onChange={(_, d) => setComments(d.value)} />
        </Field>
      </div>
    </BaseDialog>
  );
}
