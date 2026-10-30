import { useState } from "react";
import { Button, Checkbox, Input, Textarea, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import { MODE_CREATE, MODE_EDIT } from "./wizardMode";
import type { WizardMode } from "./wizardMode";

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

const useDialogStyles = makeStyles({
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  surface: {
    width: "680px",
    maxWidth: "95vw",
    display: "flex",
    flexDirection: "column",
    maxHeight: "90vh",
  },
  head: {
    padding: "12px 16px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase400,
  },
  steps: {
    display: "flex",
    gap: "16px",
    padding: "12px 16px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  step: { fontSize: tokens.fontSizeBase300, color: tokens.colorNeutralForeground3 },
  stepActive: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorBrandForeground1,
  },
  body: {
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    overflowY: "auto",
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
    padding: "12px 16px",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  field: { display: "grid", gridTemplateColumns: "170px 1fr", gap: "12px", alignItems: "center" },
  select: {
    padding: "6px 8px",
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    fontSize: tokens.fontSizeBase300,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  hint: { fontSize: tokens.fontSizeBase200, color: tokens.colorNeutralForeground3 },
  row: { display: "flex", gap: "8px", alignItems: "center" },
});

interface DialogProps {
  mode: WizardMode;
  initialName?: string;
  onClose: () => void;
}

export function FlowDialog({ mode, initialName, onClose }: DialogProps) {
  const { t } = useAppTranslation();
  const shared = useSharedStyles();
  const styles = useDialogStyles();
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
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={`${shared.contentCard} ${styles.surface}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.head}>{t(title)}</div>
        <div className={styles.steps}>
          <span className={step === 1 ? styles.stepActive : styles.step}>{t(L.step1)}</span>
          <span className={step === 2 ? styles.stepActive : styles.step}>{t(L.step2)}</span>
          <span className={step === 3 ? styles.stepActive : styles.step}>{t(L.step3)}</span>
        </div>
        <div className={styles.body}>
          {step === 1 && (
            <>
              <div className={styles.field}>
                <label>{t(L.changeSet)}</label>
                <Input
                  value={changeSet}
                  onChange={(_, d) => setChangeSet(d.value)}
                  disabled={useAutoCs}
                />
              </div>
              <div className={styles.field}>
                <span />
                <Checkbox
                  label={t(L.useAutomaticChangeSet)}
                  checked={useAutoCs === true}
                  onChange={(_, d) => setUseAutoCs(d.checked === true)}
                />
              </div>
              <div className={styles.field}>
                <label>{t(L.approvalRole)}</label>
                <Input value={approvalRole} onChange={(_, d) => setApprovalRole(d.value)} />
              </div>
              <div className={styles.field}>
                <span />
                <Checkbox
                  label={t(L.makeEffectiveOnApproval)}
                  checked={effectiveOnApproval === true}
                  onChange={(_, d) => setEffectiveOnApproval(d.checked === true)}
                />
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div className={styles.field}>
                <label>
                  <span style={{ color: tokens.colorPaletteRedForeground1 }}>* </span>
                  {t(L.name)}
                </label>
                <Input
                  value={name}
                  onChange={(_, d) => setName(d.value)}
                  disabled={mode === MODE_EDIT}
                />
              </div>
              <div className={styles.field}>
                <label>{t(L.revision)}</label>
                <Input value={revision} onChange={(_, d) => setRevision(d.value)} />
              </div>
              <div className={styles.field}>
                <label>{t(L.description)}</label>
                <Textarea value={description} onChange={(_, d) => setDescription(d.value)} />
              </div>
              <div className={styles.field}>
                <label>{t(L.flowType)}</label>
                <Input value={flowType} onChange={(_, d) => setFlowType(d.value)} />
              </div>
              <div className={styles.field}>
                <label>{t(L.flowKind)}</label>
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
              </div>
              <div className={styles.field}>
                <span />
                <Checkbox
                  label={t(L.isEnabled)}
                  checked={isEnabled === true}
                  onChange={(_, d) => setIsEnabled(d.checked === true)}
                />
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <div className={styles.hint}>{t(L.flowItemsHint)}</div>
              <div className={styles.row}>
                <Button
                  size="small"
                  onClick={() => setItems([...items, `Step ${items.length + 1}`])}
                >
                  + {t(L.addStep)}
                </Button>
                <Button
                  size="small"
                  onClick={() => setItems([...items, `Flow ${items.length + 1}`])}
                >
                  + {t(L.addFlow)}
                </Button>
              </div>
              {items.map((item, i) => (
                <div key={i} className={styles.row}>
                  <span style={{ flex: 1 }}>{item}</span>
                  <Button size="small" onClick={() => setItems(items.filter((_, j) => j !== i))}>
                    {t(L.remove)}
                  </Button>
                </div>
              ))}
            </>
          )}
        </div>
        <div className={styles.footer}>
          <Button onClick={onClose}>{t(L.cancel)}</Button>
          {step > 1 && <Button onClick={() => setStep(step - 1)}>{t(L.back)}</Button>}
          {step < 3 ? (
            <Button
              appearance="primary"
              onClick={() => setStep(step + 1)}
              disabled={step === 2 && !canSubmit}
            >
              {t(L.next)}
            </Button>
          ) : (
            <Button appearance="primary" onClick={onClose}>
              {t(mode === MODE_CREATE ? L.create : mode === MODE_EDIT ? L.save : L.clone)}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
