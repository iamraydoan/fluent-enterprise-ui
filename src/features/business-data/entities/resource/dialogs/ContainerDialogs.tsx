import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Field,
  Input,
} from "@/components/ui";
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
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface style={{ maxWidth: 800, width: "88vw" }}>
        <DialogBody>
          <DialogTitle>{t(`${k}.addTitle`)}</DialogTitle>
          <DialogContent>
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
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button appearance="primary" onClick={onClose}>
              {t(`${k}.add`)}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
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
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface style={{ maxWidth: 700, width: "85vw" }}>
        <DialogBody>
          <DialogTitle>{t(`${k}.removeTitle`)}</DialogTitle>
          <DialogContent>
            <div style={{ padding: "12px 0" }}>
              {t(`${k}.removeMessage`, { name: resourceName })}
            </div>
            <Field label={t(`${k}.comment`)}>
              <Input value={comment} onChange={(_, d) => setComment(d.value)} />
            </Field>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button appearance="primary" onClick={onClose}>
              {t(`${k}.remove`)}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
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
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface style={{ maxWidth: 800, width: "88vw" }}>
        <DialogBody>
          <DialogTitle>{t(`${k}.transferTitle`)}</DialogTitle>
          <DialogContent>
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
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button appearance="primary" onClick={onClose}>
              {t(`${k}.transfer`)}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
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
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface style={{ maxWidth: 800, width: "88vw" }}>
        <DialogBody>
          <DialogTitle>{t(`${k}.containersTitle`)}</DialogTitle>
          <DialogContent>
            <div style={{ marginBottom: 12, color: "#0078d4" }}>🔧 {resourceName}</div>
            <Field label={t(`${k}.container`)} required>
              <Input value={container} onChange={(_, d) => setContainer(d.value)} />
            </Field>
            <Field label={t(`${k}.comment`)}>
              <Input value={comment} onChange={(_, d) => setComment(d.value)} />
            </Field>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button appearance="primary" onClick={onClose}>
              {t(`${k}.store`)}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
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
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface style={{ maxWidth: 800, width: "88vw" }}>
        <DialogBody>
          <DialogTitle>{t(`${k}.materialsTitle`)}</DialogTitle>
          <DialogContent>
            <div style={{ marginBottom: 12, color: "#0078d4" }}>🔧 {resourceName}</div>
            <Field label={t(`${k}.material`)} required>
              <Input value={material} onChange={(_, d) => setMaterial(d.value)} />
            </Field>
            <Field label={t(`${k}.comment`)}>
              <Input value={comment} onChange={(_, d) => setComment(d.value)} />
            </Field>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button appearance="primary" onClick={onClose}>
              {t(`${k}.store`)}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}

export function StoreResourceDialog({ open, onClose, resourceName }: ContainerDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.resource.dialogs.store";
  const [storageResource, setStorageResource] = useState("");
  const [comment, setComment] = useState("");

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface style={{ maxWidth: 800, width: "88vw" }}>
        <DialogBody>
          <DialogTitle>{t(`${k}.resourceTitle`)}</DialogTitle>
          <DialogContent>
            <div style={{ marginBottom: 12, color: "#0078d4" }}>🔧 {resourceName}</div>
            <Field label={t(`${k}.storageResource`)} required>
              <Input value={storageResource} onChange={(_, d) => setStorageResource(d.value)} />
            </Field>
            <Field label={t(`${k}.comment`)}>
              <Input value={comment} onChange={(_, d) => setComment(d.value)} />
            </Field>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button appearance="primary" onClick={onClose}>
              {t(`${k}.store`)}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}

export function RetrieveResourceDialog({ open, onClose, resourceName }: ContainerDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.resource.dialogs.store";
  const [comment, setComment] = useState("");

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface style={{ maxWidth: 700, width: "85vw" }}>
        <DialogBody>
          <DialogTitle>{t(`${k}.retrieveTitle`)}</DialogTitle>
          <DialogContent>
            <div style={{ padding: "12px 0" }}>
              {t(`${k}.retrieveMessage`, { name: resourceName })}
            </div>
            <Field label={t(`${k}.comment`)}>
              <Input value={comment} onChange={(_, d) => setComment(d.value)} />
            </Field>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button appearance="primary" onClick={onClose}>
              {t(`${k}.retrieve`)}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
