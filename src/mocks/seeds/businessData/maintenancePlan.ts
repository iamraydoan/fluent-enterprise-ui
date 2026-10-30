import type { MaintenancePlanDetail, MaintenancePlanRecord, Page } from "@/api";
import { RecordState } from "@/api";

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
  let rows = PLANS;
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

export function getMaintenancePlanDetail(name: string): MaintenancePlanDetail | undefined {
  return DETAILS[name];
}
