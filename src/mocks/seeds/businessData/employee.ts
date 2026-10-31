import type { EmployeeDetail, EmployeeRecord, Page } from "@/api";
import { RecordState } from "@/api";
import { filterByQuery, filterByState, paginate } from "../../mockUtils";

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
  const rows = filterByState(filterByQuery(EMPLOYEES, q, ["name", "description", "user"]), state);
  return paginate(rows, page, limit);
}

export function getEmployeeDetail(name: string): EmployeeDetail | undefined {
  return DETAILS[name];
}
