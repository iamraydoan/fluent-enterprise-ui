import { useState } from "react";
import { Dismiss16Regular } from "@/components/icons";
import { Button, Input, Text, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { cardSurface } from "@/styles/shared";
import type { OperationValues } from "../components/operationTypes";

interface SimpleRow {
  id: number;
  name: string;
  extra: string;
}

const useDialogStyles = makeStyles({
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    display: "grid",
    placeItems: "center",
    padding: "24px",
    boxSizing: "border-box",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  surface: {
    width: "min(680px, calc(100vw - 48px))",
    maxHeight: "min(640px, calc(100vh - 48px))",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    ...cardSurface,
  },
  head: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: "52px",
    padding: "0 16px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    flexShrink: 0,
  },
  closeButton: {
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    padding: "6px",
    borderRadius: tokens.borderRadiusMedium,
    display: "flex",
    ":hover": { backgroundColor: tokens.colorNeutralBackground1Hover },
  },
  body: { flexGrow: 1, minHeight: 0, overflowY: "auto", padding: "16px 24px" },
  foot: {
    display: "flex",
    justifyContent: "flex-end",
    columnGap: "8px",
    padding: "12px 24px",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  fieldRow: {
    display: "grid",
    gridTemplateColumns: "170px minmax(0, 1fr)",
    alignItems: "center",
    columnGap: "12px",
    marginBottom: "12px",
  },
  fieldLabel: { fontSize: "13px", color: tokens.colorNeutralForeground2, textAlign: "right" },
  hint: { fontSize: "13px", color: tokens.colorNeutralForeground2, marginBottom: "16px" },
  row: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr) auto",
    columnGap: "8px",
    alignItems: "center",
    marginBottom: "8px",
  },
  empty: { padding: "16px", textAlign: "center", color: tokens.colorNeutralForeground3 },
});

