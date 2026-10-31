import { BaseDialog } from "@/components/common";
import { useDialogStyles } from "./dialogStyles";

export function DialogShell({
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

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  const styles = useDialogStyles();
  return (
    <div className={styles.fieldRow}>
      <span className={styles.fieldLabel}>{label}</span>
      {children}
    </div>
  );
}
