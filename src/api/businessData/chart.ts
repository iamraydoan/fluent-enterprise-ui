import { keepPreviousData, useQuery } from "@tanstack/react-query";
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

export interface ChartContext {
  contextKey: string;
  mandatory: boolean;
}

export interface ChartRule {
  rule: string;
  enabled: boolean;
}

export interface LogicalChart {
  name: string;
  dataPoints: number;
}

export interface ChartDetail extends ChartRecord {
  type: string;
  universalState: string;
  enabled: boolean;
  parameter: string;
  minimumSampleReadings: number;
  maximumSampleReadings: number;
  dataPoints: number;
  limits: ChartLimit[];
  contexts: ChartContext[];
  rules: ChartRule[];
  logicalCharts: LogicalChart[];
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
