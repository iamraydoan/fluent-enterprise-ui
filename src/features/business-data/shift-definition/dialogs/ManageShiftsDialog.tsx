import { useState } from "react";
import type { ShiftDefinitionShift } from "@/api";
import { BaseDialog, DialogFooter, FormField } from "@/components/common";
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
              <FormField label={<>{t("businessData.shiftDefinition.shiftForm.name")}</>}>
                <Input defaultValue={active.name} />
              </FormField>
              <FormField label={<>{t("businessData.shiftDefinition.shiftForm.startTime")}</>}>
                <Input defaultValue={active.startTime} />
              </FormField>
              <FormField label={<>{t("businessData.shiftDefinition.shiftForm.endTime")}</>}>
                <Input defaultValue={active.endTime} />
              </FormField>
              <FormField label={<>{t("businessData.shiftDefinition.shiftForm.code")}</>}>
                <Input defaultValue={active.code} />
              </FormField>
              <FormField
                label={<>{t("businessData.shiftDefinition.shiftForm.costOvertimeFactor")}</>}
              >
                <Input defaultValue={String(active.costOvertimeFactor)} />
              </FormField>
              <FormField label={<>{t("businessData.shiftDefinition.shiftForm.teamPattern")}</>}>
                <Input defaultValue={active.teamPattern} />
              </FormField>
            </div>
          )}
        </div>
      </div>
    </BaseDialog>
  );
}
