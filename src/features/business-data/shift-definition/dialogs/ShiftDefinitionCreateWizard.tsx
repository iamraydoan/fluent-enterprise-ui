import { useState } from "react";
import type { ShiftDefinitionShift } from "@/api";
import { BaseDialog, FormField } from "@/components/common";
import { Add24Regular, Delete20Regular } from "@/components/icons";
import { Button, Caption1, Input, Text, makeStyles, mergeClasses, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";

const L: Record<string, TranslationKey> = {
  title: "businessData.shiftDefinition.create.title",
  cancel: "businessData.shiftDefinition.cancel",
  back: "businessData.shiftDefinition.create.back",
  next: "businessData.shiftDefinition.create.next",
  create: "actionBar.create",
};

const useDialogStyles = makeStyles({
  steps: {
    display: "flex",
    columnGap: "8px",
    padding: "12px 20px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  step: {
    padding: "6px 12px",
    borderRadius: tokens.borderRadiusMedium,
    cursor: "pointer",
    backgroundColor: tokens.colorNeutralBackground2,
  },
  stepActive: {
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground2,
    fontWeight: tokens.fontWeightSemibold,
  },
  body: { padding: "16px 20px", overflow: "auto", minHeight: 0 },
  gridHeader: {
    display: "grid",
    gridTemplateColumns: "1fr 110px 110px 90px 130px 120px 32px",
    columnGap: "8px",
    padding: "8px 0",
    fontWeight: tokens.fontWeightSemibold,
  },
  gridRow: {
    display: "grid",
    gridTemplateColumns: "1fr 110px 110px 90px 130px 120px 32px",
    columnGap: "8px",
    alignItems: "center",
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
          <Input value={name} onChange={(_, d) => setName(d.value)} />
        </FormField>
        <FormField label={<>{t("businessData.shiftDefinition.create.description")}</>}>
          <Input value={description} onChange={(_, d) => setDescription(d.value)} />
        </FormField>
        <FormField label={<>{t("businessData.shiftDefinition.create.calendar")}</>}>
          <Input value={calendar} onChange={(_, d) => setCalendar(d.value)} />
        </FormField>
        <Caption1>{t("businessData.shiftDefinition.create.calendarHint")}</Caption1>
      </>
    );
  } else if (step === 1) {
    body = (
      <>
        <div className={styles.gridHeader}>
          <Text>{t("businessData.shiftDefinition.shiftForm.name")}</Text>
          <Text>{t("businessData.shiftDefinition.shiftForm.startTime")}</Text>
          <Text>{t("businessData.shiftDefinition.shiftForm.endTime")}</Text>
          <Text>{t("businessData.shiftDefinition.shiftForm.code")}</Text>
          <Text>{t("businessData.shiftDefinition.shiftForm.costOvertimeFactor")}</Text>
          <Text>{t("businessData.shiftDefinition.shiftForm.teamPattern")}</Text>
          <span />
        </div>
        {shifts.map((shift, i) => (
          <div key={i} className={styles.gridRow}>
            <Input value={shift.name} onChange={(_, d) => updateShift(i, { name: d.value })} />
            <Input
              value={shift.startTime}
              onChange={(_, d) => updateShift(i, { startTime: d.value })}
            />
            <Input
              value={shift.endTime}
              onChange={(_, d) => updateShift(i, { endTime: d.value })}
            />
            <Input value={shift.code} onChange={(_, d) => updateShift(i, { code: d.value })} />
            <Input
              value={String(shift.costOvertimeFactor)}
              onChange={(_, d) => updateShift(i, { costOvertimeFactor: Number(d.value) || 1 })}
            />
            <Input
              value={shift.teamPattern}
              onChange={(_, d) => updateShift(i, { teamPattern: d.value })}
            />
            <Button
              appearance="subtle"
              icon={<Delete20Regular />}
              onClick={() => setShifts((prev) => prev.filter((_, j) => j !== i))}
              aria-label={t("actionBar.delete")}
              disabled={shifts.length === 1}
            />
          </div>
        ))}
        <div style={{ marginTop: "8px" }}>
          <Button
            appearance="subtle"
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
        <div style={{ display: "flex", columnGap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
          {shifts.map((s, i) => (
            <Button
              key={i}
              appearance={i === activeShift ? "primary" : "secondary"}
              onClick={() => setActiveShift(i)}
            >
              {s.name || `${t("businessData.shiftDefinition.create.shift")} ${i + 1}`}
            </Button>
          ))}
        </div>
        {shift.nonWorkingTimes.map((nwt, i) => (
          <div
            key={i}
            className={styles.gridRow}
            style={{ gridTemplateColumns: "1fr 110px 110px 32px" }}
          >
            <Input
              value={nwt.name}
              onChange={(_, d) => updateNonWorking(i, { name: d.value })}
              placeholder={t("businessData.shiftDefinition.create.nonWorkingName")}
            />
            <Input
              value={nwt.startTime}
              onChange={(_, d) => updateNonWorking(i, { startTime: d.value })}
            />
            <Input
              value={nwt.endTime}
              onChange={(_, d) => updateNonWorking(i, { endTime: d.value })}
            />
            <Button
              appearance="subtle"
              icon={<Delete20Regular />}
              onClick={() => removeNonWorking(i)}
              aria-label={t("actionBar.delete")}
            />
          </div>
        ))}
        <div style={{ marginTop: "8px" }}>
          <Button appearance="subtle" icon={<Add24Regular />} onClick={addNonWorking}>
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
            <Button appearance="secondary" onClick={() => setStep(step - 1)}>
              {t(L.back)}
            </Button>
          )}
          {step < 2 ? (
            <Button appearance="primary" onClick={() => setStep(step + 1)}>
              {t(L.next)}
            </Button>
          ) : (
            <Button appearance="primary" onClick={onClose}>
              {t(L.create)}
            </Button>
          )}
        </>
      }
    >
      <div className={styles.steps} style={{ margin: "-16px -20px 0" }}>
        {steps.map((label, i) => (
          <div
            key={i}
            className={mergeClasses(styles.step, i === step && styles.stepActive)}
            onClick={() => setStep(i)}
          >
            <Text>{`${i + 1}. ${label}`}</Text>
          </div>
        ))}
      </div>
      {body}
    </BaseDialog>
  );
}
