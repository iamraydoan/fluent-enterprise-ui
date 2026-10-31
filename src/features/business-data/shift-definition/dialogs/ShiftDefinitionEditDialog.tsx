import { useState } from "react";
import type { ShiftDefinitionDetail } from "@/api";
import { Dismiss16Regular } from "@/components/icons";
import {
  Body1Strong,
  Button,
  Input,
  Text,
  makeStyles,
  mergeClasses,
  tokens,
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";

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
    width: "min(640px, 100%)",
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
  fieldRow: {
    display: "grid",
    gridTemplateColumns: "180px 1fr",
    alignItems: "center",
    columnGap: "12px",
    marginBottom: "12px",
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    columnGap: "8px",
    padding: "12px 20px",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
});

interface ShiftDefinitionEditDialogProps {
  data: ShiftDefinitionDetail;
  onClose: () => void;
}

export function ShiftDefinitionEditDialog({ data, onClose }: ShiftDefinitionEditDialogProps) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const sharedStyles = useSharedStyles();
  const [description, setDescription] = useState(data.description);
  const [calendar, setCalendar] = useState(data.calendar);

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-label={t("businessData.shiftDefinition.edit.title")}
    >
      <div className={mergeClasses(sharedStyles.contentCard, styles.surface)}>
        <div className={styles.header}>
          <Body1Strong>{t("businessData.shiftDefinition.edit.title")}</Body1Strong>
          <Button
            appearance="subtle"
            icon={<Dismiss16Regular />}
            onClick={onClose}
            aria-label={t("common.close")}
          />
        </div>
        <div className={styles.body}>
          <div className={styles.fieldRow}>
            <Text>{t("businessData.shiftDefinition.edit.name")}</Text>
            <Input value={data.name} disabled />
          </div>
          <div className={styles.fieldRow}>
            <Text>{t("businessData.shiftDefinition.edit.description")}</Text>
            <Input value={description} onChange={(_, d) => setDescription(d.value)} />
          </div>
          <div className={styles.fieldRow}>
            <Text>{t("businessData.shiftDefinition.edit.calendar")}</Text>
            <Input value={calendar} onChange={(_, d) => setCalendar(d.value)} />
          </div>
        </div>
        <div className={styles.footer}>
          <Button onClick={onClose}>{t("businessData.shiftDefinition.cancel")}</Button>
          <Button appearance="primary" onClick={onClose}>
            {t("businessData.shiftDefinition.update")}
          </Button>
        </div>
      </div>
    </div>
  );
}
