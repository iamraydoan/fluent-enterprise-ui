import { useState } from "react";
import { BaseDialog, DialogFooter, FormField } from "@/components/common";
import { Button, Input, Textarea, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";

const L: Record<string, TranslationKey> = {
  setNonWorkingTimeTitle: "businessData.employee.calendarDays.setNonWorkingTimeTitle",
  setWorkAvailabilityTitle: "businessData.employee.calendarDays.setWorkAvailabilityTitle",
  removeNonWorkingTimesTitle: "businessData.employee.calendarDays.removeNonWorkingTimesTitle",
  removeWorkAvailabilityTitle: "businessData.employee.calendarDays.removeWorkAvailabilityTitle",
  removeNonWorkingTimesMessage: "businessData.employee.calendarDays.removeNonWorkingTimesMessage",
  removeWorkAvailabilityMessage: "businessData.employee.calendarDays.removeWorkAvailabilityMessage",
  description: "businessData.employee.calendarDays.description",
  nonWorkingTimeType: "businessData.employee.calendarDays.nonWorkingTimeType",
  startTime: "businessData.employee.calendarDays.startTime",
  endTime: "businessData.employee.calendarDays.endTime",
  comment: "businessData.employee.calendarDays.comment",
  cancel: "businessData.employee.calendarDays.cancel",
  set: "businessData.employee.calendarDays.set",
  remove: "businessData.employee.calendarDays.remove",
};

interface DialogProps {
  name: string;
  onClose: () => void;
}

export function SetNonWorkingTimeDialog({ name, onClose }: DialogProps) {
  const { t } = useAppTranslation();
  const [description, setDescription] = useState("");
  const [nonWorkingTimeType, setNonWorkingTimeType] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [comment, setComment] = useState("");

  return (
    <BaseDialog
      open
      title={`${t(L.setNonWorkingTimeTitle)} ${name}`}
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>{t(L.cancel)}</Button>
          <Button
            appearance="primary"
            onClick={onClose}
            disabled={!nonWorkingTimeType.trim() || !startTime.trim() || !endTime.trim()}
          >
            {t(L.set)}
          </Button>
        </>
      }
    >
      <FormField label={<>{t(L.description)}</>}>
        <Input value={description} onChange={(_, d) => setDescription(d.value)} />
      </FormField>
      <FormField
        label={
          <>
            <span style={{ color: tokens.colorPaletteRedForeground1 }}>* </span>
            {t(L.nonWorkingTimeType)}
          </>
        }
      >
        <Input value={nonWorkingTimeType} onChange={(_, d) => setNonWorkingTimeType(d.value)} />
      </FormField>
      <FormField
        label={
          <>
            <span style={{ color: tokens.colorPaletteRedForeground1 }}>* </span>
            {t(L.startTime)}
          </>
        }
      >
        <Input value={startTime} onChange={(_, d) => setStartTime(d.value)} />
      </FormField>
      <FormField
        label={
          <>
            <span style={{ color: tokens.colorPaletteRedForeground1 }}>* </span>
            {t(L.endTime)}
          </>
        }
      >
        <Input value={endTime} onChange={(_, d) => setEndTime(d.value)} />
      </FormField>
      <FormField label={<>{t(L.comment)}</>}>
        <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />
      </FormField>
    </BaseDialog>
  );
}

export function SetWorkAvailabilityDialog({ name, onClose }: DialogProps) {
  const { t } = useAppTranslation();
  const [comment, setComment] = useState("");

  return (
    <BaseDialog
      open
      title={`${t(L.setWorkAvailabilityTitle)} ${name}`}
      onClose={onClose}
      footer={<DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={t(L.set)} />}
    >
      <FormField label={<>{t(L.comment)}</>}>
        <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />
      </FormField>
    </BaseDialog>
  );
}

export function RemoveNonWorkingTimesDialog({ name, onClose }: DialogProps) {
  const { t } = useAppTranslation();

  return (
    <BaseDialog
      open
      title={t(L.removeNonWorkingTimesTitle)}
      onClose={onClose}
      footer={
        <DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={t(L.remove)} danger />
      }
    >
      <div>{t(L.removeNonWorkingTimesMessage, { name })}</div>
    </BaseDialog>
  );
}

export function RemoveWorkAvailabilityDialog({ name, onClose }: DialogProps) {
  const { t } = useAppTranslation();

  return (
    <BaseDialog
      open
      title={t(L.removeWorkAvailabilityTitle)}
      onClose={onClose}
      footer={
        <DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={t(L.remove)} danger />
      }
    >
      <div>{t(L.removeWorkAvailabilityMessage, { name })}</div>
    </BaseDialog>
  );
}
