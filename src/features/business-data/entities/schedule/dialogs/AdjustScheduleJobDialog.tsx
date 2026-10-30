import { useState } from "react";
import type { ScheduleDetail, ScheduleRecord } from "@/api";
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

interface AdjustScheduleJobDialogProps {
  open: boolean;
  onClose: () => void;
  scheduleName: string;
  initial?: Partial<ScheduleDetail & ScheduleRecord>;
}

export function AdjustScheduleJobDialog({ open, onClose, scheduleName }: AdjustScheduleJobDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.schedule.dialogs.adjust";
  const [resource, setResource] = useState("");
  const [plannedStart, setPlannedStart] = useState("");
  const [plannedEnd, setPlannedEnd] = useState("");

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface style={{ maxWidth: 700, width: "85vw" }}>
        <DialogBody>
          <DialogTitle>{t(`${k}.title`)}</DialogTitle>
          <DialogContent>
            <div style={{ marginBottom: 12, color: "#0078d4" }}>📊 {scheduleName}</div>
            <div style={{ display: "flex", flexDirection: "column", rowGap: 12 }}>
              <Body1Strong>{t(`${k}.jobBody`)}</Body1Strong>
              <Field label={t(`${k}.resource`)}>
                <Input value={resource} onChange={(_, d) => setResource(d.value)} />
              </Field>
              <Field label={t(`${k}.plannedStart`)}>
                <Input value={plannedStart} type="datetime-local" onChange={(_, d) => setPlannedStart(d.value)} />
              </Field>
              <Field label={t(`${k}.plannedEnd`)}>
                <Input value={plannedEnd} type="datetime-local" onChange={(_, d) => setPlannedEnd(d.value)} />
              </Field>
            </div>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onClose}>{t("common.cancel")}</Button>
            <Button appearance="primary" onClick={onClose}>{t(`${k}.adjust`)}</Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
