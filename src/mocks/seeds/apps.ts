import { AppType, RecordState } from "@/api";
import type { AppRecord } from "@/api";

type AppSeedRow = [name: string, description: string, type: AppType, state: RecordState];

const APP_SEED_ROWS: AppSeedRow[] = [
  ["Shop Floor", "Operator console for work orders", AppType.System, RecordState.Active],
  ["Quality", "Inspection and NCR handling", AppType.System, RecordState.Active],
  ["Maintenance", "Equipment maintenance app", AppType.UserDefined, RecordState.Active],
  ["Traceability", "Genealogy and lot tracking", AppType.System, RecordState.Active],
];

export function buildAppSeeds(): AppRecord[] {
  return APP_SEED_ROWS.map(([name, description, type, state]) => ({
    name,
    description,
    type,
    state,
  }));
}
