import type { AppRecord } from "@/api";
import { RecordState } from "@/api";

type AppSeedRow = [name: string, description: string, type: string, state: RecordState];

const APP_SEED_ROWS: AppSeedRow[] = [
  ["Shop Floor", "Operator console for work orders", "System", RecordState.Active],
  ["Quality", "Inspection and NCR handling", "System", RecordState.Active],
  ["Maintenance", "Equipment maintenance app", "User defined", RecordState.Active],
  ["Traceability", "Genealogy and lot tracking", "System", RecordState.Active],
];

export function buildAppSeeds(): AppRecord[] {
  return APP_SEED_ROWS.map(([name, description, type, state]) => ({
    name,
    description,
    type,
    state,
  }));
}
