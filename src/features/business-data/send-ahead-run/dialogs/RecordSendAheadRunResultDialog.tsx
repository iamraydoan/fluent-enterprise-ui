import { useState } from "react";
import { BaseDialog, DialogFooter, DialogEntityBanner, VStack  } from "@/components/common";
import { Body1Strong, Field, Input } from "@/components/ui";
import { useAppTranslation } from "@/i18n";

interface RecordSendAheadRunResultDialogProps {
  open: boolean;
  onClose: () => void;
  runName: string;
}

const RESULT_OPTIONS = ["Pass", "Fail"];

export function RecordSendAheadRunResultDialog({
  open,
  onClose,
  runName,
}: RecordSendAheadRunResultDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.sendAheadRun.dialogs.record";
  const [result, setResult] = useState(RESULT_OPTIONS[0]);
  const [remarks, setRemarks] = useState("");

  return (
    <BaseDialog
      open={open}
      title={t(`${k}.title`)}
      onClose={onClose}
      width="min(700px, 85vw)"
      footer={
        <DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={t(`${k}.record`)} />
      }
    >
      <DialogEntityBanner icon="📊" name={runName} />
      <VStack gap={12}>
        <Body1Strong>{t(`${k}.resultBody`)}</Body1Strong>
        <Field label={t(`${k}.result`)}>
          <select value={result} onChange={(e) => setResult(e.target.value)}>
            {RESULT_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t(`${k}.remarks`)}>
          <Input value={remarks} onChange={setRemarks} />
        </Field>
      </VStack>
    </BaseDialog>
  );
}
