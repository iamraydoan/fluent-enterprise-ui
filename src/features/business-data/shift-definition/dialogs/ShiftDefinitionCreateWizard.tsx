import { useState } from "react";
import type { ShiftDefinitionShift } from "@/api";
import { BaseDialog, FormField, Grid, HStack } from "@/components/common";
import { Add24Regular, Delete20Regular } from "@/components/icons";
import { Button, Caption1, Input, Text, makeStyles, mergeClasses } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { theme } from "@/styles/theme";

const L: Record<string, TranslationKey> = {
  title: "businessData.shiftDefinition.create.title",
  cancel: "businessData.shiftDefinition.cancel",
  back: "businessData.shiftDefinition.create.back",
  next: "businessData.shiftDefinition.create.next",
  create: "actionBar.create",
};

const useDialogStyles = makeStyles({
  steps: {
    padding: "12px 20px",
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
  },
  step: {
    padding: `6px ${theme.spacing.md}`,
    borderRadius: theme.radius.md,
    cursor: "pointer",
    backgroundColor: theme.color.surfaceSecondary,
  },
  stepActive: {
    backgroundColor: theme.color.brandSubtle,
    color: theme.color.textBrandSecondary,
    fontWeight: theme.font.weightSemibold,
  },
  body: { padding: `${theme.spacing.lg} 20px`, overflow: "auto", minHeight: 0 },
  gridHeader: {
    padding: "8px 0",
    fontWeight: theme.font.weightSemibold,
  },
  gridRow: {
    padding: "4px 0",
  },
});

interface ShiftEntry extends ShiftDefinitionShift {
  nonWorkingTimes: { name: string; startTime: string; endTime: string }[];
}

const EMPTY_SHIFT: ShiftEntry = {
  name: "",
  startTime: "",
  endTime: "",
  code: "",
  costOvertimeFactor: 1,
  teamPattern: "",
  nonWorkingTimes: [],
};

