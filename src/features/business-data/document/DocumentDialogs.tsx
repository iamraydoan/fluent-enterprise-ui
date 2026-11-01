import { useState } from "react";
import { BaseDialog, FormField, HStack  } from "@/components/common";
import { Button, Checkbox, Input, Textarea, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { theme } from "@/styles/theme";
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
  steps: {
    padding: "12px 16px",
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
    margin: "-16px -20px 0",
  },
  step: {
    color: theme.color.textTertiary,
  },
  stepActive: { color: theme.color.textPrimary, fontWeight: theme.font.weightSemibold },
  stepNum: {
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    backgroundColor: theme.color.surfaceTertiary,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: theme.font.sizeSm,
  },
  stepNumActive: {
    backgroundColor: theme.color.brand,
    color: theme.color.textOnBrand,
  },
  field: {
    display: "grid",
    gridTemplateColumns: "200px 1fr",
    gap: theme.spacing.md,
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontWeight: theme.font.weightSemibold,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.xs,
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
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
    <FormField
      label={
        <>
          {required && <span style={{ color: theme.color.textDanger }}>* </span>}
          {t(label)}
        </>
      }
      labelWidth="200px"
    >
      {control}
    </FormField>
  );

  const canNext = step === 0 && mode === MODE_CREATE ? true : name.trim().length > 0;

  return (
    <BaseDialog
      open
      title={t(title)}
      onClose={onClose}
      width="800px"
      footer={
        <>
          <Button onClick={onClose}>{t(L.cancel)}</Button>
          {step > 0 && <Button onClick={() => setStep(step - 1)}>{t(L.back)}</Button>}
          {step < steps.length - 1 ? (
            <Button variant="primary" onClick={() => setStep(step + 1)} disabled={!canNext}>
              {t(L.next)}
            </Button>
          ) : (
            <Button variant="primary" onClick={onClose} disabled={!canNext}>
              {t(mode === MODE_CREATE ? L.create : mode === MODE_EDIT ? L.save : L.clone)}
            </Button>
          )}
        </>
      }
    >
      <HStack gap="24px" className={styles.steps}>
        {steps.map((s, i) => (
          <HStack gap="8px" align="center" key={i} className={`${styles.step} ${i === step ? styles.stepActive : ""}`}>
            <span className={`${styles.stepNum} ${i === step ? styles.stepNumActive : ""}`}>
              {i + 1}
            </span>
            {t(s)}
          </HStack>
        ))}
      </HStack>
      {step === 0 && mode === MODE_CREATE && (
        <>
          {field(L.changeSet, false, <Input value={changeSet} onChange={setChangeSet} />)}
          {field(L.approvalRole, false, <Input value={approvalRole} onChange={setApprovalRole} />)}
          <Checkbox
            label={t(L.useAutomaticChangeSet)}
            checked={autoChangeSet}
            onChange={(checked) => setAutoChangeSet(!!checked)}
          />
        </>
      )}
      {(step === 1 || mode !== MODE_CREATE) && (
        <>
          {field(
            L.name,
            true,
            <Input value={name} onChange={setName} disabled={mode === MODE_EDIT} />,
          )}
          {mode !== MODE_EDIT &&
            field(L.revision, false, <Input value={revision} onChange={setRevision} />)}
          {field(L.description, false, <Textarea value={description} onChange={setDescription} />)}
          {field(L.type, true, <Input value={type} onChange={setType} />)}
          <div className={styles.sectionTitle}>{t(L.source)}</div>
          <HStack gap="16px" style={{marginBottom: "12px"}}>
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
          </HStack>
          {source === SOURCE_INTERNAL
            ? field(
                L.file,
                false,
                <HStack gap="8px">
                  <Input value={file} onChange={setFile} style={{ flex: 1 }} />
                  <Button>{t(L.browse)}</Button>
                </HStack>,
              )
            : field(L.url, false, <Input value={url} onChange={setUrl} />)}
          {field(
            L.changeDescription,
            false,
            <Textarea value={changeDescription} onChange={setChangeDescription} />,
          )}
          {field(L.folder, false, <Input value={folder} onChange={setFolder} />)}
          {field(L.ownerRole, false, <Input value={ownerRole} onChange={setOwnerRole} />)}
          {field(L.group, false, <Input value={group} onChange={setGroup} />)}
          {field(L.author, false, <Input value={author} onChange={setAuthor} />)}
          {field(L.keywords, false, <Input value={keywords} onChange={setKeywords} />)}
          {field(
            L.distNewVersion,
            false,
            <Input value={distNewVersion} onChange={setDistNewVersion} />,
          )}
          {field(
            L.distNewEffective,
            false,
            <Input value={distNewEffective} onChange={setDistNewEffective} />,
          )}
          <Checkbox
            label={t(L.requireSignature)}
            checked={requireSignature}
            onChange={(checked) => setRequireSignature(!!checked)}
          />
          {requireSignature &&
            field(
              L.expirationDays,
              false,
              <Input value={expirationDays} onChange={setExpirationDays} />,
            )}
          {mode === MODE_CLONE &&
            field(L.comment, false, <Textarea value={comment} onChange={setComment} />)}
        </>
      )}
    </BaseDialog>
  );
}
