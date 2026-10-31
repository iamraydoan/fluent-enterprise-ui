import { useState } from "react";
import { BaseDialog, DialogFooter } from "@/components/common";
import { Button, Input, Textarea, makeStyles, tokens } from "@/components/ui";
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

const useDialogStyles = makeStyles({
  field: { display: "grid", gridTemplateColumns: "180px 1fr", gap: "12px", alignItems: "center" },
});

interface DialogProps {
  name: string;
  onClose: () => void;
}

export function SetNonWorkingTimeDialog({ name, onClose }: DialogProps) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
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
      <div className={styles.field}>
        <label>{t(L.description)}</label>
        <Input value={description} onChange={(_, d) => setDescription(d.value)} />
      </div>
      <div className={styles.field}>
        <label>
          <span style={{ color: tokens.colorPaletteRedForeground1 }}>* </span>
          {t(L.nonWorkingTimeType)}
        </label>
        <Input value={nonWorkingTimeType} onChange={(_, d) => setNonWorkingTimeType(d.value)} />
      </div>
      <div className={styles.field}>
        <label>
          <span style={{ color: tokens.colorPaletteRedForeground1 }}>* </span>
          {t(L.startTime)}
        </label>
        <Input value={startTime} onChange={(_, d) => setStartTime(d.value)} />
      </div>
      <div className={styles.field}>
        <label>
          <span style={{ color: tokens.colorPaletteRedForeground1 }}>* </span>
          {t(L.endTime)}
        </label>
        <Input value={endTime} onChange={(_, d) => setEndTime(d.value)} />
      </div>
      <div className={styles.field}>
        <label>{t(L.comment)}</label>
        <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />
      </div>
    </BaseDialog>
  );
}

export function SetWorkAvailabilityDialog({ name, onClose }: DialogProps) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [comment, setComment] = useState("");

  return (
    <BaseDialog
      open
      title={`${t(L.setWorkAvailabilityTitle)} ${name}`}
      onClose={onClose}
      footer={<DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={t(L.set)} />}
    >
      <div className={styles.field}>
        <label>{t(L.comment)}</label>
        <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />
      </div>
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
