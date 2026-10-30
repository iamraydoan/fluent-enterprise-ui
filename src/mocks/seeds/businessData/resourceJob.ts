import type { ResourceJobDetail, ResourceJobRecord } from "@/api";
import { RecordState } from "@/api";

const RECORDS: ResourceJobRecord[] = [
  {
    name: "JOB-001",
    description: "Morning baking batch",
    resource: "Oven-01",
    type: "Production",
    systemState: "Queued",
    state: RecordState.Active,
    priority: 1,
    progress: 0,
  },
  {
    name: "JOB-002",
    description: "Wafer processing",
    resource: "Oven-02",
    type: "Production",
    systemState: "Executing",
    state: RecordState.Active,
    priority: 2,
    progress: 45,
  },
  {
    name: "JOB-003",
    description: "Calibration run",
    resource: "Thermo-Probe-1",
    type: "Maintenance",
    systemState: "Completed",
    state: RecordState.Active,
    priority: 3,
    progress: 100,
  },
];

export function queryResourceJobs(q?: string, state?: string): ResourceJobRecord[] {
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

export function buildResourceJobDetail(name: string): ResourceJobDetail {
  const record = RECORDS.find((item) => item.name === name) ?? {
    name,
    description: "",
    resource: "",
    type: "Production",
    systemState: "Created" as const,
    state: RecordState.Active,
    priority: 1,
    progress: 0,
  };
  return {
    ...record,
    dataGroup: "",
    subType: "",
    selectionMode: "Step",
    equipmentJobId: "",
    jobInformation: "",
  };
}
