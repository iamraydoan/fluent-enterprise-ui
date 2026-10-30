import type { ScheduleDetail, ScheduleRecord } from "@/api";
import { RecordState } from "@/api";

const RECORDS: ScheduleRecord[] = [
  {
    name: "Fab Day Schedule",
    description: "Daily fab schedule",
    state: RecordState.Active,
  },
  {
    name: "Night Batch Schedule",
    description: "Night batch processing",
    state: RecordState.Active,
  },
  {
    name: "Legacy Schedule",
    description: "Retired schedule",
    state: RecordState.Terminated,
  },
];

export function querySchedules(q?: string, state?: string): ScheduleRecord[] {
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

export function buildScheduleDetail(name: string): ScheduleDetail {
  const record = RECORDS.find((item) => item.name === name) ?? {
    name,
    description: "",
    state: RecordState.Active,
  };
  return {
    ...record,
    defaultView: "Gantt",
    defaultFrozenPeriod: 4,
    timeQuantum: 5,
  };
}
