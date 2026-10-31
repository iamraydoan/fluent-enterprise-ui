import { useState } from "react";
import { BaseDialog, DialogFooter } from "@/components/common";
import { Add24Regular, Delete20Regular } from "@/components/icons";
import {
  Button,
  Checkbox,
  Input,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Text,
  makeStyles,
  tokens,
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import {
  PRODUCT_GROUP_MATURITIES,
  PRODUCT_GROUP_TYPES,
  PRODUCT_GROUP_UNITS,
  REPORTING_TYPES,
  TERMINATE_LEVELS,
} from "./productGroupOptions";

const useDialogStyles = makeStyles({
  steps: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 20px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  step: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "12px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  stepNumber: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    fontSize: "11px",
    fontWeight: 700,
    backgroundColor: tokens.colorNeutralBackground5,
    color: tokens.colorNeutralForeground2,
  },
  stepActive: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
  },
  stepDone: {
    backgroundColor: tokens.colorPaletteGreenBackground3,
    color: tokens.colorPaletteGreenForeground3,
  },
  field: { marginBottom: "16px" },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: 600,
    marginBottom: "6px",
  },
  required: { color: tokens.colorPaletteRedForeground1, marginRight: "4px" },
  hint: { fontSize: "12px", color: tokens.colorNeutralForeground3, marginTop: "4px" },
  row: { display: "flex", gap: "12px" },
  col: { flex: 1 },
});

interface DialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: () => void;
}

const PARAM_TYPES = ["Characteristic", "Specification"] as const;

