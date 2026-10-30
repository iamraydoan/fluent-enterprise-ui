import type { QualificationCheckDetail, QualificationCheckRecord } from "@/api";
import { RecordState } from "@/api";

const RECORDS: QualificationCheckRecord[] = [
  {
    name: "Oven Qualification Check",
    description: "Qualification check for cookie ovens",
    instanceType: "Single",
    state: RecordState.Active,
  },
  {
    name: "Mixer Qualification Check",
    description: "Qualification check for mixers",
    instanceType: "Multiple",
    state: RecordState.Active,
  },
  {
    name: "Packaging Line Check",
    description: "Qualification check for packaging line",
    instanceType: "Single",
    state: RecordState.Terminated,
  },
];

export function queryQualificationChecks(q?: string, state?: string): QualificationCheckRecord[] {
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

export function buildQualificationCheckDetail(name: string): QualificationCheckDetail {
  const record = RECORDS.find((item) => item.name === name) ?? {
    name,
    description: "",
    instanceType: "Single" as const,
    state: RecordState.Active,
  };
  return {
    ...record,
    dataGroup: "",
  };
}
