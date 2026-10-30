import type { NotificationDetail, NotificationRecord, Page } from "@/api";

const RECORDS: NotificationRecord[] = [
  {
    name: "ALM-0001",
    description: "High temperature alarm",
    severity: "Critical",
    type: "Alarm",
    state: "Active",
    validTo: "12/31/2026",
    tracking: "ManualSingleUser",
  },
  {
    name: "ALM-0002",
    description: "Low material warning",
    severity: "Warning",
    type: "Warning",
    state: "Active",
    validTo: "12/31/2026",
    tracking: "Automatic",
  },
];

export function queryNotifications(
  page: number,
  limit: number,
  q?: string,
  state?: string,
): Page<NotificationRecord> {
  let rows = RECORDS;
  if (q !== undefined && q !== "") {
    const needle = q.toLowerCase();
    rows = rows.filter((r) => r.name.toLowerCase().includes(needle));
  }
  if (state !== undefined && state !== "" && state !== "all") {
    rows = rows.filter(
      (r) => (r as unknown as Record<string, string>).state?.toLowerCase() === state.toLowerCase(),
    );
  }
  const total = rows.length;
  const start = (page - 1) * limit;
  return { data: rows.slice(start, start + limit), meta: { total, page, limit } };
}

export function buildNotificationDetail(name: string): NotificationDetail {
  const record = RECORDS.find((r) => r.name === name) ?? RECORDS[0];
  return {
    ...record,
    tracking: (record as unknown as Record<string, string>).tracking ?? "ManualSingleUser",
  };
}
