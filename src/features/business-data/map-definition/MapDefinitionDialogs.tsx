import { useState } from "react";
import { BaseDialog, FormField } from "@/components/common";
import { Button, Checkbox, Input, Text, makeStyles} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { theme } from "@/styles/theme";
import { useBooleanLabel } from "../components/propertyLabels";
import { MODE_CREATE, MODE_EDIT } from "../components/wizardMode";
import type { WizardMode } from "../components/wizardMode";

const L: Record<string, TranslationKey> = {
  createTitle: "businessData.mapDefinition.wizard.createTitle",
  editTitle: "businessData.mapDefinition.wizard.editTitle",
  stepGeneral: "businessData.mapDefinition.wizard.stepGeneral",
  stepLayers: "businessData.mapDefinition.wizard.stepLayers",
  stepFilters: "businessData.mapDefinition.wizard.stepFilters",
  name: "businessData.mapDefinition.wizard.name",
  description: "businessData.mapDefinition.wizard.description",
  type: "businessData.mapDefinition.wizard.type",
  layoutType: "businessData.mapDefinition.wizard.layoutType",
  regular: "businessData.mapDefinition.wizard.regular",
  irregular: "businessData.mapDefinition.wizard.irregular",
  rows: "businessData.mapDefinition.wizard.rows",
  columns: "businessData.mapDefinition.wizard.columns",
  height: "businessData.mapDefinition.wizard.height",
  width: "businessData.mapDefinition.wizard.width",
  dimensionUnits: "businessData.mapDefinition.wizard.dimensionUnits",
  maskFile: "businessData.mapDefinition.wizard.maskFile",
  browse: "businessData.mapDefinition.wizard.browse",
  clear: "businessData.mapDefinition.wizard.clear",
  emptyUnitsColor: "businessData.mapDefinition.wizard.emptyUnitsColor",
  gridLinesColor: "businessData.mapDefinition.wizard.gridLinesColor",
  showGridLinesByDefault: "businessData.mapDefinition.wizard.showGridLinesByDefault",
  notch: "businessData.mapDefinition.wizard.notch",
  defaultRotation: "businessData.mapDefinition.wizard.defaultRotation",
  materialUnits: "businessData.mapDefinition.wizard.materialUnits",
  rulerMode: "businessData.mapDefinition.wizard.rulerMode",
  showRulerByDefault: "businessData.mapDefinition.wizard.showRulerByDefault",
  layerName: "businessData.mapDefinition.wizard.layerName",
  layerType: "businessData.mapDefinition.wizard.layerType",
  dataType: "businessData.mapDefinition.wizard.dataType",
  isDefault: "businessData.mapDefinition.wizard.isDefault",
  addLayer: "businessData.mapDefinition.wizard.addLayer",
  removeLayer: "businessData.mapDefinition.wizard.removeLayer",
  cancel: "businessData.mapDefinition.wizard.cancel",
  back: "businessData.mapDefinition.wizard.back",
  next: "businessData.mapDefinition.wizard.next",
  create: "businessData.mapDefinition.wizard.create",
  update: "businessData.mapDefinition.wizard.update",
  comments: "businessData.mapDefinition.wizard.comments",
  generalData: "businessData.mapDefinition.wizard.generalData",
  information: "businessData.mapDefinition.wizard.information",
  colors: "businessData.mapDefinition.wizard.colors",
  options: "businessData.mapDefinition.wizard.options",
};

