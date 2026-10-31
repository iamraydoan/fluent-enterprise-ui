import { RecordState } from "@/api";
import type { Page, TeamDetail, TeamRecord } from "@/api";
import { filterByQuery, filterByState, paginate } from "../../mockUtils";

const RECORDS: TeamRecord[] = [
  {
    name: "Team A",
    description: "Morning shift team",
    calendar: "Standard",
    state: RecordState.Active,
  },
  {
    name: "Team B",
    description: "Evening shift team",
    calendar: "Standard",
    state: RecordState.Active,
  },
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
  const rows = filterByState(filterByQuery(RECORDS, params.q, ["name"]), params.state);
  return paginate(rows, params.page, params.limit);
}

export function getTeamDetail(name: string): TeamDetail | undefined {
  return DETAILS[name];
}
