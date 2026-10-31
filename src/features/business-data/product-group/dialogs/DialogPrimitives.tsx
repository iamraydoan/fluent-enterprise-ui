import { tokens } from "@/components/ui";
import { useDialogStyles } from "./dialogShared";

export function WizardSteps({ steps, current }: { steps: string[]; current: number }) {
  const styles = useDialogStyles();
  return (
    <div className={styles.steps}>
      {steps.map((step, i) => (
        <div key={step} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {i > 0 && (
            <div
              style={{
                width: "24px",
                height: "1px",
                backgroundColor: tokens.colorNeutralStroke2,
              }}
            />
          )}
          <div className={styles.step}>
            <span
              className={`${styles.stepNumber} ${
                i === current ? styles.stepActive : i < current ? styles.stepDone : ""
              }`}
            >
              {i + 1}
            </span>
            <span
              style={{
                color:
                  i === current ? tokens.colorNeutralForeground1 : tokens.colorNeutralForeground3,
              }}
            >
              {step}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  const styles = useDialogStyles();
  return (
    <div className={styles.field}>
      <label className={styles.label}>
        {required && <span className={styles.required}>*</span>}
        {label}
      </label>
      {children}
      {hint && <div className={styles.hint}>{hint}</div>}
    </div>
  );
}
