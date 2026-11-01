import { useState } from "react";
import { BaseDialog, DialogEntityBanner, DialogFooter, WizardSteps, VStack  } from "@/components/common";
import { Button, Field, Input } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { theme } from "@/styles/theme";

const RESOURCE_STATES = [
  "Standby",
  "Productive",
  "Engineering",
  "Scheduled Down",
  "Unscheduled Down",
  "Non-Scheduled",
];
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
    <BaseDialog
      open={open}
      title={t(`${k}.title`)}
      onClose={onClose}
      width="min(900px, 90vw)"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          {step > 1 && (
            <Button variant="secondary" onClick={() => setStep(step - 1)}>
              {t("common.back")}
            </Button>
          )}
          {step < 5 ? (
            <Button variant="primary" onClick={() => setStep(step + 1)}>
              {t("common.next")}
            </Button>
          ) : (
            <Button variant="primary" onClick={onClose}>
              {t(`${k}.change`)}
            </Button>
          )}
        </>
      }
    >
      <WizardSteps
        steps={[
          t(`${k}.step1`),
          t(`${k}.step2`),
          t(`${k}.step3`),
          t(`${k}.step4`),
          t(`${k}.step5`),
        ]}
        current={step}
      />
      <DialogEntityBanner icon="🔧" name={resourceName} />

      {step === 1 && (
        <VStack gap={12}>
          <Field label={t(`${k}.newState`)} required>
            <select value={newState} onChange={(e) => setNewState(e.target.value)}>
              {RESOURCE_STATES.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t(`${k}.reason`)}>
            <Input value={reason} onChange={setReason} />
          </Field>
          <Field label={t(`${k}.comment`)}>
            <Input value={comment} onChange={setComment} />
          </Field>
        </VStack>
      )}
      {step === 2 && <div style={{ padding: "12px 0", color: theme.color.textSecondary }}>{t(`${k}.step2Body`)}</div>}
      {step === 3 && <div style={{ padding: "12px 0", color: theme.color.textSecondary }}>{t(`${k}.step3Body`)}</div>}
      {step === 4 && <div style={{ padding: "12px 0", color: theme.color.textSecondary }}>{t(`${k}.step4Body`)}</div>}
      {step === 5 && <div style={{ padding: "12px 0", color: theme.color.textSecondary }}>{t(`${k}.step5Body`)}</div>}
    </BaseDialog>
  );
}

