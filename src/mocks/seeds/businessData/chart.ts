import type {
  ChartContextElement,
  ChartDataPoint,
  ChartDataPointStatus,
  ChartDetail,
  ChartRecord,
  ChartRuleRow,
  ChartUpsertInput,
  LogicalChartDetail,
  LogicalChartUpsertInput,
  Page,
  PostDataPointInput,
} from "@/api";

const RECORDS: ChartRecord[] = [
  { name: "Width Evolution", description: "", chartType: "Average And Range", state: "Active" },
  {
    name: "Thickness X-Rm",
    description: "Thickness control",
    chartType: "Individuals And Moving Range",
    state: "Active",
  },
];

const CHART_OVERLAYS = new Map<string, Partial<ChartDetail>>();

const BASE_CONTEXTS: ChartContextElement[] = [
  {
    keyOrder: 1,
    isKey: true,
    name: "Resource",
    description: "Resource key",
    elementType: "Object",
    source: "Resource",
  },
  {
    keyOrder: 2,
    isKey: true,
    name: "Product",
    description: "Product key",
    elementType: "Object",
    source: "Product",
  },
];

const BASE_RULES: ChartRuleRow[] = [
  {
    scope: "Chart",
    rule: "Nelson 1",
    description: "One point more than 3 sigma from centerline",
    protocol: "",
    actionRule: "",
    comment: "",
    enabled: true,
  },
  {
    scope: "Chart",
    rule: "Out of Spec",
    description: "Point outside specification limits",
    protocol: "",
    actionRule: "",
    comment: "",
    enabled: true,
  },
];

function baseDataPoint(
  id: string,
  readings: number[],
  status: ChartDataPointStatus = "Active",
): ChartDataPoint {
  return {
    id,
    sampleId: `S-${id}`,
    timestamp: `2026-10-${String(Number(id)).padStart(2, "0")} 08:00:00`,
    readings,
    aggregated: false,
    sampleSize: readings.length,
    status,
  };
}

const BASE_LOGICAL_CHARTS: LogicalChartDetail[] = [
  {
    name: "Width Evolution / Resource A",
    description: "Default logical chart",
    contextSummary: "Resource=Resource A, Product=Product X",
    autoCalculateControlLimits: true,
    learningMode: false,
    disableAutoCalcAfterLearning: false,
    usl: 10.5,
    target: 10.0,
    lsl: 9.5,
    autoControlLimits: true,
    centerline1: 10.0,
    centerline2: 0.25,
    stdDev: 0.12,
    ucl: 10.36,
    lcl: 9.64,
    histogramIntervals: 10,
    yAxisMode: "Automatic",
    dataPoints: [
      baseDataPoint("1", [10.1, 10.2, 10.0]),
      baseDataPoint("2", [9.9, 10.0, 10.1]),
      baseDataPoint("3", [10.3, 10.2, 10.4], "Excluded"),
    ],
  },
];

export function queryCharts(
  page: number,
  limit: number,
  q?: string,
  state?: string,
): Page<ChartRecord> {
  let rows = RECORDS;
  if (q) {
    const n = q.toLowerCase();
    rows = rows.filter((r) => r.name.toLowerCase().includes(n));
  }
  if (state && state !== "" && state !== "all")
    rows = rows.filter((r) => r.state.toLowerCase() === state.toLowerCase());
  const total = rows.length;
  const start = (page - 1) * limit;
  return { data: rows.slice(start, start + limit), meta: { total, page, limit } };
}

export function buildChartDetail(name: string): ChartDetail {
  const r = RECORDS.find((x) => x.name === name) ?? {
    name,
    description: name,
    chartType: "Average And Range",
    state: "Active",
  };
  const overlay = CHART_OVERLAYS.get(name) ?? {};
  return {
    ...r,
    type: "Standard",
    universalState: r.state,
    enabled: true,
    parameter: "Maximum Width",
    lookupTable: "",
    terminateLogicalChartsOnZeroDataPoints: false,
    minimumSampleReadings: 2,
    maximumSampleReadings: 4,
    autoRecalculateCenterlines: true,
    windowSize: 25,
    dataPointSize: 25,
    learningMode: false,
    disableAutoCalcAfterLearning: false,
    retentionTimeHours: 720,
    retentionSize: 10000,
    specLimitsType: "Chart",
    usl: 10.5,
    target: 10.0,
    lsl: 9.5,
    autoControlLimits: true,
    centerline1: 10.0,
    centerline2: 0.25,
    stdDev: 0.12,
    filterMode: "LastNPoints",
    lastNPoints: 100,
    fromDate: "",
    toDate: "",
    showHistogram: true,
    showSpecLimits: true,
    showSparkline: false,
    showTimestamp: true,
    showSampleId: false,
    histogramIntervals: 10,
    indicatorDisplay: "Both",
    defaultPanel: "Chart Statistics",
    yAxisMode: "Automatic",
    generalAnnotationSource: "",
    violationAnnotationSource: "",
    dataPoints: 20,
    limits: [
      { limit: "Upper Spec Limit", value: 10.5 },
      { limit: "Lower Spec Limit", value: 9.5 },
    ],
    contexts: BASE_CONTEXTS,
    rules: BASE_RULES,
    logicalCharts: BASE_LOGICAL_CHARTS,
    ...overlay,
  };
}

