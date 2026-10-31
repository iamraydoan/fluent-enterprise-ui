import { useState } from "react";
import { Button, Checkbox, Input, Textarea, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";

const L: Record<string, TranslationKey> = {
  manageTitle: "businessData.employee.certifications.manageTitle",
  grantTitle: "businessData.employee.certifications.grantTitle",
  revokeTitle: "businessData.employee.certifications.revokeTitle",
  revokeMessage: "businessData.employee.certifications.revokeMessage",
  assignTitle: "businessData.employee.certifications.assignTitle",
  unassignTitle: "businessData.employee.certifications.unassignTitle",
  unassignMessage: "businessData.employee.certifications.unassignMessage",
  certification: "businessData.employee.certifications.certification",
  plannedDate: "businessData.employee.certifications.plannedDate",
  certificationDate: "businessData.employee.certifications.certificationDate",
  isTrainer: "businessData.employee.certifications.isTrainer",
  isTrainee: "businessData.employee.certifications.isTrainee",
  comment: "businessData.employee.certifications.comment",
  remark: "businessData.employee.certifications.remark",
  cancel: "businessData.employee.certifications.cancel",
  update: "businessData.employee.certifications.update",
  grant: "businessData.employee.certifications.grant",
  revoke: "businessData.employee.certifications.revoke",
  assign: "businessData.employee.certifications.assign",
  unassign: "businessData.employee.certifications.unassign",
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

function CertificationForm({
  onClose,
  submitLabel,
}: {
  onClose: () => void;
  submitLabel: TranslationKey;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [certification, setCertification] = useState("");
  const [plannedDate, setPlannedDate] = useState("");
  const [certificationDate, setCertificationDate] = useState("");
  const [isTrainer, setIsTrainer] = useState(false);
  const [isTrainee, setIsTrainee] = useState(false);
  const [comment, setComment] = useState("");

  return (
    <>
      <div className={styles.body}>
        <div className={styles.field}>
          <label>
            <span style={{ color: tokens.colorPaletteRedForeground1 }}>* </span>
            {t(L.certification)}
          </label>
          <Input value={certification} onChange={(_, d) => setCertification(d.value)} />
        </div>
        <div className={styles.field}>
          <label>{t(L.plannedDate)}</label>
          <Input value={plannedDate} onChange={(_, d) => setPlannedDate(d.value)} />
        </div>
        <div className={styles.field}>
          <label>{t(L.certificationDate)}</label>
          <Input value={certificationDate} onChange={(_, d) => setCertificationDate(d.value)} />
        </div>
        <div className={styles.field}>
          <label>{t(L.isTrainer)}</label>
          <Checkbox
            checked={isTrainer === true}
            onChange={(_, d) => setIsTrainer(d.checked === true)}
          />
        </div>
        <div className={styles.field}>
          <label>{t(L.isTrainee)}</label>
          <Checkbox
            checked={isTrainee === true}
            onChange={(_, d) => setIsTrainee(d.checked === true)}
          />
        </div>
        <div className={styles.field}>
          <label>{t(L.comment)}</label>
          <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />
        </div>
      </div>
      <div className={styles.footer}>
        <Button onClick={onClose}>{t(L.cancel)}</Button>
        <Button appearance="primary" onClick={onClose} disabled={!certification.trim()}>
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

export function ManageCertificationDialog({ name, onClose }: DialogProps) {
  return (
    <Shell title={L.manageTitle} name={name} onClose={onClose}>
      <CertificationForm onClose={onClose} submitLabel={L.update} />
    </Shell>
  );
}

export function GrantCertificationDialog({ name, onClose }: DialogProps) {
  return (
    <Shell title={L.grantTitle} name={name} onClose={onClose}>
      <CertificationForm onClose={onClose} submitLabel={L.grant} />
    </Shell>
  );
}

export function AssignCertificationDialog({ name, onClose }: DialogProps) {
  return (
    <Shell title={L.assignTitle} name={name} onClose={onClose}>
      <CertificationForm onClose={onClose} submitLabel={L.assign} />
    </Shell>
  );
}


