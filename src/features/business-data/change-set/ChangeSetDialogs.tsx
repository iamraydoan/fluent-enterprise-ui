import { useState } from "react";
import { BaseDialog, DialogFooter, FormField, Empty, Grid  } from "@/components/common";
import { Button, Input, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { theme } from "@/styles/theme";
import type { OperationOnChange, OperationValues } from "../components/operationTypes";

interface SimpleRow {
  id: number;
  name: string;
  extra: string;
}

const useDialogStyles = makeStyles({
  fieldLabel: { fontSize: "13px", color: theme.color.textSecondary, textAlign: "right" },
  hint: { fontSize: "13px", color: theme.color.textSecondary, marginBottom: theme.spacing.lg },
  row: {
    marginBottom: "8px",
  }
});

function NameListEditor({
  values,
  onChange,
  valueKey,
  namePlaceholderKey,
  extraPlaceholderKey,
}: {
  values: OperationValues;
  onChange: OperationOnChange;
  valueKey: string;
  namePlaceholderKey: TranslationKey;
  extraPlaceholderKey: TranslationKey;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const rows = (values[valueKey] as unknown as SimpleRow[] | undefined) ?? [];
  const setRows = (next: SimpleRow[]) => onChange(valueKey, next);
  const addRow = () => setRows([...rows, { id: Date.now() + rows.length, name: "", extra: "" }]);
  const removeRow = (id: number) => setRows(rows.filter((r) => r.id !== id));
  const updateRow = (id: number, patch: Partial<SimpleRow>) =>
    setRows(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  return (
    <div>
      {rows.length === 0 && <Empty>{t("businessData.changeSet.operations.noEntries")}</Empty>}
      {rows.map((row) => (
        <Grid columns="minmax(0, 1fr) minmax(0, 1fr) auto" gap="8px" align="center" key={row.id} className={styles.row}>
          <Input
            placeholder={t(namePlaceholderKey)}
            value={row.name}
            onChange={(value) => updateRow(row.id, { name: value })}
          />
          <Input
            placeholder={t(extraPlaceholderKey)}
            value={row.extra}
            onChange={(value) => updateRow(row.id, { extra: value })}
          />
          <Button variant="secondary" onClick={() => removeRow(row.id)}>
            {t("common.remove")}
          </Button>
        </Grid>
      ))}
      <Button variant="secondary" onClick={addRow}>
        {t("common.add")}
      </Button>
    </div>
  );
}

function ListDialogShell({
  open,
  title,
  hint,
  submitLabel,
  valueKey,
  namePlaceholderKey,
  extraPlaceholderKey,
  commentLabel,
  onClose,
}: {
  open: boolean;
  title: string;
  hint: string;
  submitLabel: string;
  valueKey: string;
  namePlaceholderKey: TranslationKey;
  extraPlaceholderKey: TranslationKey;
  commentLabel?: string;
  onClose: () => void;
}) {
  const styles = useDialogStyles();
  const [values, setValues] = useState<OperationValues>({});
  const [comment, setComment] = useState("");

  return (
    <BaseDialog
      open={open}
      title={title}
      onClose={onClose}
      size="lg"
      footer={<DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={submitLabel} />}
    >
      <div className={styles.hint}>{hint}</div>
      <NameListEditor
        values={values}
        onChange={(key, value) => setValues((prev) => ({ ...prev, [key]: value }))}
        valueKey={valueKey}
        namePlaceholderKey={namePlaceholderKey}
        extraPlaceholderKey={extraPlaceholderKey}
      />
      {commentLabel && (
        <FormField label={commentLabel} labelWidth="170px" labelAlign="right" style={{ marginTop: "16px" }}>
        <Input value={comment} onChange={setComment} />
      </FormField>
      )}
    </BaseDialog>
  );
}

export function ManageChangeSetItemsDialog({
  open,
  changeSetName,
  onClose,
}: {
  open: boolean;
  changeSetName: string;
  onClose: () => void;
}) {
  const { t } = useAppTranslation();
  return (
    <ListDialogShell
      open={open}
      title={t("businessData.changeSet.operations.manageItems")}
      hint={t("businessData.changeSet.operations.manageItemsHint", { name: changeSetName })}
      submitLabel={t("common.update")}
      valueKey="items"
      namePlaceholderKey="businessData.changeSet.operations.itemName"
      extraPlaceholderKey="businessData.changeSet.operations.itemType"
      commentLabel={t("businessData.changeSet.operations.comment")}
      onClose={onClose}
    />
  );
}

export function CreateChangeSetItemsDialog({
  open,
  changeSetName,
  onClose,
}: {
  open: boolean;
  changeSetName: string;
  onClose: () => void;
}) {
  const { t } = useAppTranslation();
  return (
    <ListDialogShell
      open={open}
      title={t("businessData.changeSet.operations.createItems")}
      hint={t("businessData.changeSet.operations.createItemsHint", { name: changeSetName })}
      submitLabel={t("common.create")}
      valueKey="items"
      namePlaceholderKey="businessData.changeSet.operations.itemName"
      extraPlaceholderKey="businessData.changeSet.operations.itemType"
      onClose={onClose}
    />
  );
}

export function ApproveChangeSetItemsDialog({
  open,
  changeSetName,
  onClose,
}: {
  open: boolean;
  changeSetName: string;
  onClose: () => void;
}) {
  const { t } = useAppTranslation();
  return (
    <ListDialogShell
      open={open}
      title={t("businessData.changeSet.operations.approveItems")}
      hint={t("businessData.changeSet.operations.approveItemsHint", { name: changeSetName })}
      submitLabel={t("businessData.changeSet.operations.approve")}
      valueKey="items"
      namePlaceholderKey="businessData.changeSet.operations.itemName"
      extraPlaceholderKey="businessData.changeSet.operations.approvalRole"
      commentLabel={t("businessData.changeSet.operations.comment")}
      onClose={onClose}
    />
  );
}

export function TransferChangeSetItemsDialog({
  open,
  changeSetName,
  onClose,
}: {
  open: boolean;
  changeSetName: string;
  onClose: () => void;
}) {
  const { t } = useAppTranslation();
  return (
    <ListDialogShell
      open={open}
      title={t("businessData.changeSet.operations.transferItems")}
      hint={t("businessData.changeSet.operations.transferItemsHint", { name: changeSetName })}
      submitLabel={t("businessData.changeSet.operations.transfer")}
      valueKey="items"
      namePlaceholderKey="businessData.changeSet.operations.itemName"
      extraPlaceholderKey="businessData.changeSet.operations.targetChangeSet"
      commentLabel={t("businessData.changeSet.operations.comment")}
      onClose={onClose}
    />
  );
}

export function ManageStateReviewersDialog({
  open,
  changeSetName,
  onClose,
}: {
  open: boolean;
  changeSetName: string;
  onClose: () => void;
}) {
  const { t } = useAppTranslation();
  return (
    <ListDialogShell
      open={open}
      title={t("businessData.changeSet.operations.manageStateReviewers")}
      hint={t("businessData.changeSet.operations.manageStateReviewersHint", {
        name: changeSetName,
      })}
      submitLabel={t("common.update")}
      valueKey="reviewers"
      namePlaceholderKey="businessData.changeSet.operations.reviewerName"
      extraPlaceholderKey="businessData.changeSet.operations.reviewerType"
      onClose={onClose}
    />
  );
}

export function ManageSubscribersDialog({
  open,
  changeSetName,
  onClose,
}: {
  open: boolean;
  changeSetName: string;
  onClose: () => void;
}) {
  const { t } = useAppTranslation();
  return (
    <ListDialogShell
      open={open}
      title={t("businessData.changeSet.operations.manageSubscribers")}
      hint={t("businessData.changeSet.operations.manageSubscribersHint", { name: changeSetName })}
      submitLabel={t("common.update")}
      valueKey="subscribers"
      namePlaceholderKey="businessData.changeSet.operations.subscriberName"
      extraPlaceholderKey="businessData.changeSet.operations.subscriberType"
      onClose={onClose}
    />
  );
}

export function CompareChangeSetItemsDialog({
  open,
  changeSetName,
  onClose,
}: {
  open: boolean;
  changeSetName: string;
  onClose: () => void;
}) {
  const { t } = useAppTranslation();
  return (
    <ListDialogShell
      open={open}
      title={t("businessData.changeSet.operations.compareItems")}
      hint={t("businessData.changeSet.operations.compareItemsHint", { name: changeSetName })}
      submitLabel={t("businessData.changeSet.operations.compare")}
      valueKey="items"
      namePlaceholderKey="businessData.changeSet.operations.itemName"
      extraPlaceholderKey="businessData.changeSet.operations.compareWith"
      onClose={onClose}
    />
  );
}

export function TakeOwnershipDialog({
  open,
  changeSetName,
  onClose,
}: {
  open: boolean;
  changeSetName: string;
  onClose: () => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [owner, setOwner] = useState("");
  const [comment, setComment] = useState("");
  return (
    <BaseDialog
      open={open}
      title={t("businessData.changeSet.operations.takeOwnership")}
      onClose={onClose}
      size="lg"
      footer={
        <DialogFooter
          onCancel={onClose}
          onConfirm={onClose}
          confirmLabel={t("businessData.changeSet.operations.takeOwnership")}
        />
      }
    >
      <div className={styles.hint}>
        {t("businessData.changeSet.operations.takeOwnershipHint", { name: changeSetName })}
      </div>
      <FormField
        label={
          <>
            <span className={styles.fieldLabel}>{t("businessData.changeSet.detail.owner")}</span>
          </>
        }
        labelWidth="170px"
      >
        <Input value={owner} onChange={setOwner} />
      </FormField>
      <FormField
        label={
          <>
            <span className={styles.fieldLabel}>
              {t("businessData.changeSet.operations.comment")}
            </span>
          </>
        }
        labelWidth="170px"
      >
        <Input value={comment} onChange={setComment} />
      </FormField>
    </BaseDialog>
  );
}

export function ChangeChangeSetDialog({
  open,
  changeSetName,
  currentOwner,
  onClose,
  onChange,
}: {
  open: boolean;
  changeSetName: string;
  currentOwner: string;
  onClose: () => void;
  onChange: (owner: string) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [owner, setOwner] = useState(currentOwner);
  const [comment, setComment] = useState("");
  return (
    <BaseDialog
      open={open}
      title={t("businessData.changeSet.operations.change")}
      onClose={onClose}
      size="lg"
      footer={
        <DialogFooter
          onCancel={onClose}
          onConfirm={() => {
            onChange(owner);
            onClose();
          }}
          confirmLabel={t("businessData.changeSet.operations.change")}
        />
      }
    >
      <div className={styles.hint}>
        {t("businessData.changeSet.operations.changeHint", { name: changeSetName })}
      </div>
      <FormField
        label={
          <>
            <span className={styles.fieldLabel}>{t("businessData.changeSet.detail.owner")}</span>
          </>
        }
        labelWidth="170px"
      >
        <Input value={owner} onChange={setOwner} />
      </FormField>
      <FormField
        label={
          <>
            <span className={styles.fieldLabel}>
              {t("businessData.changeSet.operations.comment")}
            </span>
          </>
        }
        labelWidth="170px"
      >
        <Input value={comment} onChange={setComment} />
      </FormField>
    </BaseDialog>
  );
}
