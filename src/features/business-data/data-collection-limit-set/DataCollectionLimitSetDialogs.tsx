import { useState } from "react";
import type { ParameterLimit, SampleLimit } from "@/api";
import {
  useDataCollectionLimitSetSourceParameters,
  useDataCollectionLimitSets,
  useDataCollectionParameters,
} from "@/api";
import {
  Add24Regular,
  ArrowDown16Regular,
  ArrowUp16Regular,
  Delete20Regular,
  Dismiss16Regular,
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
  tokens,
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { cardSurface } from "@/styles/shared";
import { MiniSelect } from "../components/MiniSelect";
import type { OperationValues } from "../components/operationTypes";
import {
  COPY_FILTER_DC_KEY,
  COPY_NAMES_KEY,
  COPY_SOURCES_KEY,
  LIMIT_TYPES,
  LIMIT_TYPE_ABSOLUTE,
} from "./dataCollectionLimitSetLookups";

const useDialogStyles = makeStyles({
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
    width: "min(920px, calc(100vw - 48px))",
    maxHeight: "min(720px, calc(100vh - 48px))",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    ...cardSurface,
  },
  narrow: {
    width: "min(560px, calc(100vw - 48px))",
    maxHeight: "min(700px, calc(100vh - 48px))",
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
    flexShrink: 0,
  },
  hint: { fontSize: "13px", color: tokens.colorNeutralForeground2, marginBottom: "12px" },
  fieldRow: { display: "flex", flexDirection: "column", rowGap: "4px", marginBottom: "12px" },
  fieldLabel: { fontSize: "13px", fontWeight: tokens.fontWeightSemibold },
  staticValue: { fontSize: "13px", padding: "6px 0" },
  empty: { padding: "16px", textAlign: "center", color: tokens.colorNeutralForeground3 },
  split: { display: "flex", columnGap: "16px", minHeight: "320px" },
  listPane: {
    flex: "0 0 240px",
    display: "flex",
    flexDirection: "column",
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    overflow: "hidden",
  },
  listToolbar: {
    display: "flex",
    columnGap: "4px",
    rowGap: "4px",
    flexWrap: "wrap",
    padding: "8px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    alignItems: "center",
  },
  listTitle: { fontSize: "13px", fontWeight: tokens.fontWeightSemibold, marginRight: "auto" },
  listBody: { flexGrow: 1, overflowY: "auto" },
  listItem: {
    width: "100%",
    textAlign: "left",
    border: "none",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: "transparent",
    cursor: "pointer",
    padding: "8px 12px",
    fontFamily: "inherit",
    fontSize: "13px",
    display: "flex",
    flexDirection: "column",
    rowGap: "2px",
  },
  listItemActive: { backgroundColor: tokens.colorNeutralBackground1Selected },
  listItemSub: { fontSize: "12px", color: tokens.colorNeutralForeground3 },
  formPane: { flexGrow: 1, minWidth: 0 },
  formRow: {
    display: "flex",
    columnGap: "8px",
    rowGap: "8px",
    alignItems: "flex-end",
    flexWrap: "wrap",
    marginBottom: "12px",
  },
  miniLabel: { fontSize: "12px", color: tokens.colorNeutralForeground3, marginBottom: "4px" },
  grow: { flex: "1 1 160px", minWidth: "140px" },
  numWrap: { flex: "0 1 120px", minWidth: "100px" },
  optionsBar: { display: "flex", justifyContent: "flex-end", marginBottom: "12px" },
  checkRow: {
    display: "flex",
    alignItems: "center",
    columnGap: "8px",
    padding: "8px 0",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
});

function DialogShell({
  title,
  onClose,
  wide,
  children,
  footer,
}: {
  title: string;
  onClose: () => void;
  wide?: boolean;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  const styles = useDialogStyles();
  const { t } = useAppTranslation();
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={wide ? styles.surface : styles.narrow} onClick={(e) => e.stopPropagation()}>
        <div className={styles.head}>
          <Text weight="semibold">{title}</Text>
          <button className={styles.closeButton} onClick={onClose} aria-label={t("common.close")}>
            <Dismiss16Regular />
          </button>
        </div>
        <div className={styles.body}>{children}</div>
        <div className={styles.foot}>{footer}</div>
      </div>
    </div>
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
  onChange: (key: string, value: string | number | boolean) => void;
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

  const setRows = (next: ParameterLimitRow[]) => onChange(fieldKey, next as unknown as boolean);
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
      <div className={styles.optionsBar}>
        <Menu positioning="below-end">
          <MenuTrigger disableButtonEnhancement>
            <Button appearance="secondary" size="small">
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
      </div>
      <div className={styles.split}>
        <div className={styles.listPane}>
          <div className={styles.listToolbar}>
            <span className={styles.listTitle}>
              {t("businessData.dataCollectionLimitSet.operations.parametersTitle")}
            </span>
            <Button
              appearance="secondary"
              size="small"
              onClick={addRow}
              aria-label={t("businessData.dataCollectionLimitSet.operations.addParameter")}
            >
              <Add24Regular />
            </Button>
            <Button
              appearance="secondary"
              size="small"
              disabled={!selected}
              onClick={() => selected && removeRow(selected.id)}
              aria-label={t("businessData.dataCollectionLimitSet.operations.removeParameter")}
            >
              <Delete20Regular />
            </Button>
            <Button
              appearance="secondary"
              size="small"
              disabled={selectedIdx <= 0}
              onClick={() => move(selectedIdx, -1)}
              aria-label={t("businessData.dataCollectionLimitSet.operations.moveUp")}
            >
              <ArrowUp16Regular />
            </Button>
            <Button
              appearance="secondary"
              size="small"
              disabled={selectedIdx < 0 || selectedIdx >= rows.length - 1}
              onClick={() => move(selectedIdx, 1)}
              aria-label={t("businessData.dataCollectionLimitSet.operations.moveDown")}
            >
              <ArrowDown16Regular />
            </Button>
          </div>
          <div className={styles.listBody}>
            {rows.length === 0 && (
              <div className={styles.empty}>
                {t("businessData.dataCollectionLimitSet.operations.noParameters")}
              </div>
            )}
            {rows.map((r) => (
              <button
                key={r.id}
                className={`${styles.listItem} ${selected?.id === r.id ? styles.listItemActive : ""}`}
                onClick={() => setSelectedId(r.id)}
              >
                <span>
                  {r.parameter === ""
                    ? t("businessData.dataCollectionLimitSet.operations.unnamedParameter")
                    : r.parameter}
                </span>
                <span className={styles.listItemSub}>{r.limitType}</span>
              </button>
            ))}
          </div>
        </div>
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
              <div className={styles.formRow}>
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
                      onChange={(_, d) => update(selected.id, { parameter: d.value })}
                    />
                  )}
                </div>
              </div>
              <div className={styles.formRow}>
                <Checkbox
                  label={t("businessData.dataCollectionLimitSet.operations.overrideValidation")}
                  checked={selected.overrideParameter}
                  onChange={() =>
                    update(selected.id, { overrideParameter: !selected.overrideParameter })
                  }
                />
              </div>
              <div className={styles.formRow}>
                <div className={styles.numWrap}>
                  <div className={styles.miniLabel}>
                    {t("businessData.dataCollectionLimitSet.operations.minValue")}
                  </div>
                  <Input
                    type="number"
                    value={selected.minValue}
                    disabled={!selected.overrideParameter}
                    onChange={(_, d) => update(selected.id, { minValue: d.value })}
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
                    onChange={(_, d) => update(selected.id, { maxValue: d.value })}
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
              </div>
              <div className={styles.formRow}>
                <div className={styles.numWrap}>
                  <div className={styles.miniLabel}>
                    {t("businessData.dataCollectionLimitSet.operations.lowerErrorLimit")}
                  </div>
                  <Input
                    type="number"
                    value={selected.lowerErrorLimit}
                    onChange={(_, d) => update(selected.id, { lowerErrorLimit: d.value })}
                  />
                </div>
                <div className={styles.numWrap}>
                  <div className={styles.miniLabel}>
                    {t("businessData.dataCollectionLimitSet.operations.lowerWarningLimit")}
                  </div>
                  <Input
                    type="number"
                    value={selected.lowerWarningLimit}
                    onChange={(_, d) => update(selected.id, { lowerWarningLimit: d.value })}
                  />
                </div>
                <div className={styles.numWrap}>
                  <div className={styles.miniLabel}>
                    {t("businessData.dataCollectionLimitSet.operations.target")}
                  </div>
                  <Input
                    type="number"
                    value={selected.target}
                    onChange={(_, d) => update(selected.id, { target: d.value })}
                  />
                </div>
                <div className={styles.numWrap}>
                  <div className={styles.miniLabel}>
                    {t("businessData.dataCollectionLimitSet.operations.upperWarningLimit")}
                  </div>
                  <Input
                    type="number"
                    value={selected.upperWarningLimit}
                    onChange={(_, d) => update(selected.id, { upperWarningLimit: d.value })}
                  />
                </div>
                <div className={styles.numWrap}>
                  <div className={styles.miniLabel}>
                    {t("businessData.dataCollectionLimitSet.operations.upperErrorLimit")}
                  </div>
                  <Input
                    type="number"
                    value={selected.upperErrorLimit}
                    onChange={(_, d) => update(selected.id, { upperErrorLimit: d.value })}
                  />
                </div>
              </div>
              <div className={styles.formRow}>
                <Checkbox
                  label={t("businessData.dataCollectionLimitSet.operations.includeSampleLimits")}
                  checked={selected.includeSampleLimits}
                  disabled={selected.limitType !== LIMIT_TYPE_ABSOLUTE}
                  onChange={() =>
                    update(selected.id, { includeSampleLimits: !selected.includeSampleLimits })
                  }
                />
              </div>
            </div>
          )}
        </div>
      </div>
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
  onChange: (key: string, value: string | number | boolean) => void;
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

  const setRows = (next: ParameterLimitRow[]) => onChange(fieldKey, next as unknown as boolean);
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
        <div className={styles.split}>
          <div className={styles.listPane}>
            <div className={styles.listToolbar}>
              <span className={styles.listTitle}>
                {t("businessData.dataCollectionLimitSet.operations.samplesTitle")}
              </span>
              <Button
                appearance="secondary"
                size="small"
                onClick={addSample}
                aria-label={t("businessData.dataCollectionLimitSet.operations.addSample")}
              >
                <Add24Regular />
              </Button>
              <Button
                appearance="secondary"
                size="small"
                disabled={!selectedSample}
                onClick={() => selectedSample && removeSample(selectedSample.id)}
                aria-label={t("businessData.dataCollectionLimitSet.operations.removeSample")}
              >
                <Delete20Regular />
              </Button>
            </div>
            <div className={styles.listBody}>
              {applicable.map((p) => (
                <div key={p.id}>
                  <button
                    className={`${styles.listItem} ${selectedParam?.id === p.id ? styles.listItemActive : ""}`}
                    onClick={() => {
                      setSelectedParamId(p.id);
                      setSelectedSampleId(null);
                    }}
                  >
                    <span>
                      {p.parameter === ""
                        ? t("businessData.dataCollectionLimitSet.operations.unnamedParameter")
                        : p.parameter}
                    </span>
                    <span className={styles.listItemSub}>{p.limitType}</span>
                  </button>
                  {selectedParam?.id === p.id &&
                    p.sampleLimits.map((s) => (
                      <button
                        key={s.id}
                        className={`${styles.listItem} ${selectedSample?.id === s.id ? styles.listItemActive : ""}`}
                        style={{ paddingLeft: "24px" }}
                        onClick={() => setSelectedSampleId(s.id)}
                      >
                        <span>
                          {s.sampleId === ""
                            ? t("businessData.dataCollectionLimitSet.operations.unnamedSample")
                            : s.sampleId}
                        </span>
                      </button>
                    ))}
                </div>
              ))}
            </div>
          </div>
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
                <div className={styles.formRow}>
                  <div className={styles.grow}>
                    <div className={styles.miniLabel}>
                      {t("businessData.dataCollectionLimitSet.operations.sampleId")}
                      {REQUIRED_SUFFIX}
                    </div>
                    <Input
                      value={selectedSample.sampleId}
                      onChange={(_, d) => updateSample(selectedSample.id, { sampleId: d.value })}
                    />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.numWrap}>
                    <div className={styles.miniLabel}>
                      {t("businessData.dataCollectionLimitSet.operations.lowerErrorLimit")}
                    </div>
                    <Input
                      type="number"
                      value={selectedSample.lowerErrorLimit}
                      onChange={(_, d) =>
                        updateSample(selectedSample.id, { lowerErrorLimit: d.value })
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
                      onChange={(_, d) =>
                        updateSample(selectedSample.id, { lowerWarningLimit: d.value })
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
                      onChange={(_, d) => updateSample(selectedSample.id, { target: d.value })}
                    />
                  </div>
                  <div className={styles.numWrap}>
                    <div className={styles.miniLabel}>
                      {t("businessData.dataCollectionLimitSet.operations.upperWarningLimit")}
                    </div>
                    <Input
                      type="number"
                      value={selectedSample.upperWarningLimit}
                      onChange={(_, d) =>
                        updateSample(selectedSample.id, { upperWarningLimit: d.value })
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
                      onChange={(_, d) =>
                        updateSample(selectedSample.id, { upperErrorLimit: d.value })
                      }
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
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
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            appearance="primary"
            disabled={source === ""}
            onClick={() => onCopy(sourceParameters.map((p, i) => toRow(p, Date.now() + i)))}
          >
            {t("businessData.dataCollectionLimitSet.operations.copyAction")}
          </Button>
        </>
      }
    >
      <div className={styles.fieldRow}>
        <div className={styles.fieldLabel}>
          {t("businessData.dataCollectionLimitSet.operations.sourceLimitSet")}
        </div>
        <MiniSelect
          value={source}
          options={options}
          onSelect={setSource}
          ariaLabel={t("businessData.dataCollectionLimitSet.operations.sourceLimitSet")}
        />
      </div>
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
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            appearance="primary"
            onClick={() => onSubmit({ description, type, dataCollection })}
          >
            {t("common.save")}
          </Button>
        </>
      }
    >
      <div className={styles.fieldRow}>
        <div className={styles.fieldLabel}>
          {t("businessData.dataCollectionLimitSet.detail.name")}
        </div>
        <div className={styles.staticValue}>{name}</div>
      </div>
      <div className={styles.fieldRow}>
        <div className={styles.fieldLabel}>
          {t("businessData.dataCollectionLimitSet.detail.description")}
        </div>
        <Textarea value={description} onChange={(_, d) => setDescription(d.value)} />
      </div>
      <div className={styles.fieldRow}>
        <div className={styles.fieldLabel}>
          {t("businessData.dataCollectionLimitSet.detail.type")}
        </div>
        <MiniSelect
          value={type}
          options={typeOptions}
          onSelect={setType}
          ariaLabel={t("businessData.dataCollectionLimitSet.detail.type")}
        />
      </div>
      <div className={styles.fieldRow}>
        <div className={styles.fieldLabel}>
          {t("businessData.dataCollectionLimitSet.detail.dataCollection")}
        </div>
        <MiniSelect
          value={dataCollection}
          options={dataCollectionOptions}
          onSelect={setDataCollection}
          ariaLabel={t("businessData.dataCollectionLimitSet.detail.dataCollection")}
        />
      </div>
    </DialogShell>
  );
}

