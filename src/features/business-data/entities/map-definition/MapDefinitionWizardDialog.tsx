import { useState } from "react";
import { Grid24Regular, Dismiss20Regular } from "@/components/icons";
import {
  Button,
  Checkbox,
  Input,
  Text,
  makeStyles,
  tokens,
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import { useBooleanLabel } from "../propertyLabels";
import { MODE_CREATE, MODE_EDIT } from "./wizardMode";
import type { WizardMode } from "./wizardMode";

const tk = (key: string) => key as TranslationKey;

const L = {
  createTitle: tk("businessData.mapDefinition.wizard.createTitle"),
  editTitle: tk("businessData.mapDefinition.wizard.editTitle"),
  stepGeneral: tk("businessData.mapDefinition.wizard.stepGeneral"),
  stepLayers: tk("businessData.mapDefinition.wizard.stepLayers"),
  stepFilters: tk("businessData.mapDefinition.wizard.stepFilters"),
  name: tk("businessData.mapDefinition.wizard.name"),
  description: tk("businessData.mapDefinition.wizard.description"),
  type: tk("businessData.mapDefinition.wizard.type"),
  layoutType: tk("businessData.mapDefinition.wizard.layoutType"),
  regular: tk("businessData.mapDefinition.wizard.regular"),
  irregular: tk("businessData.mapDefinition.wizard.irregular"),
  rows: tk("businessData.mapDefinition.wizard.rows"),
  columns: tk("businessData.mapDefinition.wizard.columns"),
  height: tk("businessData.mapDefinition.wizard.height"),
  width: tk("businessData.mapDefinition.wizard.width"),
  dimensionUnits: tk("businessData.mapDefinition.wizard.dimensionUnits"),
  maskFile: tk("businessData.mapDefinition.wizard.maskFile"),
  browse: tk("businessData.mapDefinition.wizard.browse"),
  clear: tk("businessData.mapDefinition.wizard.clear"),
  emptyUnitsColor: tk("businessData.mapDefinition.wizard.emptyUnitsColor"),
  gridLinesColor: tk("businessData.mapDefinition.wizard.gridLinesColor"),
  showGridLinesByDefault: tk("businessData.mapDefinition.wizard.showGridLinesByDefault"),
  notch: tk("businessData.mapDefinition.wizard.notch"),
  defaultRotation: tk("businessData.mapDefinition.wizard.defaultRotation"),
  materialUnits: tk("businessData.mapDefinition.wizard.materialUnits"),
  rulerMode: tk("businessData.mapDefinition.wizard.rulerMode"),
  showRulerByDefault: tk("businessData.mapDefinition.wizard.showRulerByDefault"),
  layerName: tk("businessData.mapDefinition.wizard.layerName"),
  layerType: tk("businessData.mapDefinition.wizard.layerType"),
  dataType: tk("businessData.mapDefinition.wizard.dataType"),
  isDefault: tk("businessData.mapDefinition.wizard.isDefault"),
  addLayer: tk("businessData.mapDefinition.wizard.addLayer"),
  removeLayer: tk("businessData.mapDefinition.wizard.removeLayer"),
  cancel: tk("businessData.mapDefinition.wizard.cancel"),
  back: tk("businessData.mapDefinition.wizard.back"),
  next: tk("businessData.mapDefinition.wizard.next"),
  create: tk("businessData.mapDefinition.wizard.create"),
  update: tk("businessData.mapDefinition.wizard.update"),
  comments: tk("businessData.mapDefinition.wizard.comments"),
  generalData: tk("businessData.mapDefinition.wizard.generalData"),
  information: tk("businessData.mapDefinition.wizard.information"),
  colors: tk("businessData.mapDefinition.wizard.colors"),
  options: tk("businessData.mapDefinition.wizard.options"),
};

const useWizardStyles = makeStyles({
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  surface: { width: "1100px", maxWidth: "95vw", maxHeight: "90vh", display: "flex", flexDirection: "column" },
  head: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 16px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  closeBtn: {
    marginLeft: "auto",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px",
  },
  steps: {
    display: "flex",
    gap: "24px",
    padding: "12px 16px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  step: { display: "flex", alignItems: "center", gap: "6px" },
  stepNum: {
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    backgroundColor: tokens.colorNeutralBackground3,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
  },
  stepActive: { backgroundColor: tokens.colorBrandBackground, color: "#fff" },
  body: { padding: "16px", overflowY: "auto", flex: 1 },
  field: {
    display: "grid",
    gridTemplateColumns: "180px 1fr",
    alignItems: "center",
    gap: "8px",
    marginBottom: "10px",
  },
  label: { textAlign: "right", fontSize: "13px" },
  required: { color: tokens.colorPaletteRedForeground1 },
  sectionTitle: {
    fontWeight: 600,
    marginTop: "16px",
    marginBottom: "8px",
    paddingBottom: "4px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
    padding: "12px 16px",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  layerRow: {
    display: "grid",
    gridTemplateColumns: "minmax(100px, 1fr) 110px 100px auto 32px",
    gap: "8px",
    alignItems: "center",
    marginBottom: "8px",
    minWidth: "0",
  },
});

export interface WizardLayer {
  name: string;
  layerType: string;
  dataType: string;
  isDefault: boolean;
}

interface WizardProps {
  mode: WizardMode;
  initialName?: string;
  initialDescription?: string;
  initialType?: string;
  initialLayers?: WizardLayer[];
  onClose: () => void;
}


export function MapDefinitionWizardDialog({
  mode,
  initialName = "",
  initialDescription = "",
  initialType = "General",
  initialLayers = [],
  onClose,
}: WizardProps) {
  const { t } = useAppTranslation();
  const styles = useWizardStyles();
  const shared = useSharedStyles();
  const booleanLabel = useBooleanLabel();
  const [step, setStep] = useState(0);
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [mapType, setMapType] = useState(initialType);
  const [layoutType, setLayoutType] = useState("Regular");
  const [rows, setRows] = useState("3");
  const [columns, setColumns] = useState("3");
  const [height, setHeight] = useState("250");
  const [width, setWidth] = useState("250");
  const [dimensionUnits, setDimensionUnits] = useState("Kg");
  const [maskFile, setMaskFile] = useState("");
  const [emptyUnitsColor, setEmptyUnitsColor] = useState("#FFFFFF");
  const [gridLinesColor, setGridLinesColor] = useState("#000000");
  const [showGridLines, setShowGridLines] = useState(true);
  const [notch, setNotch] = useState("Bottom");
  const [rotation, setRotation] = useState("Rotate 0");
  const [materialUnits, setMaterialUnits] = useState("");
  const [rulerMode, setRulerMode] = useState("Absolute");
  const [showRuler, setShowRuler] = useState(true);
  const [layers, setLayers] = useState<WizardLayer[]>(
    initialLayers.length > 0
      ? initialLayers
      : [{ name: "", layerType: "Bin", dataType: "String", isDefault: true }],
  );

  const title =
    mode === MODE_CREATE ? t(L.createTitle) : mode === MODE_EDIT ? t(L.editTitle) : t(L.createTitle);
  const finishLabel = mode === MODE_EDIT ? t(L.update) : t(L.create);

  const field = (labelKey: TranslationKey, required: boolean, control: React.ReactNode) => (
    <div className={styles.field}>
      <span className={styles.label}>
        {required && <span className={styles.required}>* </span>}
        {t(labelKey)}
      </span>
      {control}
    </div>
  );

  const addLayer = () =>
    setLayers([...layers, { name: "", layerType: "Bin", dataType: "String", isDefault: false }]);
  const removeLayer = (index: number) => setLayers(layers.filter((_, i) => i !== index));
  const updateLayer = (index: number, patch: Partial<WizardLayer>) =>
    setLayers(layers.map((l, i) => (i === index ? { ...l, ...patch } : l)));

  const steps = [t(L.stepGeneral), t(L.stepLayers), t(L.stepFilters)];

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={`${shared.contentCard} ${styles.surface}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={title}
      >
        <div className={styles.head}>
          <Grid24Regular />
          <Text weight="semibold" size={400}>
            {title}
          </Text>
          <button className={styles.closeBtn} onClick={onClose} aria-label={t("common.close")}>
            <Dismiss20Regular />
          </button>
        </div>
        <div className={styles.steps}>
          {steps.map((label, index) => (
            <div key={label} className={styles.step}>
              <span className={`${styles.stepNum} ${index === step ? styles.stepActive : ""}`}>
                {index + 1}
              </span>
              <Text weight={index === step ? "semibold" : "regular"}>{label}</Text>
            </div>
          ))}
        </div>
        <div className={styles.body}>
          {step === 0 && (
            <>
              <div className={styles.sectionTitle}>{t(L.generalData)}</div>
              {field(L.name, true, <Input value={name} disabled={mode === MODE_EDIT} onChange={(_, d) => setName(d.value)} />)}
              {field(L.description, false, <Input value={description} onChange={(_, d) => setDescription(d.value)} />)}
              {field(L.type, true, <Input value={mapType} onChange={(_, d) => setMapType(d.value)} />)}
              <div className={styles.sectionTitle}>{t(L.information)}</div>
              {field(
                L.layoutType,
                true,
                <div style={{ display: "flex", gap: 16 }}>
                  <label>
                    <input
                      type="radio"
                      checked={layoutType === "Regular"}
                      onChange={() => setLayoutType("Regular")}
                    />{" "}
                    {t(L.regular)}
                  </label>
                  <label>
                    <input
                      type="radio"
                      checked={layoutType === "Irregular"}
                      onChange={() => setLayoutType("Irregular")}
                    />{" "}
                    {t(L.irregular)}
                  </label>
                </div>,
              )}
              {field(L.rows, true, <Input value={rows} onChange={(_, d) => setRows(d.value)} />)}
              {field(L.columns, true, <Input value={columns} onChange={(_, d) => setColumns(d.value)} />)}
              {field(L.height, false, <Input value={height} onChange={(_, d) => setHeight(d.value)} />)}
              {field(L.width, false, <Input value={width} onChange={(_, d) => setWidth(d.value)} />)}
              {field(L.dimensionUnits, false, <Input value={dimensionUnits} onChange={(_, d) => setDimensionUnits(d.value)} />)}
              {field(
                L.maskFile,
                false,
                <div style={{ display: "flex", gap: 8 }}>
                  <Input value={maskFile} style={{ flex: 1 }} readOnly />
                  <Button appearance="secondary">{t(L.browse)}</Button>
                  <Button appearance="secondary" onClick={() => setMaskFile("")}>
                    {t(L.clear)}
                  </Button>
                </div>,
              )}
              <div className={styles.sectionTitle}>{t(L.colors)}</div>
              {field(
                L.emptyUnitsColor,
                false,
                <input type="color" value={emptyUnitsColor} onChange={(e) => setEmptyUnitsColor(e.target.value)} />,
              )}
              {field(
                L.gridLinesColor,
                false,
                <input type="color" value={gridLinesColor} onChange={(e) => setGridLinesColor(e.target.value)} />,
              )}
              {field(
                L.showGridLinesByDefault,
                false,
                <Checkbox checked={showGridLines} onChange={(_, d) => setShowGridLines(d.checked === true)} />,
              )}
              <div className={styles.sectionTitle}>{t(L.options)}</div>
              {field(L.notch, false, <Input value={notch} onChange={(_, d) => setNotch(d.value)} />)}
              {field(L.defaultRotation, false, <Input value={rotation} onChange={(_, d) => setRotation(d.value)} />)}
              {field(L.materialUnits, false, <Input value={materialUnits} onChange={(_, d) => setMaterialUnits(d.value)} />)}
              {field(L.rulerMode, false, <Input value={rulerMode} onChange={(_, d) => setRulerMode(d.value)} />)}
              {field(
                L.showRulerByDefault,
                false,
                <Checkbox checked={showRuler} onChange={(_, d) => setShowRuler(d.checked === true)} />,
              )}
              {field(L.comments, false, <Input />)}
            </>
          )}
          {step === 1 && (
            <>
              <div className={styles.sectionTitle}>{t(L.stepLayers)}</div>
              {layers.map((layer, index) => (
                <div key={index} className={styles.layerRow}>
                  <Input
                    placeholder={t(L.layerName)}
                    value={layer.name}
                    onChange={(_, d) => updateLayer(index, { name: d.value })}
                  />
                  <Input
                    placeholder={t(L.layerType)}
                    value={layer.layerType}
                    onChange={(_, d) => updateLayer(index, { layerType: d.value })}
                  />
                  <Input
                    placeholder={t(L.dataType)}
                    value={layer.dataType}
                    onChange={(_, d) => updateLayer(index, { dataType: d.value })}
                  />
                  <Checkbox
                    checked={layer.isDefault}
                    onChange={(_, d) => updateLayer(index, { isDefault: d.checked === true })}
                    label={t(L.isDefault)}
                  />
                  <Button appearance="subtle" onClick={() => removeLayer(index)}>
                    {t(L.removeLayer)}
                  </Button>
                </div>
              ))}
              <Button appearance="secondary" onClick={addLayer}>
                {t(L.addLayer)}
              </Button>
              <div style={{ marginTop: 12 }}>
                <Text size={300}>
                  {t(L.showGridLinesByDefault)}: {booleanLabel(showGridLines)} | {t(L.showRulerByDefault)}:{" "}
                  {booleanLabel(showRuler)}
                </Text>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div className={styles.sectionTitle}>{t(L.stepFilters)}</div>
              <Text>{t(L.comments)}</Text>
              {field(L.comments, false, <Input />)}
            </>
          )}
        </div>
        <div className={styles.footer}>
          <Button appearance="secondary" onClick={onClose}>
            {t(L.cancel)}
          </Button>
          {step > 0 && (
            <Button appearance="secondary" onClick={() => setStep(step - 1)}>
              {t(L.back)}
            </Button>
          )}
          {step < 2 ? (
            <Button appearance="primary" onClick={() => setStep(step + 1)} disabled={name.trim() === ""}>
              {t(L.next)}
            </Button>
          ) : (
            <Button appearance="primary" onClick={onClose} disabled={name.trim() === ""}>
              {finishLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
