import { useState } from "react";
import {
  Body1Strong,
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Field,
  Input,
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";

interface RecordSendAheadRunResultDialogProps {
  open: boolean;
  onClose: () => void;
  runName: string;
}

const RESULT_OPTIONS = ["Pass", "Fail"];

export function RecordSendAheadRunResultDialog({ open, onClose, runName }: RecordSendAheadRunResultDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.sendAheadRun.dialogs.record";
  const [result, setResult] = useState(RESULT_OPTIONS[0]);
  const [remarks, setRemarks] = useState("");

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface style={{ maxWidth: 700, width: "85vw" }}>
        <DialogBody>
          <DialogTitle>{t(`${k}.title`)}</DialogTitle>
          <DialogContent>
            <div style={{ marginBottom: 12, color: "#0078d4" }}>📊 {runName}</div>
            <div style={{ display: "flex", flexDirection: "column", rowGap: 12 }}>
              <Body1Strong>{t(`${k}.resultBody`)}</Body1Strong>
              <Field label={t(`${k}.result`)}>
                <select value={result} onChange={(e) => setResult(e.target.value)}>
                  {RESULT_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </Field>
              <Field label={t(`${k}.remarks`)}>
                <Input value={remarks} onChange={(_, d) => setRemarks(d.value)} />
              </Field>
            </div>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onClose}>{t("common.cancel")}</Button>
            <Button appearance="primary" onClick={onClose}>{t(`${k}.record`)}</Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
