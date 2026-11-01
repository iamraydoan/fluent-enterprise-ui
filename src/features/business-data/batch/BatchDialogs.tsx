import { useState } from "react";
import { BaseDialog, DialogFooter, FormField, Empty, Grid } from "@/components/common";
import { Button, Checkbox, Input, Text, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { theme } from "@/styles/theme";
import type { OperationOnChange, OperationValues } from "../components/operationTypes";

const useListStyles = makeStyles({
  row: { marginBottom: theme.spacing.sm },
  hint: { fontSize: "13px", color: theme.color.textSecondary, marginBottom: theme.spacing.md },
});

export interface MaterialRow {
  id: number;
  material: string;
  isMain: boolean;
}

export interface ContainerRow {
  id: number;
  container: string;
}


export function MaterialListEditor({
  values,
  onChange,
}: {
  values: OperationValues;
  onChange: OperationOnChange;
}) {
  const { t } = useAppTranslation();
  const styles = useListStyles();
  const rows = (values.materials as unknown as MaterialRow[] | undefined) ?? [];

  const setRows = (next: MaterialRow[]) => onChange("materials", next);

  const addRow = () =>
    setRows([...rows, { id: Date.now() + rows.length, material: "", isMain: rows.length === 0 }]);

  const removeRow = (id: number) => setRows(rows.filter((row) => row.id !== id));

  const setMain = (id: number) => setRows(rows.map((row) => ({ ...row, isMain: row.id === id })));

  return (
    <div>
      <div className={styles.hint}>{t("businessData.batch.operations.materialsHint")}</div>
      {rows.length === 0 && <Empty>{t("businessData.batch.operations.noMaterials")}</Empty>}
      {rows.map((row) => (
        <Grid columns="minmax(0, 1fr) auto auto" gap="12px" className={styles.row} style={{ alignItems: "center" }}>
          <Input
            placeholder={t("businessData.batch.operations.materialName")}
            value={row.material}
            onChange={(value) =>
              setRows(rows.map((r) => (r.id === row.id ? { ...r, material: value } : r)))
            }
          />
          <Checkbox
            label={t("businessData.batch.operations.setAsMain")}
            checked={row.isMain}
            onChange={() => setMain(row.id)}
          />
          <Button variant="secondary" onClick={() => removeRow(row.id)}>
            {t("common.remove")}
          </Button>
        </Grid>
      ))}
      <Button variant="secondary" onClick={addRow}>
        {t("common.add")}
      </Button>
    </div>
  );
}

export function ContainerListEditor({
  values,
  onChange,
}: {
  values: OperationValues;
  onChange: OperationOnChange;
}) {
  const { t } = useAppTranslation();
  const styles = useListStyles();
  const rows = (values.containers as unknown as ContainerRow[] | undefined) ?? [];

  const setRows = (next: ContainerRow[]) => onChange("containers", next);

  const addRow = () => setRows([...rows, { id: Date.now() + rows.length, container: "" }]);

  const removeRow = (id: number) => setRows(rows.filter((row) => row.id !== id));

  return (
    <div>
      <div className={styles.hint}>{t("businessData.batch.operations.containersHint")}</div>
      {rows.length === 0 && <Empty>{t("businessData.batch.operations.noContainers")}</Empty>}
      {rows.map((row) => (
        <Grid columns="minmax(0, 1fr) auto auto" gap="12px" className={styles.row} style={{ alignItems: "center" }}>
          <Input
            placeholder={t("businessData.batch.operations.containerName")}
            value={row.container}
            onChange={(value) =>
              setRows(rows.map((r) => (r.id === row.id ? { ...r, container: value } : r)))
            }
          />
          <span />
          <Button variant="secondary" onClick={() => removeRow(row.id)}>
            {t("common.remove")}
          </Button>
        </Grid>
      ))}
      <Button variant="secondary" onClick={addRow}>
        {t("common.add")}
      </Button>
    </div>
  );
}


export function ManageBatchMaterialsDialog({
  open,
  batchName,
  onClose,
}: {
  open: boolean;
  batchName: string;
  onClose: () => void;
}) {
  const { t } = useAppTranslation();
  const [values, setValues] = useState<OperationValues>({});
  const [comment, setComment] = useState("");

  return (
    <BaseDialog
      open={open}
      title={t("businessData.batch.operations.manageMaterials")}
      onClose={onClose}
      size="lg"
      footer={
        <DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={t("common.update")} />
      }
    >
      <Text>{t("businessData.batch.operations.manageMaterialsHint", { name: batchName })}</Text>
      <div style={{ marginTop: theme.spacing.md }}>
        <MaterialListEditor
          values={values}
          onChange={(key, value) => setValues((prev) => ({ ...prev, [key]: value }))}
        />
      </div>
      <FormField label={t("businessData.batch.operations.comment")} labelWidth="170px" labelAlign="right" style={{ marginTop: theme.spacing.lg }}>
        <Input value={comment} onChange={setComment} />
      </FormField>
    </BaseDialog>
  );
}

export function ManageBatchContainersDialog({
  open,
  batchName,
  onClose,
}: {
  open: boolean;
  batchName: string;
  onClose: () => void;
}) {
  const { t } = useAppTranslation();
  const [values, setValues] = useState<OperationValues>({});

  return (
    <BaseDialog
      open={open}
      title={t("businessData.batch.operations.manageContainers")}
      onClose={onClose}
      size="lg"
      footer={
        <DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={t("common.update")} />
      }
    >
      <Text>{t("businessData.batch.operations.manageContainersHint", { name: batchName })}</Text>
      <div style={{ marginTop: theme.spacing.md }}>
        <ContainerListEditor
          values={values}
          onChange={(key, value) => setValues((prev) => ({ ...prev, [key]: value }))}
        />
      </div>
    </BaseDialog>
  );
}

export function ChangeBatchResourceDialog({
  open,
  batchName,
  currentResource,
  onClose,
  onChange,
}: {
  open: boolean;
  batchName: string;
  currentResource: string;
  onClose: () => void;
  onChange: (resource: string) => void;
}) {
  const { t } = useAppTranslation();
  const [resource, setResource] = useState(currentResource);
  const [comment, setComment] = useState("");

  return (
    <BaseDialog
      open={open}
      title={t("businessData.batch.operations.changeResource")}
      onClose={onClose}
      size="lg"
      footer={
        <DialogFooter
          onCancel={onClose}
          onConfirm={() => {
            onChange(resource);
            onClose();
          }}
          confirmLabel={t("businessData.batch.operations.change")}
        />
      }
    >
      <FormField
        label={t("businessData.batch.detail.resource")}
        labelWidth="170px"
      >
        <Input value={resource} onChange={setResource} />
      </FormField>
      <FormField
        label={t("businessData.batch.operations.comment")}
        labelWidth="170px"
      >
        <Input value={comment} onChange={setComment} />
      </FormField>
      <Text>{t("businessData.batch.operations.changeResourceHint", { name: batchName })}</Text>
    </BaseDialog>
  );
}
