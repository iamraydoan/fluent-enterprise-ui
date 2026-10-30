import type { SamplingPatternDetail, SamplingPatternRecord } from "@/api";
import { RecordState } from "@/api";

const RECORDS: SamplingPatternRecord[] = [
  {
    name: "SP-Manual-01",
    description: "Manual sampling pattern",
    type: "In-Step",
    mode: "Manual",
    state: RecordState.Active,
  },
  {
    name: "SP-System-01",
    description: "System sampling pattern",
    type: "In-Step",
    mode: "System",
    state: RecordState.Active,
  },
  {
    name: "SP-Rule-01",
    description: "Rule-based sampling pattern",
    type: "In-Step",
    mode: "Rule",
    state: RecordState.Terminated,
  },
];

export function querySamplingPatterns(q?: string, state?: string): SamplingPatternRecord[] {
  let rows = RECORDS;
  if (q !== undefined && q !== "") {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (record) =>
        record.name.toLowerCase().includes(needle) ||
        record.description.toLowerCase().includes(needle),
    );
  }
  if (state !== undefined && state !== "") {
    rows = rows.filter((record) => record.state === state);
  }
  return rows;
}

export function buildSamplingPatternDetail(name: string): SamplingPatternDetail {
  const record = RECORDS.find((item) => item.name === name) ?? {
    name,
    description: "",
    type: "In-Step",
    mode: "Manual" as const,
    state: RecordState.Active,
  };
  return {
    ...record,
    dataGroup: "",
    samplingSelection: record.mode === "Manual" ? "C:1,R:1;C:2,R:2" : "",
    rule: "",
    sourceForm: "",
    materialCount: 0,
    countIsPercentage: false,
    selectionMethod: "",
    sequencingMethod: "",
  };
}
