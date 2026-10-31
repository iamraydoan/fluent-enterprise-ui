import { useState } from "react";
import type { ResourceJobDetail, ResourceJobRecord } from "@/api";
import {
  Body1Strong,
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Field,
  Input,
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";

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
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface style={{ maxWidth: 1000, width: "92vw" }}>
        <DialogBody>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            {!nameReadOnly && (
              <div
                style={{ display: "flex", alignItems: "center", columnGap: 8, marginBottom: 12 }}
              >
                {[t(`${k}.step1`), t(`${k}.step2`), t(`${k}.step3`)].map((label, i) => (
                  <span key={i} style={{ display: "flex", alignItems: "center", columnGap: 8 }}>
                    {i > 0 && <span style={{ width: 40, height: 1, backgroundColor: "#ccc" }} />}
                    <span
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        backgroundColor: step === i + 1 ? "#0078d4" : "#ccc",
                        color: "#fff",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                      }}
                    >
                      {i + 1}
                    </span>
                    <Body1Strong>{label}</Body1Strong>
                  </span>
                ))}
              </div>
            )}

            {(step === 1 || nameReadOnly) && (
              <div style={{ display: "flex", flexDirection: "column", rowGap: 12 }}>
                <Field label={t(`${k}.name`)} required>
                  <Input
                    value={name}
                    readOnly={nameReadOnly}
                    onChange={(_, d) => setName(d.value)}
                  />
                </Field>
                <Field label={t(`${k}.description`)}>
                  <Input value={description} onChange={(_, d) => setDescription(d.value)} />
                </Field>
                <Field label={t(`${k}.resource`)} required>
                  <Input value={resource} onChange={(_, d) => setResource(d.value)} />
                </Field>
                <Field label={t(`${k}.type`)}>
                  <Input value={type} onChange={(_, d) => setType(d.value)} />
                </Field>
                <Field label={t(`${k}.subType`)}>
                  <Input value={subType} onChange={(_, d) => setSubType(d.value)} />
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
                <div style={{ display: "flex", columnGap: 12 }}>
                  <Field label={t(`${k}.priority`)}>
                    <Input value={priority} onChange={(_, d) => setPriority(d.value)} />
                  </Field>
                  <Field label={t(`${k}.progress`)}>
                    <Input value={progress} onChange={(_, d) => setProgress(d.value)} />
                  </Field>
                </div>
                <Field label={t(`${k}.equipmentJobId`)}>
                  <Input value={equipmentJobId} onChange={(_, d) => setEquipmentJobId(d.value)} />
                </Field>
                <Field label={t(`${k}.jobInformation`)}>
                  <Input value={jobInformation} onChange={(_, d) => setJobInformation(d.value)} />
                </Field>
              </div>
            )}

            {step === 2 && !nameReadOnly && (
              <div style={{ padding: "12px 0", color: "#666" }}>{t(`${k}.materialsBody`)}</div>
            )}

            {step === 3 && !nameReadOnly && (
              <div style={{ padding: "12px 0", color: "#666" }}>{t(`${k}.containersBody`)}</div>
            )}

            <Field label={t(`${k}.comments`)}>
              <Input value={comments} onChange={(_, d) => setComments(d.value)} />
            </Field>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            {!nameReadOnly && step > 1 && (
              <Button appearance="secondary" onClick={() => setStep(step - 1)}>
                {t("common.back")}
              </Button>
            )}
            {!nameReadOnly && step < 3 ? (
              <Button appearance="primary" onClick={() => setStep(step + 1)}>
                {t("common.next")}
              </Button>
            ) : (
              <Button appearance="primary" onClick={onClose}>
                {submitLabel}
              </Button>
            )}
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
