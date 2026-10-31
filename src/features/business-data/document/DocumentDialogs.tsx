import { useState } from "react";
import { Button, Checkbox, Input, Textarea, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import { MODE_CLONE, MODE_CREATE, MODE_EDIT } from "../components/wizardMode";
import type { WizardMode } from "../components/wizardMode";

const SOURCE_INTERNAL = "internal";
const SOURCE_EXTERNAL = "external";

const L: Record<string, TranslationKey> = {
  createTitle: "businessData.document.wizard.createTitle",
  editTitle: "businessData.document.wizard.editTitle",
  cloneTitle: "businessData.document.wizard.cloneTitle",
  stepChangeSet: "businessData.document.wizard.stepChangeSet",
  stepGeneral: "businessData.document.wizard.stepGeneral",
  changeSet: "businessData.document.wizard.changeSet",
  approvalRole: "businessData.document.wizard.approvalRole",
  useAutomaticChangeSet: "businessData.document.wizard.useAutomaticChangeSet",
  name: "businessData.document.wizard.name",
  revision: "businessData.document.wizard.revision",
  description: "businessData.document.wizard.description",
  type: "businessData.document.wizard.type",
  source: "businessData.document.wizard.source",
  internal: "businessData.document.wizard.internal",
  external: "businessData.document.wizard.external",
  file: "businessData.document.wizard.file",
  browse: "businessData.document.wizard.browse",
  url: "businessData.document.wizard.url",
  changeDescription: "businessData.document.wizard.changeDescription",
  folder: "businessData.document.wizard.folder",
  ownerRole: "businessData.document.wizard.ownerRole",
  group: "businessData.document.wizard.group",
  author: "businessData.document.wizard.author",
  creationDate: "businessData.document.wizard.creationDate",
  keywords: "businessData.document.wizard.keywords",
  distNewVersion: "businessData.document.wizard.distNewVersion",
  distNewEffective: "businessData.document.wizard.distNewEffective",
  requireSignature: "businessData.document.wizard.requireSignature",
  expirationDays: "businessData.document.wizard.expirationDays",
  comment: "businessData.document.wizard.comment",
  cancel: "businessData.document.wizard.cancel",
  back: "businessData.document.wizard.back",
  next: "businessData.document.wizard.next",
  create: "businessData.document.wizard.create",
  save: "businessData.document.wizard.save",
  clone: "businessData.document.wizard.clone",
};

const useWizardStyles = makeStyles({
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
    width: "800px",
    maxWidth: "95vw",
    maxHeight: "90vh",
    display: "flex",
    flexDirection: "column",
  },
  head: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 16px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase400,
  },
  steps: {
    display: "flex",
    gap: "24px",
    padding: "12px 16px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  step: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: tokens.colorNeutralForeground3,
  },
  stepActive: { color: tokens.colorNeutralForeground1, fontWeight: tokens.fontWeightSemibold },
  stepNum: {
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    backgroundColor: tokens.colorNeutralBackground3,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: tokens.fontSizeBase200,
  },
  stepNumActive: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
  },
  body: { padding: "16px", overflowY: "auto", flex: 1 },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
    padding: "12px 16px",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  field: {
    display: "grid",
    gridTemplateColumns: "200px 1fr",
    gap: "12px",
    alignItems: "center",
    marginBottom: "12px",
  },
  sectionTitle: {
    fontWeight: tokens.fontWeightSemibold,
    marginTop: "16px",
    marginBottom: "12px",
    paddingBottom: "4px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
});

interface WizardProps {
  mode: WizardMode;
  initialName?: string;
  initialDescription?: string;
  initialType?: string;
  onClose: () => void;
}

