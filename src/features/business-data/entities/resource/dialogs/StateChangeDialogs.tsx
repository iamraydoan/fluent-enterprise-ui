import { useState } from "react";
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

const RESOURCE_STATES = ["Standby", "Productive", "Engineering", "Scheduled Down", "Unscheduled Down", "Non-Scheduled"];
const SYSTEM_STATES = ["Up", "Down", "Non-Scheduled"];
const AUTOMATION_MODES = ["Online", "Offline"];
const RUNNING_MODES = ["Normal", "High Speed", "Eco"];

interface StateChangeDialogProps {
  open: boolean;
  onClose: () => void;
  resourceName: string;
}

function useDialogState() {
  const [comment, setComment] = useState("");
  return { comment, setComment };
}

export function ChangeResourceStateDialog({ open, onClose, resourceName }: StateChangeDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.resource.dialogs.changeState";
  const [step, setStep] = useState(1);
  const [newState, setNewState] = useState("Standby");
  const [reason, setReason] = useState("");
  const { comment, setComment } = useDialogState();

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface style={{ maxWidth: 900, width: "90vw" }}>
        <DialogBody>
          <DialogTitle>{t(`${k}.title`)}</DialogTitle>
          <DialogContent>
            <div style={{ display: "flex", alignItems: "center", columnGap: 8, marginBottom: 12 }}>
              {[t(`${k}.step1`), t(`${k}.step2`), t(`${k}.step3`), t(`${k}.step4`), t(`${k}.step5`)].map((label, i) => (
                <span key={i} style={{ display: "flex", alignItems: "center", columnGap: 8 }}>
                  {i > 0 && <span style={{ width: 24, height: 1, backgroundColor: "#ccc" }} />}
                  <span style={{ width: 24, height: 24, borderRadius: "50%", backgroundColor: step === i + 1 ? "#0078d4" : "#ccc", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>{i + 1}</span>
                  <Body1Strong>{label}</Body1Strong>
                </span>
              ))}
            </div>
            <div style={{ marginBottom: 12, color: "#0078d4" }}>🔧 {resourceName}</div>

            {step === 1 && (
              <div style={{ display: "flex", flexDirection: "column", rowGap: 12 }}>
                <Field label={t(`${k}.newState`)} required>
                  <select value={newState} onChange={(e) => setNewState(e.target.value)}>
                    {RESOURCE_STATES.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </Field>
                <Field label={t(`${k}.reason`)}>
                  <Input value={reason} onChange={(_, d) => setReason(d.value)} />
                </Field>
                <Field label={t(`${k}.comment`)}>
                  <Input value={comment} onChange={(_, d) => setComment(d.value)} />
                </Field>
              </div>
            )}
            {step === 2 && (
              <div style={{ padding: "12px 0", color: "#666" }}>
                {t(`${k}.step2Body`)}
              </div>
            )}
            {step === 3 && (
              <div style={{ padding: "12px 0", color: "#666" }}>
                {t(`${k}.step3Body`)}
              </div>
            )}
            {step === 4 && (
              <div style={{ padding: "12px 0", color: "#666" }}>
                {t(`${k}.step4Body`)}
              </div>
            )}
            {step === 5 && (
              <div style={{ padding: "12px 0", color: "#666" }}>
                {t(`${k}.step5Body`)}
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onClose}>{t("common.cancel")}</Button>
            {step > 1 && (
              <Button appearance="secondary" onClick={() => setStep(step - 1)}>{t("common.back")}</Button>
            )}
            {step < 5 ? (
              <Button appearance="primary" onClick={() => setStep(step + 1)}>{t("common.next")}</Button>
            ) : (
              <Button appearance="primary" onClick={onClose}>{t(`${k}.change`)}</Button>
            )}
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}

export function ChangeSystemStateDialog({ open, onClose, resourceName }: StateChangeDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.resource.dialogs.changeSystemState";
  const [newState, setNewState] = useState("Up");
  const { comment, setComment } = useDialogState();

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface style={{ maxWidth: 700, width: "85vw" }}>
        <DialogBody>
          <DialogTitle>{t(`${k}.title`)}</DialogTitle>
          <DialogContent>
            <div style={{ marginBottom: 12, color: "#0078d4" }}>🔧 {resourceName}</div>
            <Field label={t(`${k}.newState`)} required>
              <select value={newState} onChange={(e) => setNewState(e.target.value)}>
                {SYSTEM_STATES.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </Field>
            <Field label={t(`${k}.comment`)}>
              <Input value={comment} onChange={(_, d) => setComment(d.value)} />
            </Field>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onClose}>{t("common.cancel")}</Button>
            <Button appearance="primary" onClick={onClose}>{t(`${k}.change`)}</Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}

export function ChangeAutomationModeDialog({ open, onClose, resourceName }: StateChangeDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.resource.dialogs.changeAutomationMode";
  const [newMode, setNewMode] = useState("Online");
  const { comment, setComment } = useDialogState();

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface style={{ maxWidth: 700, width: "85vw" }}>
        <DialogBody>
          <DialogTitle>{t(`${k}.title`)}</DialogTitle>
          <DialogContent>
            <div style={{ marginBottom: 12, color: "#0078d4" }}>🔧 {resourceName}</div>
            <Field label={t(`${k}.newMode`)} required>
              <select value={newMode} onChange={(e) => setNewMode(e.target.value)}>
                {AUTOMATION_MODES.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </Field>
            <Field label={t(`${k}.comment`)}>
              <Input value={comment} onChange={(_, d) => setComment(d.value)} />
            </Field>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onClose}>{t("common.cancel")}</Button>
            <Button appearance="primary" onClick={onClose}>{t(`${k}.change`)}</Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}

export function ChangeInstrumentModeDialog({ open, onClose, resourceName }: StateChangeDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.resource.dialogs.changeInstrumentMode";
  const [newMode, setNewMode] = useState("");
  const { comment, setComment } = useDialogState();

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface style={{ maxWidth: 700, width: "85vw" }}>
        <DialogBody>
          <DialogTitle>{t(`${k}.title`)}</DialogTitle>
          <DialogContent>
            <div style={{ marginBottom: 12, color: "#0078d4" }}>🔧 {resourceName}</div>
            <Field label={t(`${k}.newMode`)} required>
              <Input value={newMode} onChange={(_, d) => setNewMode(d.value)} />
            </Field>
            <Field label={t(`${k}.comment`)}>
              <Input value={comment} onChange={(_, d) => setComment(d.value)} />
            </Field>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onClose}>{t("common.cancel")}</Button>
            <Button appearance="primary" onClick={onClose}>{t(`${k}.change`)}</Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}

export function ChangeRunningModeDialog({ open, onClose, resourceName }: StateChangeDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.resource.dialogs.changeRunningMode";
  const [newMode, setNewMode] = useState("Normal");
  const { comment, setComment } = useDialogState();

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface style={{ maxWidth: 700, width: "85vw" }}>
        <DialogBody>
          <DialogTitle>{t(`${k}.title`)}</DialogTitle>
          <DialogContent>
            <div style={{ marginBottom: 12, color: "#0078d4" }}>🔧 {resourceName}</div>
            <Field label={t(`${k}.newMode`)} required>
              <select value={newMode} onChange={(e) => setNewMode(e.target.value)}>
                {RUNNING_MODES.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </Field>
            <Field label={t(`${k}.comment`)}>
              <Input value={comment} onChange={(_, d) => setComment(d.value)} />
            </Field>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onClose}>{t("common.cancel")}</Button>
            <Button appearance="primary" onClick={onClose}>{t(`${k}.change`)}</Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}

export function ChangeProductDialog({ open, onClose, resourceName }: StateChangeDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.resource.dialogs.changeProduct";
  const [step, setStep] = useState(1);
  const [newProduct, setNewProduct] = useState("");
  const { comment, setComment } = useDialogState();

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface style={{ maxWidth: 800, width: "88vw" }}>
        <DialogBody>
          <DialogTitle>{t(`${k}.title`)}</DialogTitle>
          <DialogContent>
            <div style={{ display: "flex", alignItems: "center", columnGap: 8, marginBottom: 12 }}>
              <span style={{ width: 24, height: 24, borderRadius: "50%", backgroundColor: step === 1 ? "#0078d4" : "#ccc", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>1</span>
              <Body1Strong>{t(`${k}.materials`)}</Body1Strong>
              <span style={{ width: 40, height: 1, backgroundColor: "#ccc" }} />
              <span style={{ width: 24, height: 24, borderRadius: "50%", backgroundColor: step === 2 ? "#0078d4" : "#ccc", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>2</span>
              <Body1Strong>{t(`${k}.subMaterials`)}</Body1Strong>
            </div>
            <div style={{ marginBottom: 12, color: "#0078d4" }}>🔧 {resourceName}</div>
            <Field label={t(`${k}.newProduct`)} required>
              <Input value={newProduct} onChange={(_, d) => setNewProduct(d.value)} />
            </Field>
            {step === 2 && (
              <Field label={t(`${k}.comment`)}>
                <Input value={comment} onChange={(_, d) => setComment(d.value)} />
              </Field>
            )}
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onClose}>{t("common.cancel")}</Button>
            {step === 2 && (
              <Button appearance="secondary" onClick={() => setStep(1)}>{t("common.back")}</Button>
            )}
            {step === 1 ? (
              <Button appearance="primary" onClick={() => setStep(2)}>{t("common.next")}</Button>
            ) : (
              <Button appearance="primary" onClick={onClose}>{t(`${k}.change`)}</Button>
            )}
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}

export function EvaluateDispatchableRuleDialog({ open, onClose, resourceName }: StateChangeDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.resource.dialogs.evaluateDispatchable";
  const { comment, setComment } = useDialogState();

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface style={{ maxWidth: 700, width: "85vw" }}>
        <DialogBody>
          <DialogTitle>{t(`${k}.title`)}</DialogTitle>
          <DialogContent>
            <div style={{ marginBottom: 12, color: "#0078d4" }}>🔧 {resourceName}</div>
            <div style={{ padding: "12px 0" }}>{t(`${k}.verifyInfo`)}</div>
            <Field label={t(`${k}.comment`)}>
              <Input value={comment} onChange={(_, d) => setComment(d.value)} />
            </Field>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onClose}>{t("common.cancel")}</Button>
            <Button appearance="primary" onClick={onClose}>{t(`${k}.evaluate`)}</Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
