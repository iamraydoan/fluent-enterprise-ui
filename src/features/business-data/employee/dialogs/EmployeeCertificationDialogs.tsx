import { useState } from "react";
import { BaseDialog, FormField } from "@/components/common";
import { Button, Checkbox, Input, Textarea} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { theme } from "@/styles/theme";

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

interface DialogProps {
  name: string;
  onClose: () => void;
}

function useCertificationForm() {
  const { t } = useAppTranslation();
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
        <FormField
          label={
            <>
              <span style={{ color: theme.color.textDanger }}>* </span>
              {t(L.certification)}
            </>
          }
        >
          <Input value={certification} onChange={setCertification} />
        </FormField>
        <FormField label={<>{t(L.plannedDate)}</>}>
          <Input value={plannedDate} onChange={setPlannedDate} />
        </FormField>
        <FormField label={<>{t(L.certificationDate)}</>}>
          <Input value={certificationDate} onChange={setCertificationDate} />
        </FormField>
        <FormField label={<>{t(L.isTrainer)}</>}>
          <Checkbox
            checked={isTrainer === true}
            onChange={setIsTrainer}
          />
        </FormField>
        <FormField label={<>{t(L.isTrainee)}</>}>
          <Checkbox
            checked={isTrainee === true}
            onChange={setIsTrainee}
          />
        </FormField>
        <FormField label={<>{t(L.comment)}</>}>
          <Textarea value={comment} onChange={setComment} />
        </FormField>
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
          <Button variant="primary" onClick={onClose} disabled={!canSubmit}>
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
