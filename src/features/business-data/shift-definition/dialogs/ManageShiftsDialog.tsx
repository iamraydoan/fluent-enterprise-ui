import { useState } from "react";
import type { ShiftDefinitionShift } from "@/api";
import { Add24Regular, Delete20Regular, Dismiss16Regular } from "@/components/icons";
import {
  Body1Strong,
  Button,
  Caption1,
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
    width: "min(1100px, 100%)",
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
  body: {
    display: "flex",
    columnGap: "16px",
    padding: "16px 20px",
    overflow: "auto",
    minHeight: 0,
  },
  listPane: {
    width: "320px",
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    rowGap: "8px",
  },
  formPane: { flexGrow: 1, minWidth: 0 },
  shiftItem: {
    padding: "10px 12px",
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    cursor: "pointer",
    backgroundColor: tokens.colorNeutralBackground1,
  },
  shiftActive: { backgroundColor: tokens.colorNeutralBackground1Selected },
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

interface ManageShiftsDialogProps {
  definitionName: string;
  shifts: ShiftDefinitionShift[];
  onClose: () => void;
}

export function ManageShiftsDialog({ definitionName, shifts, onClose }: ManageShiftsDialogProps) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const sharedStyles = useSharedStyles();
  const [selected, setSelected] = useState(shifts[0]?.name ?? "");

  const active = shifts.find((shift) => shift.name === selected) ?? shifts[0];

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-label={t("businessData.shiftDefinition.manageTitle")}
    >
      <div className={mergeClasses(sharedStyles.contentCard, styles.surface)}>
        <div className={styles.header}>
          <Body1Strong>{t("businessData.shiftDefinition.manageTitle")}</Body1Strong>
          <Button
            appearance="subtle"
            icon={<Dismiss16Regular />}
            onClick={onClose}
            aria-label={t("common.close")}
          />
        </div>
        <div className={styles.body}>
          <div className={styles.listPane}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Text weight="semibold">{t("businessData.shiftDefinition.sections.shifts")}</Text>
              <div style={{ display: "flex", columnGap: "4px" }}>
                <Button
                  appearance="subtle"
                  icon={<Add24Regular />}
                  aria-label={t("actionBar.create")}
                />
                <Button
                  appearance="subtle"
                  icon={<Delete20Regular />}
                  aria-label={t("actionBar.delete")}
                />
              </div>
            </div>
            {shifts.map((shift) => (
              <button
                key={shift.name}
                className={mergeClasses(
                  styles.shiftItem,
                  shift.name === selected && styles.shiftActive,
                )}
                onClick={() => setSelected(shift.name)}
              >
                <Text weight="semibold" size={300}>
                  {shift.name}
                </Text>
                <Caption1>
                  {t("businessData.shiftDefinition.shiftTimeRange", {
                    start: shift.startTime,
                    end: shift.endTime,
                  })}
                </Caption1>
              </button>
            ))}
          </div>
          <div className={styles.formPane}>
            <Body1Strong>{definitionName}</Body1Strong>
            {active !== undefined && (
              <div style={{ marginTop: "12px" }}>
                <div className={styles.fieldRow}>
                  <Text>{t("businessData.shiftDefinition.shiftForm.name")}</Text>
                  <Input defaultValue={active.name} />
                </div>
                <div className={styles.fieldRow}>
                  <Text>{t("businessData.shiftDefinition.shiftForm.startTime")}</Text>
                  <Input defaultValue={active.startTime} />
                </div>
                <div className={styles.fieldRow}>
                  <Text>{t("businessData.shiftDefinition.shiftForm.endTime")}</Text>
                  <Input defaultValue={active.endTime} />
                </div>
                <div className={styles.fieldRow}>
                  <Text>{t("businessData.shiftDefinition.shiftForm.code")}</Text>
                  <Input defaultValue={active.code} />
                </div>
                <div className={styles.fieldRow}>
                  <Text>{t("businessData.shiftDefinition.shiftForm.costOvertimeFactor")}</Text>
                  <Input defaultValue={String(active.costOvertimeFactor)} />
                </div>
                <div className={styles.fieldRow}>
                  <Text>{t("businessData.shiftDefinition.shiftForm.teamPattern")}</Text>
                  <Input defaultValue={active.teamPattern} />
                </div>
              </div>
            )}
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