export function ShiftDefinitionCreateWizard({ onClose }: { onClose: () => void }) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [calendar, setCalendar] = useState("");
  const [shifts, setShifts] = useState<ShiftEntry[]>([{ ...EMPTY_SHIFT }]);
  const [activeShift, setActiveShift] = useState(0);

  const steps = [
    t("businessData.shiftDefinition.create.step1"),
    t("businessData.shiftDefinition.create.step2"),
    t("businessData.shiftDefinition.create.step3"),
  ];

  const updateShift = (index: number, patch: Partial<ShiftEntry>) => {
    setShifts((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  };

  const addNonWorking = () => {
    updateShift(activeShift, {
      nonWorkingTimes: [
        ...shifts[activeShift].nonWorkingTimes,
        { name: "", startTime: "", endTime: "" },
      ],
    });
  };

  const updateNonWorking = (
    index: number,
    patch: Partial<{ name: string; startTime: string; endTime: string }>,
  ) => {
    const list = shifts[activeShift].nonWorkingTimes.map((n, i) =>
      i === index ? { ...n, ...patch } : n,
    );
    updateShift(activeShift, { nonWorkingTimes: list });
  };

  const removeNonWorking = (index: number) => {
    updateShift(activeShift, {
      nonWorkingTimes: shifts[activeShift].nonWorkingTimes.filter((_, i) => i !== index),
    });
  };

  let body;
  if (step === 0) {
    body = (
      <>
        <FormField label={<>{t("businessData.shiftDefinition.create.name")}</>}>
          <Input value={name} onChange={setName} />
        </FormField>
        <FormField label={<>{t("businessData.shiftDefinition.create.description")}</>}>
          <Input value={description} onChange={setDescription} />
        </FormField>
        <FormField label={<>{t("businessData.shiftDefinition.create.calendar")}</>}>
          <Input value={calendar} onChange={setCalendar} />
        </FormField>
        <Caption1>{t("businessData.shiftDefinition.create.calendarHint")}</Caption1>
      </>
    );
  } else if (step === 1) {
    body = (
      <>
        <Grid
          columns="1fr 110px 110px 90px 130px 120px 32px"
          gap="8px"
          className={styles.gridHeader}
        >
          <Text>{t("businessData.shiftDefinition.shiftForm.name")}</Text>
          <Text>{t("businessData.shiftDefinition.shiftForm.startTime")}</Text>
          <Text>{t("businessData.shiftDefinition.shiftForm.endTime")}</Text>
          <Text>{t("businessData.shiftDefinition.shiftForm.code")}</Text>
          <Text>{t("businessData.shiftDefinition.shiftForm.costOvertimeFactor")}</Text>
          <Text>{t("businessData.shiftDefinition.shiftForm.teamPattern")}</Text>
          <span />
        </Grid>
        {shifts.map((shift, i) => (
          <Grid
            columns="1fr 110px 110px 90px 130px 120px 32px"
            gap="8px"
            align="center"
            key={i}
            className={styles.gridRow}
          >
            <Input value={shift.name} onChange={(value) => updateShift(i, { name: value })} />
            <Input
              value={shift.startTime}
              onChange={(value) => updateShift(i, { startTime: value })}
            />
            <Input value={shift.endTime} onChange={(value) => updateShift(i, { endTime: value })} />
            <Input value={shift.code} onChange={(value) => updateShift(i, { code: value })} />
            <Input
              value={String(shift.costOvertimeFactor)}
              onChange={(value) => updateShift(i, { costOvertimeFactor: Number(value) || 1 })}
            />
            <Input
              value={shift.teamPattern}
              onChange={(value) => updateShift(i, { teamPattern: value })}
            />
            <Button
              variant="subtle"
              icon={<Delete20Regular />}
              onClick={() => setShifts((prev) => prev.filter((_, j) => j !== i))}
              aria-label={t("actionBar.delete")}
              disabled={shifts.length === 1}
            />
          </Grid>
        ))}
        <div style={{ marginTop: theme.spacing.sm }}>
          <Button
            variant="subtle"
            icon={<Add24Regular />}
            onClick={() => setShifts((prev) => [...prev, { ...EMPTY_SHIFT }])}
          >
            {t("actionBar.create")}
          </Button>
        </div>
      </>
    );
  } else {
    const shift = shifts[activeShift];
    body = (
      <>
        <HStack gap="8px" wrap style={{ marginBottom: theme.spacing.md }}>
          {shifts.map((s, i) => (
            <Button
              key={i}
              variant={i === activeShift ? "primary" : "secondary"}
              onClick={() => setActiveShift(i)}
            >
              {s.name || `${t("businessData.shiftDefinition.create.shift")} ${i + 1}`}
            </Button>
          ))}
        </HStack>
        {shift.nonWorkingTimes.map((nwt, i) => (
          <Grid
            columns="1fr 110px 110px 90px 130px 120px 32px"
            gap="8px"
            align="center"
            key={i}

            style={{ gridTemplateColumns: "1fr 110px 110px 32px" }}
            className={styles.gridRow}
          >
            <Input
              value={nwt.name}
              onChange={(value) => updateNonWorking(i, { name: value })}
              placeholder={t("businessData.shiftDefinition.create.nonWorkingName")}
            />
            <Input
              value={nwt.startTime}
              onChange={(value) => updateNonWorking(i, { startTime: value })}
            />
            <Input
              value={nwt.endTime}
              onChange={(value) => updateNonWorking(i, { endTime: value })}
            />
            <Button
              variant="subtle"
              icon={<Delete20Regular />}
              onClick={() => removeNonWorking(i)}
              aria-label={t("actionBar.delete")}
            />
          </Grid>
        ))}
        <div style={{ marginTop: theme.spacing.sm }}>
          <Button variant="subtle" icon={<Add24Regular />} onClick={addNonWorking}>
            {t("actionBar.create")}
          </Button>
        </div>
      </>
    );
  }

  return (
    <BaseDialog
      open
      title={t(L.title)}
      onClose={onClose}
      width="min(900px, 100%)"
      footer={
        <>
          <Button onClick={onClose}>{t(L.cancel)}</Button>
          {step > 0 && (
            <Button variant="secondary" onClick={() => setStep(step - 1)}>
              {t(L.back)}
            </Button>
          )}
          {step < 2 ? (
            <Button variant="primary" onClick={() => setStep(step + 1)}>
              {t(L.next)}
            </Button>
          ) : (
            <Button variant="primary" onClick={onClose}>
              {t(L.create)}
            </Button>
          )}
        </>
      }
    >
      <HStack gap="8px" style={{ margin: "-16px -20px 0" }} className={styles.steps}>
        {steps.map((label, i) => (
          <div
            key={i}
            className={mergeClasses(styles.step, i === step && styles.stepActive)}
            onClick={() => setStep(i)}
          >
            <Text>{`${i + 1}. ${label}`}</Text>
          </div>
        ))}
      </HStack>
      {body}
    </BaseDialog>
  );
}
