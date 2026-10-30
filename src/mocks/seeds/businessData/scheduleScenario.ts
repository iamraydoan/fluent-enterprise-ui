import type { ScheduleScenarioDetail, ScheduleScenarioRecord } from "@/api";
import { RecordState } from "@/api";

const RECORDS: ScheduleScenarioRecord[] = [
  {
    name: "Operational Accurate 2026-10-30",
    description: "Daily operational scenario",
    schedule: "Fab Day Schedule",
    state: RecordState.Active,
  },
  {
    name: "Planning Scenario Q4",
    description: "Quarterly planning scenario",
    schedule: "Fab Day Schedule",
    state: RecordState.Active,
  },
  {
    name: "Old Night Scenario",
    description: "Retired night scenario",
    schedule: "Night Batch Schedule",
    state: RecordState.Terminated,
  },
];

export function queryScheduleScenarios(q?: string, state?: string): ScheduleScenarioRecord[] {
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

export function buildScheduleScenarioDetail(name: string): ScheduleScenarioDetail {
  const record = RECORDS.find((item) => item.name === name) ?? {
    name,
    description: "",
    schedule: "Fab Day Schedule",
    state: RecordState.Active,
  };
  return {
    ...record,
    generationType: "OperationalAccurate",
    scenarioState: "Synchronized",
  };
}
