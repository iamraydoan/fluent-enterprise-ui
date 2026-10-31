import type { MaintenancePlanDetail, MaintenancePlanRecord, Page } from "@/api";
import { RecordState } from "@/api";
import { filterByQuery, filterByState, paginate } from "../../mockUtils";

const PLANS: MaintenancePlanRecord[] = [
  {
    name: "Oven Maintenance",
    description: "Oven Maintenance Maintenance Plan",
    type: "Standard",
    scope: "Maintenance Management",
    state: RecordState.Active,
  },
  {
    name: "Pump Maintenance",
    description: "",
    type: "Standard",
    scope: "Maintenance Management",
    state: RecordState.Active,
  },
  {
    name: "Old Maintenance Plan",
    description: "",
    type: "Standard",
    scope: "Maintenance Management",
    state: RecordState.Terminated,
  },
];

const DETAILS: Record<string, MaintenancePlanDetail> = {
  "Oven Maintenance": {
    name: "Oven Maintenance",
    description: "Oven Maintenance Maintenance Plan",
    type: "Standard",
    scope: "Maintenance Management",
    state: RecordState.Active,
    dataGroup: "",
    activities: [
      {
        name: "Replace Temperature Sensor",
        description: "Replace Temperature Sensor",
        type: "Standard",
        scheduleType: "Usage Based",
        expectedDurationHours: 2,
        executionRole: "Administrators",
        requestApprovalMode: "Auto Approval",
        maintenanceType: "Preventive",
        materialTypeRestrictionMode: "Allow None",
        orderReleaseMode: "Manual Release",
        acceptanceMode: "Auto Acceptance",
        ignoreInScheduling: false,
        autoDisableAfterLateDue: false,
        postMaintenanceActivity: "",
      },
      {
        name: "Replace Light Sensor",
        description: "Replace Light Sensor",
        type: "Standard",
        scheduleType: "Usage Based",
        expectedDurationHours: 1,
        executionRole: "Administrators",
        requestApprovalMode: "Auto Approval",
        maintenanceType: "Preventive",
        materialTypeRestrictionMode: "Allow None",
        orderReleaseMode: "Manual Release",
        acceptanceMode: "Auto Acceptance",
        ignoreInScheduling: false,
        autoDisableAfterLateDue: false,
        postMaintenanceActivity: "",
      },
    ],
  },
};

export function queryMaintenancePlans(
  page: number,
  limit: number,
  q?: string,
  state?: string,
): Page<MaintenancePlanRecord> {
  const rows = filterByState(filterByQuery(PLANS, q, ["name", "description"]), state);
  return paginate(rows, page, limit);
}

export function getMaintenancePlanDetail(name: string): MaintenancePlanDetail | undefined {
  return DETAILS[name];
}
