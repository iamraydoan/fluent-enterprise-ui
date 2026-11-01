import { useState } from "react";
import type { ContainerPosition } from "@/api";
import { BaseDialog, Empty, HStack, VStack  } from "@/components/common";
import { ArrowDown16Regular, ArrowUp16Regular } from "@/components/icons";
import { Button, Input, Textarea, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { theme } from "@/styles/theme";

const useDialogStyles = makeStyles({
  hint: { fontSize: "13px", color: theme.color.textSecondary, marginBottom: "12px" },
  fieldRow: {
    marginBottom: "12px",
  },
  fieldLabel: { fontSize: "13px", fontWeight: theme.font.weightSemibold },
  flexRow: {
    marginBottom: "8px",
  },
  grow: { flex: "1 1 140px", minWidth: "120px" },
  posRow: {
    padding: "6px 0",
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
  },
  posNum: { minWidth: "48px", fontWeight: theme.font.weightSemibold, textAlign: "center" },
});

function DialogShell({
  open,
  title,
  onClose,
  wide,
  children,
  footer,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  wide?: boolean;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <BaseDialog
      open={open}
      title={title}
      onClose={onClose}
      size={wide ? "xl" : "md"}
      footer={footer}
    >
      {children}
    </BaseDialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  const styles = useDialogStyles();
  return (
    <VStack gap="4px" className={styles.fieldRow}>
      <span className={styles.fieldLabel}>{label}</span>
      {children}
    </VStack>
  );
}

export interface CloneContainerRow {
  id: number;
  name: string;
  revision: string;
  comment: string;
}

export function CloneContainerDialog({
  open,
  containerName,
  onClose,
  onClone,
}: {
  open: boolean;
  containerName: string;
  onClose: () => void;
  onClone: (rows: CloneContainerRow[]) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [rows, setRows] = useState<CloneContainerRow[]>([]);
  const addRow = () =>
    setRows([
      ...rows,
      { id: Date.now() + rows.length, name: `${containerName} - Clone`, revision: "", comment: "" },
    ]);
  const removeRow = (id: number) => setRows(rows.filter((r) => r.id !== id));
  const update = (id: number, patch: Partial<CloneContainerRow>) =>
    setRows(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  return (
    <DialogShell
      open={open}
      wide
      title={t("businessData.container.operations.cloneTitle")}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            variant="primary"
            disabled={rows.length === 0 || rows.some((r) => r.name.trim() === "")}
            onClick={() => onClone(rows)}
          >
            {t("businessData.container.operations.clone")}
          </Button>
        </>
      }
    >
      <div className={styles.hint}>
        {t("businessData.container.operations.cloneHint", { name: containerName })}
      </div>
      {rows.length === 0 && <Empty>{t("businessData.container.operations.noCloneRows")}</Empty>}
      {rows.map((row) => (
        <HStack gap="8px" align="center" wrap key={row.id} className={styles.flexRow}>
          <div className={styles.grow}>
            <Input
              placeholder={t("businessData.container.detail.name")}
              value={row.name}
              onChange={(value) => update(row.id, { name: value })}
            />
          </div>
          <div className={styles.grow}>
            <Input
              placeholder={t("businessData.container.operations.revision")}
              value={row.revision}
              onChange={(value) => update(row.id, { revision: value })}
            />
          </div>
          <div className={styles.grow}>
            <Input
              placeholder={t("businessData.container.operations.comment")}
              value={row.comment}
              onChange={(value) => update(row.id, { comment: value })}
            />
          </div>
          <Button variant="secondary" onClick={() => removeRow(row.id)}>
            {t("common.remove")}
          </Button>
        </HStack>
      ))}
      <Button variant="secondary" onClick={addRow}>
        {t("common.add")}
      </Button>
    </DialogShell>
  );
}

export function CommentConfirmDialog({
  open,
  titleKey,
  messageKey,
  messageParams,
  confirmLabelKey,
  onClose,
  onConfirm,
}: {
  open: boolean;
  titleKey: TranslationKey;
  messageKey: TranslationKey;
  messageParams?: Record<string, string>;
  confirmLabelKey: TranslationKey;
  onClose: () => void;
  onConfirm: (comment: string) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [comment, setComment] = useState("");
  return (
    <DialogShell
      open={open}
      title={t(titleKey)}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button variant="primary" onClick={() => onConfirm(comment)}>
            {t(confirmLabelKey)}
          </Button>
        </>
      }
    >
      <div className={styles.hint}>{t(messageKey, messageParams)}</div>
      <VStack gap="4px" className={styles.fieldRow}>
        <span className={styles.fieldLabel}>{t("businessData.container.operations.comment")}</span>
        <Textarea value={comment} onChange={setComment} />
      </VStack>
    </DialogShell>
  );
}

export function AddContainerToContainerDialog({
  open,
  containerName,
  onClose,
  onConfirm,
}: {
  open: boolean;
  containerName: string;
  onClose: () => void;
  onConfirm: (input: { mainContainer: string; position?: number; comment: string }) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [mainContainer, setMainContainer] = useState("");
  const [position, setPosition] = useState("");
  const [comment, setComment] = useState("");
  return (
    <DialogShell
      open={open}
      title={t("businessData.container.operations.addContainerTitle")}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            variant="primary"
            disabled={mainContainer.trim() === ""}
            onClick={() =>
              onConfirm({
                mainContainer,
                position: position === "" ? undefined : Number(position),
                comment,
              })
            }
          >
            {t("businessData.container.operations.add")}
          </Button>
        </>
      }
    >
      <div className={styles.hint}>
        {t("businessData.container.operations.addContainerHint", { name: containerName })}
      </div>
      <Field label={t("businessData.container.operations.mainContainer")}>
        <Input value={mainContainer} onChange={setMainContainer} />
      </Field>
      <Field label={t("businessData.container.operations.positionOptional")}>
        <Input type="number" value={position} onChange={setPosition} />
      </Field>
      <Field label={t("businessData.container.operations.comment")}>
        <Textarea value={comment} onChange={setComment} />
      </Field>
    </DialogShell>
  );
}

export function DockContainerDialog({
  open,
  containerName,
  onClose,
  onConfirm,
}: {
  open: boolean;
  containerName: string;
  onClose: () => void;
  onConfirm: (input: { resource: string; comment: string }) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [resource, setResource] = useState("");
  const [comment, setComment] = useState("");
  return (
    <DialogShell
      open={open}
      title={t("businessData.container.operations.dockTitle")}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            variant="primary"
            disabled={resource.trim() === ""}
            onClick={() => onConfirm({ resource, comment })}
          >
            {t("businessData.container.operations.dock")}
          </Button>
        </>
      }
    >
      <div className={styles.hint}>
        {t("businessData.container.operations.dockHint", { name: containerName })}
      </div>
      <Field label={t("businessData.container.operations.resource")}>
        <Input value={resource} onChange={setResource} />
      </Field>
      <Field label={t("businessData.container.operations.comment")}>
        <Textarea value={comment} onChange={setComment} />
      </Field>
    </DialogShell>
  );
}

export function ManagePositionsDialog({
  open,
  containerName,
  positions,
  onClose,
  onConfirm,
}: {
  open: boolean;
  containerName: string;
  positions: ContainerPosition[];
  onClose: () => void;
  onConfirm: (updates: { position: number; material: string }[], comment: string) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [rows, setRows] = useState(
    positions.map((p) => ({ position: p.position, material: p.material })),
  );
  const [comment, setComment] = useState("");

  const move = (idx: number, dir: -1 | 1) => {
    const next = [...rows];
    const j = idx + dir;
    if (j < 0 || j >= next.length) return;
    [next[idx], next[j]] = [next[j], next[idx]];
    setRows(next);
  };
  const updateMaterial = (idx: number, material: string) =>
    setRows(rows.map((r, i) => (i === idx ? { ...r, material } : r)));

  return (
    <DialogShell
      open={open}
      wide
      title={t("businessData.container.operations.managePositionsTitle")}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button variant="primary" onClick={() => onConfirm(rows, comment)}>
            {t("businessData.container.operations.update")}
          </Button>
        </>
      }
    >
      <div className={styles.hint}>
        {t("businessData.container.operations.managePositionsHint", { name: containerName })}
      </div>
      {rows.map((row, idx) => (
        <HStack gap="8px" align="center" key={row.position} className={styles.posRow}>
          <span className={styles.posNum}>{row.position}</span>
          <div style={{ flexGrow: 1 }}>
            <Input
              placeholder={t("businessData.container.operations.material")}
              value={row.material}
              onChange={(value) => updateMaterial(idx, value)}
            />
          </div>
          <Button variant="secondary" size="sm" disabled={idx === 0} onClick={() => move(idx, -1)}>
            <ArrowUp16Regular />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            disabled={idx === rows.length - 1}
            onClick={() => move(idx, 1)}
          >
            <ArrowDown16Regular />
          </Button>
        </HStack>
      ))}
      <VStack gap="4px" style={{ marginTop: "12px" }} className={styles.fieldRow}>
        <span className={styles.fieldLabel}>{t("businessData.container.operations.comment")}</span>
        <Textarea value={comment} onChange={setComment} />
      </VStack>
    </DialogShell>
  );
}

export function StoreContainerDialog({
  open,
  containerName,
  onClose,
  onConfirm,
}: {
  open: boolean;
  containerName: string;
  onClose: () => void;
  onConfirm: (input: { resource: string; position: string; comment: string }) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [resource, setResource] = useState("");
  const [position, setPosition] = useState("");
  const [comment, setComment] = useState("");
  return (
    <DialogShell
      open={open}
      title={t("businessData.container.operations.storeTitle")}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            variant="primary"
            disabled={resource.trim() === ""}
            onClick={() => onConfirm({ resource, position, comment })}
          >
            {t("businessData.container.operations.store")}
          </Button>
        </>
      }
    >
      <div className={styles.hint}>
        {t("businessData.container.operations.storeHint", { name: containerName })}
      </div>
      <Field label={t("businessData.container.operations.resource")}>
        <Input value={resource} onChange={setResource} />
      </Field>
      <Field label={t("businessData.container.operations.positionOptional")}>
        <Input value={position} onChange={setPosition} />
      </Field>
      <Field label={t("businessData.container.operations.comment")}>
        <Textarea value={comment} onChange={setComment} />
      </Field>
    </DialogShell>
  );
}

export function TransferContainerDialog({
  open,
  containerName,
  onClose,
  onConfirm,
}: {
  open: boolean;
  containerName: string;
  onClose: () => void;
  onConfirm: (input: { newContainer: string; position?: number; comment: string }) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [newContainer, setNewContainer] = useState("");
  const [position, setPosition] = useState("");
  const [comment, setComment] = useState("");
  return (
    <DialogShell
      open={open}
      title={t("businessData.container.operations.transferContainerTitle")}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            variant="primary"
            disabled={newContainer.trim() === ""}
            onClick={() =>
              onConfirm({
                newContainer,
                position: position === "" ? undefined : Number(position),
                comment,
              })
            }
          >
            {t("businessData.container.operations.transfer")}
          </Button>
        </>
      }
    >
      <div className={styles.hint}>
        {t("businessData.container.operations.transferContainerHint", { name: containerName })}
      </div>
      <Field label={t("businessData.container.operations.newContainer")}>
        <Input value={newContainer} onChange={setNewContainer} />
      </Field>
      <Field label={t("businessData.container.operations.positionOptional")}>
        <Input type="number" value={position} onChange={setPosition} />
      </Field>
      <Field label={t("businessData.container.operations.comment")}>
        <Textarea value={comment} onChange={setComment} />
      </Field>
    </DialogShell>
  );
}

export function TransferMaterialDialog({
  open,
  containerName,
  materials,
  onClose,
  onConfirm,
}: {
  open: boolean;
  containerName: string;
  materials: { position: number; material: string }[];
  onClose: () => void;
  onConfirm: (input: { newContainer: string; position?: number; comment: string }) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [newContainer, setNewContainer] = useState("");
  const [position, setPosition] = useState("");
  const [comment, setComment] = useState("");
  return (
    <DialogShell
      open={open}
      title={t("businessData.container.operations.transferMaterialTitle")}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            variant="primary"
            disabled={newContainer.trim() === ""}
            onClick={() =>
              onConfirm({
                newContainer,
                position: position === "" ? undefined : Number(position),
                comment,
              })
            }
          >
            {t("businessData.container.operations.transfer")}
          </Button>
        </>
      }
    >
      <div className={styles.hint}>
        {t("businessData.container.operations.transferMaterialHint", { name: containerName })}
      </div>
      <VStack gap="4px" className={styles.fieldRow}>
        <span className={styles.fieldLabel}>
          {t("businessData.container.operations.materials")}
        </span>
        <span style={{ fontSize: "13px", color: theme.color.textSecondary }}>
          {materials.length === 0
            ? t("businessData.container.operations.noMaterials")
            : materials.map((m) => m.material).join(", ")}
        </span>
      </VStack>
      <Field label={t("businessData.container.operations.newContainer")}>
        <Input value={newContainer} onChange={setNewContainer} />
      </Field>
      <Field label={t("businessData.container.operations.positionOptional")}>
        <Input type="number" value={position} onChange={setPosition} />
      </Field>
      <Field label={t("businessData.container.operations.comment")}>
        <Textarea value={comment} onChange={setComment} />
      </Field>
    </DialogShell>
  );
}
