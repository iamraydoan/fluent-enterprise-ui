import { useState } from "react";
import { BaseDialog, HStack } from "@/components/common";
import { Button, Input, Checkbox, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { theme } from "@/styles/theme";

const L: Record<string, TranslationKey> = {
  title: "businessData.kpi.dimensionsDialog.title",
  step1: "businessData.kpi.dimensionsDialog.step1",
  step2: "businessData.kpi.dimensionsDialog.step2",
  dimensions: "businessData.kpi.dimensionsDialog.dimensions",
  valueType: "businessData.kpi.dimensionsDialog.valueType",
  valueTypeSingle: "businessData.kpi.dimensionsDialog.valueTypeSingle",
  valueTypeSeries: "businessData.kpi.dimensionsDialog.valueTypeSeries",
  source: "businessData.kpi.dimensionsDialog.source",
  sourceBusinessRule: "businessData.kpi.dimensionsDialog.sourceBusinessRule",
  sourceOds: "businessData.kpi.dimensionsDialog.sourceOds",
  sourceDwh: "businessData.kpi.dimensionsDialog.sourceDwh",
  sourceCubes: "businessData.kpi.dimensionsDialog.sourceCubes",
  sourceCommand: "businessData.kpi.dimensionsDialog.sourceCommand",
  addDimension: "businessData.kpi.dimensionsDialog.addDimension",
  remove: "businessData.kpi.dimensionsDialog.remove",
  timeFrames: "businessData.kpi.dimensionsDialog.timeFrames",
  timeFrameName: "businessData.kpi.dimensionsDialog.timeFrameName",
  isDefault: "businessData.kpi.dimensionsDialog.isDefault",
  from: "businessData.kpi.dimensionsDialog.from",
  to: "businessData.kpi.dimensionsDialog.to",
  addTimeFrame: "businessData.kpi.dimensionsDialog.addTimeFrame",
  back: "businessData.kpi.dimensionsDialog.back",
  next: "businessData.kpi.dimensionsDialog.next",
  cancel: "businessData.kpi.dimensionsDialog.cancel",
  update: "businessData.kpi.dimensionsDialog.update",
};

const useStyles = makeStyles({
  steps: {
    padding: "4px 4px 12px",
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
    marginBottom: theme.spacing.xs,
  },
  step: { fontSize: theme.font.sizeMd, color: theme.color.textTertiary },
  stepActive: {
    fontSize: theme.font.sizeMd,
    fontWeight: theme.font.weightSemibold,
    color: theme.color.textBrand,
  },

  select: {
    padding: `6px ${theme.spacing.sm}`,
    border: `1px solid ${theme.color.border}`,
    borderRadius: theme.radius.md,
    fontSize: theme.font.sizeMd,
    backgroundColor: theme.color.surface,
  },
});

interface Dimension {
  id: number;
  valueType: string;
  source: string;
  sourceCommand: string;
}

interface TimeFrame {
  id: number;
  name: string;
  isDefault: boolean;
  from: string;
  to: string;
}

export function KpiDimensionsDialog({ onClose }: { onClose: () => void }) {
  const { t } = useAppTranslation();
  const styles = useStyles();
  const [step, setStep] = useState(1);
  const [dimensions, setDimensions] = useState<Dimension[]>([]);
  const [timeFrames, setTimeFrames] = useState<TimeFrame[]>([]);
  const [nextId, setNextId] = useState(1);

  const addDimension = () => {
    setDimensions([
      ...dimensions,
      { id: nextId, valueType: "Single", source: "BusinessRule", sourceCommand: "" },
    ]);
    setNextId(nextId + 1);
  };
  const removeDimension = (id: number) => setDimensions(dimensions.filter((d) => d.id !== id));
  const addTimeFrame = () => {
    setTimeFrames([...timeFrames, { id: nextId, name: "", isDefault: false, from: "", to: "" }]);
    setNextId(nextId + 1);
  };
  const removeTimeFrame = (id: number) => setTimeFrames(timeFrames.filter((f) => f.id !== id));

  return (
    <BaseDialog
      open
      title={t(L.title)}
      size="lg"
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>{t(L.cancel)}</Button>
          {step === 2 && <Button onClick={() => setStep(1)}>{t(L.back)}</Button>}
          {step === 1 ? (
            <Button variant="primary" onClick={() => setStep(2)}>
              {t(L.next)}
            </Button>
          ) : (
            <Button variant="primary" onClick={onClose}>
              {t(L.update)}
            </Button>
          )}
        </>
      }
    >
      <HStack gap="16px" className={styles.steps}>
        <span className={step === 1 ? styles.stepActive : styles.step}>{t(L.step1)}</span>
        <span className={step === 2 ? styles.stepActive : styles.step}>{t(L.step2)}</span>
      </HStack>
      {step === 1 && (
        <>
          <HStack gap="8px" align="center" wrap>
            <strong>{t(L.dimensions)}</strong>
            <Button size="sm" onClick={addDimension}>
              + {t(L.addDimension)}
            </Button>
          </HStack>
          {dimensions.map((d) => (
            <HStack gap="8px" align="center" wrap key={d.id}>
              <select
                className={styles.select}
                value={d.valueType}
                onChange={(e) =>
                  setDimensions(
                    dimensions.map((x) =>
                      x.id === d.id ? { ...x, valueType: e.target.value } : x,
                    ),
                  )
                }
                aria-label={t(L.valueType)}
              >
                <option value="Single">{t(L.valueTypeSingle)}</option>
                <option value="Series">{t(L.valueTypeSeries)}</option>
              </select>
              <select
                className={styles.select}
                value={d.source}
                onChange={(e) =>
                  setDimensions(
                    dimensions.map((x) => (x.id === d.id ? { ...x, source: e.target.value } : x)),
                  )
                }
                aria-label={t(L.source)}
              >
                <option value="BusinessRule">{t(L.sourceBusinessRule)}</option>
                <option value="ODS">{t(L.sourceOds)}</option>
                <option value="DWH">{t(L.sourceDwh)}</option>
                <option value="Cubes">{t(L.sourceCubes)}</option>
              </select>
              <Input
                placeholder={t(L.sourceCommand)}
                value={d.sourceCommand}
                onChange={(value) =>
                  setDimensions(
                    dimensions.map((x) => (x.id === d.id ? { ...x, sourceCommand: value } : x)),
                  )
                }
              />
              <Button size="sm" onClick={() => removeDimension(d.id)}>
                {t(L.remove)}
              </Button>
            </HStack>
          ))}
        </>
      )}
      {step === 2 && (
        <>
          <HStack gap="8px" align="center" wrap>
            <strong>{t(L.timeFrames)}</strong>
            <Button size="sm" onClick={addTimeFrame}>
              + {t(L.addTimeFrame)}
            </Button>
          </HStack>
          {timeFrames.map((f) => (
            <HStack gap="8px" align="center" wrap key={f.id}>
              <Input
                placeholder={t(L.timeFrameName)}
                value={f.name}
                onChange={(value) =>
                  setTimeFrames(timeFrames.map((x) => (x.id === f.id ? { ...x, name: value } : x)))
                }
              />
              <Checkbox
                label={t(L.isDefault)}
                checked={f.isDefault === true}
                onChange={(checked) =>
                  setTimeFrames(
                    timeFrames.map((x) =>
                      x.id === f.id ? { ...x, isDefault: checked === true } : x,
                    ),
                  )
                }
              />
              <Input
                placeholder={t(L.from)}
                value={f.from}
                onChange={(value) =>
                  setTimeFrames(timeFrames.map((x) => (x.id === f.id ? { ...x, from: value } : x)))
                }
              />
              <Input
                placeholder={t(L.to)}
                value={f.to}
                onChange={(value) =>
                  setTimeFrames(timeFrames.map((x) => (x.id === f.id ? { ...x, to: value } : x)))
                }
              />
              <Button size="sm" onClick={() => removeTimeFrame(f.id)}>
                {t(L.remove)}
              </Button>
            </HStack>
          ))}
        </>
      )}
    </BaseDialog>
  );
}
