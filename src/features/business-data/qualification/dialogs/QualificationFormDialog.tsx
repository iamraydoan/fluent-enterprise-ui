import { useState } from "react";
import type { QualificationDetail } from "@/api";
import { BaseDialog, DialogFooter } from "@/components/common";
import { Body1Strong, Field, Input, Switch } from "@/components/ui";
import { useAppTranslation } from "@/i18n";

interface QualificationFormDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  initial?: Partial<QualificationDetail>;
  nameReadOnly?: boolean;
  submitLabel: string;
}

const TYPE_OPTIONS = ["General", "Skill", "Knowledge"];
const SCALE_OPTIONS = ["Days", "Weeks", "Months", "Years"];

export function QualificationFormDialog({
  open,
  onClose,
  title,
  initial,
  nameReadOnly,
  submitLabel,
}: QualificationFormDialogProps) {
  const { t } = useAppTranslation();
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [type, setType] = useState(initial?.type ?? "General");
  const [ownerRole, setOwnerRole] = useState(initial?.ownerRole ?? "");
  const [defaultReason, setDefaultReason] = useState(initial?.defaultReason ?? "");
  const [informationUrl, setInformationUrl] = useState(initial?.informationUrl ?? "");
  const [allowSelfAssignment, setAllowSelfAssignment] = useState(
    initial?.allowSelfAssignment ?? false,
  );
  const [allowAssignmentByManager, setAllowAssignmentByManager] = useState(
    initial?.allowAssignmentByManager ?? false,
  );
  const [validForValue, setValidForValue] = useState("1");
  const [validForScale, setValidForScale] = useState("Months");
  const [allowOverride, setAllowOverride] = useState(initial?.allowOverride ?? false);
  const [graceValue, setGraceValue] = useState("1");
  const [graceScale, setGraceScale] = useState("Days");
  const [comments, setComments] = useState("");

  const k = "businessData.qualification.dialogs.form";

  return (
    <BaseDialog
      open={open}
      title={title}
      onClose={onClose}
      width="min(900px, 90vw)"
      footer={<DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={submitLabel} />}
    >
      <div style={{ display: "flex", flexDirection: "column", rowGap: 16 }}>
        <Body1Strong>{t(`${k}.generalData`)}</Body1Strong>
        <Field label={t(`${k}.name`)} required>
          <Input value={name} readOnly={nameReadOnly} onChange={(_, d) => setName(d.value)} />
        </Field>
        <Field label={t(`${k}.description`)}>
          <Input value={description} onChange={(_, d) => setDescription(d.value)} />
        </Field>
        <Field label={t(`${k}.type`)} required>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            {TYPE_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t(`${k}.dataGroup`)}>
          <Input value="" onChange={() => {}} />
        </Field>

        <Body1Strong>{t(`${k}.information`)}</Body1Strong>
        <Field label={t(`${k}.ownerRole`)} required>
          <Input value={ownerRole} onChange={(_, d) => setOwnerRole(d.value)} />
        </Field>
        <Field label={t(`${k}.defaultReason`)}>
          <Input value={defaultReason} onChange={(_, d) => setDefaultReason(d.value)} />
        </Field>
        <Field label={t(`${k}.informationUrl`)}>
          <Input value={informationUrl} onChange={(_, d) => setInformationUrl(d.value)} />
        </Field>

        <Body1Strong>{t(`${k}.permissions`)}</Body1Strong>
        <Field label={t(`${k}.allowSelfAssignment`)}>
          <Switch
            checked={allowSelfAssignment}
            onChange={(_, d) => setAllowSelfAssignment(d.checked === true)}
          />
        </Field>
        <Field label={t(`${k}.allowAssignmentByManager`)}>
          <Switch
            checked={allowAssignmentByManager}
            onChange={(_, d) => setAllowAssignmentByManager(d.checked === true)}
          />
        </Field>

        <Body1Strong>{t(`${k}.validityPeriod`)}</Body1Strong>
        <div style={{ display: "flex", columnGap: 8 }}>
          <Field label={t(`${k}.validFor`)}>
            <Input value={validForValue} onChange={(_, d) => setValidForValue(d.value)} />
          </Field>
          <Field label={t(`${k}.scale`)}>
            <select value={validForScale} onChange={(e) => setValidForScale(e.target.value)}>
              {SCALE_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label={t(`${k}.allowOverride`)}>
          <Switch
            checked={allowOverride}
            onChange={(_, d) => setAllowOverride(d.checked === true)}
          />
        </Field>

        <Body1Strong>{t(`${k}.gracePeriod`)}</Body1Strong>
        <div style={{ display: "flex", columnGap: 8 }}>
          <Field label={t(`${k}.duration`)}>
            <Input value={graceValue} onChange={(_, d) => setGraceValue(d.value)} />
          </Field>
          <Field label={t(`${k}.scale`)}>
            <select value={graceScale} onChange={(e) => setGraceScale(e.target.value)}>
              {SCALE_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label={t(`${k}.comments`)}>
          <Input value={comments} onChange={(_, d) => setComments(d.value)} />
        </Field>
      </div>
    </BaseDialog>
  );
}
