import { makeStyles } from "@/components/ui";

const useFieldStyles = makeStyles({
  field: {
    display: "grid",
    gap: "12px",
    alignItems: "center",
  },
  labelRight: { textAlign: "right" },
});

interface FormFieldProps {
  label: React.ReactNode;
  children: React.ReactNode;
  labelWidth?: string;
  labelAlign?: "left" | "right";
  className?: string;
  style?: React.CSSProperties;
}

export function FormField({
  label,
  children,
  labelWidth = "180px",
  labelAlign = "left",
  className,
  style,
}: FormFieldProps) {
  const styles = useFieldStyles();
  return (
    <div
      className={className ? `${styles.field} ${className}` : styles.field}
      style={{ gridTemplateColumns: `${labelWidth} 1fr`, ...style }}
    >
      <label className={labelAlign === "right" ? styles.labelRight : undefined}>{label}</label>
      {children}
    </div>
  );
}
