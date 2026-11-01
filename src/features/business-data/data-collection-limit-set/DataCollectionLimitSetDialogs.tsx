import { useState } from "react";
import type { ParameterLimit, SampleLimit } from "@/api";
import {
  useDataCollectionLimitSetSourceParameters,
  useDataCollectionLimitSets,
  useDataCollectionParameters,
} from "@/api";
import { BaseDialog, HStack, OptionItem, VStack } from "@/components/common";
import {
  Add24Regular,
  ArrowDown16Regular,
  ArrowUp16Regular,
  Delete20Regular,
} from "@/components/icons";
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
  Textarea,
  makeStyles,
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { theme } from "@/styles/theme";
import { MiniSelect } from "../components/MiniSelect";
import type { OperationOnChange, OperationValues } from "../components/operationTypes";
import {
  COPY_FILTER_DC_KEY,
  COPY_NAMES_KEY,
  COPY_SOURCES_KEY,
  LIMIT_TYPES,
  LIMIT_TYPE_ABSOLUTE,
} from "./dataCollectionLimitSetLookups";

const useDialogStyles = makeStyles({
  hint: { fontSize: "13px", color: theme.color.textSecondary, marginBottom: "12px" },
  fieldRow: { marginBottom: "12px" },
  fieldLabel: { fontSize: "13px", fontWeight: theme.font.weightSemibold },
  staticValue: { fontSize: "13px", padding: "6px 0" },
  empty: { padding: "16px", textAlign: "center", color: theme.color.textTertiary },
  split: { minHeight: "320px" },
  listPane: {
    flex: "0 0 240px",
    border: `1px solid ${theme.color.borderSubtle}`,
    borderRadius: theme.radius.md,
    overflow: "hidden",
  },
  listToolbar: {
    padding: "8px",
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
  },
  listTitle: { fontSize: "13px", fontWeight: theme.font.weightSemibold, marginRight: "auto" },
  listBody: { flexGrow: 1, overflowY: "auto" },
  formPane: { flexGrow: 1, minWidth: 0 },
  formRow: {
    marginBottom: "12px",
  },
  miniLabel: { fontSize: "12px", color: theme.color.textTertiary, marginBottom: "4px" },
  grow: { flex: "1 1 160px", minWidth: "140px" },
  numWrap: { flex: "0 1 120px", minWidth: "100px" },
  optionsBar: { marginBottom: "12px" },
  checkRow: {
    padding: "8px 0",
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
  },
});

function DialogShell({
  open,
  title,
  onClose,
  wide,
  children,
  footer,
}: {
  open?: boolean;
  title: string;
  onClose: () => void;
  wide?: boolean;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <BaseDialog
      open={open ?? true}
      title={title}
      onClose={onClose}
      size={wide ? "xl" : "md"}
      footer={footer}
    >
      {children}
    </BaseDialog>
  );
}

export interface SampleLimitRow extends SampleLimit {
  id: number;
}

export interface ParameterLimitRow extends Omit<ParameterLimit, "sampleLimits"> {
  id: number;
  sampleLimits: SampleLimitRow[];
}

const EMPTY_SAMPLE = (id: number): SampleLimitRow => ({
  id,
  sampleId: "",
  lowerErrorLimit: "",
  lowerWarningLimit: "",
  target: "",
  upperWarningLimit: "",
  upperErrorLimit: "",
});

const EMPTY_PARAMETER_LIMIT = (id: number): ParameterLimitRow => ({
  id,
  parameter: "",
  overrideParameter: false,
  includeSampleLimits: false,
  minValue: "",
  maxValue: "",
  limitType: LIMIT_TYPE_ABSOLUTE,
  lowerErrorLimit: "",
  lowerWarningLimit: "",
  target: "",
  upperWarningLimit: "",
  upperErrorLimit: "",
  sampleLimits: [],
});

function toRow(p: ParameterLimit, id: number): ParameterLimitRow {
  return {
    id,
    parameter: p.parameter,
    overrideParameter: p.overrideParameter,
    includeSampleLimits: p.includeSampleLimits,
    minValue: p.minValue,
    maxValue: p.maxValue,
    limitType: p.limitType,
    lowerErrorLimit: p.lowerErrorLimit,
    lowerWarningLimit: p.lowerWarningLimit,
    target: p.target,
    upperWarningLimit: p.upperWarningLimit,
    upperErrorLimit: p.upperErrorLimit,
    sampleLimits: (p.sampleLimits ?? []).map((s, i) => ({ ...s, id: id * 1000 + i + 1 })),
  };
}

