export const CHECKLIST_SCOPES = [
  "General",
  "Maintenance Management",
  "Exception Management",
  "Material Tracking",
  "Resource Tracking",
];

export const EXECUTION_MODES = ["Long Running", "Immediate"];

export const ACTIVITY_TYPES = ["Manual Task", "Manual Action", "Automatic Action", "Signature"];

export const TRACKING_TYPES = ["Start And End", "End"];

export const TIME_CATEGORIES = ["Value Added", "Non-Value Added", "Required Non-Value Added"];

export const CONDITION_TYPES = [
  "None",
  "Date Interval",
  "BOM Items",
  "Expression (Simple)",
  "Expression (Advanced)",
];

export const PARAMETER_SOURCES = ["Free", "Lookup Table", "Query"];

export const PARAMETER_TYPES = [
  "Boolean",
  "Date Time",
  "Decimal",
  "File",
  "Integer",
  "Long",
  "String",
  "Url",
];

export const DEVIATION_TYPES = [
  "Add Item After",
  "Add Item Before",
  "Change Item",
  "Remove Item",
  "Add BOM Items",
  "Change BOM Items",
  "Remove BOM Items",
];

export const INSTANCE_ITEM_STATES = ["Not Started", "Started", "Completed", "Skipped"] as const;

export type InstanceItemState = (typeof INSTANCE_ITEM_STATES)[number];

export const ITEM_STATE_NOT_STARTED: InstanceItemState = "Not Started";
export const ITEM_STATE_STARTED: InstanceItemState = "Started";
export const ITEM_STATE_COMPLETED: InstanceItemState = "Completed";
export const ITEM_STATE_SKIPPED: InstanceItemState = "Skipped";

export const SHOW_MANDATORY = "mandatory";
export const SHOW_OPTIONAL = "optional";

export const EXECUTING_STATE_PAUSED = "Paused";
export const EXECUTING_STATE_EXECUTING = "Executing";

export function joinMeta(parts: (string | false | undefined)[]): string {
  return parts.filter((p): p is string => typeof p === "string" && p !== "").join(" · ");
}
