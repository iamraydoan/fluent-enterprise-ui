import { useState } from "react";
import { Add24Regular, Delete20Regular, Dismiss16Regular } from "@/components/icons";
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
  gridRow: {
    display: "grid",
    gridTemplateColumns: "1fr 32px",
    columnGap: "8px",
    alignItems: "center",
    marginBottom: "8px",
  },
  fieldRow: {
    display: "grid",
    gridTemplateColumns: "180px 1fr",
    alignItems: "center",
    columnGap: "12px",
    marginBottom: "12px",
    marginTop: "16px",
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    columnGap: "8px",
    padding: "12px 20px",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
});

export function ShiftDefinitionCloneDialog({
  sourceName,
  onClose,
}: {
  sourceName: string;
  onClose: () => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const sharedStyles = useSharedStyles();
  const [names, setNames] = useState<string[]>([""]);
  const [comment, setComment] = useState("");

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-label={t("businessData.shiftDefinition.clone.title")}
    >
      <div className={mergeClasses(sharedStyles.contentCard, styles.surface)}>
        <div className={styles.header}>
          <Body1Strong>
            {t("businessData.shiftDefinition.clone.title", { name: sourceName })}
          </Body1Strong>
          <Button
            appearance="subtle"
            icon={<Dismiss16Regular />}
            onClick={onClose}
            aria-label={t("common.close")}
          />
        </div>
        <div className={styles.body}>
          {names.map((name, i) => (
            <div key={i} className={styles.gridRow}>
              <Input
                value={name}
                onChange={(_, d) => setNames((prev) => prev.map((n, j) => (j === i ? d.value : n)))}
                placeholder={t("businessData.shiftDefinition.clone.namePlaceholder")}
              />
              <Button
                appearance="subtle"
                icon={<Delete20Regular />}
                onClick={() => setNames((prev) => prev.filter((_, j) => j !== i))}
                aria-label={t("actionBar.delete")}
                disabled={names.length === 1}
              />
            </div>
          ))}
          <Button
            appearance="subtle"
            icon={<Add24Regular />}
            onClick={() => setNames((prev) => [...prev, ""])}
          >
            {t("actionBar.create")}
          </Button>
          <div className={styles.fieldRow}>
            <Text>{t("businessData.shiftDefinition.clone.comment")}</Text>
            <Input value={comment} onChange={(_, d) => setComment(d.value)} />
          </div>
        </div>
        <div className={styles.footer}>
          <Button onClick={onClose}>{t("businessData.shiftDefinition.cancel")}</Button>
          <Button appearance="primary" onClick={onClose}>
            {t("businessData.shiftDefinition.clone.clone")}
          </Button>
        </div>
      </div>
    </div>
  );
}
