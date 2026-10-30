import type { CalendarDetail, CalendarRecord, WeekDay } from "@/api";
import type { Page } from "@/api";

const RECORDS: CalendarRecord[] = [
  { name: "Standard", description: "Standard Calendar", state: "Active" },
  { name: "Fiscal2027", description: "Fiscal year calendar", state: "Active" },
];

const WEEK: WeekDay[] = [
  { day: "Monday", shiftDefinition: "Standard", costOvertimeFactor: 1 },
  { day: "Tuesday", shiftDefinition: "Standard", costOvertimeFactor: 1 },
  { day: "Wednesday", shiftDefinition: "Standard", costOvertimeFactor: 1 },
  { day: "Thursday", shiftDefinition: "Standard", costOvertimeFactor: 1 },
  { day: "Friday", shiftDefinition: "Standard", costOvertimeFactor: 1 },
  { day: "Saturday", shiftDefinition: "Non-Working Day", costOvertimeFactor: 1 },
  { day: "Sunday", shiftDefinition: "Non-Working Day", costOvertimeFactor: 1 },
];

export function queryCalendars(page: number, limit: number, q?: string, state?: string): Page<CalendarRecord> {
  let rows = RECORDS;
  if (q) {
    const n = q.toLowerCase();
    rows = rows.filter((r) => r.name.toLowerCase().includes(n) || r.description.toLowerCase().includes(n));
  }
  if (state && state !== "" && state !== "all") rows = rows.filter((r) => r.state.toLowerCase() === state.toLowerCase());
  const total = rows.length;
  const start = (page - 1) * limit;
  return { data: rows.slice(start, start + limit), meta: { total, page, limit } };
}

export function buildCalendarDetail(name: string): CalendarDetail {
  const r = RECORDS.find((x) => x.name === name) ?? { name, description: name, state: "Active" };
  return {
    ...r,
    universalState: r.state,
    dataGroup: "",
    timeZone: "(UTC+00:00) Dublin, Edinburgh, Lisbon, London",
    clockInEarlyStartMinutes: 0,
    enterpriseWideReportingDimension: false,
    fiscalStartDay: 1,
    fiscalStartMonth: "April",
    weekStartDay: "Monday",
    dayStartTime: "02:00 AM - Current Day",
    weekDefinition: WEEK,
  };
}
