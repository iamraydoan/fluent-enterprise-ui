import { useState } from "react";
import { BaseDialog } from "@/components/common";
import { Button, Input, Checkbox, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";

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
    display: "flex",
    gap: "16px",
    padding: "4px 4px 12px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    marginBottom: "4px",
  },
  step: { fontSize: tokens.fontSizeBase300, color: tokens.colorNeutralForeground3 },
  stepActive: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorBrandForeground1,
  },
  row: { display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" },
  select: {
    padding: "6px 8px",
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    fontSize: tokens.fontSizeBase300,
    backgroundColor: tokens.colorNeutralBackground1,
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
            <Button appearance="primary" onClick={() => setStep(2)}>
              {t(L.next)}
            </Button>
          ) : (
            <Button appearance="primary" onClick={onClose}>
              {t(L.update)}
            </Button>
          )}
        </>
      }
    >
      <div className={styles.steps}>
        <span className={step === 1 ? styles.stepActive : styles.step}>{t(L.step1)}</span>
        <span className={step === 2 ? styles.stepActive : styles.step}>{t(L.step2)}</span>
      </div>
      {step === 1 && (
        <>
          <div className={styles.row}>
            <strong>{t(L.dimensions)}</strong>
            <Button size="small" onClick={addDimension}>
              + {t(L.addDimension)}
            </Button>
          </div>
          {dimensions.map((d) => (
            <div key={d.id} className={styles.row}>
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
                onChange={(_, data) =>
                  setDimensions(
                    dimensions.map((x) =>
                      x.id === d.id ? { ...x, sourceCommand: data.value } : x,
                    ),
                  )
                }
              />
              <Button size="small" onClick={() => removeDimension(d.id)}>
                {t(L.remove)}
              </Button>
            </div>
          ))}
        </>
      )}
      {step === 2 && (
        <>
          <div className={styles.row}>
            <strong>{t(L.timeFrames)}</strong>
            <Button size="small" onClick={addTimeFrame}>
              + {t(L.addTimeFrame)}
            </Button>
          </div>
          {timeFrames.map((f) => (
            <div key={f.id} className={styles.row}>
              <Input
                placeholder={t(L.timeFrameName)}
                value={f.name}
                onChange={(_, data) =>
                  setTimeFrames(
                    timeFrames.map((x) => (x.id === f.id ? { ...x, name: data.value } : x)),
                  )
                }
              />
              <Checkbox
                label={t(L.isDefault)}
                checked={f.isDefault === true}
                onChange={(_, data) =>
                  setTimeFrames(
                    timeFrames.map((x) =>
                      x.id === f.id ? { ...x, isDefault: data.checked === true } : x,
                    ),
                  )
                }
              />
              <Input
                placeholder={t(L.from)}
                value={f.from}
                onChange={(_, data) =>
                  setTimeFrames(
                    timeFrames.map((x) => (x.id === f.id ? { ...x, from: data.value } : x)),
                  )
                }
              />
              <Input
                placeholder={t(L.to)}
                value={f.to}
                onChange={(_, data) =>
                  setTimeFrames(
                    timeFrames.map((x) => (x.id === f.id ? { ...x, to: data.value } : x)),
                  )
                }
              />
              <Button size="small" onClick={() => removeTimeFrame(f.id)}>
                {t(L.remove)}
              </Button>
            </div>
          ))}
        </>
      )}
    </BaseDialog>
  );
}
