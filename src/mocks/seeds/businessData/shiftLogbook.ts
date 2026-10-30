import { RecordState } from "@/api";
import type { Page, ShiftLogbookDetail, ShiftLogbookRecord } from "@/api";

const RECORDS: ShiftLogbookRecord[] = [
  {
    name: "Area-01 Shift 1 2026-10-30",
    area: "Area-01",
    shiftDefinition: "Chocolate Factory Shift Definition",
    shift: "Shift 1",
    state: RecordState.Active,
    systemState: "Open",
    createdOn: "10/30/2026",
  },
  {
    name: "Area-01 Shift 2 2026-10-29",
    area: "Area-01",
    shiftDefinition: "Chocolate Factory Shift Definition",
    shift: "Shift 2",
    state: RecordState.Terminated,
    systemState: "Closed",
    createdOn: "10/29/2026",
  },
];

const ENTRIES: Record<string, ShiftLogbookDetail["entries"]> = {
  "Area-01 Shift 1 2026-10-30": [
    {
      title: "Equipment-01",
      category: "Equipment",
      severity: "Problem",
      resource: "Equipment-01",
      description: "Equipment-01 needs maintenance.",
      author: "John Doe",
      createdOn: "10/30/2026 08:15 AM",
    },
    {
      title: "Material delay",
      category: "Material",
      severity: "Warning",
      resource: "",
      description: "Flour delivery delayed by 30 minutes.",
      author: "Jane Smith",
      createdOn: "10/30/2026 09:00 AM",
    },
  ],
  "Area-01 Shift 2 2026-10-29": [],
};

export function getShiftLogbookPage(params: {
  page: number;
  limit: number;
  q?: string;
  state?: string;
}): Page<ShiftLogbookRecord> {
  let filtered = RECORDS;
  if (params.q) {
    const q = params.q.toLowerCase();
    filtered = filtered.filter((r) => r.name.toLowerCase().includes(q));
  }
  if (params.state && params.state !== "All") {
    filtered = filtered.filter((r) => r.state === params.state);
  }
  const start = (params.page - 1) * params.limit;
  return {
    data: filtered.slice(start, start + params.limit),
    meta: { page: params.page, limit: params.limit, total: filtered.length },
  };
}

export function getShiftLogbookDetail(name: string): ShiftLogbookDetail | undefined {
  const record = RECORDS.find((r) => r.name === name);
  if (!record) return undefined;
  return {
    ...record,
    dataGroup: "",
    calendarDay: "10/30/2026",
    team: "Team A",
    entries: ENTRIES[name] ?? [],
  };
}
