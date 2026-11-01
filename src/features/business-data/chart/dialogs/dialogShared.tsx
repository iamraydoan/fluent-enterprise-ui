import { BaseDialog } from "@/components/common";
import { Input} from "@/components/ui";
import { theme } from "@/styles/theme";

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

export function NumField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | undefined;
  onChange: (v: number | undefined) => void;
}) {
  return (
    <div className="num-field" style={{ display: "flex", flexDirection: "column", rowGap: theme.spacing.xs }}>
      <span style={{ fontSize: "12px", color: theme.color.textTertiary }}>{label}</span>
      <Input
        type="number"
        value={value === undefined ? "" : String(value)}
        onChange={(value) => onChange(value === "" ? undefined : Number(value))}
      />
    </div>
  );
}
