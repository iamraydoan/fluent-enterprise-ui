import { useState } from "react";
import { BaseDialog } from "@/components/common";
import { Button, Input, Textarea, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";

const L: Record<string, TranslationKey> = {
  checkInTitle: "businessData.employee.attendance.checkInTitle",
  checkOutTitle: "businessData.employee.attendance.checkOutTitle",
  clockInTitle: "businessData.employee.attendance.clockInTitle",
  clockOutTitle: "businessData.employee.attendance.clockOutTitle",
  assignSubordinatesTitle: "businessData.employee.attendance.assignSubordinatesTitle",
  unassignSubordinatesTitle: "businessData.employee.attendance.unassignSubordinatesTitle",
  assignTeamTitle: "businessData.employee.attendance.assignTeamTitle",
  resource: "businessData.employee.attendance.resource",
  certification: "businessData.employee.attendance.certification",
  subordinates: "businessData.employee.attendance.subordinates",
  team: "businessData.employee.attendance.team",
  workgroup: "businessData.employee.attendance.workgroup",
  area: "businessData.employee.attendance.area",
  comment: "businessData.employee.attendance.comment",
  reason: "businessData.employee.attendance.reason",
  cancel: "businessData.employee.attendance.cancel",
  checkIn: "businessData.employee.attendance.checkIn",
  checkOut: "businessData.employee.attendance.checkOut",
  clockIn: "businessData.employee.attendance.clockIn",
  clockOut: "businessData.employee.attendance.clockOut",
  assign: "businessData.employee.attendance.assign",
  save: "businessData.employee.attendance.save",
};

const useDialogStyles = makeStyles({
  field: { display: "grid", gridTemplateColumns: "180px 1fr", gap: "12px", alignItems: "center" },
});

interface DialogProps {
  name: string;
  onClose: () => void;
}

export function CheckInDialog({ name, onClose }: DialogProps) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [resource, setResource] = useState("");
  const [certification, setCertification] = useState("");

  return (
    <BaseDialog
      open
      title={`${t(L.checkInTitle)} ${name}`}
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>{t(L.cancel)}</Button>
          <Button appearance="primary" onClick={onClose} disabled={!resource.trim()}>
            {t(L.checkIn)}
          </Button>
        </>
      }
    >
      <div className={styles.field}>
        <label>
          <span style={{ color: tokens.colorPaletteRedForeground1 }}>* </span>
          {t(L.resource)}
        </label>
        <Input value={resource} onChange={(_, d) => setResource(d.value)} />
      </div>
      <div className={styles.field}>
        <label>{t(L.certification)}</label>
        <Input value={certification} onChange={(_, d) => setCertification(d.value)} />
      </div>
    </BaseDialog>
  );
}

export function CheckOutDialog({ name, onClose }: DialogProps) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [resource, setResource] = useState("");
  const [reason, setReason] = useState("");

  return (
    <BaseDialog
      open
      title={`${t(L.checkOutTitle)} ${name}`}
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>{t(L.cancel)}</Button>
          <Button appearance="primary" onClick={onClose} disabled={!resource.trim()}>
            {t(L.checkOut)}
          </Button>
        </>
      }
    >
      <div className={styles.field}>
        <label>
          <span style={{ color: tokens.colorPaletteRedForeground1 }}>* </span>
          {t(L.resource)}
        </label>
        <Input value={resource} onChange={(_, d) => setResource(d.value)} />
      </div>
      <div className={styles.field}>
        <label>{t(L.reason)}</label>
        <Input value={reason} onChange={(_, d) => setReason(d.value)} />
      </div>
    </BaseDialog>
  );
}

export function ClockInDialog({ name, onClose }: DialogProps) {
  const { t } = useAppTranslation();

  return (
    <BaseDialog
      open
      title={t(L.clockInTitle)}
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>{t(L.cancel)}</Button>
          <Button appearance="primary" onClick={onClose}>
            {t(L.clockIn)}
          </Button>
        </>
      }
    >
      <div>{name}</div>
    </BaseDialog>
  );
}

export function ClockOutDialog({ name, onClose }: DialogProps) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [comment, setComment] = useState("");

  return (
    <BaseDialog
      open
      title={`${t(L.clockOutTitle)} ${name}`}
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>{t(L.cancel)}</Button>
          <Button appearance="primary" onClick={onClose}>
            {t(L.clockOut)}
          </Button>
        </>
      }
    >
      <div className={styles.field}>
        <label>{t(L.comment)}</label>
        <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />
      </div>
    </BaseDialog>
  );
}

export function AssignSubordinatesDialog({ name, onClose }: DialogProps) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [subordinates, setSubordinates] = useState("");

  return (
    <BaseDialog
      open
      title={`${t(L.assignSubordinatesTitle)} ${name}`}
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>{t(L.cancel)}</Button>
          <Button appearance="primary" onClick={onClose} disabled={!subordinates.trim()}>
            {t(L.assign)}
          </Button>
        </>
      }
    >
      <div className={styles.field}>
        <label>
          <span style={{ color: tokens.colorPaletteRedForeground1 }}>* </span>
          {t(L.subordinates)}
        </label>
        <Input value={subordinates} onChange={(_, d) => setSubordinates(d.value)} />
      </div>
    </BaseDialog>
  );
}

export function AssignTeamWorkgroupDialog({ name, onClose }: DialogProps) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [team, setTeam] = useState("");
  const [workgroup, setWorkgroup] = useState("");
  const [area, setArea] = useState("");

  return (
    <BaseDialog
      open
      title={`${t(L.assignTeamTitle)} ${name}`}
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>{t(L.cancel)}</Button>
          <Button appearance="primary" onClick={onClose}>
            {t(L.save)}
          </Button>
        </>
      }
    >
      <div className={styles.field}>
        <label>{t(L.team)}</label>
        <Input value={team} onChange={(_, d) => setTeam(d.value)} />
      </div>
      <div className={styles.field}>
        <label>{t(L.workgroup)}</label>
        <Input value={workgroup} onChange={(_, d) => setWorkgroup(d.value)} />
      </div>
      <div className={styles.field}>
        <label>{t(L.area)}</label>
        <Input value={area} onChange={(_, d) => setArea(d.value)} />
      </div>
    </BaseDialog>
  );
}
