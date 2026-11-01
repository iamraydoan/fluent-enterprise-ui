import { useState } from "react";
import { BaseDialog, FormField, HStack  } from "@/components/common";
import { Button, Checkbox, Input, Textarea, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { theme } from "@/styles/theme";
import { MODE_CREATE, MODE_EDIT } from "../../components/wizardMode";
import type { WizardMode } from "../../components/wizardMode";

const L: Record<string, TranslationKey> = {
  createTitle: "businessData.flow.dialog.createTitle",
  editTitle: "businessData.flow.dialog.editTitle",
  cloneTitle: "businessData.flow.dialog.cloneTitle",
  step1: "businessData.flow.dialog.step1",
  step2: "businessData.flow.dialog.step2",
  step3: "businessData.flow.dialog.step3",
  changeSet: "businessData.flow.dialog.changeSet",
  useAutomaticChangeSet: "businessData.flow.dialog.useAutomaticChangeSet",
  approvalRole: "businessData.flow.dialog.approvalRole",
  makeEffectiveOnApproval: "businessData.flow.dialog.makeEffectiveOnApproval",
  name: "businessData.flow.dialog.name",
  revision: "businessData.flow.dialog.revision",
  description: "businessData.flow.dialog.description",
  flowType: "businessData.flow.dialog.flowType",
  flowKind: "businessData.flow.dialog.flowKind",
  kindSequential: "businessData.flow.dialog.kindSequential",
  kindAlternate: "businessData.flow.dialog.kindAlternate",
  kindNonSequential: "businessData.flow.dialog.kindNonSequential",
  kindLine: "businessData.flow.dialog.kindLine",
  isEnabled: "businessData.flow.dialog.isEnabled",
  flowItems: "businessData.flow.dialog.flowItems",
  flowItemsHint: "businessData.flow.dialog.flowItemsHint",
  addStep: "businessData.flow.dialog.addStep",
  addFlow: "businessData.flow.dialog.addFlow",
  remove: "businessData.flow.dialog.remove",
  back: "businessData.flow.dialog.back",
  next: "businessData.flow.dialog.next",
  cancel: "businessData.flow.dialog.cancel",
  create: "businessData.flow.dialog.create",
  save: "businessData.flow.dialog.save",
  clone: "businessData.flow.dialog.clone",
};

const useStyles = makeStyles({
  steps: {
    padding: "4px 4px 12px",
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
    marginBottom: theme.spacing.xs,
  },
  step: { fontSize: theme.font.sizeMd, color: theme.color.textTertiary },
  stepActive: {
    fontSize: theme.font.sizeMd,
    fontWeight: theme.font.weightSemibold,
    color: theme.color.textBrand,
  },
  select: {
    padding: `6px ${theme.spacing.sm}`,
    border: `1px solid ${theme.color.border}`,
    borderRadius: theme.radius.md,
    fontSize: theme.font.sizeMd,
    backgroundColor: theme.color.surface,
  },
  hint: { fontSize: theme.font.sizeSm, color: theme.color.textTertiary },
  
});

interface DialogProps {
  mode: WizardMode;
  initialName?: string;
  onClose: () => void;
}

export function FlowDialog({ mode, initialName, onClose }: DialogProps) {
  const { t } = useAppTranslation();
  const styles = useStyles();
  const [step, setStep] = useState(1);
  const [changeSet, setChangeSet] = useState("");
  const [useAutoCs, setUseAutoCs] = useState(false);
  const [approvalRole, setApprovalRole] = useState("");
  const [effectiveOnApproval, setEffectiveOnApproval] = useState(false);
  const [name, setName] = useState(initialName ?? "");
  const [revision, setRevision] = useState("");
  const [description, setDescription] = useState("");
  const [flowType, setFlowType] = useState("");
  const [flowKind, setFlowKind] = useState("Sequential");
  const [isEnabled, setIsEnabled] = useState(true);
  const [items, setItems] = useState<string[]>([]);

  const title =
    mode === MODE_CREATE ? L.createTitle : mode === MODE_EDIT ? L.editTitle : L.cloneTitle;
  const canSubmit = name.trim().length > 0;

  return (
    <BaseDialog
      open
      title={t(title)}
      width="680px"
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>{t(L.cancel)}</Button>
          {step > 1 && <Button onClick={() => setStep(step - 1)}>{t(L.back)}</Button>}
          {step < 3 ? (
            <Button
              variant="primary"
              onClick={() => setStep(step + 1)}
              disabled={step === 2 && !canSubmit}
            >
              {t(L.next)}
            </Button>
          ) : (
            <Button variant="primary" onClick={onClose}>
              {t(mode === MODE_CREATE ? L.create : mode === MODE_EDIT ? L.save : L.clone)}
            </Button>
          )}
        </>
      }
    >
      <HStack gap="16px" className={styles.steps}>
        <span className={step === 1 ? styles.stepActive : styles.step}>{t(L.step1)}</span>
        <span className={step === 2 ? styles.stepActive : styles.step}>{t(L.step2)}</span>
        <span className={step === 3 ? styles.stepActive : styles.step}>{t(L.step3)}</span>
      </HStack>
      {step === 1 && (
        <>
          <FormField label={<>{t(L.changeSet)}</>} labelWidth="170px">
            <Input value={changeSet} onChange={setChangeSet} disabled={useAutoCs} />
          </FormField>
          <FormField
            label={
              <>
                <span />
              </>
            }
            labelWidth="170px"
          >
            <Checkbox
              label={t(L.useAutomaticChangeSet)}
              checked={useAutoCs === true}
              onChange={setUseAutoCs}
            />
          </FormField>
          <FormField label={<>{t(L.approvalRole)}</>} labelWidth="170px">
            <Input value={approvalRole} onChange={setApprovalRole} />
          </FormField>
          <FormField
            label={
              <>
                <span />
              </>
            }
            labelWidth="170px"
          >
            <Checkbox
              label={t(L.makeEffectiveOnApproval)}
              checked={effectiveOnApproval === true}
              onChange={setEffectiveOnApproval}
            />
          </FormField>
        </>
      )}
      {step === 2 && (
        <>
          <FormField
            label={
              <>
                <span style={{ color: theme.color.textDanger }}>* </span>
                {t(L.name)}
              </>
            }
            labelWidth="170px"
          >
            <Input value={name} onChange={setName} disabled={mode === MODE_EDIT} />
          </FormField>
          <FormField label={<>{t(L.revision)}</>} labelWidth="170px">
            <Input value={revision} onChange={setRevision} />
          </FormField>
          <FormField label={<>{t(L.description)}</>} labelWidth="170px">
            <Textarea value={description} onChange={setDescription} />
          </FormField>
          <FormField label={<>{t(L.flowType)}</>} labelWidth="170px">
            <Input value={flowType} onChange={setFlowType} />
          </FormField>
          <FormField label={<>{t(L.flowKind)}</>} labelWidth="170px">
            <select
              className={styles.select}
              value={flowKind}
              onChange={(e) => setFlowKind(e.target.value)}
            >
              <option value="Sequential">{t(L.kindSequential)}</option>
              <option value="Alternate">{t(L.kindAlternate)}</option>
              <option value="NonSequential">{t(L.kindNonSequential)}</option>
              <option value="Line">{t(L.kindLine)}</option>
            </select>
          </FormField>
          <FormField
            label={
              <>
                <span />
              </>
            }
            labelWidth="170px"
          >
            <Checkbox label={t(L.isEnabled)} checked={isEnabled === true} onChange={setIsEnabled} />
          </FormField>
        </>
      )}
      {step === 3 && (
        <>
          <div className={styles.hint}>{t(L.flowItemsHint)}</div>
          <HStack gap="8px" align="center">
            <Button size="sm" onClick={() => setItems([...items, `Step ${items.length + 1}`])}>
              + {t(L.addStep)}
            </Button>
            <Button size="sm" onClick={() => setItems([...items, `Flow ${items.length + 1}`])}>
              + {t(L.addFlow)}
            </Button>
          </HStack>
          {items.map((item, i) => (
            <HStack gap="8px" align="center" key={i}>
              <span style={{ flex: 1 }}>{item}</span>
              <Button size="sm" onClick={() => setItems(items.filter((_, j) => j !== i))}>
                {t(L.remove)}
              </Button>
            </HStack>
          ))}
        </>
      )}
    </BaseDialog>
  );
}
