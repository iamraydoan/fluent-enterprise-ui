import type { DataCollectionLimitSetDetail, DataCollectionLimitSetRecord } from "@/api";
import type { Page } from "@/api";

const RECORDS: DataCollectionLimitSetRecord[] = [
  { name: "Cookie Mixing Data Collection Limit Set", description: "", dataCollection: "Cookie Measurement [A]", state: "Effective" },
  { name: "Cookie Baking Limit Set 001", description: "Baking limits", dataCollection: "Cookie Baking [A]", state: "Effective" },
];

export function queryDataCollectionLimitSets(page: number, limit: number, q?: string, state?: string): Page<DataCollectionLimitSetRecord> {
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

export function buildDataCollectionLimitSetDetail(name: string): DataCollectionLimitSetDetail {
  const r = RECORDS.find((x) => x.name === name) ?? { name, description: name, dataCollection: "", state: "Effective" };
  return {
    ...r,
    type: "General",
    universalState: r.state,
    dataGroup: "",
    parameterLimits: [
      { parameter: "Thickness", overrideParameter: false, includeSampleLimits: true, minValue: "", maxValue: "", limitType: "Absolute", lowerErrorLimit: "300", lowerWarningLimit: "350", target: "400", upperWarningLimit: "450", upperErrorLimit: "500" },
    ],
  };
}
