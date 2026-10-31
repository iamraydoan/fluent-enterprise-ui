import { useState } from "react";
import type {
  ChartDataPoint,
  ChartDetail,
  ChartUpsertInput,
  LogicalChartDetail,
  LogicalChartUpsertInput,
} from "@/api";
import {
  useAddLogicalChart,
  useCreateChart,
  useOpenDataPointProtocol,
  usePostDataPoint,
  useRecalculateCenterlines,
  useRemoveLogicalChart,
  useSetChartEnabled,
  useSetChartLimits,
  useSetChartState,
  useSetDataPointStatus,
  useUpdateChart,
  useUpdateChartRules,
  useUpdateDataPoint,
  useUpdateLogicalChart,
} from "@/api";
import { useAppTranslation } from "@/i18n";
import { ConfirmOperationDialog } from "../components/ConfirmOperationDialog";
import { EntityWizardDialog } from "../components/EntityWizardDialog";
import type { OperationValues, WizardField, WizardStep } from "../components/operationTypes";
import {
  AnnotateDataPointDialog,
  CloneChartDialog,
  type CloneChartRow,
  ContextListEditor,
  DataPointConfirmDialog,
  DataPointsDialog,
  EditDataPointDialog,
  EnableDisableChartDialog,
  LogicalChartLimitsEditor,
  type LogicalChartLimitRow,
  ManageChartRulesDialog,
  OpenProtocolDialog,
  PostContextEditor,
  ReadingsEditor,
  RecalculateCenterlinesDialog,
  RemoveLogicalChartDialog,
} from "./ChartDialogs";
import { CHART_TYPES } from "./chartLookups";
import type { DataPointAction } from "./chartLookups";

const CHART_TYPE_OPTIONS = CHART_TYPES.map((v) => ({ value: v, label: v }));
const SPEC_LIMIT_OPTIONS = [
  { value: "Chart", label: "Chart" },
  { value: "Product", label: "Product" },
];
const FILTER_MODE_OPTIONS = [
  { value: "LastNPoints", label: "Last Number Of Points" },
  { value: "DateInterval", label: "Date Interval" },
];
const INDICATOR_OPTIONS = [
  { value: "Both", label: "Both" },
  { value: "Indicator1", label: "Indicator 1" },
  { value: "Indicator2", label: "Indicator 2" },
];
const YAXIS_OPTIONS = [
  { value: "Automatic", label: "Automatic" },
  { value: "Manual", label: "Manual" },
];
const DEFAULT_PANEL_OPTIONS = [
  "Chart Statistics",
  "Data Point Context",
  "Data Point Details",
  "Data Point Readings",
  "Data Point Violations",
  "None",
].map((v) => ({ value: v, label: v }));

function num(v: string | number | boolean | undefined): number | undefined {
  if (v === undefined || v === "" || typeof v === "boolean") return undefined;
  const n = Number(v);
  return Number.isNaN(n) ? undefined : n;
}

function bool(v: string | number | boolean | undefined): boolean {
  return v === true;
}

function str(v: string | number | boolean | undefined): string | undefined {
  if (v === undefined) return undefined;
  return String(v);
}