export function ChangeSystemStateDialog({ open, onClose, resourceName }: StateChangeDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.resource.dialogs.changeSystemState";
  const [newState, setNewState] = useState("Up");
  const { comment, setComment } = useDialogState();

  return (
    <BaseDialog
      open={open}
      title={t(`${k}.title`)}
      onClose={onClose}
      width="min(700px, 85vw)"
      footer={
        <DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={t(`${k}.change`)} />
      }
    >
      <DialogEntityBanner icon="🔧" name={resourceName} />
      <Field label={t(`${k}.newState`)} required>
        <select value={newState} onChange={(e) => setNewState(e.target.value)}>
          {SYSTEM_STATES.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </Field>
      <Field label={t(`${k}.comment`)}>
        <Input value={comment} onChange={setComment} />
      </Field>
    </BaseDialog>
  );
}

export function ChangeAutomationModeDialog({
  open,
  onClose,
  resourceName,
}: StateChangeDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.resource.dialogs.changeAutomationMode";
  const [newMode, setNewMode] = useState("Online");
  const { comment, setComment } = useDialogState();

  return (
    <BaseDialog
      open={open}
      title={t(`${k}.title`)}
      onClose={onClose}
      width="min(700px, 85vw)"
      footer={
        <DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={t(`${k}.change`)} />
      }
    >
      <DialogEntityBanner icon="🔧" name={resourceName} />
      <Field label={t(`${k}.newMode`)} required>
        <select value={newMode} onChange={(e) => setNewMode(e.target.value)}>
          {AUTOMATION_MODES.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </Field>
      <Field label={t(`${k}.comment`)}>
        <Input value={comment} onChange={setComment} />
      </Field>
    </BaseDialog>
  );
}

export function ChangeInstrumentModeDialog({
  open,
  onClose,
  resourceName,
}: StateChangeDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.resource.dialogs.changeInstrumentMode";
  const [newMode, setNewMode] = useState("");
  const { comment, setComment } = useDialogState();

  return (
    <BaseDialog
      open={open}
      title={t(`${k}.title`)}
      onClose={onClose}
      width="min(700px, 85vw)"
      footer={
        <DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={t(`${k}.change`)} />
      }
    >
      <DialogEntityBanner icon="🔧" name={resourceName} />
      <Field label={t(`${k}.newMode`)} required>
        <Input value={newMode} onChange={setNewMode} />
      </Field>
      <Field label={t(`${k}.comment`)}>
        <Input value={comment} onChange={setComment} />
      </Field>
    </BaseDialog>
  );
}

export function ChangeRunningModeDialog({ open, onClose, resourceName }: StateChangeDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.resource.dialogs.changeRunningMode";
  const [newMode, setNewMode] = useState("Normal");
  const { comment, setComment } = useDialogState();

  return (
    <BaseDialog
      open={open}
      title={t(`${k}.title`)}
      onClose={onClose}
      width="min(700px, 85vw)"
      footer={
        <DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={t(`${k}.change`)} />
      }
    >
      <DialogEntityBanner icon="🔧" name={resourceName} />
      <Field label={t(`${k}.newMode`)} required>
        <select value={newMode} onChange={(e) => setNewMode(e.target.value)}>
          {RUNNING_MODES.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </Field>
      <Field label={t(`${k}.comment`)}>
        <Input value={comment} onChange={setComment} />
      </Field>
    </BaseDialog>
  );
}

export function ChangeProductDialog({ open, onClose, resourceName }: StateChangeDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.resource.dialogs.changeProduct";
  const [step, setStep] = useState(1);
  const [newProduct, setNewProduct] = useState("");
  const { comment, setComment } = useDialogState();

  return (
    <BaseDialog
      open={open}
      title={t(`${k}.title`)}
      onClose={onClose}
      width="min(800px, 88vw)"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          {step === 2 && (
            <Button variant="secondary" onClick={() => setStep(1)}>
              {t("common.back")}
            </Button>
          )}
          {step === 1 ? (
            <Button variant="primary" onClick={() => setStep(2)}>
              {t("common.next")}
            </Button>
          ) : (
            <Button variant="primary" onClick={onClose}>
              {t(`${k}.change`)}
            </Button>
          )}
        </>
      }
    >
      <WizardSteps steps={[t(`${k}.materials`), t(`${k}.subMaterials`)]} current={step} />
      <DialogEntityBanner icon="🔧" name={resourceName} />
      <Field label={t(`${k}.newProduct`)} required>
        <Input value={newProduct} onChange={setNewProduct} />
      </Field>
      {step === 2 && (
        <Field label={t(`${k}.comment`)}>
          <Input value={comment} onChange={setComment} />
        </Field>
      )}
    </BaseDialog>
  );
}

export function EvaluateDispatchableRuleDialog({
  open,
  onClose,
  resourceName,
}: StateChangeDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.resource.dialogs.evaluateDispatchable";
  const { comment, setComment } = useDialogState();

  return (
    <BaseDialog
      open={open}
      title={t(`${k}.title`)}
      onClose={onClose}
      width="min(700px, 85vw)"
      footer={
        <DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={t(`${k}.evaluate`)} />
      }
    >
      <DialogEntityBanner icon="🔧" name={resourceName} />
      <div style={{ padding: "12px 0" }}>{t(`${k}.verifyInfo`)}</div>
      <Field label={t(`${k}.comment`)}>
        <Input value={comment} onChange={setComment} />
      </Field>
    </BaseDialog>
  );
}
