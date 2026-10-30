import { RecordState } from "@/api";
import type { Page, TeamDetail, TeamRecord } from "@/api";

const RECORDS: TeamRecord[] = [
  { name: "Team A", description: "Morning shift team", calendar: "Standard", state: RecordState.Active },
  { name: "Team B", description: "Evening shift team", calendar: "Standard", state: RecordState.Active },
];

const DETAILS: Record<string, TeamDetail> = {
  "Team A": {
    name: "Team A",
    description: "Morning shift team",
    calendar: "Standard",
    state: RecordState.Active,
    dataGroup: "",
    employees: ["John Doe", "Jane Smith"],
    calendarDays: ["2026-10-30", "2026-10-31"],
  },
  "Team B": {
    name: "Team B",
    description: "Evening shift team",
    calendar: "Standard",
    state: RecordState.Active,
    dataGroup: "",
    employees: ["Bob Wilson"],
    calendarDays: ["2026-10-30"],
  },
};

export function getTeamPage(params: {
  page: number;
  limit: number;
  q?: string;
  state?: string;
}): Page<TeamRecord> {
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

export function getTeamDetail(name: string): TeamDetail | undefined {
  return DETAILS[name];
}
