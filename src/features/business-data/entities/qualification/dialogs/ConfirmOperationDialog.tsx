import {
  Text,
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";

interface ConfirmOperationDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmLabel: string;
}

export function ConfirmOperationDialog({
  open,
  onClose,
  title,
  message,
  confirmLabel,
}: ConfirmOperationDialogProps) {
  const { t } = useAppTranslation();
  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface style={{ maxWidth: 560 }}>
        <DialogBody>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            <Text>{message}</Text>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button appearance="primary" onClick={onClose}>
              {confirmLabel}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
