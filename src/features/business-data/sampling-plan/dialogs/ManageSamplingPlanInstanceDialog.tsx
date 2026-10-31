import { useState } from "react";
import { BaseDialog, DialogFooter } from "@/components/common";
import { Body1Strong, Button, Field, Input } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";

interface ManageSamplingPlanInstanceDialogProps {
  open: boolean;
  onClose: () => void;
  planName: string;
}

interface PlanInstance {
  materialType: string;
  samplingType: string;
  counterFrequency: string;
  currentCounter: string;
  timeFrequency: string;
  lastSamplingDate: string;
}

const SAMPLING_TYPES = ["Counter Based", "Counter And Time Based", "Time Based"];

const INITIAL: PlanInstance[] = [
  {
    materialType: "Wafer",
    samplingType: "Counter Based",
    counterFrequency: "10",
    currentCounter: "3",
    timeFrequency: "",
    lastSamplingDate: "",
  },
];

const FIELDS: { key: keyof PlanInstance; labelKey: TranslationKey }[] = [
  { key: "materialType", labelKey: "businessData.samplingPlan.dialogs.instance.materialType" },
  {
    key: "counterFrequency",
    labelKey: "businessData.samplingPlan.dialogs.instance.counterFrequency",
  },
  { key: "currentCounter", labelKey: "businessData.samplingPlan.dialogs.instance.currentCounter" },
  { key: "timeFrequency", labelKey: "businessData.samplingPlan.dialogs.instance.timeFrequency" },
  {
    key: "lastSamplingDate",
    labelKey: "businessData.samplingPlan.dialogs.instance.lastSamplingDate",
  },
];

export function ManageSamplingPlanInstanceDialog({
  open,
  onClose,
  planName,
}: ManageSamplingPlanInstanceDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.samplingPlan.dialogs.instance";
  const [instances, setInstances] = useState<PlanInstance[]>(INITIAL);
  const [selected, setSelected] = useState(0);
  const [samplingType, setSamplingType] = useState(INITIAL[0].samplingType);
  const [values, setValues] = useState<Record<string, string>>({});
  const [comments, setComments] = useState("");

  const addInstance = () => {
    const next = [
      ...instances,
      {
        materialType: "",
        samplingType: "Counter Based",
        counterFrequency: "",
        currentCounter: "",
        timeFrequency: "",
        lastSamplingDate: "",
      },
    ];
    setInstances(next);
    setSelected(next.length - 1);
    setSamplingType("Counter Based");
    setValues({});
  };

  const removeInstance = (index: number) => {
    const next = instances.filter((_, i) => i !== index);
    setInstances(
      next.length > 0
        ? next
        : [
            {
              materialType: "",
              samplingType: "Counter Based",
              counterFrequency: "",
              currentCounter: "",
              timeFrequency: "",
              lastSamplingDate: "",
            },
          ],
    );
    setSelected(0);
  };

  const selectInstance = (index: number) => {
    setSelected(index);
    setSamplingType(instances[index].samplingType);
    setValues({});
  };

  return (
    <BaseDialog
      open={open}
      title={t(`${k}.title`)}
      onClose={onClose}
      width="min(1100px, 92vw)"
      footer={
        <DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={t(`${k}.update`)} />
      }
    >
      <div style={{ marginBottom: 12, color: "#0078d4" }}>📊 {planName}</div>
      <div style={{ display: "flex", columnGap: 16 }}>
        <div style={{ width: 320, flexShrink: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <Body1Strong>{t(`${k}.instances`, { count: instances.length })}</Body1Strong>
            <div style={{ display: "flex", columnGap: 4 }}>
              <Button size="small" appearance="subtle" onClick={addInstance}>
                +
              </Button>
              <Button size="small" appearance="subtle" onClick={() => removeInstance(selected)}>
                🗑
              </Button>
            </div>
          </div>
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: 4,
              minHeight: 300,
              overflow: "auto",
            }}
          >
            {instances.map((inst, i) => (
              <div
                key={`${inst.materialType}-${i}`}
                onClick={() => selectInstance(i)}
                style={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  backgroundColor: i === selected ? "#e3f2fd" : "transparent",
                  borderBottom: "1px solid #eee",
                }}
              >
                <div style={{ fontWeight: 600 }}>{inst.materialType || t(`${k}.newInstance`)}</div>
                <div style={{ fontSize: 12, color: "#666" }}>{inst.samplingType}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", rowGap: 12 }}>
          <Body1Strong>{t(`${k}.detailsTitle`)}</Body1Strong>
          <Field label={t(`${k}.samplingType`)}>
            <select value={samplingType} onChange={(e) => setSamplingType(e.target.value)}>
              {SAMPLING_TYPES.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </Field>
          {FIELDS.map((f) => (
            <Field key={f.key} label={t(f.labelKey)}>
              <Input
                value={values[f.key] ?? instances[selected]?.[f.key] ?? ""}
                onChange={(_, d) => setValues({ ...values, [f.key]: d.value })}
              />
            </Field>
          ))}
        </div>
      </div>
      <Field label={t(`${k}.comments`)}>
        <Input value={comments} onChange={(_, d) => setComments(d.value)} />
      </Field>
    </BaseDialog>
  );
}
