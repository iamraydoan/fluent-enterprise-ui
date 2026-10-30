import { useState } from "react";
import { Button, Input, Textarea, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";

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
  field: { display: "grid", gridTemplateColumns: "180px 1fr", gap: "12px", alignItems: "center" },
});

interface DialogProps {
  name: string;
  onClose: () => void;
}

function Shell({
  title,
  name,
  onClose,
  children,
}: {
  title: TranslationKey;
  name: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const { t } = useAppTranslation();
  const shared = useSharedStyles();
  const styles = useDialogStyles();

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div className={`${shared.contentCard} ${styles.surface}`} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className={styles.head}>
          {t(title)} {name}
        </div>
        {children}
      </div>
    </div>
  );
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
    <Shell title={L.setNonWorkingTimeTitle} name={name} onClose={onClose}>
      <div className={styles.body}>
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
      </div>
      <div className={styles.footer}>
        <Button onClick={onClose}>{t(L.cancel)}</Button>
        <Button appearance="primary" onClick={onClose} disabled={!nonWorkingTimeType.trim() || !startTime.trim() || !endTime.trim()}>
          {t(L.set)}
        </Button>
      </div>
    </Shell>
  );
}

export function SetWorkAvailabilityDialog({ name, onClose }: DialogProps) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [comment, setComment] = useState("");

  return (
    <Shell title={L.setWorkAvailabilityTitle} name={name} onClose={onClose}>
      <div className={styles.body}>
        <div className={styles.field}>
          <label>{t(L.comment)}</label>
          <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />
        </div>
      </div>
      <div className={styles.footer}>
        <Button onClick={onClose}>{t(L.cancel)}</Button>
        <Button appearance="primary" onClick={onClose}>
          {t(L.set)}
        </Button>
      </div>
    </Shell>
  );
}

export function RemoveNonWorkingTimesDialog({ name, onClose }: DialogProps) {
  const { t } = useAppTranslation();
  const shared = useSharedStyles();
  const styles = useDialogStyles();

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div className={`${shared.contentCard} ${styles.surface}`} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className={styles.head}>{t(L.removeNonWorkingTimesTitle)}</div>
        <div className={styles.body}>
          <div>{t(L.removeNonWorkingTimesMessage, { name })}</div>
        </div>
        <div className={styles.footer}>
          <Button onClick={onClose}>{t(L.cancel)}</Button>
          <Button appearance="primary" onClick={onClose} style={{ backgroundColor: tokens.colorPaletteRedBackground3 }}>
            {t(L.remove)}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function RemoveWorkAvailabilityDialog({ name, onClose }: DialogProps) {
  const { t } = useAppTranslation();
  const shared = useSharedStyles();
  const styles = useDialogStyles();

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div className={`${shared.contentCard} ${styles.surface}`} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className={styles.head}>{t(L.removeWorkAvailabilityTitle)}</div>
        <div className={styles.body}>
          <div>{t(L.removeWorkAvailabilityMessage, { name })}</div>
        </div>
        <div className={styles.footer}>
          <Button onClick={onClose}>{t(L.cancel)}</Button>
          <Button appearance="primary" onClick={onClose} style={{ backgroundColor: tokens.colorPaletteRedBackground3 }}>
            {t(L.remove)}
          </Button>
        </div>
      </div>
    </div>
  );
}
