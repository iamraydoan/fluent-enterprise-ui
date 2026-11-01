import { useState } from "react";
import type { ScheduleDetail, ScheduleRecord } from "@/api";
import { BaseDialog, DialogFooter, DialogEntityBanner, VStack  } from "@/components/common";
import { Body1Strong, Field, Input } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { theme } from "@/styles/theme";

interface AdjustScheduleJobDialogProps {
  open: boolean;
  onClose: () => void;
  scheduleName: string;
  initial?: Partial<ScheduleDetail & ScheduleRecord>;
}

export function AdjustScheduleJobDialog({
  open,
  onClose,
  scheduleName,
}: AdjustScheduleJobDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.schedule.dialogs.adjust";
  const [resource, setResource] = useState("");
  const [plannedStart, setPlannedStart] = useState("");
  const [plannedEnd, setPlannedEnd] = useState("");

  return (
    <BaseDialog
      open={open}
      title={t(`${k}.title`)}
      onClose={onClose}
      width="min(700px, 85vw)"
      footer={
        <DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={t(`${k}.adjust`)} />
      }
    >
      <DialogEntityBanner icon="📊" name={scheduleName} />
      <VStack gap={12}>
        <Body1Strong>{t(`${k}.jobBody`)}</Body1Strong>
        <Field label={t(`${k}.resource`)}>
          <Input value={resource} onChange={setResource} />
        </Field>
        <Field label={t(`${k}.plannedStart`)}>
          <Input value={plannedStart} type="datetime-local" onChange={setPlannedStart} />
        </Field>
        <Field label={t(`${k}.plannedEnd`)}>
          <Input value={plannedEnd} type="datetime-local" onChange={setPlannedEnd} />
        </Field>
      </VStack>
    </BaseDialog>
  );
}
