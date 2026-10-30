import { useState } from "react";
import { Button, Input, Checkbox, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";

const tk = (key: string) => key as TranslationKey;

const L = {
  title: tk("businessData.kpi.dimensionsDialog.title"),
  step1: tk("businessData.kpi.dimensionsDialog.step1"),
  step2: tk("businessData.kpi.dimensionsDialog.step2"),
  dimensions: tk("businessData.kpi.dimensionsDialog.dimensions"),
  valueType: tk("businessData.kpi.dimensionsDialog.valueType"),
  valueTypeSingle: tk("businessData.kpi.dimensionsDialog.valueTypeSingle"),
  valueTypeSeries: tk("businessData.kpi.dimensionsDialog.valueTypeSeries"),
  source: tk("businessData.kpi.dimensionsDialog.source"),
  sourceBusinessRule: tk("businessData.kpi.dimensionsDialog.sourceBusinessRule"),
  sourceOds: tk("businessData.kpi.dimensionsDialog.sourceOds"),
  sourceDwh: tk("businessData.kpi.dimensionsDialog.sourceDwh"),
  sourceCubes: tk("businessData.kpi.dimensionsDialog.sourceCubes"),
  sourceCommand: tk("businessData.kpi.dimensionsDialog.sourceCommand"),
  addDimension: tk("businessData.kpi.dimensionsDialog.addDimension"),
  remove: tk("businessData.kpi.dimensionsDialog.remove"),
  timeFrames: tk("businessData.kpi.dimensionsDialog.timeFrames"),
  timeFrameName: tk("businessData.kpi.dimensionsDialog.timeFrameName"),
  isDefault: tk("businessData.kpi.dimensionsDialog.isDefault"),
  from: tk("businessData.kpi.dimensionsDialog.from"),
  to: tk("businessData.kpi.dimensionsDialog.to"),
  addTimeFrame: tk("businessData.kpi.dimensionsDialog.addTimeFrame"),
  back: tk("businessData.kpi.dimensionsDialog.back"),
  next: tk("businessData.kpi.dimensionsDialog.next"),
  cancel: tk("businessData.kpi.dimensionsDialog.cancel"),
  update: tk("businessData.kpi.dimensionsDialog.update"),
};

const useDialogStyles = makeStyles({
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  surface: {
    width: "720px",
    maxWidth: "95vw",
    display: "flex",
    flexDirection: "column",
    maxHeight: "90vh",
  },
  head: {
    padding: "12px 16px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase400,
  },
  steps: {
    display: "flex",
    gap: "16px",
    padding: "12px 16px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  step: { fontSize: tokens.fontSizeBase300, color: tokens.colorNeutralForeground3 },
  stepActive: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorBrandForeground1,
  },
  body: {
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    overflowY: "auto",
  },
  row: { display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
    padding: "12px 16px",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
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
  const shared = useSharedStyles();
  const styles = useDialogStyles();
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
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={`${shared.contentCard} ${styles.surface}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.head}>{t(L.title)}</div>
        <div className={styles.steps}>
          <span className={step === 1 ? styles.stepActive : styles.step}>{t(L.step1)}</span>
          <span className={step === 2 ? styles.stepActive : styles.step}>{t(L.step2)}</span>
        </div>
        <div className={styles.body}>
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
                        dimensions.map((x) =>
                          x.id === d.id ? { ...x, source: e.target.value } : x,
                        ),
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
        </div>
        <div className={styles.footer}>
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
        </div>
      </div>
    </div>
  );
}
