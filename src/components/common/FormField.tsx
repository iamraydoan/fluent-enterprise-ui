import { makeStyles } from "@/components/ui";

const useFieldStyles = makeStyles({
  field: {
    display: "grid",
    gap: "12px",
    alignItems: "center",
  },
});

interface FormFieldProps {
  label: React.ReactNode;
  children: React.ReactNode;
  labelWidth?: string;
}

export function FormField({ label, children, labelWidth = "180px" }: FormFieldProps) {
  const styles = useFieldStyles();
  return (
    <div className={styles.field} style={{ gridTemplateColumns: `${labelWidth} 1fr` }}>
      <label>{label}</label>
      {children}
    </div>
  );
}
