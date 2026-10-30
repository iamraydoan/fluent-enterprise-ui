import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/api/client";
import type { Page } from "@/api/types";
import type { ListQueryParams } from "@/lib/listQuery";

export interface ChartRecord {
  name: string;
  description: string;
  chartType: string;
  state: string;
}

export interface ChartLimit {
  limit: string;
  value: number;
}

export interface ChartContextElement {
  keyOrder: number;
  isKey: boolean;
  name: string;
  description: string;
  elementType: "FreeText" | "LookupTable" | "Object";
  source: string;
}

export interface ChartRuleRow {
  scope: string;
  rule: string;
  description: string;
  protocol: string;
  actionRule: string;
  comment: string;
  enabled: boolean;
}

export type ChartDataPointStatus = "Active" | "Excluded" | "Edited" | "Removed";

export interface ChartDataPoint {
  id: string;
  sampleId: string;
  timestamp: string;
  readings: number[];
  aggregated: boolean;
  sampleSize: number;
  indicator1?: number;
  indicator2?: number;
  status: ChartDataPointStatus;
  annotation?: string;
  annotationCode?: string;
}

export interface LogicalChartDetail {
  name: string;
  description: string;
  contextSummary: string;
  autoCalculateControlLimits: boolean;
  learningMode: boolean;
  disableAutoCalcAfterLearning: boolean;
  usl?: number;
  target?: number;
  lsl?: number;
  autoControlLimits: boolean;
  centerline1?: number;
  centerline2?: number;
  stdDev?: number;
  ucl?: number;
  lcl?: number;
  histogramIntervals: number;
  yAxisMode: "Automatic" | "Manual";
  yAxisMin?: number;
  yAxisMax?: number;
  yAxisMajorUnits?: number;
  dataPoints: ChartDataPoint[];
}

export interface ChartDetail extends ChartRecord {
  type: string;
  universalState: string;
  enabled: boolean;
  parameter: string;
  lookupTable: string;
  terminateLogicalChartsOnZeroDataPoints: boolean;
  minimumSampleReadings: number;
  maximumSampleReadings: number;
  autoRecalculateCenterlines: boolean;
  windowSize: number;
  dataPointSize: number;
  learningMode: boolean;
  disableAutoCalcAfterLearning: boolean;
  retentionTimeHours?: number;
  retentionSize?: number;
  specLimitsType: "Chart" | "Product";
  usl?: number;
  target?: number;
  lsl?: number;
  autoControlLimits: boolean;
  ucl?: number;
  lcl?: number;
  centerline1?: number;
  centerline2?: number;
  stdDev?: number;
  filterMode: "LastNPoints" | "DateInterval";
  lastNPoints: number;
  fromDate: string;
  toDate: string;
  showHistogram: boolean;
  showSpecLimits: boolean;
  showSparkline: boolean;
  showTimestamp: boolean;
  showSampleId: boolean;
  histogramIntervals: number;
  indicatorDisplay: "Both" | "Indicator1" | "Indicator2";
  defaultPanel: string;
  yAxisMode: "Automatic" | "Manual";
  yAxisMin?: number;
  yAxisMax?: number;
  yAxisMajorUnits?: number;
  generalAnnotationSource: string;
  violationAnnotationSource: string;
  dataPoints: number;
  limits: ChartLimit[];
  contexts: ChartContextElement[];
  rules: ChartRuleRow[];
  logicalCharts: LogicalChartDetail[];
}

export interface ChartUpsertInput {
  name?: string;
  description?: string;
  type?: string;
  enabled?: boolean;
  parameter?: string;
  chartType?: string;
  lookupTable?: string;
  terminateLogicalChartsOnZeroDataPoints?: boolean;
  minimumSampleReadings?: number;
  maximumSampleReadings?: number;
  autoRecalculateCenterlines?: boolean;
  windowSize?: number;
  dataPointSize?: number;
  learningMode?: boolean;
  disableAutoCalcAfterLearning?: boolean;
  retentionTimeHours?: number;
  retentionSize?: number;
  specLimitsType?: "Chart" | "Product";
  usl?: number;
  target?: number;
  lsl?: number;
  autoControlLimits?: boolean;
  ucl?: number;
  lcl?: number;
  centerline1?: number;
  centerline2?: number;
  stdDev?: number;
  filterMode?: "LastNPoints" | "DateInterval";
  lastNPoints?: number;
  fromDate?: string;
  toDate?: string;
  showHistogram?: boolean;
  showSpecLimits?: boolean;
  showSparkline?: boolean;
  showTimestamp?: boolean;
  showSampleId?: boolean;
  histogramIntervals?: number;
  indicatorDisplay?: "Both" | "Indicator1" | "Indicator2";
  defaultPanel?: string;
  yAxisMode?: "Automatic" | "Manual";
  yAxisMin?: number;
  yAxisMax?: number;
  yAxisMajorUnits?: number;
  generalAnnotationSource?: string;
  violationAnnotationSource?: string;
  contexts?: ChartContextElement[];
}

