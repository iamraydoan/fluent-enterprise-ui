import { useState } from "react";
import { Dismiss16Regular } from "@/components/icons";
import { Button, Checkbox, Input, Text, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { cardSurface } from "@/styles/shared";
import type { OperationValues } from "../../components/operationTypes";

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

  const setMain = (id: number) =>
    setRows(rows.map((row) => ({ ...row, isMain: row.id === id })));

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

  const addRow = () =>
    setRows([...rows, { id: Date.now() + rows.length, container: "" }]);

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
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    display: "grid",
    placeItems: "center",
    padding: "24px",
    boxSizing: "border-box",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  surface: {
    width: "min(720px, calc(100vw - 48px))",
    maxHeight: "min(640px, calc(100vh - 48px))",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    ...cardSurface,
  },
  head: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: "52px",
    padding: "0 16px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    flexShrink: 0,
  },
  closeButton: {
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    padding: "6px",
    borderRadius: tokens.borderRadiusMedium,
    display: "flex",
    ":hover": { backgroundColor: tokens.colorNeutralBackground1Hover },
  },
  body: { flexGrow: 1, minHeight: 0, overflowY: "auto", padding: "16px 24px" },
  foot: {
    display: "flex",
    justifyContent: "flex-end",
    columnGap: "8px",
    padding: "12px 24px",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
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

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.surface} onClick={(event) => event.stopPropagation()}>
        <div className={styles.head}>
          <Text weight="semibold">{t("businessData.batch.operations.manageMaterials")}</Text>
          <button className={styles.closeButton} onClick={onClose} aria-label={t("common.close")}>
            <Dismiss16Regular />
          </button>
        </div>
        <div className={styles.body}>
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
        </div>
        <div className={styles.foot}>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button appearance="primary" onClick={onClose}>
            {t("common.update")}
          </Button>
        </div>
      </div>
    </div>
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
  const styles = useManageDialogStyles();
  const [values, setValues] = useState<OperationValues>({});

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.surface} onClick={(event) => event.stopPropagation()}>
        <div className={styles.head}>
          <Text weight="semibold">{t("businessData.batch.operations.manageContainers")}</Text>
          <button className={styles.closeButton} onClick={onClose} aria-label={t("common.close")}>
            <Dismiss16Regular />
          </button>
        </div>
        <div className={styles.body}>
          <Text>{t("businessData.batch.operations.manageContainersHint", { name: batchName })}</Text>
          <div style={{ marginTop: "12px" }}>
            <ContainerListEditor
              values={values}
              onChange={(key, value) => setValues((prev) => ({ ...prev, [key]: value }))}
            />
          </div>
        </div>
        <div className={styles.foot}>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button appearance="primary" onClick={onClose}>
            {t("common.update")}
          </Button>
        </div>
      </div>
    </div>
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

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.surface} onClick={(event) => event.stopPropagation()}>
        <div className={styles.head}>
          <Text weight="semibold">{t("businessData.batch.operations.changeResource")}</Text>
          <button className={styles.closeButton} onClick={onClose} aria-label={t("common.close")}>
            <Dismiss16Regular />
          </button>
        </div>
        <div className={styles.body}>
          <div className={styles.fieldRow}>
            <span className={styles.fieldLabel}>{t("businessData.batch.detail.resource")}</span>
            <Input value={resource} onChange={(_, data) => setResource(data.value)} />
          </div>
          <div className={styles.fieldRow}>
            <span className={styles.fieldLabel}>{t("businessData.batch.operations.comment")}</span>
            <Input value={comment} onChange={(_, data) => setComment(data.value)} />
          </div>
          <Text>{t("businessData.batch.operations.changeResourceHint", { name: batchName })}</Text>
        </div>
        <div className={styles.foot}>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            appearance="primary"
            onClick={() => {
              onChange(resource);
              onClose();
            }}
          >
            {t("businessData.batch.operations.change")}
          </Button>
        </div>
      </div>
    </div>
  );
}

