import { useState } from "react";
import { Button, Input, Textarea, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";

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
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  surface: {
    width: "560px",
    maxWidth: "95vw",
    display: "flex",
    flexDirection: "column",
    maxHeight: "90vh",
  },
  head: {
    padding: "12px 16px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase400,
  },
  body: {
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    overflowY: "auto",
  },
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
      <div
        className={`${shared.contentCard} ${styles.surface}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.head}>
          {t(title)} {name}
        </div>
        {children}
      </div>
    </div>
  );
}

export function CheckInDialog({ name, onClose }: DialogProps) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [resource, setResource] = useState("");
  const [certification, setCertification] = useState("");

  return (
    <Shell title={L.checkInTitle} name={name} onClose={onClose}>
      <div className={styles.body}>
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
      </div>
      <div className={styles.footer}>
        <Button onClick={onClose}>{t(L.cancel)}</Button>
        <Button appearance="primary" onClick={onClose} disabled={!resource.trim()}>
          {t(L.checkIn)}
        </Button>
      </div>
    </Shell>
  );
}

export function CheckOutDialog({ name, onClose }: DialogProps) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [resource, setResource] = useState("");
  const [reason, setReason] = useState("");

  return (
    <Shell title={L.checkOutTitle} name={name} onClose={onClose}>
      <div className={styles.body}>
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
      </div>
      <div className={styles.footer}>
        <Button onClick={onClose}>{t(L.cancel)}</Button>
        <Button appearance="primary" onClick={onClose} disabled={!resource.trim()}>
          {t(L.checkOut)}
        </Button>
      </div>
    </Shell>
  );
}

export function ClockInDialog({ name, onClose }: DialogProps) {
  const { t } = useAppTranslation();
  const shared = useSharedStyles();
  const styles = useDialogStyles();

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={`${shared.contentCard} ${styles.surface}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.head}>{t(L.clockInTitle)}</div>
        <div className={styles.body}>
          <div>{name}</div>
        </div>
        <div className={styles.footer}>
          <Button onClick={onClose}>{t(L.cancel)}</Button>
          <Button appearance="primary" onClick={onClose}>
            {t(L.clockIn)}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ClockOutDialog({ name, onClose }: DialogProps) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [comment, setComment] = useState("");

  return (
    <Shell title={L.clockOutTitle} name={name} onClose={onClose}>
      <div className={styles.body}>
        <div className={styles.field}>
          <label>{t(L.comment)}</label>
          <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />
        </div>
      </div>
      <div className={styles.footer}>
        <Button onClick={onClose}>{t(L.cancel)}</Button>
        <Button appearance="primary" onClick={onClose}>
          {t(L.clockOut)}
        </Button>
      </div>
    </Shell>
  );
}

export function AssignSubordinatesDialog({ name, onClose }: DialogProps) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [subordinates, setSubordinates] = useState("");

  return (
    <Shell title={L.assignSubordinatesTitle} name={name} onClose={onClose}>
      <div className={styles.body}>
        <div className={styles.field}>
          <label>
            <span style={{ color: tokens.colorPaletteRedForeground1 }}>* </span>
            {t(L.subordinates)}
          </label>
          <Input value={subordinates} onChange={(_, d) => setSubordinates(d.value)} />
        </div>
      </div>
      <div className={styles.footer}>
        <Button onClick={onClose}>{t(L.cancel)}</Button>
        <Button appearance="primary" onClick={onClose} disabled={!subordinates.trim()}>
          {t(L.assign)}
        </Button>
      </div>
    </Shell>
  );
}

export function AssignTeamWorkgroupDialog({ name, onClose }: DialogProps) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [team, setTeam] = useState("");
  const [workgroup, setWorkgroup] = useState("");
  const [area, setArea] = useState("");

  return (
    <Shell title={L.assignTeamTitle} name={name} onClose={onClose}>
      <div className={styles.body}>
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
      </div>
      <div className={styles.footer}>
        <Button onClick={onClose}>{t(L.cancel)}</Button>
        <Button appearance="primary" onClick={onClose}>
          {t(L.save)}
        </Button>
      </div>
    </Shell>
  );
}
