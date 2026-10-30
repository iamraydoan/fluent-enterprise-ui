import type { DataCollectionDetail, DataCollectionRecord } from "@/api";
import type { Page } from "@/api";

const RECORDS: DataCollectionRecord[] = [
  { name: "Cookie Inspection 001", description: "Cookie Inspection", scope: "Inspection", state: "Created" },
  { name: "Dough Mixing 001", description: "Mixing parameters", scope: "General", state: "Effective" },
];

export function queryDataCollections(page: number, limit: number, q?: string, state?: string): Page<DataCollectionRecord> {
  let rows = RECORDS;
  if (q) {
    const n = q.toLowerCase();
    rows = rows.filter((r) => r.name.toLowerCase().includes(n) || r.description.toLowerCase().includes(n));
  }
  if (state && state !== "" && state !== "all") rows = rows.filter((r) => r.state.toLowerCase() === state.toLowerCase());
  const total = rows.length;
  const start = (page - 1) * limit;
  return { data: rows.slice(start, start + limit), meta: { total, page, limit } };
}

export function buildDataCollectionDetail(name: string): DataCollectionDetail {
  const r = RECORDS.find((x) => x.name === name) ?? { name, description: name, scope: "Inspection", state: "Created" };
  return {
    ...r,
    type: "Generic",
    universalState: r.state,
    dataGroup: "",
    changeSet: "Clone 135",
    userInterface: "Modern",
    limitCheckingMode: "On Post",
    parameters: [
      { parameter: "Thickness", dataType: "FreeText", isOptional: false, minimumSamples: 1, maximumSamples: 5, minimumSampleReadings: 1, maximumSampleReadings: 1, limitChecking: "IndividualValue" },
      { parameter: "Weight", dataType: "Decimal", isOptional: false, minimumSamples: 1, maximumSamples: 3, minimumSampleReadings: 1, maximumSampleReadings: 1, limitChecking: "IndividualValue" },
    ],
    limitSets: [{ name: "Cookie Inspection Limits 001" }],
    instances: [{ name: "Cookie Inspection 001 / Lot A", state: "Open" }],
  };
}
