import { HStack } from "@/components/common";
import { theme } from "@/styles/theme";
import { useDialogStyles } from "./dialogShared";

export function WizardSteps({ steps, current }: { steps: string[]; current: number }) {
  const styles = useDialogStyles();
  return (
    <div className={styles.steps}>
      {steps.map((step, i) => (
        <HStack gap="8px" align="center" key={step}>
          {i > 0 && (
            <div
              style={{
                width: "24px",
                height: "1px",
                backgroundColor: theme.color.borderSubtle,
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
                color: i === current ? theme.color.textPrimary : theme.color.textTertiary,
              }}
            >
              {step}
            </span>
          </div>
        </HStack>
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
