import type { ShiftPlanEmployee, ShiftPlanWorkgroup } from "@/api";

export function formatWorkgroupMeta(wg: ShiftPlanWorkgroup): string {
  return [wg.description, wg.ownerRole].filter(Boolean).join(" · ");
}

export function formatWorkgroupResources(wg: ShiftPlanWorkgroup): string {
  return wg.resources.join(", ");
}

export function formatEmployeeMeta(emp: ShiftPlanEmployee): string {
  return [emp.team, emp.workgroup, emp.position].filter(Boolean).join(" · ");
}
