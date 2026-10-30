import { useState } from "react";
import { Button, Input, Textarea, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";

const L: Record<string, TranslationKey> = {
  manageTitle: "businessData.employee.qualifications.manageTitle",
  assignTitle: "businessData.employee.qualifications.assignTitle",
  unassignTitle: "businessData.employee.qualifications.unassignTitle",
  unassignMessage: "businessData.employee.qualifications.unassignMessage",
  qualification: "businessData.employee.qualifications.qualification",
  qualificationDate: "businessData.employee.qualifications.qualificationDate",
  validTo: "businessData.employee.qualifications.validTo",
  reason: "businessData.employee.qualifications.reason",
  proficiency: "businessData.employee.qualifications.proficiency",
  remarks: "businessData.employee.qualifications.remarks",
  comment: "businessData.employee.qualifications.comment",
  cancel: "businessData.employee.qualifications.cancel",
  update: "businessData.employee.qualifications.update",
  assign: "businessData.employee.qualifications.assign",
  unassign: "businessData.employee.qualifications.unassign",
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

function QualificationForm({
  onClose,
  submitLabel,
}: {
  onClose: () => void;
  submitLabel: TranslationKey;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [qualification, setQualification] = useState("");
  const [qualificationDate, setQualificationDate] = useState("");
  const [validTo, setValidTo] = useState("");
  const [reason, setReason] = useState("");
  const [proficiency, setProficiency] = useState("");
  const [remarks, setRemarks] = useState("");
  const [comment, setComment] = useState("");

  return (
    <>
      <div className={styles.body}>
        <div className={styles.field}>
          <label>
            <span style={{ color: tokens.colorPaletteRedForeground1 }}>* </span>
            {t(L.qualification)}
          </label>
          <Input value={qualification} onChange={(_, d) => setQualification(d.value)} />
        </div>
        <div className={styles.field}>
          <label>{t(L.qualificationDate)}</label>
          <Input value={qualificationDate} onChange={(_, d) => setQualificationDate(d.value)} />
        </div>
        <div className={styles.field}>
          <label>{t(L.validTo)}</label>
          <Input value={validTo} onChange={(_, d) => setValidTo(d.value)} />
        </div>
        <div className={styles.field}>
          <label>{t(L.reason)}</label>
          <Input value={reason} onChange={(_, d) => setReason(d.value)} />
        </div>
        <div className={styles.field}>
          <label>{t(L.proficiency)}</label>
          <Input value={proficiency} onChange={(_, d) => setProficiency(d.value)} />
        </div>
        <div className={styles.field}>
          <label>{t(L.remarks)}</label>
          <Textarea value={remarks} onChange={(_, d) => setRemarks(d.value)} />
        </div>
        <div className={styles.field}>
          <label>{t(L.comment)}</label>
          <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />
        </div>
      </div>
      <div className={styles.footer}>
        <Button onClick={onClose}>{t(L.cancel)}</Button>
        <Button appearance="primary" onClick={onClose} disabled={!qualification.trim()}>
          {t(submitLabel)}
        </Button>
      </div>
    </>
  );
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

export function ManageQualificationDialog({ name, onClose }: DialogProps) {
  return (
    <Shell title={L.manageTitle} name={name} onClose={onClose}>
      <QualificationForm onClose={onClose} submitLabel={L.update} />
    </Shell>
  );
}

export function AssignQualificationDialog({ name, onClose }: DialogProps) {
  return (
    <Shell title={L.assignTitle} name={name} onClose={onClose}>
      <QualificationForm onClose={onClose} submitLabel={L.assign} />
    </Shell>
  );
}

export function UnassignQualificationDialog({
  name,
  qualification,
  onClose,
}: {
  name: string;
  qualification: string;
  onClose: () => void;
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
        <div className={styles.head}>{t(L.unassignTitle)}</div>
        <div className={styles.body}>
          <div>{t(L.unassignMessage, { name, qualification })}</div>
        </div>
        <div className={styles.footer}>
          <Button onClick={onClose}>{t(L.cancel)}</Button>
          <Button appearance="primary" onClick={onClose}>
            {t(L.unassign)}
          </Button>
        </div>
      </div>
    </div>
  );
}
