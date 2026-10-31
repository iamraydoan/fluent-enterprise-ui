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
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import {
  PRODUCT_GROUP_MATURITIES,
  PRODUCT_GROUP_TYPES,
  PRODUCT_GROUP_UNITS,
} from "../productGroupOptions";
import { WizardSteps, Field } from "./DialogPrimitives";
import { useDialogStyles } from "./dialogShared";
import type { DialogProps } from "./dialogShared";

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
