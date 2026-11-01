import { useState } from "react";
import type { SamplingPatternDetail, SamplingPatternMode, SamplingPatternRecord } from "@/api";
import { BaseDialog, DialogFooter, VStack  } from "@/components/common";
import { Checkbox, Field, Input } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { theme } from "@/styles/theme";

interface SamplingPatternFormDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  initial?: Partial<SamplingPatternDetail & SamplingPatternRecord>;
  nameReadOnly?: boolean;
  submitLabel: string;
}

const MODES: SamplingPatternMode[] = ["Manual", "Rule", "System"];
const SELECTION_METHODS = ["Bottom", "Middle", "Random", "Spread", "Top"];
const SEQUENCING_METHODS = [
  "BottomUpLeftRight",
  "BottomUpRightLeft",
  "None",
  "TopDownLeftRight",
  "TopDownRightLeft",
];

export function SamplingPatternFormDialog({
  open,
  onClose,
  title,
  initial,
  nameReadOnly,
  submitLabel,
}: SamplingPatternFormDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.samplingPattern.dialogs.form";
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [type, setType] = useState(initial?.type ?? "In-Step");
  const [mode, setMode] = useState<SamplingPatternMode>(initial?.mode ?? "Manual");
  const [samplingSelection, setSamplingSelection] = useState(initial?.samplingSelection ?? "");
  const [rule, setRule] = useState(initial?.rule ?? "");
  const [sourceForm, setSourceForm] = useState(initial?.sourceForm ?? "");
  const [materialCount, setMaterialCount] = useState(String(initial?.materialCount ?? 0));
  const [countIsPercentage, setCountIsPercentage] = useState(initial?.countIsPercentage ?? false);
  const [selectionMethod, setSelectionMethod] = useState(initial?.selectionMethod ?? "Random");
  const [sequencingMethod, setSequencingMethod] = useState(initial?.sequencingMethod ?? "None");
  const [comments, setComments] = useState("");

  return (
    <BaseDialog
      open={open}
      title={title}
      onClose={onClose}
      width="min(900px, 90vw)"
      footer={<DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={submitLabel} />}
    >
      <VStack gap={12}>
        <Field label={t(`${k}.name`)} required>
          <Input value={name} readOnly={nameReadOnly} onChange={setName} />
        </Field>
        <Field label={t(`${k}.description`)}>
          <Input value={description} onChange={setDescription} />
        </Field>
        <Field label={t(`${k}.type`)}>
          <Input value={type} onChange={setType} />
        </Field>
        <Field label={t(`${k}.mode`)} required>
          <select value={mode} onChange={(e) => setMode(e.target.value as SamplingPatternMode)}>
            {MODES.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </Field>
        {mode === "Manual" && (
          <Field label={t(`${k}.samplingSelection`)}>
            <Input value={samplingSelection} onChange={setSamplingSelection} />
          </Field>
        )}
        {mode === "Rule" && (
          <Field label={t(`${k}.rule`)}>
            <Input value={rule} onChange={setRule} />
          </Field>
        )}
        {mode === "System" && (
          <>
            <Field label={t(`${k}.sourceForm`)}>
              <Input value={sourceForm} onChange={setSourceForm} />
            </Field>
            <Field label={t(`${k}.materialCount`)}>
              <Input value={materialCount} onChange={setMaterialCount} />
            </Field>
            <Field label={t(`${k}.countIsPercentage`)}>
              <Checkbox checked={countIsPercentage} onChange={setCountIsPercentage} />
            </Field>
            <Field label={t(`${k}.selectionMethod`)}>
              <select value={selectionMethod} onChange={(e) => setSelectionMethod(e.target.value)}>
                {SELECTION_METHODS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t(`${k}.sequencingMethod`)}>
              <select
                value={sequencingMethod}
                onChange={(e) => setSequencingMethod(e.target.value)}
              >
                {SEQUENCING_METHODS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </Field>
          </>
        )}
      </VStack>
      <Field label={t(`${k}.comments`)}>
        <Input value={comments} onChange={setComments} />
      </Field>
    </BaseDialog>
  );
}
