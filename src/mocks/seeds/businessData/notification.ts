import type { NotificationDetail, NotificationRecord, Page } from "@/api";
import { filterByQuery, filterByState, paginate } from "../mockUtils";

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
  const rows = filterByState(filterByQuery(RECORDS, q, ["name"]), state);
  return paginate(rows, page, limit);
}

export function buildNotificationDetail(name: string): NotificationDetail {
  const record = RECORDS.find((r) => r.name === name) ?? RECORDS[0];
  return {
    ...record,
    tracking: (record as unknown as Record<string, string>).tracking ?? "ManualSingleUser",
  };
}
