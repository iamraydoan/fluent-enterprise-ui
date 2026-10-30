import type { ReasonDetail, ReasonRecord } from "@/api";
import { RecordState } from "@/api";

const RECORDS: ReasonRecord[] = [
  { name: "Broken", description: "Broken", type: "Loss", state: RecordState.Active },
  {
    name: "Incorrectly installed",
    description: "Component incorrectly installed",
    type: "Defect",
    state: RecordState.Active,
  },
  {
    name: "Machine adjustment",
    description: "Machine adjustment bonus",
    type: "Bonus",
    state: RecordState.Active,
  },
  {
    name: "Quality hold",
    description: "Quality hold reason",
    type: "Hold",
    state: RecordState.Terminated,
  },
];

export function queryReasons(q?: string, state?: string): ReasonRecord[] {
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

export function buildReasonDetail(name: string): ReasonDetail {
  const record = RECORDS.find((item) => item.name === name) ?? {
    name,
    description: "",
    type: "Loss" as const,
    state: RecordState.Active,
  };
  return {
    ...record,
    dataGroup: "",
    excludeFromStepYield: false,
    excludeFromResourceYield: false,
  };
}