export interface LogicalChartUpsertInput {
  name?: string;
  description?: string;
  contextSummary?: string;
  autoCalculateControlLimits?: boolean;
  learningMode?: boolean;
  disableAutoCalcAfterLearning?: boolean;
  usl?: number;
  target?: number;
  lsl?: number;
  autoControlLimits?: boolean;
  centerline1?: number;
  centerline2?: number;
  stdDev?: number;
  ucl?: number;
  lcl?: number;
  histogramIntervals?: number;
  yAxisMode?: "Automatic" | "Manual";
  yAxisMin?: number;
  yAxisMax?: number;
  yAxisMajorUnits?: number;
}

export interface PostDataPointInput {
  contextValues?: Record<string, string>;
  comment?: string;
  readings?: number[];
  aggregated?: boolean;
  sampleSize?: number;
  indicator1?: number;
  indicator2?: number;
}

export function useCharts(params: ListQueryParams) {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.filters?.q) search.set("q", params.filters.q);
  if (params.filters?.state) search.set("state", params.filters.state);
  return useQuery<Page<ChartRecord>>({
    queryKey: ["business-data", "charts", params],
    queryFn: () => apiFetch<Page<ChartRecord>>(`/business-data/charts?${search.toString()}`),
    placeholderData: keepPreviousData,
  });
}

export function useChartDetail(name: string) {
  return useQuery({
    queryKey: ["business-data", "charts", name],
    queryFn: () => apiFetch<ChartDetail>(`/business-data/charts/${encodeURIComponent(name)}`),
  });
}

function useInvalidateChart() {
  const queryClient = useQueryClient();
  return (name: string) => {
    void queryClient.invalidateQueries({ queryKey: ["business-data", "charts"] });
    void queryClient.invalidateQueries({ queryKey: ["business-data", "charts", name] });
  };
}

export function useCreateChart() {
  const invalidate = useInvalidateChart();
  return useMutation({
    mutationFn: (input: ChartUpsertInput) =>
      apiFetch<ChartDetail>("/business-data/charts", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: (data) => invalidate(data.name),
  });
}

export function useUpdateChart() {
  const invalidate = useInvalidateChart();
  return useMutation({
    mutationFn: ({ name, input }: { name: string; input: ChartUpsertInput }) =>
      apiFetch<ChartDetail>(`/business-data/charts/${encodeURIComponent(name)}`, {
        method: "PUT",
        body: JSON.stringify(input),
      }),
    onSuccess: (data) => invalidate(data.name),
  });
}

export function useSetChartState() {
  const invalidate = useInvalidateChart();
  return useMutation({
    mutationFn: ({ name, patch }: { name: string; patch: { state: string } }) =>
      apiFetch<ChartDetail>(`/business-data/charts/${encodeURIComponent(name)}/state`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      }),
    onSuccess: (data) => invalidate(data.name),
  });
}

export function useSetChartEnabled() {
  const invalidate = useInvalidateChart();
  return useMutation({
    mutationFn: ({ name, enabled }: { name: string; enabled: boolean }) =>
      apiFetch<ChartDetail>(`/business-data/charts/${encodeURIComponent(name)}/enabled`, {
        method: "PATCH",
        body: JSON.stringify({ enabled }),
      }),
    onSuccess: (data) => invalidate(data.name),
  });
}

export function useUpdateChartRules() {
  const invalidate = useInvalidateChart();
  return useMutation({
    mutationFn: ({ name, rules }: { name: string; rules: ChartRuleRow[] }) =>
      apiFetch<ChartDetail>(`/business-data/charts/${encodeURIComponent(name)}/rules`, {
        method: "PUT",
        body: JSON.stringify({ rules }),
      }),
    onSuccess: (data) => invalidate(data.name),
  });
}

export function useSetChartLimits() {
  const invalidate = useInvalidateChart();
  return useMutation({
    mutationFn: ({
      name,
      chartLimits,
      logicalChartLimits,
    }: {
      name: string;
      chartLimits: Partial<ChartUpsertInput>;
      logicalChartLimits: { name: string; limits: Partial<LogicalChartUpsertInput> }[];
    }) =>
      apiFetch<ChartDetail>(`/business-data/charts/${encodeURIComponent(name)}/limits`, {
        method: "PUT",
        body: JSON.stringify({ chartLimits, logicalChartLimits }),
      }),
    onSuccess: (data) => invalidate(data.name),
  });
}

