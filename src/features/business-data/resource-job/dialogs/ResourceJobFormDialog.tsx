import { useState } from "react";
import type { ResourceJobDetail, ResourceJobRecord } from "@/api";
import { BaseDialog, WizardSteps } from "@/components/common";
import { Button, Field, Input } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { theme } from "@/styles/theme";

interface ResourceJobFormDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  initial?: Partial<ResourceJobDetail & ResourceJobRecord>;
  nameReadOnly?: boolean;
  submitLabel: string;
}

const SYSTEM_STATES = ["Created", "Queued"];
const SELECTION_MODES = ["Step", "Flow Path", "Flow Logical Path"];

export function ResourceJobFormDialog({
  open,
  onClose,
  title,
  initial,
  nameReadOnly,
  submitLabel,
}: ResourceJobFormDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.resourceJob.dialogs.form";
  const [step, setStep] = useState(1);
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [resource, setResource] = useState(initial?.resource ?? "");
  const [type, setType] = useState(initial?.type ?? "");
  const [subType, setSubType] = useState(initial?.subType ?? "");
  const [systemState, setSystemState] = useState("Created");
  const [selectionMode, setSelectionMode] = useState(initial?.selectionMode ?? "Step");
  const [priority, setPriority] = useState(String(initial?.priority ?? 1));
  const [progress, setProgress] = useState(String(initial?.progress ?? 0));
  const [equipmentJobId, setEquipmentJobId] = useState(initial?.equipmentJobId ?? "");
  const [jobInformation, setJobInformation] = useState(initial?.jobInformation ?? "");
  const [comments, setComments] = useState("");

  return (
    <BaseDialog
      open={open}
      title={title}
      onClose={onClose}
      width="min(1000px, 92vw)"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          {!nameReadOnly && step > 1 && (
            <Button variant="secondary" onClick={() => setStep(step - 1)}>
              {t("common.back")}
            </Button>
          )}
          {!nameReadOnly && step < 3 ? (
            <Button variant="primary" onClick={() => setStep(step + 1)}>
              {t("common.next")}
            </Button>
          ) : (
            <Button variant="primary" onClick={onClose}>
              {submitLabel}
            </Button>
          )}
        </>
      }
    >
      {!nameReadOnly && (
        <WizardSteps steps={[t(`${k}.step1`), t(`${k}.step2`), t(`${k}.step3`)]} current={step} />
      )}

      {(step === 1 || nameReadOnly) && (
        <div style={{ display: "flex", flexDirection: "column", rowGap: theme.spacing.md }}>
          <Field label={t(`${k}.name`)} required>
            <Input value={name} readOnly={nameReadOnly} onChange={setName} />
          </Field>
          <Field label={t(`${k}.description`)}>
            <Input value={description} onChange={setDescription} />
          </Field>
          <Field label={t(`${k}.resource`)} required>
            <Input value={resource} onChange={setResource} />
          </Field>
          <Field label={t(`${k}.type`)}>
            <Input value={type} onChange={setType} />
          </Field>
          <Field label={t(`${k}.subType`)}>
            <Input value={subType} onChange={setSubType} />
          </Field>
          {!nameReadOnly && (
            <Field label={t(`${k}.initialSystemState`)}>
              <select value={systemState} onChange={(e) => setSystemState(e.target.value)}>
                {SYSTEM_STATES.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </Field>
          )}
          <Field label={t(`${k}.selectionMode`)}>
            <select value={selectionMode} onChange={(e) => setSelectionMode(e.target.value)}>
              {SELECTION_MODES.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </Field>
          <div style={{ display: "flex", columnGap: theme.spacing.md }}>
            <Field label={t(`${k}.priority`)}>
              <Input value={priority} onChange={setPriority} />
            </Field>
            <Field label={t(`${k}.progress`)}>
              <Input value={progress} onChange={setProgress} />
            </Field>
          </div>
          <Field label={t(`${k}.equipmentJobId`)}>
            <Input value={equipmentJobId} onChange={setEquipmentJobId} />
          </Field>
          <Field label={t(`${k}.jobInformation`)}>
            <Input value={jobInformation} onChange={setJobInformation} />
          </Field>
        </div>
      )}

      {step === 2 && !nameReadOnly && (
        <div style={{ padding: `${theme.spacing.md} 0`, color: theme.color.textTertiary }}>{t(`${k}.materialsBody`)}</div>
      )}

      {step === 3 && !nameReadOnly && (
        <div style={{ padding: `${theme.spacing.md} 0`, color: theme.color.textTertiary }}>{t(`${k}.containersBody`)}</div>
      )}

      <Field label={t(`${k}.comments`)}>
        <Input value={comments} onChange={setComments} />
      </Field>
    </BaseDialog>
  );
}
