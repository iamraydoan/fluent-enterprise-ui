import { useState } from "react";
import type { ShiftDefinitionShift } from "@/api";
import { BaseDialog, DialogFooter } from "@/components/common";
import { Add24Regular, Delete20Regular } from "@/components/icons";
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

const useDialogStyles = makeStyles({
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
});

interface ManageShiftsDialogProps {
  definitionName: string;
  shifts: ShiftDefinitionShift[];
  onClose: () => void;
}

export function ManageShiftsDialog({ definitionName, shifts, onClose }: ManageShiftsDialogProps) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [selected, setSelected] = useState(shifts[0]?.name ?? "");

  const active = shifts.find((shift) => shift.name === selected) ?? shifts[0];

  return (
    <BaseDialog
      open
      title={t("businessData.shiftDefinition.manageTitle")}
      onClose={onClose}
      width="min(1100px, 100%)"
      footer={
        <DialogFooter
          onCancel={onClose}
          onConfirm={onClose}
          confirmLabel={t("businessData.shiftDefinition.update")}
        />
      }
    >
      <div style={{ display: "flex", columnGap: "16px", minHeight: 0 }}>
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
    </BaseDialog>
  );
}
