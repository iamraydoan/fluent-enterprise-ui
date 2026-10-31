import { BaseDialog, DialogFooter } from "@/components/common";
import { Text } from "@/components/ui";

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
  return (
    <BaseDialog
      open={open}
      title={title}
      onClose={onClose}
      size="md"
      footer={<DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={confirmLabel} />}
    >
      <Text>{message}</Text>
    </BaseDialog>
  );
}