function buildChartSteps(editMode: boolean): WizardStep[] {
  const nameField: WizardField[] = editMode
    ? []
    : [{ key: "name", labelKey: "businessData.chart.detail.name", type: "text", required: true }];
  return [
    {
      titleKey: "businessData.chart.operations.stepGeneralData",
      fields: [
        ...nameField,
        { key: "description", labelKey: "businessData.chart.detail.description", type: "textarea" },
        { key: "type", labelKey: "businessData.chart.detail.type", type: "text" },
        { key: "enabled", labelKey: "businessData.chart.detail.enabled", type: "checkbox" },
        { key: "parameter", labelKey: "businessData.chart.detail.parameter", type: "text" },
        {
          key: "chartType",
          labelKey: "businessData.chart.detail.chartType",
          type: "select",
          options: CHART_TYPE_OPTIONS,
        },
        { key: "lookupTable", labelKey: "businessData.chart.detail.lookupTable", type: "text" },
        {
          key: "terminateLogicalChartsOnZeroDataPoints",
          labelKey: "businessData.chart.detail.terminateLogicalChartsOnZeroDataPoints",
          type: "checkbox",
        },
        {
          key: "minimumSampleReadings",
          labelKey: "businessData.chart.detail.minimumSampleReadings",
          type: "number",
        },
        {
          key: "maximumSampleReadings",
          labelKey: "businessData.chart.detail.maximumSampleReadings",
          type: "number",
        },
        {
          key: "autoRecalculateCenterlines",
          labelKey: "businessData.chart.detail.autoRecalculateCenterlines",
          type: "checkbox",
        },
        { key: "windowSize", labelKey: "businessData.chart.detail.windowSize", type: "number" },
        {
          key: "dataPointSize",
          labelKey: "businessData.chart.detail.dataPointSize",
          type: "number",
        },
        {
          key: "learningMode",
          labelKey: "businessData.chart.detail.learningMode",
          type: "checkbox",
        },
        {
          key: "disableAutoCalcAfterLearning",
          labelKey: "businessData.chart.detail.disableAutoCalcAfterLearning",
          type: "checkbox",
        },
        {
          key: "retentionTimeHours",
          labelKey: "businessData.chart.detail.retentionTimeHours",
          type: "number",
        },
        {
          key: "retentionSize",
          labelKey: "businessData.chart.detail.retentionSize",
          type: "number",
        },
      ],
    },
    {
      titleKey: "businessData.chart.operations.stepLimits",
      fields: [
        {
          key: "specLimitsType",
          labelKey: "businessData.chart.detail.specLimitsType",
          type: "select",
          options: SPEC_LIMIT_OPTIONS,
        },
        { key: "usl", labelKey: "businessData.chart.detail.usl", type: "number" },
        { key: "target", labelKey: "businessData.chart.detail.target", type: "number" },
        { key: "lsl", labelKey: "businessData.chart.detail.lsl", type: "number" },
        {
          key: "autoControlLimits",
          labelKey: "businessData.chart.operations.autoControlLimits",
          type: "checkbox",
        },
        { key: "ucl", labelKey: "businessData.chart.detail.ucl", type: "number" },
        { key: "lcl", labelKey: "businessData.chart.detail.lcl", type: "number" },
        { key: "centerline1", labelKey: "businessData.chart.detail.centerline1", type: "number" },
        { key: "centerline2", labelKey: "businessData.chart.detail.centerline2", type: "number" },
        { key: "stdDev", labelKey: "businessData.chart.detail.stdDev", type: "number" },
      ],
    },
    {
      titleKey: "businessData.chart.operations.stepDisplay",
      fields: [
        {
          key: "filterMode",
          labelKey: "businessData.chart.detail.filterMode",
          type: "select",
          options: FILTER_MODE_OPTIONS,
        },
        { key: "lastNPoints", labelKey: "businessData.chart.detail.lastNPoints", type: "number" },
        {
          key: "fromDate",
          labelKey: "businessData.chart.detail.fromDate",
          type: "text",
          placeholderKey: "businessData.chart.operations.dynamicDatePlaceholder",
        },
        {
          key: "toDate",
          labelKey: "businessData.chart.detail.toDate",
          type: "text",
          placeholderKey: "businessData.chart.operations.dynamicDatePlaceholder",
        },
        {
          key: "showHistogram",
          labelKey: "businessData.chart.detail.showHistogram",
          type: "checkbox",
        },
        {
          key: "showSpecLimits",
          labelKey: "businessData.chart.detail.showSpecLimits",
          type: "checkbox",
        },
        {
          key: "showSparkline",
          labelKey: "businessData.chart.detail.showSparkline",
          type: "checkbox",
        },
        {
          key: "showTimestamp",
          labelKey: "businessData.chart.detail.showTimestamp",
          type: "checkbox",
        },
        {
          key: "showSampleId",
          labelKey: "businessData.chart.detail.showSampleId",
          type: "checkbox",
        },
        {
          key: "histogramIntervals",
          labelKey: "businessData.chart.detail.histogramIntervals",
          type: "number",
        },
        {
          key: "indicatorDisplay",
          labelKey: "businessData.chart.detail.indicatorDisplay",
          type: "select",
          options: INDICATOR_OPTIONS,
        },
        {
          key: "defaultPanel",
          labelKey: "businessData.chart.detail.defaultPanel",
          type: "select",
          options: DEFAULT_PANEL_OPTIONS,
        },
        {
          key: "yAxisMode",
          labelKey: "businessData.chart.detail.yAxisMode",
          type: "select",
          options: YAXIS_OPTIONS,
        },
        {
          key: "yAxisMajorUnits",
          labelKey: "businessData.chart.detail.yAxisMajorUnits",
          type: "number",
        },
        { key: "yAxisMin", labelKey: "businessData.chart.detail.yAxisMin", type: "number" },
        { key: "yAxisMax", labelKey: "businessData.chart.detail.yAxisMax", type: "number" },
        {
          key: "generalAnnotationSource",
          labelKey: "businessData.chart.detail.generalAnnotationSource",
          type: "text",
        },
        {
          key: "violationAnnotationSource",
          labelKey: "businessData.chart.detail.violationAnnotationSource",
          type: "text",
        },
      ],
    },
    {
      titleKey: "businessData.chart.operations.stepContext",
      fields: [
        {
          key: "contexts",
          labelKey: "businessData.chart.detail.contexts",
          type: "custom",
          render: (values, onChange) => <ContextListEditor values={values} onChange={onChange} />,
        },
      ],
    },
  ];
}