function writeOverlay(name: string, patch: Partial<ChartDetail>): ChartDetail {
  const current = CHART_OVERLAYS.get(name) ?? {};
  const next = { ...current, ...patch };
  CHART_OVERLAYS.set(name, next);
  return buildChartDetail(name);
}

export function createChartDetail(input: ChartUpsertInput): ChartDetail {
  const name = (input.name ?? "").trim();
  if (!RECORDS.some((r) => r.name === name)) {
    RECORDS.push({
      name,
      description: input.description ?? "",
      chartType: input.chartType ?? "Average And Range",
      state: "Active",
    });
  }
  const { name: _name, ...rest } = input;
  CHART_OVERLAYS.set(name, {
    description: input.description ?? "",
    chartType: input.chartType ?? "Average And Range",
    ...rest,
  });
  return buildChartDetail(name);
}

export function updateChartDetail(name: string, input: ChartUpsertInput): ChartDetail {
  const rec = RECORDS.find((r) => r.name === name);
  if (rec) {
    if (input.description !== undefined) rec.description = input.description;
    if (input.chartType !== undefined) rec.chartType = input.chartType;
  }
  const { name: _name, ...rest } = input;
  return writeOverlay(name, rest);
}

export function setChartState(name: string, state: string): ChartDetail {
  const rec = RECORDS.find((r) => r.name === name);
  if (rec) rec.state = state;
  return writeOverlay(name, { state, universalState: state });
}

export function setChartEnabled(name: string, enabled: boolean): ChartDetail {
  return writeOverlay(name, { enabled });
}

export function updateChartRules(name: string, rules: ChartRuleRow[]): ChartDetail {
  return writeOverlay(name, { rules });
}

export function setChartLimits(
  name: string,
  chartLimits: Partial<ChartUpsertInput>,
  logicalChartLimits: { name: string; limits: Partial<LogicalChartUpsertInput> }[],
): ChartDetail {
  const detail = buildChartDetail(name);
  const nextLogical = detail.logicalCharts.map((lc) => {
    const match = logicalChartLimits.find((l) => l.name === lc.name);
    return match ? { ...lc, ...match.limits } : lc;
  });
  const limitRows = [
    { limit: "Upper Spec Limit", value: chartLimits.usl ?? detail.usl ?? 0 },
    { limit: "Lower Spec Limit", value: chartLimits.lsl ?? detail.lsl ?? 0 },
  ];
  return writeOverlay(name, { ...chartLimits, limits: limitRows, logicalCharts: nextLogical });
}

export function addLogicalChart(name: string, input: LogicalChartUpsertInput): ChartDetail {
  const detail = buildChartDetail(name);
  const lc: LogicalChartDetail = {
    name: (input.name ?? "").trim() || `${name} / ${detail.logicalCharts.length + 1}`,
    description: input.description ?? "",
    contextSummary: input.contextSummary ?? "",
    autoCalculateControlLimits: input.autoCalculateControlLimits ?? true,
    learningMode: input.learningMode ?? false,
    disableAutoCalcAfterLearning: input.disableAutoCalcAfterLearning ?? false,
    usl: input.usl,
    target: input.target,
    lsl: input.lsl,
    autoControlLimits: input.autoControlLimits ?? true,
    centerline1: input.centerline1,
    centerline2: input.centerline2,
    stdDev: input.stdDev,
    ucl: input.ucl,
    lcl: input.lcl,
    histogramIntervals: input.histogramIntervals ?? detail.histogramIntervals,
    yAxisMode: input.yAxisMode ?? "Automatic",
    yAxisMin: input.yAxisMin,
    yAxisMax: input.yAxisMax,
    yAxisMajorUnits: input.yAxisMajorUnits,
    dataPoints: [],
  };
  return writeOverlay(name, { logicalCharts: [...detail.logicalCharts, lc] });
}

