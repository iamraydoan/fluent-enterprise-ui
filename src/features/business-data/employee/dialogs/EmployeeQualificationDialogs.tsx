import { useState } from "react";
import { BaseDialog } from "@/components/common";
import { Button, Input, Textarea, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";

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
  field: { display: "grid", gridTemplateColumns: "180px 1fr", gap: "12px", alignItems: "center" },
});

interface DialogProps {
  name: string;
  onClose: () => void;
}

function useQualificationForm() {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [qualification, setQualification] = useState("");
  const [qualificationDate, setQualificationDate] = useState("");
  const [validTo, setValidTo] = useState("");
  const [reason, setReason] = useState("");
  const [proficiency, setProficiency] = useState("");
  const [remarks, setRemarks] = useState("");
  const [comment, setComment] = useState("");

  return {
    canSubmit: !!qualification.trim(),
    fields: (
      <>
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
      </>
    ),
  };
}

function QualificationDialog({
  name,
  onClose,
  titleKey,
  submitKey,
}: DialogProps & { titleKey: TranslationKey; submitKey: TranslationKey }) {
  const { t } = useAppTranslation();
  const { fields, canSubmit } = useQualificationForm();

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

export function ManageQualificationDialog({ name, onClose }: DialogProps) {
  return (
    <QualificationDialog
      name={name}
      onClose={onClose}
      titleKey={L.manageTitle}
      submitKey={L.update}
    />
  );
}

export function AssignQualificationDialog({ name, onClose }: DialogProps) {
  return (
    <QualificationDialog
      name={name}
      onClose={onClose}
      titleKey={L.assignTitle}
      submitKey={L.assign}
    />
  );
}