function toChartUpsertInput(values: OperationValues): ChartUpsertInput {
  return {
    name: str(values.name),
    description: str(values.description),
    type: str(values.type),
    enabled: values.enabled === undefined ? undefined : bool(values.enabled),
    parameter: str(values.parameter),
    chartType: str(values.chartType),
    lookupTable: str(values.lookupTable),
    terminateLogicalChartsOnZeroDataPoints: bool(values.terminateLogicalChartsOnZeroDataPoints),
    minimumSampleReadings: num(values.minimumSampleReadings),
    maximumSampleReadings: num(values.maximumSampleReadings),
    autoRecalculateCenterlines: bool(values.autoRecalculateCenterlines),
    windowSize: num(values.windowSize),
    dataPointSize: num(values.dataPointSize),
    learningMode: bool(values.learningMode),
    disableAutoCalcAfterLearning: bool(values.disableAutoCalcAfterLearning),
    retentionTimeHours: num(values.retentionTimeHours),
    retentionSize: num(values.retentionSize),
    specLimitsType: str(values.specLimitsType) as ChartUpsertInput["specLimitsType"],
    usl: num(values.usl),
    target: num(values.target),
    lsl: num(values.lsl),
    autoControlLimits:
      values.autoControlLimits === undefined ? undefined : bool(values.autoControlLimits),
    ucl: num(values.ucl),
    lcl: num(values.lcl),
    centerline1: num(values.centerline1),
    centerline2: num(values.centerline2),
    stdDev: num(values.stdDev),
    filterMode: str(values.filterMode) as ChartUpsertInput["filterMode"],
    lastNPoints: num(values.lastNPoints),
    fromDate: str(values.fromDate),
    toDate: str(values.toDate),
    showHistogram: bool(values.showHistogram),
    showSpecLimits: bool(values.showSpecLimits),
    showSparkline: bool(values.showSparkline),
    showTimestamp: bool(values.showTimestamp),
    showSampleId: bool(values.showSampleId),
    histogramIntervals: num(values.histogramIntervals),
    indicatorDisplay: str(values.indicatorDisplay) as ChartUpsertInput["indicatorDisplay"],
    defaultPanel: str(values.defaultPanel),
    yAxisMode: str(values.yAxisMode) as ChartUpsertInput["yAxisMode"],
    yAxisMin: num(values.yAxisMin),
    yAxisMax: num(values.yAxisMax),
    yAxisMajorUnits: num(values.yAxisMajorUnits),
    generalAnnotationSource: str(values.generalAnnotationSource),
    violationAnnotationSource: str(values.violationAnnotationSource),
    contexts: (values.contexts as unknown as ChartUpsertInput["contexts"]) ?? undefined,
  };
}

function chartToValues(chart: ChartDetail): OperationValues {
  return {
    name: chart.name,
    description: chart.description,
    type: chart.type,
    enabled: chart.enabled,
    parameter: chart.parameter,
    chartType: chart.chartType,
    lookupTable: chart.lookupTable,
    terminateLogicalChartsOnZeroDataPoints: chart.terminateLogicalChartsOnZeroDataPoints,
    minimumSampleReadings: chart.minimumSampleReadings,
    maximumSampleReadings: chart.maximumSampleReadings,
    autoRecalculateCenterlines: chart.autoRecalculateCenterlines,
    windowSize: chart.windowSize,
    dataPointSize: chart.dataPointSize,
    learningMode: chart.learningMode,
    disableAutoCalcAfterLearning: chart.disableAutoCalcAfterLearning,
    retentionTimeHours: chart.retentionTimeHours ?? "",
    retentionSize: chart.retentionSize ?? "",
    specLimitsType: chart.specLimitsType,
    usl: chart.usl ?? "",
    target: chart.target ?? "",
    lsl: chart.lsl ?? "",
    autoControlLimits: chart.autoControlLimits,
    ucl: chart.ucl ?? "",
    lcl: chart.lcl ?? "",
    centerline1: chart.centerline1 ?? "",
    centerline2: chart.centerline2 ?? "",
    stdDev: chart.stdDev ?? "",
    filterMode: chart.filterMode,
    lastNPoints: chart.lastNPoints,
    fromDate: chart.fromDate,
    toDate: chart.toDate,
    showHistogram: chart.showHistogram,
    showSpecLimits: chart.showSpecLimits,
    showSparkline: chart.showSparkline,
    showTimestamp: chart.showTimestamp,
    showSampleId: chart.showSampleId,
    histogramIntervals: chart.histogramIntervals,
    indicatorDisplay: chart.indicatorDisplay,
    defaultPanel: chart.defaultPanel,
    yAxisMode: chart.yAxisMode,
    yAxisMin: chart.yAxisMin ?? "",
    yAxisMax: chart.yAxisMax ?? "",
    yAxisMajorUnits: chart.yAxisMajorUnits ?? "",
    generalAnnotationSource: chart.generalAnnotationSource,
    violationAnnotationSource: chart.violationAnnotationSource,
    contexts: chart.contexts.map((c, i) => ({ ...c, id: Date.now() + i })) as unknown as boolean,
  };
}

