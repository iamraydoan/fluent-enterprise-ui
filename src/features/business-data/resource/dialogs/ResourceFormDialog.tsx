import { useState } from "react";
import type { ResourceDetail, ResourceProcessingType, ResourceRecord } from "@/api";
import { BaseDialog, VStack, WizardSteps } from "@/components/common";
import { Body1Strong, Button, Checkbox, Field, Input } from "@/components/ui";
import { useAppTranslation } from "@/i18n";

interface ResourceFormDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  initial?: Partial<ResourceDetail & ResourceRecord>;
  nameReadOnly?: boolean;
  submitLabel: string;
}

const PROCESSING_TYPES: ResourceProcessingType[] = [
  "Component",
  "Consumable Feed",
  "Instrument",
  "Line",
  "Load Port",
  "Process",
  "Storage",
  "Transport",
];

const CRITICALITIES = ["High", "Medium", "Low"];

const SETUP_MODES = ["Always", "Not Required", "On Changeover"];

export function ResourceFormDialog({
  open,
  onClose,
  title,
  initial,
  nameReadOnly,
  submitLabel,
}: ResourceFormDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.resource.dialogs.form";
  const [step, setStep] = useState(1);
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [type, setType] = useState(initial?.type ?? "Equipment");
  const [processingType, setProcessingType] = useState<ResourceProcessingType>(
    initial?.processingType ?? "Process",
  );
  const [area, setArea] = useState(initial?.area ?? "");
  const [priority, setPriority] = useState(String(initial?.priority ?? 1));
  const [displayOrder, setDisplayOrder] = useState(String(initial?.displayOrder ?? 1));
  const [vendor, setVendor] = useState(initial?.vendor ?? "");
  const [model, setModel] = useState(initial?.model ?? "");
  const [serialNumber, setSerialNumber] = useState(initial?.serialNumber ?? "");
  const [criticality, setCriticality] = useState(initial?.criticality ?? "Medium");
  const [stateModel, setStateModel] = useState(initial?.stateModel ?? "SEMI E10");
  const [allowProductMix, setAllowProductMix] = useState(false);
  const [enableSubMaterialTracking, setEnableSubMaterialTracking] = useState(false);
  const [recipeManagementEnabled, setRecipeManagementEnabled] = useState(false);
  const [trackResourceRecipes, setTrackResourceRecipes] = useState(false);
  const [hasStorageBins, setHasStorageBins] = useState(false);
  const [setupMode, setSetupMode] = useState("Not Required");
  const [enableAutomationScenarios, setEnableAutomationScenarios] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [comments, setComments] = useState("");

  const steps = nameReadOnly ? [2] : [1, 2, 3];
  const stepLabels = [t(`${k}.generalData`), t(`${k}.additionalInfo`), t(`${k}.automation`)];

  return (
    <BaseDialog
      open={open}
      title={title}
      onClose={onClose}
      width="min(1000px, 92vw)"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          {!nameReadOnly && step > 1 && (
            <Button variant="secondary" onClick={() => setStep(step - 1)}>
              {t("common.back")}
            </Button>
          )}
          {!nameReadOnly && step < 3 ? (
            <Button variant="primary" onClick={() => setStep(step + 1)}>
              {t("common.next")}
            </Button>
          ) : (
            <Button variant="primary" onClick={onClose}>
              {submitLabel}
            </Button>
          )}
        </>
      }
    >
      {!nameReadOnly && (
        <WizardSteps steps={stepLabels.slice(0, steps.length)} current={step} />
      )}

      {(step === 1 || nameReadOnly) && (
        <VStack gap={12}>
          <Field label={t(`${k}.name`)} required>
            <Input value={name} readOnly={nameReadOnly} onChange={setName} />
          </Field>
          <Field label={t(`${k}.description`)}>
            <Input value={description} onChange={setDescription} />
          </Field>
          <Field label={t(`${k}.type`)} required>
            <Input value={type} onChange={setType} />
          </Field>
          <Field label={t(`${k}.processingType`)} required>
            <select
              value={processingType}
              onChange={(e) => setProcessingType(e.target.value as ResourceProcessingType)}
            >
              {PROCESSING_TYPES.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t(`${k}.area`)}>
            <Input value={area} onChange={setArea} />
          </Field>
          <div style={{ display: "flex", columnGap: 12 }}>
            <Field label={t(`${k}.priority`)}>
              <Input value={priority} onChange={setPriority} />
            </Field>
            <Field label={t(`${k}.displayOrder`)}>
              <Input value={displayOrder} onChange={setDisplayOrder} />
            </Field>
          </div>
          <div style={{ display: "flex", columnGap: 12 }}>
            <Field label={t(`${k}.vendor`)}>
              <Input value={vendor} onChange={setVendor} />
            </Field>
            <Field label={t(`${k}.model`)}>
              <Input value={model} onChange={setModel} />
            </Field>
          </div>
          <Field label={t(`${k}.serialNumber`)}>
            <Input value={serialNumber} onChange={setSerialNumber} />
          </Field>
          <Field label={t(`${k}.criticality`)}>
            <select value={criticality} onChange={(e) => setCriticality(e.target.value)}>
              {CRITICALITIES.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t(`${k}.stateModel`)}>
            <Input value={stateModel} onChange={setStateModel} />
          </Field>
        </VStack>
      )}

      {step === 2 && !nameReadOnly && (
        <VStack gap={12}>
          <Body1Strong>{t(`${k}.materialTracking`)}</Body1Strong>
          <Field label={t(`${k}.allowProductMix`)}>
            <Checkbox
              checked={allowProductMix}
              onChange={setAllowProductMix}
            />
          </Field>
          <Field label={t(`${k}.enableSubMaterialTracking`)}>
            <Checkbox
              checked={enableSubMaterialTracking}
              onChange={setEnableSubMaterialTracking}
            />
          </Field>
          <Field label={t(`${k}.recipeManagementEnabled`)}>
            <Checkbox
              checked={recipeManagementEnabled}
              onChange={setRecipeManagementEnabled}
            />
          </Field>
          <Field label={t(`${k}.trackResourceRecipes`)}>
            <Checkbox
              checked={trackResourceRecipes}
              onChange={setTrackResourceRecipes}
            />
          </Field>
          <Body1Strong>{t(`${k}.materialLogistics`)}</Body1Strong>
          <Field label={t(`${k}.hasStorageBins`)}>
            <Checkbox
              checked={hasStorageBins}
              onChange={setHasStorageBins}
            />
          </Field>
          <Body1Strong>{t(`${k}.setup`)}</Body1Strong>
          <Field label={t(`${k}.setupMode`)}>
            <select value={setupMode} onChange={(e) => setSetupMode(e.target.value)}>
              {SETUP_MODES.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </Field>
          <Body1Strong>{t(`${k}.coordinates`)}</Body1Strong>
          <div style={{ display: "flex", columnGap: 12 }}>
            <Field label={t(`${k}.latitude`)}>
              <Input value={latitude} onChange={setLatitude} />
            </Field>
            <Field label={t(`${k}.longitude`)}>
              <Input value={longitude} onChange={setLongitude} />
            </Field>
          </div>
        </VStack>
      )}

      {step === 3 && !nameReadOnly && (
        <VStack gap={12}>
          <Body1Strong>{t(`${k}.automation`)}</Body1Strong>
          <Field label={t(`${k}.enableAutomationScenarios`)}>
            <Checkbox
              checked={enableAutomationScenarios}
              onChange={setEnableAutomationScenarios}
            />
          </Field>
        </VStack>
      )}

      <Field label={t(`${k}.comments`)}>
        <Input value={comments} onChange={setComments} />
      </Field>
    </BaseDialog>
  );
}
