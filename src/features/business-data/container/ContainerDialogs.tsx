import { useState } from "react";
import type { ContainerPosition } from "@/api";
import { BaseDialog } from "@/components/common";
import { ArrowDown16Regular, ArrowUp16Regular } from "@/components/icons";
import { Button, Input, Textarea, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";

const useDialogStyles = makeStyles({
  hint: { fontSize: "13px", color: tokens.colorNeutralForeground2, marginBottom: "12px" },
  fieldRow: { display: "flex", flexDirection: "column", rowGap: "4px", marginBottom: "12px" },
  fieldLabel: { fontSize: "13px", fontWeight: tokens.fontWeightSemibold },
  empty: { padding: "16px", textAlign: "center", color: tokens.colorNeutralForeground3 },
  flexRow: {
    display: "flex",
    flexWrap: "wrap",
    columnGap: "8px",
    rowGap: "8px",
    alignItems: "center",
    marginBottom: "8px",
  },
  grow: { flex: "1 1 140px", minWidth: "120px" },
  posRow: {
    display: "flex",
    alignItems: "center",
    columnGap: "8px",
    padding: "6px 0",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  posNum: { minWidth: "48px", fontWeight: tokens.fontWeightSemibold, textAlign: "center" },
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
    <div className={styles.fieldRow}>
      <span className={styles.fieldLabel}>{label}</span>
      {children}
    </div>
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
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            appearance="primary"
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
      {rows.length === 0 && (
        <div className={styles.empty}>{t("businessData.container.operations.noCloneRows")}</div>
      )}
      {rows.map((row) => (
        <div key={row.id} className={styles.flexRow}>
          <div className={styles.grow}>
            <Input
              placeholder={t("businessData.container.detail.name")}
              value={row.name}
              onChange={(_, d) => update(row.id, { name: d.value })}
            />
          </div>
          <div className={styles.grow}>
            <Input
              placeholder={t("businessData.container.operations.revision")}
              value={row.revision}
              onChange={(_, d) => update(row.id, { revision: d.value })}
            />
          </div>
          <div className={styles.grow}>
            <Input
              placeholder={t("businessData.container.operations.comment")}
              value={row.comment}
              onChange={(_, d) => update(row.id, { comment: d.value })}
            />
          </div>
          <Button appearance="secondary" onClick={() => removeRow(row.id)}>
            {t("common.remove")}
          </Button>
        </div>
      ))}
      <Button appearance="secondary" onClick={addRow}>
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
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button appearance="primary" onClick={() => onConfirm(comment)}>
            {t(confirmLabelKey)}
          </Button>
        </>
      }
    >
      <div className={styles.hint}>{t(messageKey, messageParams)}</div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>{t("businessData.container.operations.comment")}</span>
        <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />
      </div>
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
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            appearance="primary"
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
        <Input value={mainContainer} onChange={(_, d) => setMainContainer(d.value)} />
      </Field>
      <Field label={t("businessData.container.operations.positionOptional")}>
        <Input type="number" value={position} onChange={(_, d) => setPosition(d.value)} />
      </Field>
      <Field label={t("businessData.container.operations.comment")}>
        <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />
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
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            appearance="primary"
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
        <Input value={resource} onChange={(_, d) => setResource(d.value)} />
      </Field>
      <Field label={t("businessData.container.operations.comment")}>
        <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />
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
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button appearance="primary" onClick={() => onConfirm(rows, comment)}>
            {t("businessData.container.operations.update")}
          </Button>
        </>
      }
    >
      <div className={styles.hint}>
        {t("businessData.container.operations.managePositionsHint", { name: containerName })}
      </div>
      {rows.map((row, idx) => (
        <div key={row.position} className={styles.posRow}>
          <span className={styles.posNum}>{row.position}</span>
          <div style={{ flexGrow: 1 }}>
            <Input
              placeholder={t("businessData.container.operations.material")}
              value={row.material}
              onChange={(_, d) => updateMaterial(idx, d.value)}
            />
          </div>
          <Button
            appearance="secondary"
            size="small"
            disabled={idx === 0}
            onClick={() => move(idx, -1)}
          >
            <ArrowUp16Regular />
          </Button>
          <Button
            appearance="secondary"
            size="small"
            disabled={idx === rows.length - 1}
            onClick={() => move(idx, 1)}
          >
            <ArrowDown16Regular />
          </Button>
        </div>
      ))}
      <div className={styles.fieldRow} style={{ marginTop: "12px" }}>
        <span className={styles.fieldLabel}>{t("businessData.container.operations.comment")}</span>
        <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />
      </div>
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
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            appearance="primary"
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
        <Input value={resource} onChange={(_, d) => setResource(d.value)} />
      </Field>
      <Field label={t("businessData.container.operations.positionOptional")}>
        <Input value={position} onChange={(_, d) => setPosition(d.value)} />
      </Field>
      <Field label={t("businessData.container.operations.comment")}>
        <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />
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
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            appearance="primary"
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
        <Input value={newContainer} onChange={(_, d) => setNewContainer(d.value)} />
      </Field>
      <Field label={t("businessData.container.operations.positionOptional")}>
        <Input type="number" value={position} onChange={(_, d) => setPosition(d.value)} />
      </Field>
      <Field label={t("businessData.container.operations.comment")}>
        <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />
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
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            appearance="primary"
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
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>
          {t("businessData.container.operations.materials")}
        </span>
        <span style={{ fontSize: "13px", color: tokens.colorNeutralForeground2 }}>
          {materials.length === 0
            ? t("businessData.container.operations.noMaterials")
            : materials.map((m) => m.material).join(", ")}
        </span>
      </div>
      <Field label={t("businessData.container.operations.newContainer")}>
        <Input value={newContainer} onChange={(_, d) => setNewContainer(d.value)} />
      </Field>
      <Field label={t("businessData.container.operations.positionOptional")}>
        <Input type="number" value={position} onChange={(_, d) => setPosition(d.value)} />
      </Field>
      <Field label={t("businessData.container.operations.comment")}>
        <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />
      </Field>
    </DialogShell>
  );
}