const useWizardStyles = makeStyles({
  steps: {
    display: "flex",
    gap: theme.spacing.xl,
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
    margin: "-16px -20px 0",
  },
  step: { display: "flex", alignItems: "center", gap: "6px" },
  stepNum: {
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    backgroundColor: theme.color.surfaceTertiary,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
  },
  stepActive: { backgroundColor: theme.color.brand, color: "#fff" },
  field: {
    display: "grid",
    gridTemplateColumns: "180px 1fr",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginBottom: "10px",
  },
  label: { textAlign: "right", fontSize: "13px" },
  required: { color: theme.color.textDanger },
  sectionTitle: {
    fontWeight: 600,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    paddingBottom: theme.spacing.xs,
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
  },
  layerRow: {
    display: "grid",
    gridTemplateColumns: "minmax(100px, 1fr) 110px 100px auto 32px",
    gap: theme.spacing.sm,
    alignItems: "center",
    marginBottom: theme.spacing.sm,
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
  open: boolean;
  mode: WizardMode;
  initialName?: string;
  initialDescription?: string;
  initialType?: string;
  initialLayers?: WizardLayer[];
  onClose: () => void;
}

export function MapDefinitionWizardDialog({
  open,
  mode,
  initialName = "",
  initialDescription = "",
  initialType = "General",
  initialLayers = [],
  onClose,
}: WizardProps) {
  const { t } = useAppTranslation();
  const styles = useWizardStyles();
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
    mode === MODE_CREATE
      ? t(L.createTitle)
      : mode === MODE_EDIT
        ? t(L.editTitle)
        : t(L.createTitle);
  const finishLabel = mode === MODE_EDIT ? t(L.update) : t(L.create);

  const field = (labelKey: TranslationKey, required: boolean, control: React.ReactNode) => (
    <FormField
      label={
        <>
          <span className={styles.label}>
            {required && <span className={styles.required}>* </span>}
            {t(labelKey)}
          </span>
        </>
      }
    >
      {control}
    </FormField>
  );

  const addLayer = () =>
    setLayers([...layers, { name: "", layerType: "Bin", dataType: "String", isDefault: false }]);
  const removeLayer = (index: number) => setLayers(layers.filter((_, i) => i !== index));
  const updateLayer = (index: number, patch: Partial<WizardLayer>) =>
    setLayers(layers.map((l, i) => (i === index ? { ...l, ...patch } : l)));

  const steps = [t(L.stepGeneral), t(L.stepLayers), t(L.stepFilters)];

  return (
    <BaseDialog
      open={open}
      title={title}
      onClose={onClose}
      width="1100px"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {t(L.cancel)}
          </Button>
          {step > 0 && (
            <Button variant="secondary" onClick={() => setStep(step - 1)}>
              {t(L.back)}
            </Button>
          )}
          {step < 2 ? (
            <Button
              variant="primary"
              onClick={() => setStep(step + 1)}
              disabled={name.trim() === ""}
            >
              {t(L.next)}
            </Button>
          ) : (
            <Button variant="primary" onClick={onClose} disabled={name.trim() === ""}>
              {finishLabel}
            </Button>
          )}
        </>
      }
    >
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
      {step === 0 && (
        <>
          <div className={styles.sectionTitle}>{t(L.generalData)}</div>
          {field(
            L.name,
            true,
            <Input
              value={name}
              disabled={mode === MODE_EDIT}
              onChange={setName}
            />,
          )}
          {field(
            L.description,
            false,
            <Input value={description} onChange={setDescription} />,
          )}
          {field(L.type, true, <Input value={mapType} onChange={setMapType} />)}
          <div className={styles.sectionTitle}>{t(L.information)}</div>
          {field(
            L.layoutType,
            true,
            <div style={{ display: "flex", gap: theme.spacing.lg }}>
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
          {field(L.rows, true, <Input value={rows} onChange={setRows} />)}
          {field(
            L.columns,
            true,
            <Input value={columns} onChange={setColumns} />,
          )}
          {field(L.height, false, <Input value={height} onChange={setHeight} />)}
          {field(L.width, false, <Input value={width} onChange={setWidth} />)}
          {field(
            L.dimensionUnits,
            false,
            <Input value={dimensionUnits} onChange={setDimensionUnits} />,
          )}
          {field(
            L.maskFile,
            false,
            <div style={{ display: "flex", gap: theme.spacing.sm }}>
              <Input value={maskFile} style={{ flex: 1 }} readOnly />
              <Button variant="secondary">{t(L.browse)}</Button>
              <Button variant="secondary" onClick={() => setMaskFile("")}>
                {t(L.clear)}
              </Button>
            </div>,
          )}
          <div className={styles.sectionTitle}>{t(L.colors)}</div>
          {field(
            L.emptyUnitsColor,
            false,
            <input
              type="color"
              value={emptyUnitsColor}
              onChange={(e) => setEmptyUnitsColor(e.target.value)}
            />,
          )}
          {field(
            L.gridLinesColor,
            false,
            <input
              type="color"
              value={gridLinesColor}
              onChange={(e) => setGridLinesColor(e.target.value)}
            />,
          )}
          {field(
            L.showGridLinesByDefault,
            false,
            <Checkbox
              checked={showGridLines}
              onChange={setShowGridLines}
            />,
          )}
          <div className={styles.sectionTitle}>{t(L.options)}</div>
          {field(L.notch, false, <Input value={notch} onChange={setNotch} />)}
          {field(
            L.defaultRotation,
            false,
            <Input value={rotation} onChange={setRotation} />,
          )}
          {field(
            L.materialUnits,
            false,
            <Input value={materialUnits} onChange={setMaterialUnits} />,
          )}
          {field(
            L.rulerMode,
            false,
            <Input value={rulerMode} onChange={setRulerMode} />,
          )}
          {field(
            L.showRulerByDefault,
            false,
            <Checkbox checked={showRuler} onChange={setShowRuler} />,
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
                onChange={(value) => updateLayer(index, { name: value })}
              />
              <Input
                placeholder={t(L.layerType)}
                value={layer.layerType}
                onChange={(value) => updateLayer(index, { layerType: value })}
              />
              <Input
                placeholder={t(L.dataType)}
                value={layer.dataType}
                onChange={(value) => updateLayer(index, { dataType: value })}
              />
              <Checkbox
                checked={layer.isDefault}
                onChange={(checked) => updateLayer(index, { isDefault: checked === true })}
                label={t(L.isDefault)}
              />
              <Button variant="subtle" onClick={() => removeLayer(index)}>
                {t(L.removeLayer)}
              </Button>
            </div>
          ))}
          <Button variant="secondary" onClick={addLayer}>
            {t(L.addLayer)}
          </Button>
          <div style={{ marginTop: theme.spacing.md }}>
            <Text size={300}>
              {t(L.showGridLinesByDefault)}: {booleanLabel(showGridLines)} |{" "}
              {t(L.showRulerByDefault)}: {booleanLabel(showRuler)}
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
    </BaseDialog>
  );
}
