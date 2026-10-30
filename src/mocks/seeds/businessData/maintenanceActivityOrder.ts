import type { MaintenanceActivityOrderDetail, MaintenanceActivityOrderRecord, Page } from "@/api";
import { RecordState } from "@/api";

const ORDERS: MaintenanceActivityOrderRecord[] = [
  {
    name: "14",
    description: "",
    type: "Standard",
    executionState: "Approved",
    scheduleType: "Adhoc",
    state: RecordState.Active,
  },
  {
    name: "15",
    description: "Pump maintenance",
    type: "Standard",
    executionState: "In Progress",
    scheduleType: "Time",
    state: RecordState.Active,
  },
  {
    name: "9",
    description: "Old order",
    type: "Standard",
    executionState: "Closed",
    scheduleType: "Adhoc",
    state: RecordState.Terminated,
  },
];

const DETAILS: Record<string, MaintenanceActivityOrderDetail> = {
  "14": {
    name: "14",
    description: "",
    type: "Standard",
    executionState: "Approved",
    scheduleType: "Adhoc",
    state: RecordState.Active,
    dataGroup: "",
    scheduleDate: Date.UTC(2026, 8, 23, 14, 2),
    requestedBy: "Administrator",
    requestDate: Date.UTC(2026, 8, 23, 14, 1),
    comment: "",
    maintenancePlanInstance: "Maintenance Plan 02-Mixer",
    resource: "Mixer-01",
    ownerRole: "Administrators",
    maintenanceActivity: "Replace Mixing Sensor",
    role: "Administrators",
    beginDate: null,
    endDate: null,
    expectedDuration: "2 hour(s)",
    reworkCount: 0,
    requestApprovalMode: "Auto Approval",
    maintenanceType: "Corrective",
    materialTypeRestrictionMode: "Allow None",
    materialType: "",
    orderReleaseMode: "Manual Release",
    completionAcceptanceMode: "Auto Acceptance",
    beginAndCompleteMode: "Manual Begin And Complete",
    cost: 0,
    checklist: "",
  },
};

export function queryMaintenanceActivityOrders(
  page: number,
  limit: number,
  q?: string,
  state?: string,
): Page<MaintenanceActivityOrderRecord> {
  let rows = ORDERS;
  if (q !== undefined && q !== "") {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (row) =>
        row.name.toLowerCase().includes(needle) || row.description.toLowerCase().includes(needle),
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

export function getMaintenanceActivityOrderDetail(
  name: string,
): MaintenanceActivityOrderDetail | undefined {
  return DETAILS[name];
}