export function DocumentWizardDialog({
  mode,
  initialName,
  initialDescription,
  initialType,
  onClose,
}: WizardProps) {
  const { t } = useAppTranslation();
  const shared = useSharedStyles();
  const styles = useWizardStyles();
  const [step, setStep] = useState(0);

  const [changeSet, setChangeSet] = useState("");
  const [approvalRole, setApprovalRole] = useState("");
  const [autoChangeSet, setAutoChangeSet] = useState(false);
  const [name, setName] = useState(initialName ?? "");
  const [revision, setRevision] = useState("");
  const [description, setDescription] = useState(initialDescription ?? "");
  const [type, setType] = useState(initialType ?? "PDF");
  const [source, setSource] = useState(SOURCE_INTERNAL);
  const [file, setFile] = useState("");
  const [url, setUrl] = useState("");
  const [changeDescription, setChangeDescription] = useState("");
  const [folder, setFolder] = useState("");
  const [ownerRole, setOwnerRole] = useState("");
  const [group, setGroup] = useState("");
  const [author, setAuthor] = useState("");
  const [keywords, setKeywords] = useState("");
  const [distNewVersion, setDistNewVersion] = useState("");
  const [distNewEffective, setDistNewEffective] = useState("");
  const [requireSignature, setRequireSignature] = useState(false);
  const [expirationDays, setExpirationDays] = useState("");
  const [comment, setComment] = useState("");

  const title =
    mode === MODE_CREATE ? L.createTitle : mode === MODE_EDIT ? L.editTitle : L.cloneTitle;
  const steps = mode === MODE_CREATE ? [L.stepChangeSet, L.stepGeneral] : [L.stepGeneral];

  const field = (label: TranslationKey, required: boolean, control: React.ReactNode) => (
    <div className={styles.field}>
      <label>
        {required && <span style={{ color: tokens.colorPaletteRedForeground1 }}>* </span>}
        {t(label)}
      </label>
      {control}
    </div>
  );

  const canNext = step === 0 && mode === MODE_CREATE ? true : name.trim().length > 0;

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
          {steps.map((s, i) => (
            <div key={i} className={`${styles.step} ${i === step ? styles.stepActive : ""}`}>
              <span className={`${styles.stepNum} ${i === step ? styles.stepNumActive : ""}`}>
                {i + 1}
              </span>
              {t(s)}
            </div>
          ))}
        </div>
        <div className={styles.body}>
          {step === 0 && mode === MODE_CREATE && (
            <>
              {field(
                L.changeSet,
                false,
                <Input value={changeSet} onChange={(_, d) => setChangeSet(d.value)} />,
              )}
              {field(
                L.approvalRole,
                false,
                <Input value={approvalRole} onChange={(_, d) => setApprovalRole(d.value)} />,
              )}
              <Checkbox
                label={t(L.useAutomaticChangeSet)}
                checked={autoChangeSet}
                onChange={(_, d) => setAutoChangeSet(!!d.checked)}
              />
            </>
          )}
          {(step === 1 || mode !== MODE_CREATE) && (
            <>
              {field(
                L.name,
                true,
                <Input
                  value={name}
                  onChange={(_, d) => setName(d.value)}
                  disabled={mode === MODE_EDIT}
                />,
              )}
              {mode !== MODE_EDIT &&
                field(
                  L.revision,
                  false,
                  <Input value={revision} onChange={(_, d) => setRevision(d.value)} />,
                )}
              {field(
                L.description,
                false,
                <Textarea value={description} onChange={(_, d) => setDescription(d.value)} />,
              )}
              {field(L.type, true, <Input value={type} onChange={(_, d) => setType(d.value)} />)}
              <div className={styles.sectionTitle}>{t(L.source)}</div>
              <div style={{ display: "flex", gap: "16px", marginBottom: "12px" }}>
                <Checkbox
                  label={t(L.internal)}
                  checked={source === SOURCE_INTERNAL}
                  onChange={() => setSource(SOURCE_INTERNAL)}
                />
                <Checkbox
                  label={t(L.external)}
                  checked={source === SOURCE_EXTERNAL}
                  onChange={() => setSource(SOURCE_EXTERNAL)}
                />
              </div>
              {source === SOURCE_INTERNAL
                ? field(
                    L.file,
                    false,
                    <div style={{ display: "flex", gap: "8px" }}>
                      <Input
                        value={file}
                        onChange={(_, d) => setFile(d.value)}
                        style={{ flex: 1 }}
                      />
                      <Button>{t(L.browse)}</Button>
                    </div>,
                  )
                : field(L.url, false, <Input value={url} onChange={(_, d) => setUrl(d.value)} />)}
              {field(
                L.changeDescription,
                false,
                <Textarea
                  value={changeDescription}
                  onChange={(_, d) => setChangeDescription(d.value)}
                />,
              )}
              {field(
                L.folder,
                false,
                <Input value={folder} onChange={(_, d) => setFolder(d.value)} />,
              )}
              {field(
                L.ownerRole,
                false,
                <Input value={ownerRole} onChange={(_, d) => setOwnerRole(d.value)} />,
              )}
              {field(
                L.group,
                false,
                <Input value={group} onChange={(_, d) => setGroup(d.value)} />,
              )}
              {field(
                L.author,
                false,
                <Input value={author} onChange={(_, d) => setAuthor(d.value)} />,
              )}
              {field(
                L.keywords,
                false,
                <Input value={keywords} onChange={(_, d) => setKeywords(d.value)} />,
              )}
              {field(
                L.distNewVersion,
                false,
                <Input value={distNewVersion} onChange={(_, d) => setDistNewVersion(d.value)} />,
              )}
              {field(
                L.distNewEffective,
                false,
                <Input
                  value={distNewEffective}
                  onChange={(_, d) => setDistNewEffective(d.value)}
                />,
              )}
              <Checkbox
                label={t(L.requireSignature)}
                checked={requireSignature}
                onChange={(_, d) => setRequireSignature(!!d.checked)}
              />
              {requireSignature &&
                field(
                  L.expirationDays,
                  false,
                  <Input value={expirationDays} onChange={(_, d) => setExpirationDays(d.value)} />,
                )}
              {mode === MODE_CLONE &&
                field(
                  L.comment,
                  false,
                  <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />,
                )}
            </>
          )}
        </div>
        <div className={styles.footer}>
          <Button onClick={onClose}>{t(L.cancel)}</Button>
          {step > 0 && <Button onClick={() => setStep(step - 1)}>{t(L.back)}</Button>}
          {step < steps.length - 1 ? (
            <Button appearance="primary" onClick={() => setStep(step + 1)} disabled={!canNext}>
              {t(L.next)}
            </Button>
          ) : (
            <Button appearance="primary" onClick={onClose} disabled={!canNext}>
              {t(mode === MODE_CREATE ? L.create : mode === MODE_EDIT ? L.save : L.clone)}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