const REQUIRED_SUFFIX = " *";

function limitSetMeta(dataCollection: string, state: string): string {
  return `${dataCollection} · ${state}`;
}

export function ParameterLimitsEditor({
  values,
  onChange,
  fieldKey = "parameterLimits",
  dataCollectionName,
}: {
  values: OperationValues;
  onChange: OperationOnChange;
  fieldKey?: string;
  dataCollectionName?: string;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const rows = (values[fieldKey] as unknown as ParameterLimitRow[] | undefined) ?? [];
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [copyOpen, setCopyOpen] = useState(false);
  const dcParameters = useDataCollectionParameters(dataCollectionName).map((p) => p.parameter);
  const selected = rows.find((r) => r.id === selectedId) ?? rows[0] ?? null;

  const setRows = (next: ParameterLimitRow[]) => onChange(fieldKey, next);
  const addRow = () => {
    const row = EMPTY_PARAMETER_LIMIT(Date.now() + rows.length);
    setRows([...rows, row]);
    setSelectedId(row.id);
  };
  const removeRow = (id: number) => {
    setRows(rows.filter((r) => r.id !== id));
    if (selectedId === id) setSelectedId(null);
  };
  const update = (id: number, patch: Partial<ParameterLimitRow>) =>
    setRows(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const move = (idx: number, dir: -1 | 1) => {
    const next = [...rows];
    const j = idx + dir;
    if (j < 0 || j >= next.length) return;
    [next[idx], next[j]] = [next[j], next[idx]];
    setRows(next);
  };

  const synchronize = () => {
    if (dcParameters.length === 0) return;
    const kept = rows.filter((r) => dcParameters.includes(r.parameter));
    const existing = new Set(kept.map((r) => r.parameter));
    const added = dcParameters
      .filter((p) => !existing.has(p))
      .map((p, i) => ({ ...EMPTY_PARAMETER_LIMIT(Date.now() + kept.length + i), parameter: p }));
    setRows([...kept, ...added]);
  };

  const copyFrom = (sourceRows: ParameterLimitRow[]) => {
    const base = Date.now();
    setRows(
      sourceRows.map((r, i) => ({
        ...r,
        id: base + i,
        sampleLimits: r.sampleLimits.map((s, j) => ({ ...s, id: base + i * 1000 + j })),
      })),
    );
    setCopyOpen(false);
  };

  const selectedIdx = selected ? rows.findIndex((r) => r.id === selected.id) : -1;

  return (
    <div>
      <div className={styles.hint}>
        {t("businessData.dataCollectionLimitSet.operations.parametersHint")}
      </div>
      <HStack justify="end" className={styles.optionsBar}>
        <Menu positioning="below-end">
          <MenuTrigger disableButtonEnhancement>
            <Button variant="secondary" size="sm">
              {t("businessData.dataCollectionLimitSet.operations.options")}
            </Button>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              <MenuItem onClick={synchronize} disabled={dcParameters.length === 0}>
                {t("businessData.dataCollectionLimitSet.operations.synchronize")}
              </MenuItem>
              <MenuItem onClick={() => setCopyOpen(true)}>
                {t("businessData.dataCollectionLimitSet.operations.copyParameters")}
              </MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>
      </HStack>
      <HStack gap="16px" className={styles.split}>
        <VStack className={styles.listPane}>
          <HStack gap="4px" wrap align="center" className={styles.listToolbar}>
            <span className={styles.listTitle}>
              {t("businessData.dataCollectionLimitSet.operations.parametersTitle")}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={addRow}
              aria-label={t("businessData.dataCollectionLimitSet.operations.addParameter")}
            >
              <Add24Regular />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={!selected}
              onClick={() => selected && removeRow(selected.id)}
              aria-label={t("businessData.dataCollectionLimitSet.operations.removeParameter")}
            >
              <Delete20Regular />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={selectedIdx <= 0}
              onClick={() => move(selectedIdx, -1)}
              aria-label={t("businessData.dataCollectionLimitSet.operations.moveUp")}
            >
              <ArrowUp16Regular />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={selectedIdx < 0 || selectedIdx >= rows.length - 1}
              onClick={() => move(selectedIdx, 1)}
              aria-label={t("businessData.dataCollectionLimitSet.operations.moveDown")}
            >
              <ArrowDown16Regular />
            </Button>
          </HStack>
          <div className={styles.listBody}>
            {rows.length === 0 && (
              <div className={styles.empty}>
                {t("businessData.dataCollectionLimitSet.operations.noParameters")}
              </div>
            )}
            {rows.map((r) => (
              <OptionItem
                key={r.id}
                selected={selected?.id === r.id}
                onClick={() => setSelectedId(r.id)}
              >
                <HStack justify="between" align="center" grow>
                  <span>
                    {r.parameter === ""
                      ? t("businessData.dataCollectionLimitSet.operations.unnamedParameter")
                      : r.parameter}
                  </span>
                  <Text size={200} style={{ color: theme.color.textTertiary }}>
                    {r.limitType}
                  </Text>
                </HStack>
              </OptionItem>
            ))}
          </div>
        </VStack>
        <div className={styles.formPane}>
          {!selected && (
            <div className={styles.empty}>
              {t("businessData.dataCollectionLimitSet.operations.selectParameter")}
            </div>
          )}
          {selected && (
            <div>
              <div className={styles.fieldLabel} style={{ marginBottom: "12px" }}>
                {t("businessData.dataCollectionLimitSet.operations.limitsTitle")}
              </div>
              <HStack gap="8px" wrap align="end" className={styles.formRow}>
                <div className={styles.grow}>
                  <div className={styles.miniLabel}>
                    {t("businessData.dataCollectionLimitSet.operations.parameter")}
                    {REQUIRED_SUFFIX}
                  </div>
                  {dcParameters.length > 0 ? (
                    <MiniSelect
                      value={selected.parameter}
                      options={dcParameters.map((v) => ({ value: v, label: v }))}
                      onSelect={(v) => update(selected.id, { parameter: v })}
                      ariaLabel={t("businessData.dataCollectionLimitSet.operations.parameter")}
                    />
                  ) : (
                    <Input
                      value={selected.parameter}
                      onChange={(value) => update(selected.id, { parameter: value })}
                    />
                  )}
                </div>
              </HStack>
              <HStack gap="8px" wrap align="end" className={styles.formRow}>
                <Checkbox
                  label={t("businessData.dataCollectionLimitSet.operations.overrideValidation")}
                  checked={selected.overrideParameter}
                  onChange={() =>
                    update(selected.id, { overrideParameter: !selected.overrideParameter })
                  }
                />
              </HStack>
              <HStack gap="8px" wrap align="end" className={styles.formRow}>
                <div className={styles.numWrap}>
                  <div className={styles.miniLabel}>
                    {t("businessData.dataCollectionLimitSet.operations.minValue")}
                  </div>
                  <Input
                    type="number"
                    value={selected.minValue}
                    disabled={!selected.overrideParameter}
                    onChange={(value) => update(selected.id, { minValue: value })}
                  />
                </div>
                <div className={styles.numWrap}>
                  <div className={styles.miniLabel}>
                    {t("businessData.dataCollectionLimitSet.operations.maxValue")}
                  </div>
                  <Input
                    type="number"
                    value={selected.maxValue}
                    disabled={!selected.overrideParameter}
                    onChange={(value) => update(selected.id, { maxValue: value })}
                  />
                </div>
                <div className={styles.grow}>
                  <div className={styles.miniLabel}>
                    {t("businessData.dataCollectionLimitSet.operations.limitType")}
                    {REQUIRED_SUFFIX}
                  </div>
                  <MiniSelect
                    value={selected.limitType}
                    options={LIMIT_TYPES.map((v) => ({ value: v, label: v }))}
                    onSelect={(v) =>
                      update(selected.id, {
                        limitType: v,
                        includeSampleLimits:
                          v === LIMIT_TYPE_ABSOLUTE ? selected.includeSampleLimits : false,
                      })
                    }
                    ariaLabel={t("businessData.dataCollectionLimitSet.operations.limitType")}
                  />
                </div>
              </HStack>
              <HStack gap="8px" wrap align="end" className={styles.formRow}>
                <div className={styles.numWrap}>
                  <div className={styles.miniLabel}>
                    {t("businessData.dataCollectionLimitSet.operations.lowerErrorLimit")}
                  </div>
                  <Input
                    type="number"
                    value={selected.lowerErrorLimit}
                    onChange={(value) => update(selected.id, { lowerErrorLimit: value })}
                  />
                </div>
                <div className={styles.numWrap}>
                  <div className={styles.miniLabel}>
                    {t("businessData.dataCollectionLimitSet.operations.lowerWarningLimit")}
                  </div>
                  <Input
                    type="number"
                    value={selected.lowerWarningLimit}
                    onChange={(value) => update(selected.id, { lowerWarningLimit: value })}
                  />
                </div>
                <div className={styles.numWrap}>
                  <div className={styles.miniLabel}>
                    {t("businessData.dataCollectionLimitSet.operations.target")}
                  </div>
                  <Input
                    type="number"
                    value={selected.target}
                    onChange={(value) => update(selected.id, { target: value })}
                  />
                </div>
                <div className={styles.numWrap}>
                  <div className={styles.miniLabel}>
                    {t("businessData.dataCollectionLimitSet.operations.upperWarningLimit")}
                  </div>
                  <Input
                    type="number"
                    value={selected.upperWarningLimit}
                    onChange={(value) => update(selected.id, { upperWarningLimit: value })}
                  />
                </div>
                <div className={styles.numWrap}>
                  <div className={styles.miniLabel}>
                    {t("businessData.dataCollectionLimitSet.operations.upperErrorLimit")}
                  </div>
                  <Input
                    type="number"
                    value={selected.upperErrorLimit}
                    onChange={(value) => update(selected.id, { upperErrorLimit: value })}
                  />
                </div>
              </HStack>
              <HStack gap="8px" wrap align="end" className={styles.formRow}>
                <Checkbox
                  label={t("businessData.dataCollectionLimitSet.operations.includeSampleLimits")}
                  checked={selected.includeSampleLimits}
                  disabled={selected.limitType !== LIMIT_TYPE_ABSOLUTE}
                  onChange={() =>
                    update(selected.id, { includeSampleLimits: !selected.includeSampleLimits })
                  }
                />
              </HStack>
            </div>
          )}
        </div>
      </HStack>
      {copyOpen && <CopyParametersDialog onClose={() => setCopyOpen(false)} onCopy={copyFrom} />}
    </div>
  );
}

export function SampleLimitsEditor({
  values,
  onChange,
  fieldKey = "parameterLimits",
}: {
  values: OperationValues;
  onChange: OperationOnChange;
  fieldKey?: string;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const rows = (values[fieldKey] as unknown as ParameterLimitRow[] | undefined) ?? [];
  const applicable = rows.filter(
    (r) => r.includeSampleLimits && r.limitType === LIMIT_TYPE_ABSOLUTE,
  );
  const [selectedParamId, setSelectedParamId] = useState<number | null>(null);
  const [selectedSampleId, setSelectedSampleId] = useState<number | null>(null);
  const selectedParam =
    applicable.find((r) => r.id === (selectedParamId ?? applicable[0]?.id)) ??
    applicable[0] ??
    null;
  const selectedSample =
    selectedParam?.sampleLimits.find(
      (s) => s.id === (selectedSampleId ?? selectedParam?.sampleLimits[0]?.id),
    ) ?? null;

  const setRows = (next: ParameterLimitRow[]) => onChange(fieldKey, next);
  const updateParam = (id: number, patch: Partial<ParameterLimitRow>) =>
    setRows(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const addSample = () => {
    if (!selectedParam) return;
    const sample = EMPTY_SAMPLE(Date.now() + selectedParam.sampleLimits.length);
    updateParam(selectedParam.id, { sampleLimits: [...selectedParam.sampleLimits, sample] });
    setSelectedSampleId(sample.id);
  };
  const removeSample = (sampleId: number) => {
    if (!selectedParam) return;
    updateParam(selectedParam.id, {
      sampleLimits: selectedParam.sampleLimits.filter((s) => s.id !== sampleId),
    });
    if (selectedSampleId === sampleId) setSelectedSampleId(null);
  };
  const updateSample = (sampleId: number, patch: Partial<SampleLimitRow>) => {
    if (!selectedParam) return;
    updateParam(selectedParam.id, {
      sampleLimits: selectedParam.sampleLimits.map((s) =>
        s.id === sampleId ? { ...s, ...patch } : s,
      ),
    });
  };

  return (
    <div>
      <div className={styles.hint}>
        {t("businessData.dataCollectionLimitSet.operations.samplesHint")}
      </div>
      {applicable.length === 0 && (
        <div className={styles.empty}>
          {t("businessData.dataCollectionLimitSet.operations.noSampleLimits")}
        </div>
      )}
      {applicable.length > 0 && (
        <HStack gap="16px" className={styles.split}>
          <VStack className={styles.listPane}>
            <HStack gap="4px" wrap align="center" className={styles.listToolbar}>
              <span className={styles.listTitle}>
                {t("businessData.dataCollectionLimitSet.operations.samplesTitle")}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={addSample}
                aria-label={t("businessData.dataCollectionLimitSet.operations.addSample")}
              >
                <Add24Regular />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={!selectedSample}
                onClick={() => selectedSample && removeSample(selectedSample.id)}
                aria-label={t("businessData.dataCollectionLimitSet.operations.removeSample")}
              >
                <Delete20Regular />
              </Button>
            </HStack>
            <div className={styles.listBody}>
              {applicable.map((p) => (
                <div key={p.id}>
                  <OptionItem
                    selected={selectedParam?.id === p.id}
                    onClick={() => {
                      setSelectedParamId(p.id);
                      setSelectedSampleId(null);
                    }}
                  >
                    <HStack justify="between" align="center" grow>
                      <span>
                        {p.parameter === ""
                          ? t("businessData.dataCollectionLimitSet.operations.unnamedParameter")
                          : p.parameter}
                      </span>
                      <Text size={200} style={{ color: theme.color.textTertiary }}>
                        {p.limitType}
                      </Text>
                    </HStack>
                  </OptionItem>
                  {selectedParam?.id === p.id &&
                    p.sampleLimits.map((s) => (
                      <div style={{ paddingLeft: "24px" }}>
                        <OptionItem
                          key={s.id}
                          selected={selectedSample?.id === s.id}
                          onClick={() => setSelectedSampleId(s.id)}
                        >
                          <span>
                            {s.sampleId === ""
                              ? t("businessData.dataCollectionLimitSet.operations.unnamedSample")
                              : s.sampleId}
                          </span>
                        </OptionItem>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </VStack>
          <div className={styles.formPane}>
            {!selectedSample && (
              <div className={styles.empty}>
                {t("businessData.dataCollectionLimitSet.operations.selectSample")}
              </div>
            )}
            {selectedSample && (
              <div>
                <div className={styles.fieldLabel} style={{ marginBottom: "12px" }}>
                  {t("businessData.dataCollectionLimitSet.operations.sampleLimitsTitle")}
                </div>
                <HStack gap="8px" wrap align="end" className={styles.formRow}>
                  <div className={styles.grow}>
                    <div className={styles.miniLabel}>
                      {t("businessData.dataCollectionLimitSet.operations.sampleId")}
                      {REQUIRED_SUFFIX}
                    </div>
                    <Input
                      value={selectedSample.sampleId}
                      onChange={(value) => updateSample(selectedSample.id, { sampleId: value })}
                    />
                  </div>
                </HStack>
                <HStack gap="8px" wrap align="end" className={styles.formRow}>
                  <div className={styles.numWrap}>
                    <div className={styles.miniLabel}>
                      {t("businessData.dataCollectionLimitSet.operations.lowerErrorLimit")}
                    </div>
                    <Input
                      type="number"
                      value={selectedSample.lowerErrorLimit}
                      onChange={(value) =>
                        updateSample(selectedSample.id, { lowerErrorLimit: value })
                      }
                    />
                  </div>
                  <div className={styles.numWrap}>
                    <div className={styles.miniLabel}>
                      {t("businessData.dataCollectionLimitSet.operations.lowerWarningLimit")}
                    </div>
                    <Input
                      type="number"
                      value={selectedSample.lowerWarningLimit}
                      onChange={(value) =>
                        updateSample(selectedSample.id, { lowerWarningLimit: value })
                      }
                    />
                  </div>
                  <div className={styles.numWrap}>
                    <div className={styles.miniLabel}>
                      {t("businessData.dataCollectionLimitSet.operations.target")}
                    </div>
                    <Input
                      type="number"
                      value={selectedSample.target}
                      onChange={(value) => updateSample(selectedSample.id, { target: value })}
                    />
                  </div>
                  <div className={styles.numWrap}>
                    <div className={styles.miniLabel}>
                      {t("businessData.dataCollectionLimitSet.operations.upperWarningLimit")}
                    </div>
                    <Input
                      type="number"
                      value={selectedSample.upperWarningLimit}
                      onChange={(value) =>
                        updateSample(selectedSample.id, { upperWarningLimit: value })
                      }
                    />
                  </div>
                  <div className={styles.numWrap}>
                    <div className={styles.miniLabel}>
                      {t("businessData.dataCollectionLimitSet.operations.upperErrorLimit")}
                    </div>
                    <Input
                      type="number"
                      value={selectedSample.upperErrorLimit}
                      onChange={(value) =>
                        updateSample(selectedSample.id, { upperErrorLimit: value })
                      }
                    />
                  </div>
                </HStack>
              </div>
            )}
          </div>
        </HStack>
      )}
    </div>
  );
}

function CopyParametersDialog({
  onClose,
  onCopy,
}: {
  onClose: () => void;
  onCopy: (rows: ParameterLimitRow[]) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [source, setSource] = useState("");
  const { data } = useDataCollectionLimitSets({ page: 1, limit: 100, filters: {} });
  const sourceParameters = useDataCollectionLimitSetSourceParameters(source);
  const options = (data?.data ?? []).map((r) => ({ value: r.name, label: r.name }));

  return (
    <DialogShell
      title={t("businessData.dataCollectionLimitSet.operations.copyParametersTitle")}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            variant="primary"
            disabled={source === ""}
            onClick={() => onCopy(sourceParameters.map((p, i) => toRow(p, Date.now() + i)))}
          >
            {t("businessData.dataCollectionLimitSet.operations.copyAction")}
          </Button>
        </>
      }
    >
      <VStack gap="4px" className={styles.fieldRow}>
        <div className={styles.fieldLabel}>
          {t("businessData.dataCollectionLimitSet.operations.sourceLimitSet")}
        </div>
        <MiniSelect
          value={source}
          options={options}
          onSelect={setSource}
          ariaLabel={t("businessData.dataCollectionLimitSet.operations.sourceLimitSet")}
        />
      </VStack>
      <div className={styles.hint}>
        {t("businessData.dataCollectionLimitSet.operations.copyParametersHint")}
      </div>
    </DialogShell>
  );
}

export function EditDataCollectionLimitSetDialog({
  name,
  initial,
  dataCollectionOptions,
  typeOptions,
  onClose,
  onSubmit,
}: {
  name: string;
  initial: { description: string; type: string; dataCollection: string };
  dataCollectionOptions: { value: string; label: string }[];
  typeOptions: { value: string; label: string }[];
  onClose: () => void;
  onSubmit: (values: { description: string; type: string; dataCollection: string }) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [description, setDescription] = useState(initial.description);
  const [type, setType] = useState(initial.type);
  const [dataCollection, setDataCollection] = useState(initial.dataCollection);

  return (
    <DialogShell
      title={t("businessData.dataCollectionLimitSet.operations.editTitle")}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button variant="primary" onClick={() => onSubmit({ description, type, dataCollection })}>
            {t("common.save")}
          </Button>
        </>
      }
    >
      <VStack gap="4px" className={styles.fieldRow}>
        <div className={styles.fieldLabel}>
          {t("businessData.dataCollectionLimitSet.detail.name")}
        </div>
        <div className={styles.staticValue}>{name}</div>
      </VStack>
      <VStack gap="4px" className={styles.fieldRow}>
        <div className={styles.fieldLabel}>
          {t("businessData.dataCollectionLimitSet.detail.description")}
        </div>
        <Textarea value={description} onChange={setDescription} />
      </VStack>
      <VStack gap="4px" className={styles.fieldRow}>
        <div className={styles.fieldLabel}>
          {t("businessData.dataCollectionLimitSet.detail.type")}
        </div>
        <MiniSelect
          value={type}
          options={typeOptions}
          onSelect={setType}
          ariaLabel={t("businessData.dataCollectionLimitSet.detail.type")}
        />
      </VStack>
      <VStack gap="4px" className={styles.fieldRow}>
        <div className={styles.fieldLabel}>
          {t("businessData.dataCollectionLimitSet.detail.dataCollection")}
        </div>
        <MiniSelect
          value={dataCollection}
          options={dataCollectionOptions}
          onSelect={setDataCollection}
          ariaLabel={t("businessData.dataCollectionLimitSet.detail.dataCollection")}
        />
      </VStack>
    </DialogShell>
  );
}

export function CopyLimitSetsSelectStep({
  values,
  onChange,
}: {
  values: OperationValues;
  onChange: OperationOnChange;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const filterDc = (values[COPY_FILTER_DC_KEY] as string | undefined) ?? "";
  const selected = (values[COPY_SOURCES_KEY] as unknown as string[] | undefined) ?? [];
  const { data } = useDataCollectionLimitSets({ page: 1, limit: 100, filters: {} });
  const all = data?.data ?? [];
  const dcOptions = [
    { value: "", label: t("businessData.dataCollectionLimitSet.operations.allDataCollections") },
  ].concat(
    [...new Set(all.map((r) => r.dataCollection).filter((d) => d !== ""))].map((d) => ({
      value: d,
      label: d,
    })),
  );
  const list = all.filter((r) => filterDc === "" || r.dataCollection === filterDc);

  const toggle = (name: string) => {
    const next = selected.includes(name) ? selected.filter((s) => s !== name) : [...selected, name];
    onChange(COPY_SOURCES_KEY, next);
  };

  return (
    <div>
      <div className={styles.hint}>
        {t("businessData.dataCollectionLimitSet.operations.selectLimitSetsHint")}
      </div>
      <VStack gap="4px" className={styles.fieldRow}>
        <div className={styles.fieldLabel}>
          {t("businessData.dataCollectionLimitSet.operations.filterByDataCollection")}
        </div>
        <MiniSelect
          value={filterDc}
          options={dcOptions}
          onSelect={(v) => onChange(COPY_FILTER_DC_KEY, v)}
          ariaLabel={t("businessData.dataCollectionLimitSet.operations.filterByDataCollection")}
        />
      </VStack>
      <div>
        {list.map((r) => (
          <HStack key={r.name} align="center" gap="8px" className={styles.checkRow}>
            <Checkbox
              checked={selected.includes(r.name)}
              onChange={() => toggle(r.name)}
              label={r.name}
            />
            <Text size={200} style={{ color: theme.color.textTertiary }}>
              {limitSetMeta(r.dataCollection, r.state)}
            </Text>
          </HStack>
        ))}
        {list.length === 0 && (
          <div className={styles.empty}>
            {t("businessData.dataCollectionLimitSet.operations.noLimitSets")}
          </div>
        )}
      </div>
    </div>
  );
}

export function CopyLimitSetsNamesStep({
  values,
  onChange,
  targetDataCollection,
}: {
  values: OperationValues;
  onChange: OperationOnChange;
  targetDataCollection: string;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const sources = (values[COPY_SOURCES_KEY] as unknown as string[] | undefined) ?? [];
  const names = (values[COPY_NAMES_KEY] as unknown as Record<string, string> | undefined) ?? {};
  const getName = (s: string) => names[s] ?? `${targetDataCollection}_${s}`;
  const setName = (s: string, v: string) => onChange(COPY_NAMES_KEY, { ...names, [s]: v });

  return (
    <div>
      <div className={styles.hint}>
        {t("businessData.dataCollectionLimitSet.operations.limitSetNamesHint")}
      </div>
      {sources.length === 0 && (
        <div className={styles.empty}>
          {t("businessData.dataCollectionLimitSet.operations.noSourcesSelected")}
        </div>
      )}
      {sources.map((s) => (
        <VStack key={s} gap="4px" className={styles.fieldRow}>
          <div className={styles.fieldLabel}>{s}</div>
          <Input value={getName(s)} onChange={(value) => setName(s, value)} />
        </VStack>
      ))}
    </div>
  );
}
