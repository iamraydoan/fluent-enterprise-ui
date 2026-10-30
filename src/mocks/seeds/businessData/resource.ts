import type { ResourceDetail, ResourceRecord } from "@/api";
import { RecordState } from "@/api";

const RECORDS: ResourceRecord[] = [
  {
    name: "Oven-01",
    description: "Baking oven line 1",
    type: "Equipment",
    processingType: "Process",
    state: RecordState.Active,
    systemState: "Up",
    automationMode: "Online",
  },
  {
    name: "Oven-02",
    description: "Baking oven line 2",
    type: "Equipment",
    processingType: "Process",
    state: RecordState.Active,
    systemState: "Up",
    automationMode: "Offline",
  },
  {
    name: "Storage-Rack-A",
    description: "Material storage rack A",
    type: "Storage",
    processingType: "Storage",
    state: RecordState.Active,
    systemState: "Up",
    automationMode: "Online",
  },
  {
    name: "Thermo-Probe-1",
    description: "Temperature measurement instrument",
    type: "Instrument",
    processingType: "Instrument",
    state: RecordState.Terminated,
    systemState: "Down",
    automationMode: "Offline",
  },
];

export function queryResources(q?: string, state?: string): ResourceRecord[] {
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

export function buildResourceDetail(name: string): ResourceDetail {
  const record = RECORDS.find((item) => item.name === name) ?? {
    name,
    description: "",
    type: "Equipment",
    processingType: "Process" as const,
    state: RecordState.Active,
    systemState: "Up",
    automationMode: "Online",
  };
  return {
    ...record,
    dataGroup: "",
    area: "Production",
    priority: 1,
    displayOrder: 1,
    vendor: "",
    model: "",
    modelRevision: "",
    serialNumber: "",
    criticality: "Medium",
    installationDate: "",
    yearBuilt: 2020,
    stateModel: "SEMI E10",
    resourceState: "Standby",
    runningMode: "Normal",
    instrumentMode: "",
  };
}
