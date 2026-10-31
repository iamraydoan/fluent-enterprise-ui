import { useState } from "react";
import { BaseDialog, DialogFooter } from "@/components/common";
import { Field, Input } from "@/components/ui";
import { useAppTranslation } from "@/i18n";

interface ContainerDialogProps {
  open: boolean;
  onClose: () => void;
  resourceName: string;
}

export function AddResourceToContainerDialog({
  open,
  onClose,
  resourceName,
}: ContainerDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.resource.dialogs.container";
  const [container, setContainer] = useState("");
  const [position, setPosition] = useState("");
  const [comment, setComment] = useState("");

  return (
    <BaseDialog
      open={open}
      title={t(`${k}.addTitle`)}
      onClose={onClose}
      width="min(800px, 88vw)"
      footer={<DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={t(`${k}.add`)} />}
    >
      <div style={{ marginBottom: 12, color: "#0078d4" }}>🔧 {resourceName}</div>
      <div style={{ display: "flex", flexDirection: "column", rowGap: 12 }}>
        <Field label={t(`${k}.container`)} required>
          <Input value={container} onChange={(_, d) => setContainer(d.value)} />
        </Field>
        <Field label={t(`${k}.position`)}>
          <Input value={position} onChange={(_, d) => setPosition(d.value)} />
        </Field>
        <Field label={t(`${k}.comment`)}>
          <Input value={comment} onChange={(_, d) => setComment(d.value)} />
        </Field>
      </div>
    </BaseDialog>
  );
}

export function RemoveResourceFromContainerDialog({
  open,
  onClose,
  resourceName,
}: ContainerDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.resource.dialogs.container";
  const [comment, setComment] = useState("");

  return (
    <BaseDialog
      open={open}
      title={t(`${k}.removeTitle`)}
      onClose={onClose}
      width="min(700px, 85vw)"
      footer={
        <DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={t(`${k}.remove`)} />
      }
    >
      <div style={{ padding: "12px 0" }}>{t(`${k}.removeMessage`, { name: resourceName })}</div>
      <Field label={t(`${k}.comment`)}>
        <Input value={comment} onChange={(_, d) => setComment(d.value)} />
      </Field>
    </BaseDialog>
  );
}

export function TransferResourceBetweenContainersDialog({
  open,
  onClose,
  resourceName,
}: ContainerDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.resource.dialogs.container";
  const [sourceContainer, setSourceContainer] = useState("");
  const [targetContainer, setTargetContainer] = useState("");
  const [position, setPosition] = useState("");
  const [comment, setComment] = useState("");

  return (
    <BaseDialog
      open={open}
      title={t(`${k}.transferTitle`)}
      onClose={onClose}
      width="min(800px, 88vw)"
      footer={
        <DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={t(`${k}.transfer`)} />
      }
    >
      <div style={{ marginBottom: 12, color: "#0078d4" }}>🔧 {resourceName}</div>
      <div style={{ display: "flex", flexDirection: "column", rowGap: 12 }}>
        <Field label={t(`${k}.sourceContainer`)} required>
          <Input value={sourceContainer} onChange={(_, d) => setSourceContainer(d.value)} />
        </Field>
        <Field label={t(`${k}.targetContainer`)} required>
          <Input value={targetContainer} onChange={(_, d) => setTargetContainer(d.value)} />
        </Field>
        <Field label={t(`${k}.position`)}>
          <Input value={position} onChange={(_, d) => setPosition(d.value)} />
        </Field>
        <Field label={t(`${k}.comment`)}>
          <Input value={comment} onChange={(_, d) => setComment(d.value)} />
        </Field>
      </div>
    </BaseDialog>
  );
}

export function StoreContainersInResourceDialog({
  open,
  onClose,
  resourceName,
}: ContainerDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.resource.dialogs.store";
  const [container, setContainer] = useState("");
  const [comment, setComment] = useState("");

  return (
    <BaseDialog
      open={open}
      title={t(`${k}.containersTitle`)}
      onClose={onClose}
      width="min(800px, 88vw)"
      footer={
        <DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={t(`${k}.store`)} />
      }
    >
      <div style={{ marginBottom: 12, color: "#0078d4" }}>🔧 {resourceName}</div>
      <Field label={t(`${k}.container`)} required>
        <Input value={container} onChange={(_, d) => setContainer(d.value)} />
      </Field>
      <Field label={t(`${k}.comment`)}>
        <Input value={comment} onChange={(_, d) => setComment(d.value)} />
      </Field>
    </BaseDialog>
  );
}

export function StoreMaterialsInResourceDialog({
  open,
  onClose,
  resourceName,
}: ContainerDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.resource.dialogs.store";
  const [material, setMaterial] = useState("");
  const [comment, setComment] = useState("");

  return (
    <BaseDialog
      open={open}
      title={t(`${k}.materialsTitle`)}
      onClose={onClose}
      width="min(800px, 88vw)"
      footer={
        <DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={t(`${k}.store`)} />
      }
    >
      <div style={{ marginBottom: 12, color: "#0078d4" }}>🔧 {resourceName}</div>
      <Field label={t(`${k}.material`)} required>
        <Input value={material} onChange={(_, d) => setMaterial(d.value)} />
      </Field>
      <Field label={t(`${k}.comment`)}>
        <Input value={comment} onChange={(_, d) => setComment(d.value)} />
      </Field>
    </BaseDialog>
  );
}

export function StoreResourceDialog({ open, onClose, resourceName }: ContainerDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.resource.dialogs.store";
  const [storageResource, setStorageResource] = useState("");
  const [comment, setComment] = useState("");

  return (
    <BaseDialog
      open={open}
      title={t(`${k}.resourceTitle`)}
      onClose={onClose}
      width="min(800px, 88vw)"
      footer={
        <DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={t(`${k}.store`)} />
      }
    >
      <div style={{ marginBottom: 12, color: "#0078d4" }}>🔧 {resourceName}</div>
      <Field label={t(`${k}.storageResource`)} required>
        <Input value={storageResource} onChange={(_, d) => setStorageResource(d.value)} />
      </Field>
      <Field label={t(`${k}.comment`)}>
        <Input value={comment} onChange={(_, d) => setComment(d.value)} />
      </Field>
    </BaseDialog>
  );
}

export function RetrieveResourceDialog({ open, onClose, resourceName }: ContainerDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.resource.dialogs.store";
  const [comment, setComment] = useState("");

  return (
    <BaseDialog
      open={open}
      title={t(`${k}.retrieveTitle`)}
      onClose={onClose}
      width="min(700px, 85vw)"
      footer={
        <DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={t(`${k}.retrieve`)} />
      }
    >
      <div style={{ padding: "12px 0" }}>{t(`${k}.retrieveMessage`, { name: resourceName })}</div>
      <Field label={t(`${k}.comment`)}>
        <Input value={comment} onChange={(_, d) => setComment(d.value)} />
      </Field>
    </BaseDialog>
  );
}
