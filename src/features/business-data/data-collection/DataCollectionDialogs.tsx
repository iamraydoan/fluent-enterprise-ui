import { useState } from "react";
import type { DataCollectionInstance, DataCollectionParameter } from "@/api";
import { BaseDialog } from "@/components/common";
import { ArrowDown16Regular, ArrowUp16Regular } from "@/components/icons";
import { Button, Checkbox, Input, Textarea, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { MiniSelect } from "../components/MiniSelect";
import type { OperationValues } from "../components/operationTypes";
import { LIMIT_CHECKING_MODES, PARAMETER_DATA_TYPES } from "./dataCollectionLookups";

const useDialogStyles = makeStyles({
  hint: { fontSize: "13px", color: tokens.colorNeutralForeground2, marginBottom: "12px" },
  fieldRow: { display: "flex", flexDirection: "column", rowGap: "4px", marginBottom: "12px" },
  fieldLabel: { fontSize: "13px", fontWeight: tokens.fontWeightSemibold },
  sectionTitle: { fontSize: "13px", fontWeight: tokens.fontWeightSemibold, margin: "16px 0 8px 0" },
  empty: { padding: "16px", textAlign: "center", color: tokens.colorNeutralForeground3 },
  paramRow: {
    display: "flex",
    flexWrap: "wrap",
    columnGap: "8px",
    rowGap: "8px",
    alignItems: "flex-end",
  },
  paramCard: {
    display: "flex",
    flexDirection: "column",
    rowGap: "8px",
    padding: "12px",
    marginBottom: "8px",
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  miniLabel: {
    fontSize: "12px",
    color: tokens.colorNeutralForeground3,
    marginBottom: "4px",
  },
  rowActions: {
    marginLeft: "auto",
    display: "flex",
    columnGap: "4px",
    alignItems: "center",
  },
  grow: { flex: "1 1 130px", minWidth: "110px" },
  numWrap: { flex: "0 1 90px", minWidth: "80px" },
  tabs: {
    display: "flex",
    columnGap: "4px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    marginBottom: "12px",
  },
  tab: {
    padding: "8px 16px",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: "13px",
    borderBottom: "2px solid transparent",
  },
  tabActive: {
    fontWeight: tokens.fontWeightSemibold,
    borderBottom: `2px solid ${tokens.colorBrandStroke1}`,
  },
  kvRow: { display: "flex", columnGap: "12px", fontSize: "13px", marginBottom: "8px" },
  kvLabel: { color: tokens.colorNeutralForeground3, minWidth: "160px" },
});

export interface DataCollectionParameterRow extends DataCollectionParameter {
  id: number;
}

const EMPTY_PARAMETER = (id: number): DataCollectionParameterRow => ({
  id,
  parameter: "",
  dataType: "FreeText",
  isOptional: false,
  minimumSamples: 1,
  maximumSamples: 1,
  minimumSampleReadings: 1,
  maximumSampleReadings: 1,
  limitChecking: "None",
});

export function DataCollectionParametersEditor({
  values,
  onChange,
  fieldKey = "parameters",
}: {
  values: OperationValues;
  onChange: (key: string, value: string | number | boolean) => void;
  fieldKey?: string;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const rows = (values[fieldKey] as unknown as DataCollectionParameterRow[] | undefined) ?? [];
  const setRows = (next: DataCollectionParameterRow[]) =>
    onChange(fieldKey, next as unknown as boolean);
  const addRow = () => setRows([...rows, EMPTY_PARAMETER(Date.now() + rows.length)]);
  const removeRow = (id: number) => setRows(rows.filter((r) => r.id !== id));
  const update = (id: number, patch: Partial<DataCollectionParameterRow>) =>
    setRows(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const move = (idx: number, dir: -1 | 1) => {
    const next = [...rows];
    const j = idx + dir;
    if (j < 0 || j >= next.length) return;
    [next[idx], next[j]] = [next[j], next[idx]];
    setRows(next);
  };

  return (
    <div>
      <div className={styles.hint}>
        {t("businessData.dataCollection.operations.parametersHint")}
      </div>
      {rows.length === 0 && (
        <div className={styles.empty}>
          {t("businessData.dataCollection.operations.noParameters")}
        </div>
      )}
      {rows.map((row, idx) => (
        <div key={row.id} className={styles.paramCard}>
          <div className={styles.paramRow}>
            <div className={styles.grow}>
              <div className={styles.miniLabel}>
                {t("businessData.dataCollection.operations.parameterName")}
              </div>
              <Input
                placeholder={t("businessData.dataCollection.operations.parameterName")}
                value={row.parameter}
                onChange={(_, d) => update(row.id, { parameter: d.value })}
              />
            </div>
            <div>
              <div className={styles.miniLabel}>
                {t("businessData.dataCollection.operations.dataType")}
              </div>
              <MiniSelect
                value={row.dataType}
                options={PARAMETER_DATA_TYPES.map((v) => ({ value: v, label: v }))}
                onSelect={(v) => update(row.id, { dataType: v })}
                ariaLabel={t("businessData.dataCollection.operations.dataType")}
              />
            </div>
            <Checkbox
              label={t("businessData.dataCollection.operations.optional")}
              checked={row.isOptional}
              onChange={() => update(row.id, { isOptional: !row.isOptional })}
            />
          </div>
          <div className={styles.paramRow}>
            <div className={styles.numWrap}>
              <div className={styles.miniLabel}>
                {t("businessData.dataCollection.operations.minSamples")}
              </div>
              <Input
                type="number"
                value={String(row.minimumSamples)}
                onChange={(_, d) => update(row.id, { minimumSamples: Number(d.value) })}
              />
            </div>
            <div className={styles.numWrap}>
              <div className={styles.miniLabel}>
                {t("businessData.dataCollection.operations.maxSamples")}
              </div>
              <Input
                type="number"
                value={String(row.maximumSamples)}
                onChange={(_, d) => update(row.id, { maximumSamples: Number(d.value) })}
              />
            </div>
            <div className={styles.numWrap}>
              <div className={styles.miniLabel}>
                {t("businessData.dataCollection.operations.minReadings")}
              </div>
              <Input
                type="number"
                value={String(row.minimumSampleReadings)}
                onChange={(_, d) => update(row.id, { minimumSampleReadings: Number(d.value) })}
              />
            </div>
            <div className={styles.numWrap}>
              <div className={styles.miniLabel}>
                {t("businessData.dataCollection.operations.maxReadings")}
              </div>
              <Input
                type="number"
                value={String(row.maximumSampleReadings)}
                onChange={(_, d) => update(row.id, { maximumSampleReadings: Number(d.value) })}
              />
            </div>
            <div>
              <div className={styles.miniLabel}>
                {t("businessData.dataCollection.operations.limitChecking")}
              </div>
              <MiniSelect
                value={row.limitChecking}
                options={LIMIT_CHECKING_MODES.map((v) => ({ value: v, label: v }))}
                onSelect={(v) => update(row.id, { limitChecking: v })}
                ariaLabel={t("businessData.dataCollection.operations.limitChecking")}
              />
            </div>
            <div className={styles.rowActions}>
              <Button
                appearance="secondary"
                size="small"
                disabled={idx === 0}
                onClick={() => move(idx, -1)}
              >
                <ArrowUp16Regular />
              </Button>
              <Button
                appearance="secondary"
                size="small"
                disabled={idx === rows.length - 1}
                onClick={() => move(idx, 1)}
              >
                <ArrowDown16Regular />
              </Button>
              <Button appearance="secondary" size="small" onClick={() => removeRow(row.id)}>
                {t("common.remove")}
              </Button>
            </div>
          </div>
        </div>
      ))}
      <Button appearance="secondary" onClick={addRow}>
        {t("common.add")}
      </Button>
    </div>
  );
}

export interface DataValueRow {
  parameter: string;
  value: string;
}

function DataValuesEditor({
  parameters,
  values,
  onChange,
}: {
  parameters: { parameter: string; isOptional: boolean }[];
  values: OperationValues;
  onChange: (key: string, value: string | number | boolean) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const rows = (values.dataValues as unknown as DataValueRow[] | undefined) ?? [];
  const valueOf = (parameter: string) => rows.find((r) => r.parameter === parameter)?.value ?? "";
  const setValue = (parameter: string, value: string) => {
    const next = rows.some((r) => r.parameter === parameter)
      ? rows.map((r) => (r.parameter === parameter ? { ...r, value } : r))
      : [...rows, { parameter, value }];
    onChange("dataValues", next as unknown as boolean);
  };

  return (
    <div>
      <div className={styles.hint}>
        {t("businessData.dataCollection.operations.dataValuesHint")}
      </div>
      {parameters.length === 0 && (
        <div className={styles.empty}>
          {t("businessData.dataCollection.operations.noParameters")}
        </div>
      )}
      {parameters.map((p) => (
        <div key={p.parameter} className={styles.fieldRow}>
          <span className={styles.fieldLabel}>
            {p.parameter}
            {p.isOptional ? "" : " *"}
          </span>
          <Input value={valueOf(p.parameter)} onChange={(_, d) => setValue(p.parameter, d.value)} />
        </div>
      ))}
    </div>
  );
}

export interface CloneDataCollectionRow {
  id: number;
  name: string;
  revision: string;
  comment: string;
}

export function CloneDataCollectionDialog({
  open,
  dataCollectionName,
  onClose,
  onClone,
}: {
  open: boolean;
  dataCollectionName: string;
  onClose: () => void;
  onClone: (rows: CloneDataCollectionRow[]) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [rows, setRows] = useState<CloneDataCollectionRow[]>([]);
  const addRow = () =>
    setRows([
      ...rows,
      {
        id: Date.now() + rows.length,
        name: `${dataCollectionName} - Clone`,
        revision: "",
        comment: "",
      },
    ]);
  const removeRow = (id: number) => setRows(rows.filter((r) => r.id !== id));
  const update = (id: number, patch: Partial<CloneDataCollectionRow>) =>
    setRows(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  return (
    <BaseDialog
      open={open}
      size="xl"
      title={t("businessData.dataCollection.operations.cloneTitle")}
      onClose={onClose}
      footer={
        <>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            appearance="primary"
            disabled={rows.length === 0 || rows.some((r) => r.name.trim() === "")}
            onClick={() => onClone(rows)}
          >
            {t("businessData.dataCollection.operations.clone")}
          </Button>
        </>
      }
    >
      <div className={styles.hint}>
        {t("businessData.dataCollection.operations.cloneHint", { name: dataCollectionName })}
      </div>
      {rows.length === 0 && (
        <div className={styles.empty}>
          {t("businessData.dataCollection.operations.noCloneRows")}
        </div>
      )}
      {rows.map((row) => (
        <div key={row.id} className={styles.paramRow}>
          <div className={styles.grow}>
            <Input
              placeholder={t("businessData.dataCollection.detail.name")}
              value={row.name}
              onChange={(_, d) => update(row.id, { name: d.value })}
            />
          </div>
          <div className={styles.grow}>
            <Input
              placeholder={t("businessData.dataCollection.operations.revision")}
              value={row.revision}
              onChange={(_, d) => update(row.id, { revision: d.value })}
            />
          </div>
          <div className={styles.grow}>
            <Input
              placeholder={t("businessData.dataCollection.operations.comment")}
              value={row.comment}
              onChange={(_, d) => update(row.id, { comment: d.value })}
            />
          </div>
          <Button appearance="secondary" onClick={() => removeRow(row.id)}>
            {t("common.remove")}
          </Button>
        </div>
      ))}
      <Button appearance="secondary" onClick={addRow}>
        {t("common.add")}
      </Button>
    </BaseDialog>
  );
}

export function OpenDataCollectionInstanceDialog({
  open,
  dataCollectionName,
  limitSets,
  onClose,
  onConfirm,
}: {
  open: boolean;
  dataCollectionName: string;
  limitSets: string[];
  onClose: () => void;
  onConfirm: (input: {
    instanceName: string;
    description: string;
    limitSet: string;
    material: string;
    comment: string;
  }) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [instanceName, setInstanceName] = useState("");
  const [description, setDescription] = useState("");
  const [limitSet, setLimitSet] = useState("");
  const [material, setMaterial] = useState("");
  const [comment, setComment] = useState("");
  return (
    <BaseDialog
      open={open}
      size="md"
      title={t("businessData.dataCollection.operations.openInstanceTitle")}
      onClose={onClose}
      footer={
        <>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            appearance="primary"
            onClick={() => onConfirm({ instanceName, description, limitSet, material, comment })}
          >
            {t("businessData.dataCollection.operations.open")}
          </Button>
        </>
      }
    >
      <div className={styles.hint}>
        {t("businessData.dataCollection.operations.openInstanceHint", { name: dataCollectionName })}
      </div>
      <div className={styles.sectionTitle}>
        {t("businessData.dataCollection.operations.generalData")}
      </div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>
          {t("businessData.dataCollection.operations.instanceName")}
        </span>
        <Input
          placeholder={t("businessData.dataCollection.operations.instanceNamePlaceholder")}
          value={instanceName}
          onChange={(_, d) => setInstanceName(d.value)}
        />
      </div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>
          {t("businessData.dataCollection.detail.description")}
        </span>
        <Textarea value={description} onChange={(_, d) => setDescription(d.value)} />
      </div>
      <div className={styles.sectionTitle}>
        {t("businessData.dataCollection.operations.context")}
      </div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>
          {t("businessData.dataCollection.operations.limitSet")}
        </span>
        <MiniSelect
          value={limitSet}
          options={[{ value: "", label: t("businessData.dataCollection.operations.none") }].concat(
            limitSets.map((v) => ({ value: v, label: v })),
          )}
          onSelect={setLimitSet}
        />
      </div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>
          {t("businessData.dataCollection.operations.material")}
        </span>
        <Input value={material} onChange={(_, d) => setMaterial(d.value)} />
      </div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>
          {t("businessData.dataCollection.operations.comment")}
        </span>
        <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />
      </div>
    </BaseDialog>
  );
}

export function ViewDataCollectionInstanceDialog({
  open,
  instance,
  onClose,
}: {
  open: boolean;
  instance: DataCollectionInstance | null;
  onClose: () => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [tab, setTab] = useState<"data" | "context">("data");
  if (!instance) return null;
  return (
    <BaseDialog
      open={open}
      size="xl"
      title={t("businessData.dataCollection.operations.viewInstanceTitle")}
      onClose={onClose}
      footer={
        <Button appearance="secondary" onClick={onClose}>
          {t("common.close")}
        </Button>
      }
    >
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === "data" ? styles.tabActive : ""}`}
          onClick={() => setTab("data")}
        >
          {t("businessData.dataCollection.operations.dataTab")}
        </button>
        <button
          className={`${styles.tab} ${tab === "context" ? styles.tabActive : ""}`}
          onClick={() => setTab("context")}
        >
          {t("businessData.dataCollection.operations.contextTab")}
        </button>
      </div>
      {tab === "data" ? (
        instance.postedData.length === 0 ? (
          <div className={styles.empty}>{t("businessData.dataCollection.operations.noData")}</div>
        ) : (
          instance.postedData.map((d) => (
            <div key={d.parameter} className={styles.kvRow}>
              <span className={styles.kvLabel}>{d.parameter}:</span>
              <span>{d.value}</span>
            </div>
          ))
        )
      ) : (
        <>
          <div className={styles.kvRow}>
            <span className={styles.kvLabel}>
              {t("businessData.dataCollection.operations.instanceName")}:
            </span>
            <span>{instance.name}</span>
          </div>
          <div className={styles.kvRow}>
            <span className={styles.kvLabel}>
              {t("businessData.dataCollection.detail.description")}:
            </span>
            <span>
              {instance.description === ""
                ? t("businessData.dataCollection.detail.emptyValue")
                : instance.description}
            </span>
          </div>
          <div className={styles.kvRow}>
            <span className={styles.kvLabel}>
              {t("businessData.dataCollection.operations.limitSet")}:
            </span>
            <span>
              {instance.limitSet === ""
                ? t("businessData.dataCollection.detail.emptyValue")
                : instance.limitSet}
            </span>
          </div>
          <div className={styles.kvRow}>
            <span className={styles.kvLabel}>
              {t("businessData.dataCollection.operations.material")}:
            </span>
            <span>
              {instance.material === ""
                ? t("businessData.dataCollection.detail.emptyValue")
                : instance.material}
            </span>
          </div>
          <div className={styles.kvRow}>
            <span className={styles.kvLabel}>{t("businessData.dataCollection.detail.state")}:</span>
            <span>{instance.state}</span>
          </div>
        </>
      )}
    </BaseDialog>
  );
}

export function PostDataDialog({
  open,
  instance,
  parameters,
  onClose,
  onConfirm,
}: {
  open: boolean;
  instance: DataCollectionInstance | null;
  parameters: { parameter: string; isOptional: boolean }[];
  onClose: () => void;
  onConfirm: (values: DataValueRow[], comment: string) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [rows, setRows] = useState<DataValueRow[]>([]);
  const [comment, setComment] = useState("");
  if (!instance) return null;
  const valueOf = (parameter: string) => rows.find((r) => r.parameter === parameter)?.value ?? "";
  const setValue = (parameter: string, value: string) => {
    setRows((prev) =>
      prev.some((r) => r.parameter === parameter)
        ? prev.map((r) => (r.parameter === parameter ? { ...r, value } : r))
        : [...prev, { parameter, value }],
    );
  };
  return (
    <BaseDialog
      open={open}
      size="md"
      title={t("businessData.dataCollection.operations.postDataTitle")}
      onClose={onClose}
      footer={
        <>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button appearance="primary" onClick={() => onConfirm(rows, comment)}>
            {t("businessData.dataCollection.operations.post")}
          </Button>
        </>
      }
    >
      <div className={styles.hint}>
        {t("businessData.dataCollection.operations.postDataHint", { name: instance.name })}
      </div>
      {parameters.map((p) => (
        <div key={p.parameter} className={styles.fieldRow}>
          <span className={styles.fieldLabel}>
            {p.parameter}
            {p.isOptional ? "" : " *"}
          </span>
          <Input value={valueOf(p.parameter)} onChange={(_, d) => setValue(p.parameter, d.value)} />
        </div>
      ))}
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>
          {t("businessData.dataCollection.operations.comment")}
        </span>
        <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />
      </div>
    </BaseDialog>
  );
}

export function CorrectDataDialog({
  open,
  instance,
  parameters,
  onClose,
  onConfirm,
}: {
  open: boolean;
  instance: DataCollectionInstance | null;
  parameters: { parameter: string; isOptional: boolean }[];
  onClose: () => void;
  onConfirm: (values: DataValueRow[]) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [rows, setRows] = useState<DataValueRow[]>(instance?.postedData ?? []);
  const [recalculate, setRecalculate] = useState(false);
  if (!instance) return null;
  const valueOf = (parameter: string) => rows.find((r) => r.parameter === parameter)?.value ?? "";
  const setValue = (parameter: string, value: string) => {
    setRows((prev) =>
      prev.some((r) => r.parameter === parameter)
        ? prev.map((r) => (r.parameter === parameter ? { ...r, value } : r))
        : [...prev, { parameter, value }],
    );
  };
  return (
    <BaseDialog
      open={open}
      size="md"
      title={t("businessData.dataCollection.operations.correctTitle")}
      onClose={onClose}
      footer={
        <>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button appearance="primary" onClick={() => onConfirm(rows)}>
            {t("businessData.dataCollection.operations.correct")}
          </Button>
        </>
      }
    >
      <div className={styles.hint}>
        {t("businessData.dataCollection.operations.correctHint", { name: instance.name })}
      </div>
      {parameters.map((p) => (
        <div key={p.parameter} className={styles.fieldRow}>
          <span className={styles.fieldLabel}>{p.parameter}</span>
          <Input value={valueOf(p.parameter)} onChange={(_, d) => setValue(p.parameter, d.value)} />
        </div>
      ))}
      <Checkbox
        label={t("businessData.dataCollection.operations.recalculate")}
        checked={recalculate}
        onChange={() => setRecalculate(!recalculate)}
      />
    </BaseDialog>
  );
}

export function CommentConfirmDialog({
  open,
  titleKey,
  messageKey,
  messageParams,
  confirmLabelKey,
  onClose,
  onConfirm,
}: {
  open: boolean;
  titleKey: TranslationKey;
  messageKey: TranslationKey;
  messageParams?: Record<string, string>;
  confirmLabelKey: TranslationKey;
  onClose: () => void;
  onConfirm: (comment: string) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [comment, setComment] = useState("");
  return (
    <BaseDialog
      open={open}
      size="md"
      title={t(titleKey)}
      onClose={onClose}
      footer={
        <>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button appearance="primary" onClick={() => onConfirm(comment)}>
            {t(confirmLabelKey)}
          </Button>
        </>
      }
    >
      <div className={styles.hint}>{t(messageKey, messageParams)}</div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>
          {t("businessData.dataCollection.operations.comment")}
        </span>
        <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />
      </div>
    </BaseDialog>
  );
}

export function ManageDataCollectionParametersDialog({
  open,
  parameters,
  onClose,
  onConfirm,
}: {
  open: boolean;
  parameters: DataCollectionParameter[];
  onClose: () => void;
  onConfirm: (parameters: DataCollectionParameter[]) => void;
}) {
  const { t } = useAppTranslation();
  const [values, setValues] = useState<OperationValues>({});
  const onChange = (key: string, value: string | number | boolean) =>
    setValues((prev) => ({ ...prev, [key]: value }));
  const rows = (values.parameters as unknown as DataCollectionParameterRow[] | undefined) ?? [];
  const toParameters = (): DataCollectionParameter[] =>
    rows.map((r) => ({
      parameter: r.parameter,
      dataType: r.dataType,
      isOptional: r.isOptional,
      minimumSamples: r.minimumSamples,
      maximumSamples: r.maximumSamples,
      minimumSampleReadings: r.minimumSampleReadings,
      maximumSampleReadings: r.maximumSampleReadings,
      limitChecking: r.limitChecking,
    }));
  return (
    <BaseDialog
      open={open}
      size="xl"
      title={t("businessData.dataCollection.operations.manageParametersTitle")}
      onClose={onClose}
      footer={
        <>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button appearance="primary" onClick={() => onConfirm(toParameters())}>
            {t("businessData.dataCollection.operations.update")}
          </Button>
        </>
      }
    >
      <DataCollectionParametersEditor
        values={{
          parameters: (values.parameters ??
            parameters.map((p, idx) => ({ ...p, id: Date.now() + idx }))) as unknown as boolean,
        }}
        onChange={onChange}
      />
    </BaseDialog>
  );
}

export function PerformImmediateParametersStep({
  values,
  onChange,
  dcParameters,
}: {
  values: OperationValues;
  onChange: (key: string, value: string | number | boolean) => void;
  dcParameters: DataCollectionParameter[];
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const adHoc = values.adHoc === true;
  if (!adHoc) {
    return (
      <div>
        <div className={styles.hint}>
          {t("businessData.dataCollection.operations.useDcParametersHint")}
        </div>
        {dcParameters.length === 0 && (
          <div className={styles.empty}>
            {t("businessData.dataCollection.operations.noParameters")}
          </div>
        )}
        {dcParameters.map((p) => (
          <div key={p.parameter} className={styles.kvRow}>
            <span className={styles.kvLabel}>{p.parameter}:</span>
            <span>{p.dataType}</span>
          </div>
        ))}
      </div>
    );
  }
  return (
    <DataCollectionParametersEditor
      values={values}
      onChange={onChange}
      fieldKey="adHocParameters"
    />
  );
}

export function PerformImmediateDataStep({
  values,
  onChange,
  dcParameters,
}: {
  values: OperationValues;
  onChange: (key: string, value: string | number | boolean) => void;
  dcParameters: DataCollectionParameter[];
}) {
  const adHoc = values.adHoc === true;
  const adHocParams =
    (values.adHocParameters as unknown as DataCollectionParameterRow[] | undefined) ?? [];
  const parameters = adHoc
    ? adHocParams.map((p) => ({ parameter: p.parameter, isOptional: p.isOptional }))
    : dcParameters.map((p) => ({ parameter: p.parameter, isOptional: p.isOptional }));
  return <DataValuesEditor parameters={parameters} values={values} onChange={onChange} />;
}