function buildLogicalChartSteps(
  chart: ChartDetail | undefined,
  editMode: boolean,
  lc?: LogicalChartDetail,
): WizardStep[] {
  const contextStep: WizardStep = {
    titleKey: "businessData.chart.operations.stepContexts",
    fields: [
      {
        key: "contextValues",
        labelKey: "businessData.chart.detail.contexts",
        type: "custom",
        render: (values, onChange) => (
          <PostContextEditor values={values} onChange={onChange} contexts={chart?.contexts ?? []} />
        ),
      },
    ],
  };
  const steps: WizardStep[] = [
    {
      titleKey: "businessData.chart.operations.stepGeneralData",
      fields: [
        { key: "description", labelKey: "businessData.chart.detail.description", type: "textarea" },
        { key: "comment", labelKey: "businessData.chart.operations.comment", type: "textarea" },
      ],
    },
    {
      titleKey: "businessData.chart.operations.stepCenterlines",
      fields: [
        {
          key: "autoCalculateControlLimits",
          labelKey: "businessData.chart.operations.autoCalculateControlLimits",
          type: "checkbox",
        },
        {
          key: "learningMode",
          labelKey: "businessData.chart.detail.learningMode",
          type: "checkbox",
        },
        {
          key: "disableAutoCalcAfterLearning",
          labelKey: "businessData.chart.detail.disableAutoCalcAfterLearning",
          type: "checkbox",
        },
      ],
    },
    {
      titleKey: "businessData.chart.operations.stepLimits",
      fields: [
        { key: "usl", labelKey: "businessData.chart.detail.usl", type: "number" },
        { key: "target", labelKey: "businessData.chart.detail.target", type: "number" },
        { key: "lsl", labelKey: "businessData.chart.detail.lsl", type: "number" },
        {
          key: "autoControlLimits",
          labelKey: "businessData.chart.operations.autoControlLimits",
          type: "checkbox",
        },
        { key: "centerline1", labelKey: "businessData.chart.detail.centerline1", type: "number" },
        { key: "centerline2", labelKey: "businessData.chart.detail.centerline2", type: "number" },
        { key: "stdDev", labelKey: "businessData.chart.detail.stdDev", type: "number" },
      ],
    },
    {
      titleKey: "businessData.chart.operations.stepDisplay",
      fields: [
        {
          key: "histogramIntervals",
          labelKey: "businessData.chart.detail.histogramIntervals",
          type: "number",
        },
        {
          key: "yAxisMode",
          labelKey: "businessData.chart.detail.yAxisMode",
          type: "select",
          options: YAXIS_OPTIONS,
        },
        { key: "yAxisMin", labelKey: "businessData.chart.detail.yAxisMin", type: "number" },
        { key: "yAxisMax", labelKey: "businessData.chart.detail.yAxisMax", type: "number" },
        {
          key: "yAxisMajorUnits",
          labelKey: "businessData.chart.detail.yAxisMajorUnits",
          type: "number",
        },
      ],
    },
  ];
  if (!editMode) steps.unshift(contextStep);
  void lc;
  return steps;
}

function toLogicalChartInput(
  values: OperationValues,
  chart?: ChartDetail,
): LogicalChartUpsertInput {
  const contextValues =
    (values.contextValues as unknown as Record<string, string> | undefined) ?? {};
  const summary = Object.entries(contextValues)
    .filter(([, v]) => v !== "")
    .map(([k, v]) => `${k}=${v}`)
    .join(", ");
  return {
    contextSummary: summary || undefined,
    description: str(values.description),
    autoCalculateControlLimits:
      values.autoCalculateControlLimits === undefined
        ? undefined
        : bool(values.autoCalculateControlLimits),
    learningMode: bool(values.learningMode),
    disableAutoCalcAfterLearning: bool(values.disableAutoCalcAfterLearning),
    usl: num(values.usl),
    target: num(values.target),
    lsl: num(values.lsl),
    autoControlLimits:
      values.autoControlLimits === undefined ? undefined : bool(values.autoControlLimits),
    centerline1: num(values.centerline1),
    centerline2: num(values.centerline2),
    stdDev: num(values.stdDev),
    histogramIntervals: num(values.histogramIntervals) ?? chart?.histogramIntervals,
    yAxisMode: str(values.yAxisMode) as ChartUpsertInput["yAxisMode"],
    yAxisMin: num(values.yAxisMin),
    yAxisMax: num(values.yAxisMax),
    yAxisMajorUnits: num(values.yAxisMajorUnits),
  };
}

function logicalChartToValues(lc: LogicalChartDetail): OperationValues {
  return {
    description: lc.description,
    autoCalculateControlLimits: lc.autoCalculateControlLimits,
    learningMode: lc.learningMode,
    disableAutoCalcAfterLearning: lc.disableAutoCalcAfterLearning,
    usl: lc.usl ?? "",
    target: lc.target ?? "",
    lsl: lc.lsl ?? "",
    autoControlLimits: lc.autoControlLimits,
    centerline1: lc.centerline1 ?? "",
    centerline2: lc.centerline2 ?? "",
    stdDev: lc.stdDev ?? "",
    histogramIntervals: lc.histogramIntervals,
    yAxisMode: lc.yAxisMode,
    yAxisMin: lc.yAxisMin ?? "",
    yAxisMax: lc.yAxisMax ?? "",
    yAxisMajorUnits: lc.yAxisMajorUnits ?? "",
  };
}

export interface ChartDialogs {
  dialogs: React.ReactNode;
  openCreate: () => void;
  openEdit: () => void;
  openClone: () => void;
  openTerminate: () => void;
  openUnterminate: () => void;
  openEnable: () => void;
  openDisable: () => void;
  openManageRules: () => void;
  openSetLimits: () => void;
  openPostDataPoint: () => void;
  openPostAggregated: () => void;
  openAddLogicalChart: () => void;
  openEditLogicalChart: (lc: LogicalChartDetail) => void;
  openRemoveLogicalChart: (lc: LogicalChartDetail) => void;
  openRecalculate: (lc: LogicalChartDetail) => void;
  openDataPoints: (lc: LogicalChartDetail) => void;
}

interface DataPointDialogState {
  action: DataPointAction | "confirm";
  confirmKind?: "exclude" | "include" | "remove";
  dp: ChartDataPoint;
  lcName: string;
}