export function CopyLimitSetsSelectStep({
  values,
  onChange,
}: {
  values: OperationValues;
  onChange: (key: string, value: string | number | boolean) => void;
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
    onChange(COPY_SOURCES_KEY, next as unknown as boolean);
  };

  return (
    <div>
      <div className={styles.hint}>
        {t("businessData.dataCollectionLimitSet.operations.selectLimitSetsHint")}
      </div>
      <div className={styles.fieldRow}>
        <div className={styles.fieldLabel}>
          {t("businessData.dataCollectionLimitSet.operations.filterByDataCollection")}
        </div>
        <MiniSelect
          value={filterDc}
          options={dcOptions}
          onSelect={(v) => onChange(COPY_FILTER_DC_KEY, v)}
          ariaLabel={t("businessData.dataCollectionLimitSet.operations.filterByDataCollection")}
        />
      </div>
      <div>
        {list.map((r) => (
          <div key={r.name} className={styles.checkRow}>
            <Checkbox
              checked={selected.includes(r.name)}
              onChange={() => toggle(r.name)}
              label={r.name}
            />
            <span className={styles.listItemSub}>{limitSetMeta(r.dataCollection, r.state)}</span>
          </div>
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
  onChange: (key: string, value: string | number | boolean) => void;
  targetDataCollection: string;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const sources = (values[COPY_SOURCES_KEY] as unknown as string[] | undefined) ?? [];
  const names = (values[COPY_NAMES_KEY] as unknown as Record<string, string> | undefined) ?? {};
  const getName = (s: string) => names[s] ?? `${targetDataCollection}_${s}`;
  const setName = (s: string, v: string) =>
    onChange(COPY_NAMES_KEY, { ...names, [s]: v } as unknown as boolean);

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
        <div key={s} className={styles.fieldRow}>
          <div className={styles.fieldLabel}>{s}</div>
          <Input value={getName(s)} onChange={(_, d) => setName(s, d.value)} />
        </div>
      ))}
    </div>
  );
}