export function updateLogicalChart(
  name: string,
  logicalChart: string,
  input: LogicalChartUpsertInput,
): ChartDetail {
  const detail = buildChartDetail(name);
  const next = detail.logicalCharts.map((lc) => {
    if (lc.name !== logicalChart) return lc;
    const { yAxisMode, ...rest } = input;
    return {
      ...lc,
      ...rest,
      yAxisMode: yAxisMode ?? lc.yAxisMode,
      name: lc.name,
    };
  });
  return writeOverlay(name, { logicalCharts: next });
}

export function removeLogicalChart(name: string, logicalChart: string): ChartDetail {
  const detail = buildChartDetail(name);
  return writeOverlay(name, {
    logicalCharts: detail.logicalCharts.filter((lc) => lc.name !== logicalChart),
  });
}

export function recalculateCenterlines(
  name: string,
  logicalChart: string,
  points: number,
): ChartDetail {
  const detail = buildChartDetail(name);
  const next = detail.logicalCharts.map((lc) => {
    if (lc.name !== logicalChart) return lc;
    const considered = lc.dataPoints
      .filter((d) => d.status === "Active" || d.status === "Edited")
      .slice(-points);
    const all = considered.flatMap((d) => d.readings);
    const avg =
      all.length > 0 ? all.reduce((a, b) => a + b, 0) / all.length : (lc.centerline1 ?? 0);
    const variance =
      all.length > 0 ? all.reduce((a, b) => a + (b - avg) * (b - avg), 0) / all.length : 0;
    const stdDev = Math.sqrt(variance);
    return { ...lc, centerline1: Number(avg.toFixed(4)), stdDev: Number(stdDev.toFixed(4)) };
  });
  return writeOverlay(name, { logicalCharts: next });
}

export function postDataPoint(name: string, input: PostDataPointInput): ChartDetail {
  const detail = buildChartDetail(name);
  let logicalCharts = detail.logicalCharts;
  if (logicalCharts.length === 0) {
    logicalCharts = [
      {
        name: `${name} / Default`,
        description: "",
        contextSummary: Object.entries(input.contextValues ?? {})
          .map(([k, v]) => `${k}=${v}`)
          .join(", "),
        autoCalculateControlLimits: true,
        learningMode: false,
        disableAutoCalcAfterLearning: false,
        autoControlLimits: true,
        histogramIntervals: detail.histogramIntervals,
        yAxisMode: "Automatic",
        dataPoints: [],
      },
    ];
  }
  const target = logicalCharts[0];
  const id = `${target.dataPoints.length + 1}`;
  const dp: ChartDataPoint = {
    id,
    sampleId: `S-${id}`,
    timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
    readings: input.readings ?? [],
    aggregated: input.aggregated ?? false,
    sampleSize: input.sampleSize ?? input.readings?.length ?? 0,
    indicator1: input.indicator1,
    indicator2: input.indicator2,
    status: "Active",
    annotation: input.comment,
  };
  const next = logicalCharts.map((lc) =>
    lc.name === target.name ? { ...lc, dataPoints: [...lc.dataPoints, dp] } : lc,
  );
  return writeOverlay(name, { logicalCharts: next, dataPoints: detail.dataPoints + 1 });
}

export function updateDataPoint(
  name: string,
  logicalChart: string,
  dataPoint: string,
  input: { readings?: number[]; annotation?: string; annotationCode?: string },
): ChartDetail {
  const detail = buildChartDetail(name);
  const next = detail.logicalCharts.map((lc) => {
    if (lc.name !== logicalChart) return lc;
    return {
      ...lc,
      dataPoints: lc.dataPoints.map((d) =>
        d.id === dataPoint
          ? {
              ...d,
              readings: input.readings ?? d.readings,
              annotation: input.annotation ?? d.annotation,
              annotationCode: input.annotationCode ?? d.annotationCode,
              status: input.readings ? ("Edited" as ChartDataPointStatus) : d.status,
            }
          : d,
      ),
    };
  });
  return writeOverlay(name, { logicalCharts: next });
}

export function setDataPointStatus(
  name: string,
  logicalChart: string,
  dataPoint: string,
  status: ChartDataPointStatus,
): ChartDetail {
  const detail = buildChartDetail(name);
  const next = detail.logicalCharts.map((lc) => {
    if (lc.name !== logicalChart) return lc;
    return {
      ...lc,
      dataPoints: lc.dataPoints.map((d) => (d.id === dataPoint ? { ...d, status } : d)),
    };
  });
  return writeOverlay(name, { logicalCharts: next });
}
