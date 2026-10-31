import { useState } from "react";
import { BaseDialog, FormField } from "@/components/common";
import { Button, Input, Textarea, tokens } from "@/components/ui";
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

interface DialogProps {
  name: string;
  onClose: () => void;
}

function useQualificationForm() {
  const { t } = useAppTranslation();
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
        <FormField
          label={
            <>
              <span style={{ color: tokens.colorPaletteRedForeground1 }}>* </span>
              {t(L.qualification)}
            </>
          }
        >
          <Input value={qualification} onChange={(_, d) => setQualification(d.value)} />
        </FormField>
        <FormField label={<>{t(L.qualificationDate)}</>}>
          <Input value={qualificationDate} onChange={(_, d) => setQualificationDate(d.value)} />
        </FormField>
        <FormField label={<>{t(L.validTo)}</>}>
          <Input value={validTo} onChange={(_, d) => setValidTo(d.value)} />
        </FormField>
        <FormField label={<>{t(L.reason)}</>}>
          <Input value={reason} onChange={(_, d) => setReason(d.value)} />
        </FormField>
        <FormField label={<>{t(L.proficiency)}</>}>
          <Input value={proficiency} onChange={(_, d) => setProficiency(d.value)} />
        </FormField>
        <FormField label={<>{t(L.remarks)}</>}>
          <Textarea value={remarks} onChange={(_, d) => setRemarks(d.value)} />
        </FormField>
        <FormField label={<>{t(L.comment)}</>}>
          <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />
        </FormField>
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