function WizardSteps({ steps, current }: { steps: string[]; current: number }) {
  const styles = useDialogStyles();
  return (
    <div className={styles.steps}>
      {steps.map((step, i) => (
        <div key={step} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {i > 0 && (
            <div
              style={{
                width: "24px",
                height: "1px",
                backgroundColor: tokens.colorNeutralStroke2,
              }}
            />
          )}
          <div className={styles.step}>
            <span
              className={`${styles.stepNumber} ${
                i === current ? styles.stepActive : i < current ? styles.stepDone : ""
              }`}
            >
              {i + 1}
            </span>
            <span
              style={{
                color:
                  i === current ? tokens.colorNeutralForeground1 : tokens.colorNeutralForeground3,
              }}
            >
              {step}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  const styles = useDialogStyles();
  return (
    <div className={styles.field}>
      <label className={styles.label}>
        {required && <span className={styles.required}>*</span>}
        {label}
      </label>
      {children}
      {hint && <div className={styles.hint}>{hint}</div>}
    </div>
  );
}

export function CreateProductGroupDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [step, setStep] = useState(0);
  const [useAutoChangeSet, setUseAutoChangeSet] = useState(false);
  const [name, setName] = useState("");
  const [revision, setRevision] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Standard");
  const [defaultUnits, setDefaultUnits] = useState("Cookies");
  const [maturity, setMaturity] = useState("");
  const [flowPath, setFlowPath] = useState("");
  const [comments, setComments] = useState("");

  const reset = () => {
    setStep(0);
    setUseAutoChangeSet(false);
    setName("");
    setRevision("");
    setDescription("");
    setType("Standard");
    setDefaultUnits("Cookies");
    setMaturity("");
    setFlowPath("");
    setComments("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = () => {
    onSubmit?.();
    handleClose();
  };

  return (
    <BaseDialog
      open={open}
      onClose={handleClose}
      title={t("businessData.productGroup.operations.create.title")}
      size="xl"
      footer={
        <>
          <Button onClick={handleClose}>
            {t("businessData.productGroup.operations.create.cancel")}
          </Button>
          {step > 0 && (
            <Button onClick={() => setStep(step - 1)}>
              {t("businessData.productGroup.operations.create.back")}
            </Button>
          )}
          {step < 1 ? (
            <Button appearance="primary" onClick={() => setStep(step + 1)}>
              {t("businessData.productGroup.operations.create.next")}
            </Button>
          ) : (
            <Button appearance="primary" onClick={handleSubmit} disabled={!name || !type}>
              {t("businessData.productGroup.operations.create.submit")}
            </Button>
          )}
        </>
      }
    >
      <WizardSteps
        steps={[
          t("businessData.productGroup.operations.create.steps.changeSet"),
          t("businessData.productGroup.operations.create.steps.generalData"),
        ]}
        current={step}
      />
      <div style={{ paddingTop: "16px" }}>
        {step === 0 && (
          <>
            <Field
              label={t("businessData.productGroup.operations.create.fields.changeSet")}
              hint={t("businessData.productGroup.operations.create.hints.changeSet")}
            >
              <Input
                placeholder={t(
                  "businessData.productGroup.operations.create.placeholders.selectChangeSet",
                )}
                disabled={useAutoChangeSet}
              />
            </Field>
            <Field label={t("businessData.productGroup.operations.create.fields.approvalRole")}>
              <Input
                placeholder={t(
                  "businessData.productGroup.operations.create.placeholders.selectApprovalRole",
                )}
              />
            </Field>
            <Checkbox
              checked={useAutoChangeSet}
              onChange={(_, d) => setUseAutoChangeSet(d.checked === true)}
              label={t("businessData.productGroup.operations.create.fields.useAutomaticChangeSet")}
            />
          </>
        )}
        {step === 1 && (
          <>
            <Field label={t("businessData.productGroup.operations.create.fields.name")} required>
              <Input
                value={name}
                onChange={(_, d) => setName(d.value)}
                placeholder={t(
                  "businessData.productGroup.operations.create.placeholders.enterName",
                )}
              />
            </Field>
            <Field
              label={t("businessData.productGroup.operations.create.fields.revision")}
              hint={t("businessData.productGroup.operations.create.hints.revision")}
            >
              <Input
                value={revision}
                onChange={(_, d) => setRevision(d.value)}
                placeholder={t(
                  "businessData.productGroup.operations.create.placeholders.revisionHint",
                )}
              />
            </Field>
            <Field label={t("businessData.productGroup.operations.create.fields.description")}>
              <Input
                value={description}
                onChange={(_, d) => setDescription(d.value)}
                placeholder={t(
                  "businessData.productGroup.operations.create.placeholders.enterDescription",
                )}
              />
            </Field>
            <Field
              label={t("businessData.productGroup.operations.create.fields.type")}
              required
              hint={t("businessData.productGroup.operations.create.hints.type")}
            >
              <Menu>
                <MenuTrigger disableButtonEnhancement>
                  <Button style={{ width: "100%", justifyContent: "space-between" }}>
                    {type ||
                      t("businessData.productGroup.operations.create.placeholders.selectType")}
                  </Button>
                </MenuTrigger>
                <MenuPopover>
                  <MenuList>
                    {PRODUCT_GROUP_TYPES.map((opt) => (
                      <MenuItem key={opt} onClick={() => setType(opt)}>
                        {opt}
                      </MenuItem>
                    ))}
                  </MenuList>
                </MenuPopover>
              </Menu>
            </Field>
            <div className={styles.row}>
              <div className={styles.col}>
                <Field
                  label={t("businessData.productGroup.operations.create.fields.defaultUnits")}
                  hint={t("businessData.productGroup.operations.create.hints.defaultUnits")}
                >
                  <Menu>
                    <MenuTrigger disableButtonEnhancement>
                      <Button style={{ width: "100%", justifyContent: "space-between" }}>
                        {defaultUnits ||
                          t("businessData.productGroup.operations.create.placeholders.selectUnits")}
                      </Button>
                    </MenuTrigger>
                    <MenuPopover>
                      <MenuList>
                        {PRODUCT_GROUP_UNITS.map((opt) => (
                          <MenuItem key={opt} onClick={() => setDefaultUnits(opt)}>
                            {opt}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </MenuPopover>
                  </Menu>
                </Field>
              </div>
              <div className={styles.col}>
                <Field
                  label={t("businessData.productGroup.operations.create.fields.maturity")}
                  hint={t("businessData.productGroup.operations.create.hints.maturity")}
                >
                  <Menu>
                    <MenuTrigger disableButtonEnhancement>
                      <Button style={{ width: "100%", justifyContent: "space-between" }}>
                        {maturity ||
                          t(
                            "businessData.productGroup.operations.create.placeholders.selectMaturity",
                          )}
                      </Button>
                    </MenuTrigger>
                    <MenuPopover>
                      <MenuList>
                        {PRODUCT_GROUP_MATURITIES.map((opt) => (
                          <MenuItem key={opt} onClick={() => setMaturity(opt)}>
                            {opt}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </MenuPopover>
                  </Menu>
                </Field>
              </div>
            </div>
            <Field
              label={t("businessData.productGroup.operations.create.fields.flowPath")}
              hint={t("businessData.productGroup.operations.create.hints.flowPath")}
            >
              <Input
                value={flowPath}
                onChange={(_, d) => setFlowPath(d.value)}
                placeholder={t(
                  "businessData.productGroup.operations.create.placeholders.selectFlowPath",
                )}
              />
            </Field>
            <Field label={t("businessData.productGroup.operations.create.fields.comments")}>
              <Input
                value={comments}
                onChange={(_, d) => setComments(d.value)}
                placeholder={t(
                  "businessData.productGroup.operations.create.placeholders.enterComments",
                )}
              />
            </Field>
          </>
        )}
      </div>
    </BaseDialog>
  );
}

export function EditProductGroupDialog({
  open,
  onClose,
  onSubmit,
  initialName,
}: DialogProps & { initialName?: string }) {
  const { t } = useAppTranslation();
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Standard");
  const [defaultUnits, setDefaultUnits] = useState("Cookies");
  const [maturity, setMaturity] = useState("");

  const handleClose = () => {
    setDescription("");
    setType("Standard");
    setDefaultUnits("Cookies");
    setMaturity("");
    onClose();
  };

  const handleSubmit = () => {
    onSubmit?.();
    handleClose();
  };

  return (
    <BaseDialog
      open={open}
      onClose={handleClose}
      title={t("businessData.productGroup.operations.edit.title")}
      size="xl"
      footer={
        <DialogFooter
          onCancel={handleClose}
          onConfirm={handleSubmit}
          confirmLabel={t("businessData.productGroup.operations.edit.submit")}
        />
      }
    >
      <Field
        label={t("businessData.productGroup.operations.edit.fields.name")}
        hint={t("businessData.productGroup.operations.edit.hints.nameLocked")}
      >
        <Input value={initialName ?? ""} disabled />
      </Field>
      <Field label={t("businessData.productGroup.operations.edit.fields.description")}>
        <Input
          value={description}
          onChange={(_, d) => setDescription(d.value)}
          placeholder={t(
            "businessData.productGroup.operations.create.placeholders.enterDescription",
          )}
        />
      </Field>
      <Field label={t("businessData.productGroup.operations.edit.fields.type")}>
        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <Button style={{ width: "100%", justifyContent: "space-between" }}>{type}</Button>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              {PRODUCT_GROUP_TYPES.map((opt) => (
                <MenuItem key={opt} onClick={() => setType(opt)}>
                  {opt}
                </MenuItem>
              ))}
            </MenuList>
          </MenuPopover>
        </Menu>
      </Field>
      <Field label={t("businessData.productGroup.operations.edit.fields.defaultUnits")}>
        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <Button style={{ width: "100%", justifyContent: "space-between" }}>
              {defaultUnits}
            </Button>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              {PRODUCT_GROUP_UNITS.map((opt) => (
                <MenuItem key={opt} onClick={() => setDefaultUnits(opt)}>
                  {opt}
                </MenuItem>
              ))}
            </MenuList>
          </MenuPopover>
        </Menu>
      </Field>
      <Field label={t("businessData.productGroup.operations.edit.fields.maturity")}>
        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <Button style={{ width: "100%", justifyContent: "space-between" }}>
              {maturity ||
                t("businessData.productGroup.operations.create.placeholders.selectMaturity")}
            </Button>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              {PRODUCT_GROUP_MATURITIES.map((opt) => (
                <MenuItem key={opt} onClick={() => setMaturity(opt)}>
                  {opt}
                </MenuItem>
              ))}
            </MenuList>
          </MenuPopover>
        </Menu>
      </Field>
    </BaseDialog>
  );
}

export function CloneProductGroupDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [rows, setRows] = useState([{ name: "", revision: "" }]);
  const [comment, setComment] = useState("");

  const addRow = () => setRows([...rows, { name: "", revision: "" }]);
  const removeRow = (i: number) => setRows(rows.filter((_, idx) => idx !== i));
  const updateRowName = (i: number, value: string) => {
    const next = [...rows];
    next[i] = { ...next[i], name: value };
    setRows(next);
  };
  const updateRowRevision = (i: number, value: string) => {
    const next = [...rows];
    next[i] = { ...next[i], revision: value };
    setRows(next);
  };

  const handleClose = () => {
    setRows([{ name: "", revision: "" }]);
    setComment("");
    onClose();
  };

  const handleSubmit = () => {
    onSubmit?.();
    handleClose();
  };

  return (
    <BaseDialog
      open={open}
      onClose={handleClose}
      title={t("businessData.productGroup.operations.clone.title")}
      size="xl"
      footer={
        <DialogFooter
          onCancel={handleClose}
          onConfirm={handleSubmit}
          confirmLabel={t("businessData.productGroup.operations.clone.submit")}
        />
      }
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <Text weight="semibold">
          {t("businessData.productGroup.operations.clone.newInstances")}
        </Text>
        <Button appearance="subtle" icon={<Add24Regular />} onClick={addRow}>
          {t("businessData.productGroup.operations.clone.add")}
        </Button>
      </div>
      {rows.map((row, i) => (
        <div key={i} className={styles.row} style={{ marginBottom: "12px" }}>
          <div className={styles.col}>
            <Input
              value={row.name}
              onChange={(_, d) => updateRowName(i, d.value)}
              placeholder={t("businessData.productGroup.operations.clone.placeholders.newRowName")}
            />
          </div>
          <div className={styles.col}>
            <Input
              value={row.revision}
              onChange={(_, d) => updateRowRevision(i, d.value)}
              placeholder={t(
                "businessData.productGroup.operations.clone.placeholders.newRowRevision",
              )}
            />
          </div>
          {rows.length > 1 && (
            <Button
              appearance="subtle"
              icon={<Delete20Regular />}
              onClick={() => removeRow(i)}
              aria-label={t("businessData.productGroup.operations.clone.removeRow")}
            />
          )}
        </div>
      ))}
      <div className={styles.hint} style={{ marginBottom: "16px" }}>
        {t("businessData.productGroup.operations.clone.hints.nameGenerator")}
      </div>
      <Field label={t("businessData.productGroup.operations.clone.fields.comment")}>
        <Input
          value={comment}
          onChange={(_, d) => setComment(d.value)}
          placeholder={t("businessData.productGroup.operations.create.placeholders.enterComment")}
        />
      </Field>
    </BaseDialog>
  );
}

export function TerminateProductGroupDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const [level, setLevel] = useState("Revision");

  const handleClose = () => {
    setLevel("Revision");
    onClose();
  };

  const handleSubmit = () => {
    onSubmit?.();
    handleClose();
  };

  return (
    <BaseDialog
      open={open}
      onClose={handleClose}
      title={t("businessData.productGroup.operations.terminate.title")}
      size="xl"
      footer={
        <DialogFooter
          onCancel={handleClose}
          onConfirm={handleSubmit}
          confirmLabel={t("businessData.productGroup.operations.terminate.submit")}
        />
      }
    >
      <Field label={t("businessData.productGroup.operations.terminate.fields.level")}>
        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <Button style={{ width: "100%", justifyContent: "space-between" }}>{level}</Button>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              {TERMINATE_LEVELS.map((opt) => (
                <MenuItem key={opt} onClick={() => setLevel(opt)}>
                  {opt}
                </MenuItem>
              ))}
            </MenuList>
          </MenuPopover>
        </Menu>
      </Field>
      <div
        style={{
          padding: "12px",
          backgroundColor: tokens.colorPaletteYellowBackground1,
          borderRadius: "4px",
          fontSize: "13px",
          marginTop: "8px",
        }}
      >
        {t("businessData.productGroup.operations.terminate.warning")}
      </div>
    </BaseDialog>
  );
}

export function UnterminateProductGroupDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const [step, setStep] = useState(0);
  const [useAutoChangeSet, setUseAutoChangeSet] = useState(false);

  const handleClose = () => {
    setStep(0);
    setUseAutoChangeSet(false);
    onClose();
  };

  const handleSubmit = () => {
    onSubmit?.();
    handleClose();
  };

  return (
    <BaseDialog
      open={open}
      onClose={handleClose}
      title={t("businessData.productGroup.operations.unterminate.title")}
      size="xl"
      footer={
        <>
          <Button onClick={handleClose}>
            {t("businessData.productGroup.operations.unterminate.cancel")}
          </Button>
          {step > 0 && (
            <Button onClick={() => setStep(step - 1)}>
              {t("businessData.productGroup.operations.unterminate.back")}
            </Button>
          )}
          {step < 1 ? (
            <Button appearance="primary" onClick={() => setStep(step + 1)}>
              {t("businessData.productGroup.operations.unterminate.next")}
            </Button>
          ) : (
            <Button appearance="primary" onClick={handleSubmit}>
              {t("businessData.productGroup.operations.unterminate.submit")}
            </Button>
          )}
        </>
      }
    >
      <WizardSteps
        steps={[
          t("businessData.productGroup.operations.unterminate.steps.changeSet"),
          t("businessData.productGroup.operations.unterminate.steps.details"),
        ]}
        current={step}
      />
      <div style={{ paddingTop: "16px" }}>
        {step === 0 && (
          <>
            <Field label={t("businessData.productGroup.operations.unterminate.fields.changeSet")}>
              <Input
                placeholder={t(
                  "businessData.productGroup.operations.create.placeholders.selectChangeSet",
                )}
                disabled={useAutoChangeSet}
              />
            </Field>
            <Field
              label={t("businessData.productGroup.operations.unterminate.fields.approvalRole")}
            >
              <Input
                placeholder={t(
                  "businessData.productGroup.operations.create.placeholders.selectApprovalRole",
                )}
              />
            </Field>
            <Checkbox
              checked={useAutoChangeSet}
              onChange={(_, d) => setUseAutoChangeSet(d.checked === true)}
              label={t(
                "businessData.productGroup.operations.unterminate.fields.useAutomaticChangeSet",
              )}
            />
          </>
        )}
        {step === 1 && (
          <div style={{ fontSize: "13px", color: tokens.colorNeutralForeground2 }}>
            {t("businessData.productGroup.operations.unterminate.detailsText")}
          </div>
        )}
      </div>
    </BaseDialog>
  );
}

interface ProductGroupParameter {
  id: string;
  parameter: string;
  unit: string;
  type: "Characteristic" | "Specification";
  value: string;
  lowerSpec: string;
  targetSpec: string;
  upperSpec: string;
  reportingType: string;
  reportingInfo: string;
}

export function ManageProductGroupParametersDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [params, setParams] = useState<ProductGroupParameter[]>([
    {
      id: "1",
      parameter: "Thickness",
      unit: "",
      type: "Characteristic",
      value: "",
      lowerSpec: "",
      targetSpec: "",
      upperSpec: "",
      reportingType: "Non-Critical",
      reportingInfo: "",
    },
  ]);
  const [selectedId, setSelectedId] = useState("1");
  const [comments, setComments] = useState("");

  const selected = params.find((p) => p.id === selectedId);

  const addParam = () => {
    const id = String(Date.now());
    setParams([
      ...params,
      {
        id,
        parameter: "",
        unit: "",
        type: "Characteristic",
        value: "",
        lowerSpec: "",
        targetSpec: "",
        upperSpec: "",
        reportingType: "Non-Critical",
        reportingInfo: "",
      },
    ]);
    setSelectedId(id);
  };

  const removeParam = (id: string) => {
    const next = params.filter((p) => p.id !== id);
    setParams(next);
    if (selectedId === id && next.length > 0) setSelectedId(next[0].id);
  };

  const updateSelected = (patch: Partial<ProductGroupParameter>) => {
    setParams(params.map((p) => (p.id === selectedId ? { ...p, ...patch } : p)));
  };

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = () => {
    onSubmit?.();
    handleClose();
  };

  return (
    <BaseDialog
      open={open}
      onClose={handleClose}
      title={t("businessData.productGroup.operations.manageParameters.title")}
      width="min(1100px, 100%)"
      footer={
        <DialogFooter
          onCancel={handleClose}
          onConfirm={handleSubmit}
          confirmLabel={t("businessData.productGroup.operations.manageParameters.submit")}
        />
      }
    >
      <div style={{ display: "flex", gap: "20px", minHeight: "420px" }}>
        <div style={{ width: "300px", flexShrink: 0 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <Text weight="semibold">
              {t("businessData.productGroup.operations.manageParameters.parameters")}
            </Text>
            <div style={{ display: "flex", gap: "4px" }}>
              <Button appearance="subtle" icon={<Add24Regular />} onClick={addParam} />
              {selected && (
                <Button
                  appearance="subtle"
                  icon={<Delete20Regular />}
                  onClick={() => removeParam(selected.id)}
                />
              )}
            </div>
          </div>
          <div
            style={{
              border: `1px solid ${tokens.colorNeutralStroke2}`,
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            {params.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                style={{
                  padding: "10px 12px",
                  cursor: "pointer",
                  backgroundColor:
                    p.id === selectedId ? tokens.colorBrandBackground2 : "transparent",
                  borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text>
                  {p.parameter ||
                    t("businessData.productGroup.operations.manageParameters.newParam")}
                </Text>
                <Button
                  appearance="subtle"
                  icon={<Delete20Regular />}
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeParam(p.id);
                  }}
                />
              </div>
            ))}
            {params.length === 0 && (
              <div
                style={{
                  padding: "16px",
                  textAlign: "center",
                  color: tokens.colorNeutralForeground3,
                }}
              >
                {t("businessData.productGroup.operations.manageParameters.empty")}
              </div>
            )}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <Text weight="semibold" style={{ marginBottom: "16px", display: "block" }}>
            {t("businessData.productGroup.operations.manageParameters.parameterDetails")}
          </Text>
          {selected ? (
            <>
              <Field
                label={t("businessData.productGroup.operations.manageParameters.fields.parameter")}
                required
              >
                <Input
                  value={selected.parameter}
                  onChange={(_, d) => updateSelected({ parameter: d.value })}
                  placeholder={t(
                    "businessData.productGroup.operations.create.placeholders.selectParameter",
                  )}
                />
              </Field>
              <Field label={t("businessData.productGroup.operations.manageParameters.fields.unit")}>
                <Input
                  value={selected.unit}
                  onChange={(_, d) => updateSelected({ unit: d.value })}
                />
              </Field>
              <Field label={t("businessData.productGroup.operations.manageParameters.fields.type")}>
                <div style={{ display: "flex", gap: "16px" }}>
                  {PARAM_TYPES.map((opt) => (
                    <label
                      key={opt}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "13px",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        name="paramType"
                        checked={selected.type === opt}
                        onChange={() => updateSelected({ type: opt })}
                      />
                      {t(
                        `businessData.productGroup.operations.manageParameters.types.${opt.toLowerCase()}` as never,
                      )}
                    </label>
                  ))}
                </div>
              </Field>
              {selected.type === "Characteristic" ? (
                <Field
                  label={t("businessData.productGroup.operations.manageParameters.fields.value")}
                >
                  <Input
                    value={selected.value}
                    onChange={(_, d) => updateSelected({ value: d.value })}
                    style={{ maxWidth: "280px" }}
                  />
                </Field>
              ) : (
                <>
                  <div className={styles.row}>
                    <div className={styles.col}>
                      <Field
                        label={t(
                          "businessData.productGroup.operations.manageParameters.fields.lowerSpec",
                        )}
                      >
                        <Input
                          value={selected.lowerSpec}
                          onChange={(_, d) => updateSelected({ lowerSpec: d.value })}
                        />
                      </Field>
                    </div>
                    <div className={styles.col}>
                      <Field
                        label={t(
                          "businessData.productGroup.operations.manageParameters.fields.targetSpec",
                        )}
                      >
                        <Input
                          value={selected.targetSpec}
                          onChange={(_, d) => updateSelected({ targetSpec: d.value })}
                        />
                      </Field>
                    </div>
                    <div className={styles.col}>
                      <Field
                        label={t(
                          "businessData.productGroup.operations.manageParameters.fields.upperSpec",
                        )}
                      >
                        <Input
                          value={selected.upperSpec}
                          onChange={(_, d) => updateSelected({ upperSpec: d.value })}
                        />
                      </Field>
                    </div>
                  </div>
                </>
              )}
              <Field
                label={t(
                  "businessData.productGroup.operations.manageParameters.fields.reportingType",
                )}
                hint={t(
                  "businessData.productGroup.operations.manageParameters.hints.reportingType",
                )}
              >
                <Menu>
                  <MenuTrigger disableButtonEnhancement>
                    <Button style={{ width: "100%", justifyContent: "space-between" }}>
                      {selected.reportingType}
                    </Button>
                  </MenuTrigger>
                  <MenuPopover>
                    <MenuList>
                      {REPORTING_TYPES.map((opt) => (
                        <MenuItem key={opt} onClick={() => updateSelected({ reportingType: opt })}>
                          {opt}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </MenuPopover>
                </Menu>
              </Field>
              <Field
                label={t(
                  "businessData.productGroup.operations.manageParameters.fields.reportingInfo",
                )}
              >
                <Input
                  value={selected.reportingInfo}
                  onChange={(_, d) => updateSelected({ reportingInfo: d.value })}
                />
              </Field>
            </>
          ) : (
            <div style={{ color: tokens.colorNeutralForeground3, fontSize: "13px" }}>
              {t("businessData.productGroup.operations.manageParameters.selectPrompt")}
            </div>
          )}
        </div>
      </div>
      <Field label={t("businessData.productGroup.operations.manageParameters.fields.comments")}>
        <Input
          value={comments}
          onChange={(_, d) => setComments(d.value)}
          placeholder={t("businessData.productGroup.operations.create.placeholders.enterComments")}
        />
      </Field>
    </BaseDialog>
  );
}
