import { RecordState } from "@/api";
import type { Page, ShiftDefinitionDetail, ShiftDefinitionRecord } from "@/api";

const RECORDS: ShiftDefinitionRecord[] = [
  {
    name: "Chocolate Factory Shift Definition",
    description: "Chocolate Factory Shift Definition",
    calendar: "Standard",
    startTime: "02:00 AM",
    state: RecordState.Active,
  },
  {
    name: "Day Shift",
    description: "Standard day shift definition",
    calendar: "Standard",
    startTime: "06:00 AM",
    state: RecordState.Active,
  },
  {
    name: "Night Shift",
    description: "Standard night shift definition",
    calendar: "Standard",
    startTime: "10:00 PM",
    state: RecordState.Terminated,
  },
];

const SHIFTS: Record<string, ShiftDefinitionDetail["shifts"]> = {
  "Chocolate Factory Shift Definition": [
    {
      name: "Shift 1",
      startTime: "02:00 AM",
      endTime: "11:00 AM",
      code: "",
      costOvertimeFactor: 1,
      teamPattern: "AB",
    },
    {
      name: "Shift 2",
      startTime: "11:00 AM",
      endTime: "02:00 AM",
      code: "",
      costOvertimeFactor: 1,
      teamPattern: "AB",
    },
  ],
  "Day Shift": [
    {
      name: "Shift 1",
      startTime: "06:00 AM",
      endTime: "02:00 PM",
      code: "",
      costOvertimeFactor: 1,
      teamPattern: "A",
    },
  ],
  "Night Shift": [],
};

export function queryShiftDefinitions(
  page: number,
  limit: number,
  q?: string,
  state?: string,
): Page<ShiftDefinitionRecord> {
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
    const needle = state.toLowerCase();
    rows = rows.filter((record) => record.state.toLowerCase() === needle);
  }
  const total = rows.length;
  const start = (page - 1) * limit;
  return { data: rows.slice(start, start + limit), meta: { total, page, limit } };
}

export function buildShiftDefinitionDetail(name: string): ShiftDefinitionDetail | undefined {
  const record = RECORDS.find((item) => item.name === name);
  if (!record) return undefined;
  return { ...record, dataGroup: "", shifts: SHIFTS[name] ?? [] };
}
