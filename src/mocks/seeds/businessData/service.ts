import type { ServiceDetail, ServiceRecord } from "@/api";
import { RecordState } from "@/api";

const RECORDS: ServiceRecord[] = [
  {
    name: "Photolithography",
    description: "Lithography processing",
    type: "Process",
    enabled: true,
    state: RecordState.Active,
  },
  {
    name: "Oven Bake",
    description: "Baking service",
    type: "Process",
    enabled: true,
    state: RecordState.Active,
  },
  {
    name: "Legacy Storage",
    description: "Retired storage service",
    type: "Storage",
    enabled: false,
    state: RecordState.Terminated,
  },
];

export function queryServices(q?: string, state?: string): ServiceRecord[] {
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

export function buildServiceDetail(name: string): ServiceDetail {
  const record = RECORDS.find((item) => item.name === name) ?? {
    name,
    description: "",
    type: "Process",
    enabled: true,
    state: RecordState.Active,
  };
  return {
    ...record,
    dataGroup: "",
    processingType: "Process",
  };
}