export function useChartDialogs(chart?: ChartDetail): ChartDialogs {
  const { t } = useAppTranslation();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [cloneOpen, setCloneOpen] = useState(false);
  const [terminateOpen, setTerminateOpen] = useState(false);
  const [unterminateOpen, setUnterminateOpen] = useState(false);
  const [enableOpen, setEnableOpen] = useState(false);
  const [disableOpen, setDisableOpen] = useState(false);
  const [manageRulesOpen, setManageRulesOpen] = useState(false);
  const [setLimitsOpen, setSetLimitsOpen] = useState(false);
  const [postOpen, setPostOpen] = useState(false);
  const [postAggOpen, setPostAggOpen] = useState(false);
  const [addLcOpen, setAddLcOpen] = useState(false);
  const [editLc, setEditLc] = useState<LogicalChartDetail | null>(null);
  const [removeLc, setRemoveLc] = useState<LogicalChartDetail | null>(null);
  const [recalcLc, setRecalcLc] = useState<LogicalChartDetail | null>(null);
  const [dataPointsLc, setDataPointsLc] = useState<LogicalChartDetail | null>(null);
  const [dpDialog, setDpDialog] = useState<DataPointDialogState | null>(null);

  const createMutation = useCreateChart();
  const updateMutation = useUpdateChart();
  const stateMutation = useSetChartState();
  const enabledMutation = useSetChartEnabled();
  const rulesMutation = useUpdateChartRules();
  const limitsMutation = useSetChartLimits();
  const addLcMutation = useAddLogicalChart();
  const updateLcMutation = useUpdateLogicalChart();
  const removeLcMutation = useRemoveLogicalChart();
  const recalcMutation = useRecalculateCenterlines();
  const postMutation = usePostDataPoint();
  const updateDpMutation = useUpdateDataPoint();
  const statusDpMutation = useSetDataPointStatus();
  const protocolMutation = useOpenDataPointProtocol();

  const entityLabel = t("businessData.chart.entityName");
  const createSteps = buildChartSteps(false);
  const editSteps = buildChartSteps(true);
  const editInitial = chart ? chartToValues(chart) : {};

  const maxReadings = chart?.maximumSampleReadings ?? 4;

  const postSteps: WizardStep[] = [
    {
      titleKey: "businessData.chart.operations.stepContext",
      fields: [
        {
          key: "contextValues",
          labelKey: "businessData.chart.detail.contexts",
          type: "custom",
          render: (values, onChange) => (
            <PostContextEditor
              values={values}
              onChange={onChange}
              contexts={chart?.contexts ?? []}
            />
          ),
        },
        { key: "comment", labelKey: "businessData.chart.operations.comment", type: "textarea" },
      ],
    },
    {
      titleKey: "businessData.chart.operations.stepReadings",
      fields: [
        {
          key: "readings",
          labelKey: "businessData.chart.operations.readings",
          type: "custom",
          render: (values, onChange) => (
            <ReadingsEditor values={values} onChange={onChange} count={maxReadings} />
          ),
        },
      ],
    },
  ];

  const postAggSteps: WizardStep[] = [
    {
      titleKey: "businessData.chart.operations.stepContext",
      fields: [
        {
          key: "contextValues",
          labelKey: "businessData.chart.detail.contexts",
          type: "custom",
          render: (values, onChange) => (
            <PostContextEditor
              values={values}
              onChange={onChange}
              contexts={chart?.contexts ?? []}
            />
          ),
        },
        { key: "comment", labelKey: "businessData.chart.operations.comment", type: "textarea" },
      ],
    },
    {
      titleKey: "businessData.chart.operations.stepReadings",
      fields: [
        {
          key: "sampleSize",
          labelKey: "businessData.chart.operations.sampleSize",
          type: "number",
          required: true,
        },
        { key: "indicator1", labelKey: "businessData.chart.operations.indicator1", type: "number" },
        { key: "indicator2", labelKey: "businessData.chart.operations.indicator2", type: "number" },
      ],
    },
  ];

  const setLimitsSteps: WizardStep[] = [
    {
      titleKey: "businessData.chart.operations.stepLimits",
      fields: [
        {
          key: "autoRecalculateCenterlines",
          labelKey: "businessData.chart.detail.autoRecalculateCenterlines",
          type: "checkbox",
        },
        { key: "windowSize", labelKey: "businessData.chart.detail.windowSize", type: "number" },
        {
          key: "learningMode",
          labelKey: "businessData.chart.detail.learningMode",
          type: "checkbox",
        },
        {
          key: "disableAutoCalcAfterLearning",
          labelKey: "businessData.chart.detail.disableAutoCalcAfterLearning",
          type: "checkbox",
        },
        { key: "usl", labelKey: "businessData.chart.detail.usl", type: "number" },
        { key: "target", labelKey: "businessData.chart.detail.target", type: "number" },
        { key: "lsl", labelKey: "businessData.chart.detail.lsl", type: "number" },
        {
          key: "autoControlLimits",
          labelKey: "businessData.chart.operations.autoControlLimits",
          type: "checkbox",
        },
        { key: "ucl", labelKey: "businessData.chart.detail.ucl", type: "number" },
        { key: "lcl", labelKey: "businessData.chart.detail.lcl", type: "number" },
        { key: "centerline1", labelKey: "businessData.chart.detail.centerline1", type: "number" },
        { key: "centerline2", labelKey: "businessData.chart.detail.centerline2", type: "number" },
        { key: "stdDev", labelKey: "businessData.chart.detail.stdDev", type: "number" },
      ],
    },
    {
      titleKey: "businessData.chart.operations.stepLogicalCharts",
      fields: [
        {
          key: "logicalChartLimits",
          labelKey: "businessData.chart.detail.logicalCharts",
          type: "custom",
          render: (values, onChange) => (
            <LogicalChartLimitsEditor values={values} onChange={onChange} />
          ),
        },
      ],
    },
  ];

  const setLimitsInitial: OperationValues = chart
    ? {
        autoRecalculateCenterlines: chart.autoRecalculateCenterlines,
        windowSize: chart.windowSize,
        learningMode: chart.learningMode,
        disableAutoCalcAfterLearning: chart.disableAutoCalcAfterLearning,
        usl: chart.usl ?? "",
        target: chart.target ?? "",
        lsl: chart.lsl ?? "",
        autoControlLimits: chart.autoControlLimits,
        ucl: chart.ucl ?? "",
        lcl: chart.lcl ?? "",
        centerline1: chart.centerline1 ?? "",
        centerline2: chart.centerline2 ?? "",
        stdDev: chart.stdDev ?? "",
        logicalChartLimits: chart.logicalCharts.map((lc): LogicalChartLimitRow => ({
          name: lc.name,
          autoRecalculateCenterlines: lc.autoCalculateControlLimits,
          windowSize: chart.windowSize,
          learningMode: lc.learningMode,
          disableAutoCalcAfterLearning: lc.disableAutoCalcAfterLearning,
          usl: lc.usl,
          target: lc.target,
          lsl: lc.lsl,
          autoControlLimits: lc.autoControlLimits,
          centerline1: lc.centerline1,
          centerline2: lc.centerline2,
          stdDev: lc.stdDev,
          ucl: lc.ucl,
          lcl: lc.lcl,
        })) as unknown as boolean,
      }
    : {};

  const closeDpDialog = () => setDpDialog(null);

  const handleDataPointAction = (action: DataPointAction, dp: ChartDataPoint, lcName: string) => {
    if (action === "exclude" || action === "include" || action === "remove") {
      setDpDialog({ action: "confirm", confirmKind: action, dp, lcName });
    } else {
      setDpDialog({ action, dp, lcName });
    }
  };

  const dpStatusOf = (kind: "exclude" | "include" | "remove") =>
    kind === "exclude" ? "Excluded" : kind === "include" ? "Active" : "Removed";

  const dialogs = (
    <>
      <EntityWizardDialog
        open={createOpen}
        titleKey="businessData.chart.operations.createTitle"
        steps={createSteps}
        initialValues={{ enabled: true, autoControlLimits: true, autoRecalculateCenterlines: true }}
        submitLabelKey="common.create"
        onClose={() => setCreateOpen(false)}
        onSubmit={(values) => {
          createMutation.mutate(toChartUpsertInput(values));
          setCreateOpen(false);
        }}
      />
      <EntityWizardDialog
        open={editOpen}
        titleKey="businessData.chart.operations.editTitle"
        steps={editSteps}
        initialValues={editInitial}
        submitLabelKey="common.save"
        onClose={() => setEditOpen(false)}
        onSubmit={(values) => {
          if (chart) updateMutation.mutate({ name: chart.name, input: toChartUpsertInput(values) });
          setEditOpen(false);
        }}
      />
      <CloneChartDialog
        open={cloneOpen}
        chart={chart ?? null}
        onClose={() => setCloneOpen(false)}
        onClone={(rows: CloneChartRow[]) => {
          if (chart) {
            const base = toChartUpsertInput(chartToValues(chart));
            rows.forEach((row) => {
              createMutation.mutate({
                ...base,
                name: row.name,
                parameter: row.parameter || base.parameter,
                type: row.type || base.type,
                description: row.description,
                lsl: row.lsl ?? base.lsl,
                target: row.target ?? base.target,
                usl: row.usl ?? base.usl,
                centerline1: row.centerline1 ?? base.centerline1,
                centerline2: row.centerline2 ?? base.centerline2,
                stdDev: row.stdDev ?? base.stdDev,
              });
            });
          }
          setCloneOpen(false);
        }}
      />
      <ConfirmOperationDialog
        open={terminateOpen}
        titleKey="businessData.chart.operations.terminateTitle"
        messageKey="businessData.chart.operations.terminateMessage"
        messageParams={{ name: chart?.name ?? entityLabel }}
        confirmLabelKey="actionBar.terminate"
        danger
        onClose={() => setTerminateOpen(false)}
        onConfirm={() => {
          if (chart) stateMutation.mutate({ name: chart.name, patch: { state: "Terminated" } });
          setTerminateOpen(false);
        }}
      />
      <ConfirmOperationDialog
        open={unterminateOpen}
        titleKey="businessData.chart.operations.unterminateTitle"
        messageKey="businessData.chart.operations.unterminateMessage"
        messageParams={{ name: chart?.name ?? entityLabel }}
        confirmLabelKey="actionBar.unterminate"
        onClose={() => setUnterminateOpen(false)}
        onConfirm={() => {
          if (chart) stateMutation.mutate({ name: chart.name, patch: { state: "Active" } });
          setUnterminateOpen(false);
        }}
      />
      <EnableDisableChartDialog
        open={enableOpen}
        chartName={chart?.name ?? ""}
        enabling
        onClose={() => setEnableOpen(false)}
        onConfirm={() => {
          if (chart) enabledMutation.mutate({ name: chart.name, enabled: true });
          setEnableOpen(false);
        }}
      />
      <EnableDisableChartDialog
        open={disableOpen}
        chartName={chart?.name ?? ""}
        enabling={false}
        onClose={() => setDisableOpen(false)}
        onConfirm={() => {
          if (chart) enabledMutation.mutate({ name: chart.name, enabled: false });
          setDisableOpen(false);
        }}
      />
      <ManageChartRulesDialog
        open={manageRulesOpen}
        chartName={chart?.name ?? ""}
        initialRules={chart?.rules ?? []}
        onClose={() => setManageRulesOpen(false)}
        onSave={(rules) => {
          if (chart) rulesMutation.mutate({ name: chart.name, rules });
          setManageRulesOpen(false);
        }}
      />
      <EntityWizardDialog
        open={setLimitsOpen}
        titleKey="businessData.chart.operations.setLimitsTitle"
        steps={setLimitsSteps}
        initialValues={setLimitsInitial}
        submitLabelKey="common.update"
        onClose={() => setSetLimitsOpen(false)}
        onSubmit={(values) => {
          if (chart) {
            const rows =
              (values.logicalChartLimits as unknown as LogicalChartLimitRow[] | undefined) ?? [];
            limitsMutation.mutate({
              name: chart.name,
              chartLimits: toChartUpsertInput(values),
              logicalChartLimits: rows.map((r) => ({
                name: r.name,
                limits: {
                  autoCalculateControlLimits: r.autoRecalculateCenterlines,
                  learningMode: r.learningMode,
                  disableAutoCalcAfterLearning: r.disableAutoCalcAfterLearning,
                  usl: r.usl,
                  target: r.target,
                  lsl: r.lsl,
                  autoControlLimits: r.autoControlLimits,
                  centerline1: r.centerline1,
                  centerline2: r.centerline2,
                  stdDev: r.stdDev,
                  ucl: r.ucl,
                  lcl: r.lcl,
                },
              })),
            });
          }
          setSetLimitsOpen(false);
        }}
      />
      <EntityWizardDialog
        open={postOpen}
        titleKey="businessData.chart.operations.postDataPointTitle"
        steps={postSteps}
        submitLabelKey="businessData.chart.operations.post"
        onClose={() => setPostOpen(false)}
        onSubmit={(values) => {
          if (chart) {
            const raw = (values.readings as unknown as (number | "")[] | undefined) ?? [];
            const readings = raw.map(Number).filter((n) => !Number.isNaN(n));
            postMutation.mutate({
              name: chart.name,
              input: {
                contextValues:
                  (values.contextValues as unknown as Record<string, string> | undefined) ?? {},
                comment: str(values.comment),
                readings,
                aggregated: false,
              },
            });
          }
          setPostOpen(false);
        }}
      />
      <EntityWizardDialog
        open={postAggOpen}
        titleKey="businessData.chart.operations.postAggregatedTitle"
        steps={postAggSteps}
        submitLabelKey="businessData.chart.operations.post"
        onClose={() => setPostAggOpen(false)}
        onSubmit={(values) => {
          if (chart) {
            postMutation.mutate({
              name: chart.name,
              input: {
                contextValues:
                  (values.contextValues as unknown as Record<string, string> | undefined) ?? {},
                comment: str(values.comment),
                aggregated: true,
                sampleSize: num(values.sampleSize),
                indicator1: num(values.indicator1),
                indicator2: num(values.indicator2),
              },
            });
          }
          setPostAggOpen(false);
        }}
      />
      <EntityWizardDialog
        open={addLcOpen}
        titleKey="businessData.chart.operations.addLogicalChartTitle"
        steps={buildLogicalChartSteps(chart, false)}
        initialValues={{ autoCalculateControlLimits: true, autoControlLimits: true }}
        submitLabelKey="common.add"
        onClose={() => setAddLcOpen(false)}
        onSubmit={(values) => {
          if (chart) {
            const input = toLogicalChartInput(values, chart);
            const contextValues =
              (values.contextValues as unknown as Record<string, string> | undefined) ?? {};
            const parts = Object.entries(contextValues)
              .filter(([, v]) => v !== "")
              .map(([, v]) => v);
            addLcMutation.mutate({
              name: chart.name,
              input: {
                ...input,
                name: parts.length > 0 ? `${chart.name} / ${parts.join(" / ")}` : undefined,
              },
            });
          }
          setAddLcOpen(false);
        }}
      />
      <EntityWizardDialog
        open={editLc !== null}
        titleKey="businessData.chart.operations.editLogicalChartTitle"
        steps={buildLogicalChartSteps(chart, true, editLc ?? undefined)}
        initialValues={editLc ? logicalChartToValues(editLc) : {}}
        submitLabelKey="common.save"
        onClose={() => setEditLc(null)}
        onSubmit={(values) => {
          if (chart && editLc) {
            updateLcMutation.mutate({
              name: chart.name,
              logicalChart: editLc.name,
              input: toLogicalChartInput(values, chart),
            });
          }
          setEditLc(null);
        }}
      />
      <RemoveLogicalChartDialog
        open={removeLc !== null}
        logicalChartName={removeLc?.name ?? ""}
        onClose={() => setRemoveLc(null)}
        onConfirm={() => {
          if (chart && removeLc)
            removeLcMutation.mutate({ name: chart.name, logicalChart: removeLc.name });
          setRemoveLc(null);
        }}
      />
      <RecalculateCenterlinesDialog
        open={recalcLc !== null}
        logicalChartName={recalcLc?.name ?? ""}
        defaultPoints={chart?.dataPointSize ?? 25}
        dataPoints={recalcLc?.dataPoints ?? []}
        onClose={() => setRecalcLc(null)}
        onRecalculate={(points) => {
          if (chart && recalcLc)
            recalcMutation.mutate({ name: chart.name, logicalChart: recalcLc.name, points });
          setRecalcLc(null);
        }}
      />
      <DataPointsDialog
        open={dataPointsLc !== null}
        logicalChartName={dataPointsLc?.name ?? ""}
        dataPoints={dataPointsLc?.dataPoints ?? []}
        onClose={() => setDataPointsLc(null)}
        onAction={(action, dp) => handleDataPointAction(action, dp, dataPointsLc?.name ?? "")}
        onPost={() => setPostOpen(true)}
      />
      <AnnotateDataPointDialog
        open={dpDialog?.action === "annotate"}
        dataPoint={dpDialog?.dp ?? null}
        onClose={closeDpDialog}
        onConfirm={(input) => {
          if (chart && dpDialog) {
            updateDpMutation.mutate({
              name: chart.name,
              logicalChart: dpDialog.lcName,
              dataPoint: dpDialog.dp.id,
              input: { annotation: input.annotation, annotationCode: input.annotationCode },
            });
          }
          closeDpDialog();
        }}
      />
      <EditDataPointDialog
        open={dpDialog?.action === "edit"}
        dataPoint={dpDialog?.dp ?? null}
        onClose={closeDpDialog}
        onConfirm={(input) => {
          if (chart && dpDialog) {
            updateDpMutation.mutate({
              name: chart.name,
              logicalChart: dpDialog.lcName,
              dataPoint: dpDialog.dp.id,
              input: { readings: input.readings, annotation: input.comment || undefined },
            });
          }
          closeDpDialog();
        }}
      />
      <DataPointConfirmDialog
        open={dpDialog?.action === "confirm"}
        titleKey={
          dpDialog?.confirmKind === "exclude"
            ? "businessData.chart.operations.excludeTitle"
            : dpDialog?.confirmKind === "include"
              ? "businessData.chart.operations.includeTitle"
              : "businessData.chart.operations.removeDataPointTitle"
        }
        message={t(
          dpDialog?.confirmKind === "exclude"
            ? "businessData.chart.operations.excludeMessage"
            : dpDialog?.confirmKind === "include"
              ? "businessData.chart.operations.includeMessage"
              : "businessData.chart.operations.removeDataPointMessage",
          { id: dpDialog?.dp.sampleId ?? "" },
        )}
        confirmLabel={t(
          dpDialog?.confirmKind === "exclude"
            ? "businessData.chart.operations.exclude"
            : dpDialog?.confirmKind === "include"
              ? "businessData.chart.operations.include"
              : "businessData.chart.operations.removeDataPoint",
        )}
        onClose={closeDpDialog}
        onConfirm={() => {
          if (chart && dpDialog && dpDialog.confirmKind) {
            statusDpMutation.mutate({
              name: chart.name,
              logicalChart: dpDialog.lcName,
              dataPoint: dpDialog.dp.id,
              status: dpStatusOf(dpDialog.confirmKind),
            });
          }
          closeDpDialog();
        }}
      />
      <OpenProtocolDialog
        open={dpDialog?.action === "protocol"}
        dataPoint={dpDialog?.dp ?? null}
        protocols={(chart?.rules ?? []).map((r) => r.protocol).filter((p) => p !== "")}
        onClose={closeDpDialog}
        onConfirm={(protocol) => {
          if (chart && dpDialog) {
            protocolMutation.mutate({
              name: chart.name,
              logicalChart: dpDialog.lcName,
              dataPoint: dpDialog.dp.id,
              protocol,
            });
          }
          closeDpDialog();
        }}
      />
    </>
  );

  return {
    dialogs,
    openCreate: () => setCreateOpen(true),
    openEdit: () => setEditOpen(true),
    openClone: () => setCloneOpen(true),
    openTerminate: () => setTerminateOpen(true),
    openUnterminate: () => setUnterminateOpen(true),
    openEnable: () => setEnableOpen(true),
    openDisable: () => setDisableOpen(true),
    openManageRules: () => setManageRulesOpen(true),
    openSetLimits: () => setSetLimitsOpen(true),
    openPostDataPoint: () => setPostOpen(true),
    openPostAggregated: () => setPostAggOpen(true),
    openAddLogicalChart: () => setAddLcOpen(true),
    openEditLogicalChart: (lc: LogicalChartDetail) => setEditLc(lc),
    openRemoveLogicalChart: (lc: LogicalChartDetail) => setRemoveLc(lc),
    openRecalculate: (lc: LogicalChartDetail) => setRecalcLc(lc),
    openDataPoints: (lc: LogicalChartDetail) => setDataPointsLc(lc),
  };
}
