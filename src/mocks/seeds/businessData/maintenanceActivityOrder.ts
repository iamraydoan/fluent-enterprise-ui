import type { MaintenanceActivityOrderDetail, MaintenanceActivityOrderRecord, Page } from "@/api";
import { RecordState } from "@/api";
import { filterByQuery, filterByState, paginate } from "../../mockUtils";

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
  const rows = filterByState(filterByQuery(ORDERS, q, ["name", "description"]), state);
  return paginate(rows, page, limit);
}

export function getMaintenanceActivityOrderDetail(
  name: string,
): MaintenanceActivityOrderDetail | undefined {
  return DETAILS[name];
}
