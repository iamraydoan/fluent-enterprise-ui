import type { EmployeeDetail, EmployeeRecord, Page } from "@/api";
import { RecordState } from "@/api";

const EMPLOYEES: EmployeeRecord[] = [
  {
    name: "Ann Seidelberg",
    description: "",
    user: "ANNSEIDELBERG",
    number: "10261",
    team: "Team E",
    state: RecordState.Active,
  },
  {
    name: "John Doe",
    description: "",
    user: "JOHNDOE",
    number: "10",
    team: "Team E",
    state: RecordState.Active,
  },
  {
    name: "Old Employee",
    description: "Left the company",
    user: "OLDEMPLOYEE",
    number: "9",
    team: "",
    state: RecordState.Terminated,
  },
];

const DETAILS: Record<string, EmployeeDetail> = {
  "Ann Seidelberg": {
    name: "Ann Seidelberg",
    description: "",
    user: "ANNSEIDELBERG",
    number: "10261",
    team: "Team E",
    state: RecordState.Active,
    type: "General",
    dataGroup: "",
    requireClockIn: true,
    enableAutomaticClockIn: false,
    lastClockInDate: null,
    clockedState: "Clocked Out",
    automaticClockOutAtEndOfShift: false,
    area: "",
    calendar: "My Calendar",
    manager: "John Doe (10)",
    position: "Cookie Baking",
    workgroup: "Cookie Team A",
    shiftplan: "Shift Plan 001",
    costCenter: "",
    costPerHour: 0,
  },
};

export function queryEmployees(
  page: number,
  limit: number,
  q?: string,
  state?: string,
): Page<EmployeeRecord> {
  let rows = EMPLOYEES;
  if (q !== undefined && q !== "") {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (row) =>
        row.name.toLowerCase().includes(needle) ||
        row.user.toLowerCase().includes(needle) ||
        row.description.toLowerCase().includes(needle),
    );
  }
  if (state !== undefined && state !== "") {
    const needle = state.toLowerCase();
    rows = rows.filter((row) => row.state.toLowerCase() === needle);
  }
  const total = rows.length;
  const start = (page - 1) * limit;
  return { data: rows.slice(start, start + limit), meta: { total, page, limit } };
}

export function getEmployeeDetail(name: string): EmployeeDetail | undefined {
  return DETAILS[name];
}
