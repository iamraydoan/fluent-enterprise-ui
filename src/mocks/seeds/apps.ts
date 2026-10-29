import type { AppRecord } from "@/api";

type AppSeedRow = [name: string, description: string, type: string, state: string];

const APP_SEED_ROWS: AppSeedRow[] = [
  ["Shop Floor", "Operator console for work orders", "System", "Active"],
  ["Quality", "Inspection and NCR handling", "System", "Active"],
  ["Maintenance", "Equipment maintenance app", "User defined", "Active"],
  ["Traceability", "Genealogy and lot tracking", "System", "Active"],
];

export function buildAppSeeds(): AppRecord[] {
  return APP_SEED_ROWS.map(([name, description, type, state]) => ({
    name,
    description,
    type,
    state,
  }));
}
