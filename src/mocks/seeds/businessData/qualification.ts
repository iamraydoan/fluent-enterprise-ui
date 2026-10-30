import type { QualificationDetail, QualificationRecord } from "@/api";
import { RecordState } from "@/api";

const RECORDS: QualificationRecord[] = [
  {
    name: "Cookie oven experience",
    description: "",
    type: "General",
    state: RecordState.Active,
  },
  {
    name: "Forklift License",
    description: "Forklift operation certification",
    type: "General",
    state: RecordState.Active,
  },
  {
    name: "Cleanroom Level 2",
    description: "Cleanroom access level 2",
    type: "General",
    state: RecordState.Active,
  },
  {
    name: "Safety Training",
    description: "General safety training",
    type: "General",
    state: RecordState.Terminated,
  },
];

export function queryQualifications(q?: string, state?: string): QualificationRecord[] {
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

export function buildQualificationDetail(name: string): QualificationDetail {
  const record = RECORDS.find((item) => item.name === name) ?? {
    name,
    description: "",
    type: "General",
    state: RecordState.Active,
  };
  return {
    ...record,
    dataGroup: "",
    ownerRole: "CookieManager",
    defaultReason: "Experience",
    informationUrl: "",
    allowSelfAssignment: true,
    allowAssignmentByManager: true,
    validFor: "1 Month",
    allowOverride: true,
    gracePeriodDuration: "1 Day",
  };
}