function NameListEditor({
  values,
  onChange,
  valueKey,
  namePlaceholderKey,
  extraPlaceholderKey,
}: {
  values: OperationValues;
  onChange: (key: string, value: string | number | boolean) => void;
  valueKey: string;
  namePlaceholderKey: TranslationKey;
  extraPlaceholderKey: TranslationKey;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const rows = (values[valueKey] as unknown as SimpleRow[] | undefined) ?? [];
  const setRows = (next: SimpleRow[]) => onChange(valueKey, next as unknown as boolean);
  const addRow = () => setRows([...rows, { id: Date.now() + rows.length, name: "", extra: "" }]);
  const removeRow = (id: number) => setRows(rows.filter((r) => r.id !== id));
  const updateRow = (id: number, patch: Partial<SimpleRow>) =>
    setRows(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  return (
    <div>
      {rows.length === 0 && (
        <div className={styles.empty}>{t("businessData.changeSet.operations.noEntries")}</div>
      )}
      {rows.map((row) => (
        <div key={row.id} className={styles.row}>
          <Input
            placeholder={t(namePlaceholderKey)}
            value={row.name}
            onChange={(_, data) => updateRow(row.id, { name: data.value })}
          />
          <Input
            placeholder={t(extraPlaceholderKey)}
            value={row.extra}
            onChange={(_, data) => updateRow(row.id, { extra: data.value })}
          />
          <Button appearance="secondary" onClick={() => removeRow(row.id)}>
            {t("common.remove")}
          </Button>
        </div>
      ))}
      <Button appearance="secondary" onClick={addRow}>
        {t("common.add")}
      </Button>
    </div>
  );
}

function ListDialogShell({
  title,
  hint,
  submitLabel,
  valueKey,
  namePlaceholderKey,
  extraPlaceholderKey,
  commentLabel,
  onClose,
}: {
  title: string;
  hint: string;
  submitLabel: string;
  valueKey: string;
  namePlaceholderKey: TranslationKey;
  extraPlaceholderKey: TranslationKey;
  commentLabel?: string;
  onClose: () => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [values, setValues] = useState<OperationValues>({});
  const [comment, setComment] = useState("");

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.surface} onClick={(event) => event.stopPropagation()}>
        <div className={styles.head}>
          <Text weight="semibold">{title}</Text>
          <button className={styles.closeButton} onClick={onClose} aria-label={t("common.close")}>
            <Dismiss16Regular />
          </button>
        </div>
        <div className={styles.body}>
          <div className={styles.hint}>{hint}</div>
          <NameListEditor
            values={values}
            onChange={(key, value) => setValues((prev) => ({ ...prev, [key]: value }))}
            valueKey={valueKey}
            namePlaceholderKey={namePlaceholderKey}
            extraPlaceholderKey={extraPlaceholderKey}
          />
          {commentLabel && (
            <div className={styles.fieldRow} style={{ marginTop: "16px" }}>
              <span className={styles.fieldLabel}>{commentLabel}</span>
              <Input value={comment} onChange={(_, data) => setComment(data.value)} />
            </div>
          )}
        </div>
        <div className={styles.foot}>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button appearance="primary" onClick={onClose}>
            {submitLabel}
          </Button>
        </div>
      </div>
    </div>
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
  if (!open) return null;
  return (
    <ListDialogShell
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
  if (!open) return null;
  return (
    <ListDialogShell
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
  if (!open) return null;
  return (
    <ListDialogShell
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
  if (!open) return null;
  return (
    <ListDialogShell
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
  if (!open) return null;
  return (
    <ListDialogShell
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
  if (!open) return null;
  return (
    <ListDialogShell
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
  if (!open) return null;
  return (
    <ListDialogShell
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
  if (!open) return null;
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.surface} onClick={(e) => e.stopPropagation()}>
        <div className={styles.head}>
          <Text weight="semibold">{t("businessData.changeSet.operations.takeOwnership")}</Text>
          <button className={styles.closeButton} onClick={onClose} aria-label={t("common.close")}>
            <Dismiss16Regular />
          </button>
        </div>
        <div className={styles.body}>
          <div className={styles.hint}>
            {t("businessData.changeSet.operations.takeOwnershipHint", { name: changeSetName })}
          </div>
          <div className={styles.fieldRow}>
            <span className={styles.fieldLabel}>{t("businessData.changeSet.detail.owner")}</span>
            <Input value={owner} onChange={(_, d) => setOwner(d.value)} />
          </div>
          <div className={styles.fieldRow}>
            <span className={styles.fieldLabel}>
              {t("businessData.changeSet.operations.comment")}
            </span>
            <Input value={comment} onChange={(_, d) => setComment(d.value)} />
          </div>
        </div>
        <div className={styles.foot}>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button appearance="primary" onClick={onClose}>
            {t("businessData.changeSet.operations.takeOwnership")}
          </Button>
        </div>
      </div>
    </div>
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
  if (!open) return null;
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.surface} onClick={(e) => e.stopPropagation()}>
        <div className={styles.head}>
          <Text weight="semibold">{t("businessData.changeSet.operations.change")}</Text>
          <button className={styles.closeButton} onClick={onClose} aria-label={t("common.close")}>
            <Dismiss16Regular />
          </button>
        </div>
        <div className={styles.body}>
          <div className={styles.hint}>
            {t("businessData.changeSet.operations.changeHint", { name: changeSetName })}
          </div>
          <div className={styles.fieldRow}>
            <span className={styles.fieldLabel}>{t("businessData.changeSet.detail.owner")}</span>
            <Input value={owner} onChange={(_, d) => setOwner(d.value)} />
          </div>
          <div className={styles.fieldRow}>
            <span className={styles.fieldLabel}>
              {t("businessData.changeSet.operations.comment")}
            </span>
            <Input value={comment} onChange={(_, d) => setComment(d.value)} />
          </div>
        </div>
        <div className={styles.foot}>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            appearance="primary"
            onClick={() => {
              onChange(owner);
              onClose();
            }}
          >
            {t("businessData.changeSet.operations.change")}
          </Button>
        </div>
      </div>
    </div>
  );
}
