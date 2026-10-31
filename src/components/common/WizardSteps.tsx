import { Body1Strong, makeStyles, mergeClasses, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";

const useWizardStepsStyles = makeStyles({
  root: { display: "flex", alignItems: "center", columnGap: "8px", marginBottom: "12px" },
  step: { display: "flex", alignItems: "center", columnGap: "8px" },
  connector: { width: "24px", height: "1px", backgroundColor: tokens.colorNeutralStroke2 },
  circle: {
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    color: tokens.colorNeutralForegroundOnBrand,
    flexShrink: 0,
  },
  circleActive: { backgroundColor: tokens.colorBrandBackground },
  circleTodo: { backgroundColor: tokens.colorNeutralStroke2 },
});

interface WizardStepsProps {
  steps: string[];
  current: number;
}

export function WizardSteps({ steps, current }: WizardStepsProps) {
  const styles = useWizardStepsStyles();
  const { t } = useAppTranslation();
  return (
    <div className={styles.root} role="list" aria-label={t("common.wizardSteps")}>
      {steps.map((label, i) => {
        const stepNumber = i + 1;
        const isActive = stepNumber === current;
        return (
          <span key={label} className={styles.step} role="listitem">
            {i > 0 && <span className={styles.connector} aria-hidden="true" />}
            <span
              className={mergeClasses(
                styles.circle,
                isActive ? styles.circleActive : styles.circleTodo,
              )}
              aria-current={isActive ? "step" : undefined}
            >
              {stepNumber}
            </span>
            <Body1Strong>{label}</Body1Strong>
          </span>
        );
      })}
    </div>
  );
}
