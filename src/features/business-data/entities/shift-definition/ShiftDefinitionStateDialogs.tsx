import { Dismiss16Regular } from "@/components/icons";
import { Body1Strong, Button, Text, makeStyles, mergeClasses, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import { TERMINATE_DIALOG_CONFIG, UNTERMINATE_DIALOG_CONFIG } from "./shiftDefinitionDialogConfigs";

const useDialogStyles = makeStyles({
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    display: "grid",
    placeItems: "center",
    padding: "24px",
    boxSizing: "border-box",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  surface: {
    width: "min(480px, 100%)",
    maxHeight: "100%",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  body: { padding: "16px 20px", overflow: "auto", minHeight: 0 },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    columnGap: "8px",
    padding: "12px 20px",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
});

interface ConfirmDialogProps {
  name: string;
  onClose: () => void;
}

function ConfirmShell({
  titleKey,
  messageKey,
  confirmKey,
  name,
  onClose,
}: ConfirmDialogProps & {
  titleKey: TranslationKey;
  messageKey: TranslationKey;
  confirmKey: TranslationKey;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const sharedStyles = useSharedStyles();

  return (
    <div className={styles.overlay} role="dialog" aria-label={t(titleKey)}>
      <div className={mergeClasses(sharedStyles.contentCard, styles.surface)}>
        <div className={styles.header}>
          <Body1Strong>{t(titleKey)}</Body1Strong>
          <Button
            appearance="subtle"
            icon={<Dismiss16Regular />}
            onClick={onClose}
            aria-label={t("common.close")}
          />
        </div>
        <div className={styles.body}>
          <Text>{t(messageKey, { name })}</Text>
        </div>
        <div className={styles.footer}>
          <Button onClick={onClose}>{t("businessData.shiftDefinition.cancel")}</Button>
          <Button appearance="primary" onClick={onClose}>
            {t(confirmKey)}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ShiftDefinitionTerminateDialog({ name, onClose }: ConfirmDialogProps) {
  return <ConfirmShell {...TERMINATE_DIALOG_CONFIG} name={name} onClose={onClose} />;
}

export function ShiftDefinitionUnterminateDialog({ name, onClose }: ConfirmDialogProps) {
  return <ConfirmShell {...UNTERMINATE_DIALOG_CONFIG} name={name} onClose={onClose} />;
}