export function useAddLogicalChart() {
  const invalidate = useInvalidateChart();
  return useMutation({
    mutationFn: ({ name, input }: { name: string; input: LogicalChartUpsertInput }) =>
      apiFetch<ChartDetail>(`/business-data/charts/${encodeURIComponent(name)}/logical-charts`, {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: (data) => invalidate(data.name),
  });
}

export function useUpdateLogicalChart() {
  const invalidate = useInvalidateChart();
  return useMutation({
    mutationFn: ({
      name,
      logicalChart,
      input,
    }: {
      name: string;
      logicalChart: string;
      input: LogicalChartUpsertInput;
    }) =>
      apiFetch<ChartDetail>(
        `/business-data/charts/${encodeURIComponent(name)}/logical-charts/${encodeURIComponent(logicalChart)}`,
        { method: "PUT", body: JSON.stringify(input) },
      ),
    onSuccess: (data) => invalidate(data.name),
  });
}

export function useRemoveLogicalChart() {
  const invalidate = useInvalidateChart();
  return useMutation({
    mutationFn: ({ name, logicalChart }: { name: string; logicalChart: string }) =>
      apiFetch<ChartDetail>(
        `/business-data/charts/${encodeURIComponent(name)}/logical-charts/${encodeURIComponent(logicalChart)}`,
        { method: "DELETE" },
      ),
    onSuccess: (data) => invalidate(data.name),
  });
}

export function useRecalculateCenterlines() {
  const invalidate = useInvalidateChart();
  return useMutation({
    mutationFn: ({
      name,
      logicalChart,
      points,
    }: {
      name: string;
      logicalChart: string;
      points: number;
    }) =>
      apiFetch<ChartDetail>(
        `/business-data/charts/${encodeURIComponent(name)}/logical-charts/${encodeURIComponent(logicalChart)}/recalculate`,
        { method: "POST", body: JSON.stringify({ points }) },
      ),
    onSuccess: (data) => invalidate(data.name),
  });
}

export function usePostDataPoint() {
  const invalidate = useInvalidateChart();
  return useMutation({
    mutationFn: ({ name, input }: { name: string; input: PostDataPointInput }) =>
      apiFetch<ChartDetail>(`/business-data/charts/${encodeURIComponent(name)}/data-points`, {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: (data) => invalidate(data.name),
  });
}

export function useUpdateDataPoint() {
  const invalidate = useInvalidateChart();
  return useMutation({
    mutationFn: ({
      name,
      logicalChart,
      dataPoint,
      input,
    }: {
      name: string;
      logicalChart: string;
      dataPoint: string;
      input: { readings?: number[]; annotation?: string; annotationCode?: string };
    }) =>
      apiFetch<ChartDetail>(
        `/business-data/charts/${encodeURIComponent(name)}/logical-charts/${encodeURIComponent(logicalChart)}/data-points/${encodeURIComponent(dataPoint)}`,
        { method: "PUT", body: JSON.stringify(input) },
      ),
    onSuccess: (data) => invalidate(data.name),
  });
}

export function useSetDataPointStatus() {
  const invalidate = useInvalidateChart();
  return useMutation({
    mutationFn: ({
      name,
      logicalChart,
      dataPoint,
      status,
    }: {
      name: string;
      logicalChart: string;
      dataPoint: string;
      status: ChartDataPointStatus;
    }) =>
      apiFetch<ChartDetail>(
        `/business-data/charts/${encodeURIComponent(name)}/logical-charts/${encodeURIComponent(logicalChart)}/data-points/${encodeURIComponent(dataPoint)}/status`,
        { method: "PATCH", body: JSON.stringify({ status }) },
      ),
    onSuccess: (data) => invalidate(data.name),
  });
}

export function useOpenDataPointProtocol() {
  const invalidate = useInvalidateChart();
  return useMutation({
    mutationFn: ({
      name,
      logicalChart,
      dataPoint,
      protocol,
    }: {
      name: string;
      logicalChart: string;
      dataPoint: string;
      protocol: string;
    }) =>
      apiFetch<ChartDetail>(
        `/business-data/charts/${encodeURIComponent(name)}/logical-charts/${encodeURIComponent(logicalChart)}/data-points/${encodeURIComponent(dataPoint)}/protocol`,
        { method: "POST", body: JSON.stringify({ protocol }) },
      ),
    onSuccess: (data) => invalidate(data.name),
  });
}
