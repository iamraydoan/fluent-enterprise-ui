import { useState } from "react";
import { BaseDialog } from "@/components/common";
import { Button, Checkbox, Input, Textarea, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";

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
  field: { display: "grid", gridTemplateColumns: "180px 1fr", gap: "12px", alignItems: "center" },
});

interface DialogProps {
  name: string;
  onClose: () => void;
}

function useCertificationForm() {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [certification, setCertification] = useState("");
  const [plannedDate, setPlannedDate] = useState("");
  const [certificationDate, setCertificationDate] = useState("");
  const [isTrainer, setIsTrainer] = useState(false);
  const [isTrainee, setIsTrainee] = useState(false);
  const [comment, setComment] = useState("");

  return {
    canSubmit: !!certification.trim(),
    fields: (
      <>
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
      </>
    ),
  };
}

function CertificationDialog({
  name,
  onClose,
  titleKey,
  submitKey,
}: DialogProps & { titleKey: TranslationKey; submitKey: TranslationKey }) {
  const { t } = useAppTranslation();
  const { fields, canSubmit } = useCertificationForm();

  return (
    <BaseDialog
      open
      title={`${t(titleKey)} ${name}`}
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>{t(L.cancel)}</Button>
          <Button appearance="primary" onClick={onClose} disabled={!canSubmit}>
            {t(submitKey)}
          </Button>
        </>
      }
    >
      {fields}
    </BaseDialog>
  );
}

export function ManageCertificationDialog({ name, onClose }: DialogProps) {
  return (
    <CertificationDialog
      name={name}
      onClose={onClose}
      titleKey={L.manageTitle}
      submitKey={L.update}
    />
  );
}

export function GrantCertificationDialog({ name, onClose }: DialogProps) {
  return (
    <CertificationDialog
      name={name}
      onClose={onClose}
      titleKey={L.grantTitle}
      submitKey={L.grant}
    />
  );
}

export function AssignCertificationDialog({ name, onClose }: DialogProps) {
  return (
    <CertificationDialog
      name={name}
      onClose={onClose}
      titleKey={L.assignTitle}
      submitKey={L.assign}
    />
  );
}
