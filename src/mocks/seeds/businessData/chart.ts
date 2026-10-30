import type { ChartDetail, ChartRecord } from "@/api";
import type { Page } from "@/api";

const RECORDS: ChartRecord[] = [
  { name: "Width Evolution", description: "", chartType: "Average And Range", state: "Active" },
  { name: "Thickness X-Rm", description: "Thickness control", chartType: "Individuals And Moving Range", state: "Active" },
];

export function queryCharts(page: number, limit: number, q?: string, state?: string): Page<ChartRecord> {
  let rows = RECORDS;
  if (q) {
    const n = q.toLowerCase();
    rows = rows.filter((r) => r.name.toLowerCase().includes(n));
  }
  if (state && state !== "" && state !== "all") rows = rows.filter((r) => r.state.toLowerCase() === state.toLowerCase());
  const total = rows.length;
  const start = (page - 1) * limit;
  return { data: rows.slice(start, start + limit), meta: { total, page, limit } };
}

export function buildChartDetail(name: string): ChartDetail {
  const r = RECORDS.find((x) => x.name === name) ?? { name, description: name, chartType: "Average And Range", state: "Active" };
  return {
    ...r,
    type: "Standard",
    universalState: r.state,
    enabled: true,
    parameter: "Maximum Width",
    minimumSampleReadings: 2,
    maximumSampleReadings: 4,
    dataPoints: 20,
    limits: [
      { limit: "Upper Spec Limit", value: 10.5 },
      { limit: "Lower Spec Limit", value: 9.5 },
    ],
    contexts: [
      { contextKey: "Resource", mandatory: true },
      { contextKey: "Product", mandatory: false },
    ],
    rules: [
      { rule: "Nelson 1", enabled: true },
      { rule: "Out of Spec", enabled: true },
    ],
    logicalCharts: [{ name: "Width Evolution / Resource A", dataPoints: 20 }],
  };
}
