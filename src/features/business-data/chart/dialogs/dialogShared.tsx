import { BaseDialog } from "@/components/common";
import { Input, tokens } from "@/components/ui";

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
    <div className="num-field" style={{ display: "flex", flexDirection: "column", rowGap: "4px" }}>
      <span style={{ fontSize: "12px", color: tokens.colorNeutralForeground3 }}>{label}</span>
      <Input
        type="number"
        value={value === undefined ? "" : String(value)}
        onChange={(_, d) => onChange(d.value === "" ? undefined : Number(d.value))}
      />
    </div>
  );
}
