import { useState } from "react";
import { BaseDialog, DialogFooter } from "@/components/common";
import { Button, Checkbox, Input, Text, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { OperationValues } from "../components/operationTypes";

export interface MaterialRow {
  id: number;
  material: string;
  isMain: boolean;
}

export interface ContainerRow {
  id: number;
  container: string;
}

const useListStyles = makeStyles({
  row: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto auto",
    columnGap: "12px",
    alignItems: "center",
    marginBottom: "8px",
  },
  empty: { padding: "16px", textAlign: "center", color: tokens.colorNeutralForeground3 },
  hint: { fontSize: "13px", color: tokens.colorNeutralForeground2, marginBottom: "12px" },
});

export function MaterialListEditor({
  values,
  onChange,
}: {
  values: OperationValues;
  onChange: (key: string, value: string | number | boolean) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useListStyles();
  const rows = (values.materials as unknown as MaterialRow[] | undefined) ?? [];

  const setRows = (next: MaterialRow[]) => onChange("materials", next as unknown as boolean);

  const addRow = () =>
    setRows([...rows, { id: Date.now() + rows.length, material: "", isMain: rows.length === 0 }]);

  const removeRow = (id: number) => setRows(rows.filter((row) => row.id !== id));

  const setMain = (id: number) => setRows(rows.map((row) => ({ ...row, isMain: row.id === id })));

  return (
    <div>
      <div className={styles.hint}>{t("businessData.batch.operations.materialsHint")}</div>
      {rows.length === 0 && (
        <div className={styles.empty}>{t("businessData.batch.operations.noMaterials")}</div>
      )}
      {rows.map((row) => (
        <div key={row.id} className={styles.row}>
          <Input
            placeholder={t("businessData.batch.operations.materialName")}
            value={row.material}
            onChange={(_, data) =>
              setRows(rows.map((r) => (r.id === row.id ? { ...r, material: data.value } : r)))
            }
          />
          <Checkbox
            label={t("businessData.batch.operations.setAsMain")}
            checked={row.isMain}
            onChange={() => setMain(row.id)}
          />
          <Button appearance="secondary" onClick={() => removeRow(row.id)}>
            {t("common.remove")}
          </Button>
        </div>
      ))}
      <Button appearance="secondary" onClick={addRow}>
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
  onChange: (key: string, value: string | number | boolean) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useListStyles();
  const rows = (values.containers as unknown as ContainerRow[] | undefined) ?? [];

  const setRows = (next: ContainerRow[]) => onChange("containers", next as unknown as boolean);

  const addRow = () => setRows([...rows, { id: Date.now() + rows.length, container: "" }]);

  const removeRow = (id: number) => setRows(rows.filter((row) => row.id !== id));

  return (
    <div>
      <div className={styles.hint}>{t("businessData.batch.operations.containersHint")}</div>
      {rows.length === 0 && (
        <div className={styles.empty}>{t("businessData.batch.operations.noContainers")}</div>
      )}
      {rows.map((row) => (
        <div key={row.id} className={styles.row}>
          <Input
            placeholder={t("businessData.batch.operations.containerName")}
            value={row.container}
            onChange={(_, data) =>
              setRows(rows.map((r) => (r.id === row.id ? { ...r, container: data.value } : r)))
            }
          />
          <span />
          <Button appearance="secondary" onClick={() => removeRow(row.id)}>
            {t("common.remove")}
          </Button>
        </div>
      ))}
      <Button appearance="secondary" onClick={addRow}>
        {t("common.add")}
      </Button>
    </div>
  );
}

const useManageDialogStyles = makeStyles({
  fieldRow: {
    display: "grid",
    gridTemplateColumns: "170px minmax(0, 1fr)",
    alignItems: "center",
    columnGap: "12px",
    marginBottom: "12px",
  },
  fieldLabel: { fontSize: "13px", color: tokens.colorNeutralForeground2, textAlign: "right" },
});

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
  const styles = useManageDialogStyles();
  const [values, setValues] = useState<OperationValues>({});
  const [comment, setComment] = useState("");

  return (
    <BaseDialog
      open={open}
      title={t("businessData.batch.operations.manageMaterials")}
      onClose={onClose}
      size="lg"
      footer={
        <DialogFooter
          onCancel={onClose}
          onConfirm={onClose}
          confirmLabel={t("common.update")}
        />
      }
    >
      <Text>{t("businessData.batch.operations.manageMaterialsHint", { name: batchName })}</Text>
          <div style={{ marginTop: "12px" }}>
            <MaterialListEditor
              values={values}
              onChange={(key, value) => setValues((prev) => ({ ...prev, [key]: value }))}
            />
          </div>
          <div className={styles.fieldRow} style={{ marginTop: "16px" }}>
            <span className={styles.fieldLabel}>{t("businessData.batch.operations.comment")}</span>
            <Input value={comment} onChange={(_, data) => setComment(data.value)} />
          </div>
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
        <DialogFooter
          onCancel={onClose}
          onConfirm={onClose}
          confirmLabel={t("common.update")}
        />
      }
    >
      <Text>
        {t("businessData.batch.operations.manageContainersHint", { name: batchName })}
      </Text>
          <div style={{ marginTop: "12px" }}>
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
  const styles = useManageDialogStyles();
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
          <div className={styles.fieldRow}>
            <span className={styles.fieldLabel}>{t("businessData.batch.detail.resource")}</span>
            <Input value={resource} onChange={(_, data) => setResource(data.value)} />
          </div>
          <div className={styles.fieldRow}>
            <span className={styles.fieldLabel}>{t("businessData.batch.operations.comment")}</span>
            <Input value={comment} onChange={(_, data) => setComment(data.value)} />
          </div>
          <Text>{t("businessData.batch.operations.changeResourceHint", { name: batchName })}</Text>
    </BaseDialog>
  );
}
