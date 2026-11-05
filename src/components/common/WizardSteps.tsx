import { Body1Strong, Text, makeStyles, mergeClasses } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { tileSurface } from "@/styles/shared";
import { theme } from "@/styles/theme";

const useWizardStepsStyles = makeStyles({
  root: { display: "flex", alignItems: "center", columnGap: "8px", marginBottom: "12px" },
  step: { display: "flex", alignItems: "center", columnGap: "8px" },
  connector: { width: "24px", height: "1px", backgroundColor: theme.color.borderSubtle },
  circle: {
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    color: theme.color.textOnBrand,
    flexShrink: 0,
  },
  circleActive: { backgroundColor: theme.color.brand },
  circleTodo: { backgroundColor: theme.color.borderSubtle },
  band: {
    display: "flex",
    alignItems: "center",
    columnGap: "12px",
    padding: "10px 24px",
    ...tileSurface,
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
    flexShrink: 0,
  },
  bandStep: { display: "flex", alignItems: "center", columnGap: "8px" },
  bandConnector: { width: "48px", height: "1px", backgroundColor: theme.color.borderSubtle },
  bandCircle: {
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: theme.font.weightSemibold,
    flexShrink: 0,
  },
  bandCircleActive: {
    backgroundColor: theme.color.textPrimary,
    color: theme.color.surface,
  },
  bandCircleTodo: {
    backgroundColor: "transparent",
    color: theme.color.textTertiary,
    border: `1px solid ${theme.color.borderSubtle}`,
  },
  bandLabelActive: {
    fontSize: "12px",
    fontWeight: theme.font.weightSemibold,
    textTransform: "uppercase",
    letterSpacing: "0.4px",
    color: theme.color.textPrimary,
  },
  bandLabelTodo: {
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.4px",
    color: theme.color.textTertiary,
  },
});

interface WizardStepsProps {
  steps: string[];
  current: number;
  variant?: "inline" | "band";
}

export function WizardSteps({ steps, current, variant = "inline" }: WizardStepsProps) {
  const styles = useWizardStepsStyles();
  const { t } = useAppTranslation();

  if (variant === "band") {
    return (
      <div className={styles.band} role="list" aria-label={t("common.wizardSteps")}>
        {steps.map((label, i) => {
          const stepNumber = i + 1;
          const isActive = stepNumber === current;
          const isDone = stepNumber < current;
          return (
            <span key={label} className={styles.bandStep} role="listitem">
              {i > 0 && <span className={styles.bandConnector} aria-hidden="true" />}
              <span
                className={mergeClasses(
                  styles.bandCircle,
                  isActive || isDone ? styles.bandCircleActive : styles.bandCircleTodo,
                )}
                aria-current={isActive ? "step" : undefined}
              >
                {stepNumber}
              </span>
              <Text className={isActive ? styles.bandLabelActive : styles.bandLabelTodo}>
                {label}
              </Text>
            </span>
          );
        })}
      </div>
    );
  }

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
